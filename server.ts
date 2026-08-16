/**
 * ============================================================================
 * Trigantara — Server Aplikasi
 * ============================================================================
 * Satu proses Express melayani tiga hal:
 *   1. API publik  (/api/*)          — pendaftaran anggota, health check
 *   2. API admin   (/api/admin/*)    — CRUD konten + manajemen berkas R2
 *   3. Frontend    (semua sisanya)   — Vite dev server (dev) / berkas statis (prod)
 *
 * Prinsip keamanan yang dipegang berkas ini:
 *   - Tidak ada rute admin tanpa `verifyAdmin`.
 *   - `verifyAdmin` memverifikasi DUA hal: token valid DAN pengguna terdaftar
 *     di tabel `admin_users`. Token valid saja tidak cukup.
 *   - Body permintaan tidak pernah diteruskan mentah ke database; setiap tabel
 *     punya daftar putih kolom (mencegah mass assignment).
 *   - Kunci objek R2 selalu dinormalisasi sebelum dipakai.
 *   - Pesan galat internal tidak pernah bocor ke klien.
 * ============================================================================
 */

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { ZipArchive, type Archiver } from 'archiver';

// ============================================================================
// Konfigurasi lingkungan
// ============================================================================

const IS_PROD = process.env.NODE_ENV === 'production';

// Di produksi (Cloud Run) variabel disuntikkan platform; .env hanya untuk lokal.
if (!IS_PROD) dotenv.config();

const PORT = Number.parseInt(process.env.PORT || '8080', 10);
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const log = {
  info: (...a: unknown[]) => console.log('[trigantara]', ...a),
  warn: (...a: unknown[]) => console.warn('[trigantara]', ...a),
  error: (...a: unknown[]) => console.error('[trigantara]', ...a),
};

// ============================================================================
// Klien eksternal
// ============================================================================

const s3Client =
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
    ? new S3Client({
        region: 'auto',
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
      })
    : null;

if (!s3Client) log.warn('R2 belum dikonfigurasi — fitur berkas dinonaktifkan.');

/**
 * Klien service-role. Melewati RLS, jadi HANYA boleh dipakai di balik
 * `verifyAdmin` atau pada endpoint publik dengan validasi ketat.
 */
let supabaseAdmin: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
} else if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  log.warn('SUPABASE_SERVICE_ROLE_KEY tidak diisi — memakai anon key (hak terbatas).');
} else {
  log.warn('Supabase belum dikonfigurasi — API data dinonaktifkan.');
}

// ============================================================================
// Aplikasi & middleware global
// ============================================================================

const app = express();

// Cloud Run / proxy lain menaruh IP asli di X-Forwarded-For. Angka 1 berarti
// "percayai tepat satu proxy" — memakai `true` akan membuat pembatas laju bisa
// diakali dengan header X-Forwarded-For palsu.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('etag', 'strong');

const supabaseOrigin = SUPABASE_URL ? new URL(SUPABASE_URL).origin : '';
const r2Origin = R2_PUBLIC_URL ? new URL(R2_PUBLIC_URL).origin : '';

app.use(
  helmet({
    contentSecurityPolicy: IS_PROD
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            mediaSrc: ["'self'", 'blob:', ...(r2Origin ? [r2Origin] : [])],
            connectSrc: [
              "'self'",
              ...(supabaseOrigin ? [supabaseOrigin, supabaseOrigin.replace('https://', 'wss://')] : []),
              ...(r2Origin ? [r2Origin] : []),
            ],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    // Gambar/berkas R2 dimuat lintas origin; COEP ketat akan memblokirnya.
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: IS_PROD ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
  })
);

app.use(compression());

// Batas ukuran body. Unggahan berkas memakai rute terpisah dengan batas sendiri.
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false, limit: '256kb' }));

// ============================================================================
// Pembatas laju permintaan (rate limiter)
// ============================================================================
// Implementasi in-memory: cukup untuk satu instans. Bila nanti diskalakan ke
// banyak instans Cloud Run, ganti penyimpanan ini dengan Redis/Upstash —
// antarmuka `rateLimit()` tidak perlu berubah.

interface RateRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateRecord>();
const RATE_STORE_MAX = 20_000;

// Versi lama tidak pernah membersihkan Map ini: setiap IP baru menambah entri
// permanen sehingga memori tumbuh tanpa batas (vektor DoS). Sekarang entri
// kedaluwarsa disapu berkala.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of rateLimitStore) {
    if (now > rec.resetAt) rateLimitStore.delete(key);
  }
}, 60_000);
sweeper.unref();

function clientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function rateLimit(maxRequests: number, windowMs: number, bucket = 'default') {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${bucket}:${clientKey(req)}`;
    const now = Date.now();
    const rec = rateLimitStore.get(key);

    if (!rec || now > rec.resetAt) {
      // Jika penyimpanan penuh (serangan penyebaran IP), sapu paksa dulu.
      if (rateLimitStore.size >= RATE_STORE_MAX) {
        for (const [k, v] of rateLimitStore) if (now > v.resetAt) rateLimitStore.delete(k);
      }
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (rec.count >= maxRequests) {
      res.setHeader('Retry-After', Math.ceil((rec.resetAt - now) / 1000));
      res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi beberapa saat lagi.' });
      return;
    }

    rec.count += 1;
    next();
  };
}

// Selubung pengaman menyeluruh untuk seluruh API.
app.use('/api', rateLimit(300, 60_000, 'api'));

// ============================================================================
// Autentikasi admin
// ============================================================================

interface AdminRequest extends Request {
  admin?: { id: string; email: string | null };
}

/**
 * Cache keanggotaan admin. Menghindari satu query tambahan ke Supabase pada
 * setiap permintaan admin, tanpa membuat pencabutan hak tertunda lama.
 */
const adminCache = new Map<string, { isAdmin: boolean; expiresAt: number }>();
const ADMIN_CACHE_TTL_MS = 60_000;

async function isRegisteredAdmin(userId: string): Promise<boolean> {
  const cached = adminCache.get(userId);
  if (cached && Date.now() < cached.expiresAt) return cached.isAdmin;

  if (!supabaseAdmin) return false;

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    // Tabel belum dibuat (migrasi 002 belum dijalankan) → tolak, jangan
    // "gagal-terbuka". Lebih baik admin sementara tidak bisa masuk daripada
    // seluruh basis data terbuka untuk siapa saja.
    log.error('Gagal memeriksa admin_users:', error.message);
    return false;
  }

  const ok = Boolean(data);
  adminCache.set(userId, { isAdmin: ok, expiresAt: Date.now() + ADMIN_CACHE_TTL_MS });
  return ok;
}

/**
 * Token diambil dari header Authorization. Untuk rute unduhan yang dibuka
 * langsung oleh browser (tag <a>, tidak bisa mengirim header), token boleh
 * lewat query — namun HANYA untuk permintaan GET agar tidak bisa dipakai
 * memicu perubahan data lewat tautan (CSRF).
 */
function extractToken(req: Request): string {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  if (req.method === 'GET' && typeof req.query.token === 'string') return req.query.token;
  return '';
}

async function verifyAdmin(req: AdminRequest, res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: 'Sesi tidak ditemukan. Silakan masuk kembali.' });
    return;
  }
  if (!supabaseAdmin) {
    res.status(503).json({ error: 'Layanan basis data belum siap.' });
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Sesi tidak valid atau telah berakhir. Silakan masuk kembali.' });
      return;
    }

    // Token yang sah TIDAK otomatis berarti admin. Inilah pemeriksaan yang
    // dulu hilang dan membuat setiap akun terdaftar berhak menulis apa pun.
    if (!(await isRegisteredAdmin(user.id))) {
      log.warn(`Akses admin ditolak untuk ${user.email ?? user.id} (bukan anggota admin_users).`);
      res.status(403).json({ error: 'Akun Anda tidak memiliki hak akses pengelola.' });
      return;
    }

    req.admin = { id: user.id, email: user.email ?? null };
    next();
  } catch (err) {
    log.error('verifyAdmin gagal:', err);
    res.status(401).json({ error: 'Verifikasi sesi gagal.' });
  }
}

// ============================================================================
// Utilitas
// ============================================================================

/** Membungkus handler async agar galatnya sampai ke penangan galat terpusat. */
function wrap(fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Karakter kendali (U+0000-U+001F dan U+007F) dibuang: nama berkas dan header
// HTTP tidak boleh memuatnya.
function stripControlChars(value: string): string {
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0)!;
    if (code >= 0x20 && code !== 0x7f) out += ch;
  }
  return out;
}

/**
 * Express 5 mengetikkan `req.params[x]` sebagai `string | string[]`.
 * Pembungkus ini mengembalikan satu nilai string agar validasi di bawah
 * tidak pernah menerima larik yang lolos begitu saja.
 */
function param(req: Request, name: string): string {
  const value = (req.params as Record<string, string | string[]>)[name];
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

/**
 * Menormalkan prefiks/kunci objek R2.
 * Membuang segmen `..`, `.`, garis miring ganda, karakter kendali, dan
 * backslash agar masukan pengguna tidak bisa menunjuk ke luar area yang
 * dimaksud atau membuat kunci aneh yang sulit dihapus.
 */
function sanitizeKey(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return '';
  return stripControlChars(raw.replace(/\\/g, '/'))
    .split('/')
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .join('/')
    .slice(0, 1024);
}

/** Kunci folder selalu diakhiri garis miring. */
function sanitizePrefix(raw: unknown): string {
  const key = sanitizeKey(raw);
  return key ? `${key}/` : '';
}

/** Nama berkas aman untuk disematkan pada header Content-Disposition. */
function safeFilename(name: string): string {
  return name.replace(/[^\w.\- ]+/g, '_').slice(0, 120) || 'berkas';
}

const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'text/plain',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

function fileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return /^[a-z0-9]{1,8}$/.test(ext) ? ext : 'bin';
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

// ============================================================================
// Rute publik
// ============================================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    waktu: new Date().toISOString(),
    layanan: { r2: Boolean(s3Client), supabase: Boolean(supabaseAdmin) },
  });
});

/**
 * Penyajian berkas publik dari Cloudflare R2 secara streaming.
 * Memungkinkan peramban memuat gambar/media tanpa bergantung pada domain pub-*.r2.dev
 * yang sering terkendala sertifikat SSL atau CORS.
 */
app.get(
  '/api/storage/*key',
  wrap(async (req: Request, res: Response) => {
    if (!s3Client) {
      res.status(503).json({ error: 'Storage belum dikonfigurasi.' });
      return;
    }

    const raw = (req.params as Record<string, unknown>).key;
    const rawKey = Array.isArray(raw) ? raw.join('/') : String(raw || '');
    const key = sanitizeKey(rawKey);
    if (!key) {
      res.status(400).json({ error: 'Kunci berkas tidak valid.' });
      return;
    }

    try {
      const result = await s3Client.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
      if (!result.Body) {
        res.status(404).json({ error: 'Berkas tidak ditemukan.' });
        return;
      }

      const ext = key.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        gif: 'image/gif',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        webm: 'video/webm',
      };

      const contentType = result.ContentType || (ext ? mimeTypes[ext] : null) || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      // Gunakan cache pendek dengan revalidasi — bukan immutable — agar gambar
      // yang diganti (misalnya karena konten tidak layak) langsung ter-refresh
      // di peramban tanpa perlu menghapus cache secara manual.
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (result.ETag) res.setHeader('ETag', result.ETag);
      if (result.ContentLength) res.setHeader('Content-Length', String(result.ContentLength));

      (result.Body as Readable).pipe(res);
    } catch (err: any) {
      if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
        res.status(404).json({ error: 'Berkas tidak ditemukan di storage.' });
      } else {
        log.error('Streaming berkas R2 gagal:', err);
        res.status(500).json({ error: 'Gagal mengambil berkas.' });
      }
    }
  })
);

/**
 * Pendaftaran anggota baru.
 * Endpoint publik satu-satunya yang menulis ke basis data, jadi validasinya
 * dibuat ketat: hanya kolom yang diizinkan, panjang dibatasi, status dipaksa
 * 'pending' (klien tidak boleh meloloskan dirinya sendiri).
 */
app.post(
  '/api/pendaftaran',
  rateLimit(5, 15 * 60_000, 'daftar'),
  wrap(async (req: Request, res: Response) => {
    if (!supabaseAdmin) {
      res.status(503).json({ error: 'Layanan pendaftaran belum siap. Coba lagi nanti.' });
      return;
    }

    const { nama_lengkap, kelas, jurusan, no_hp, alamat, motivasi } = req.body ?? {};

    if (
      !isNonEmptyString(nama_lengkap, 100) ||
      !isNonEmptyString(kelas, 20) ||
      !isNonEmptyString(jurusan, 100) ||
      !isNonEmptyString(no_hp, 20)
    ) {
      res.status(400).json({ error: 'Data belum lengkap atau melebihi batas panjang yang wajar.' });
      return;
    }

    const nomor = String(no_hp).replace(/[^\d+]/g, '');
    if (nomor.length < 8) {
      res.status(400).json({ error: 'Nomor HP tidak valid. Contoh: 08123456789' });
      return;
    }
    if (typeof alamat === 'string' && alamat.length > 255) {
      res.status(400).json({ error: 'Alamat terlalu panjang (maksimal 255 karakter).' });
      return;
    }
    if (typeof motivasi === 'string' && motivasi.length > 1000) {
      res.status(400).json({ error: 'Motivasi terlalu panjang (maksimal 1000 karakter).' });
      return;
    }

    const { error } = await supabaseAdmin.from('pendaftaran').insert({
      nama_lengkap: String(nama_lengkap).trim(),
      kelas: String(kelas).trim(),
      jurusan: String(jurusan).trim(),
      no_hp: nomor,
      alamat: typeof alamat === 'string' && alamat.trim() ? alamat.trim() : null,
      motivasi: typeof motivasi === 'string' && motivasi.trim() ? motivasi.trim() : null,
      status: 'pending',
    });

    if (error) {
      log.error('Pendaftaran gagal disimpan:', error.message);
      res.status(500).json({ error: 'Pendaftaran gagal disimpan. Silakan coba lagi.' });
      return;
    }

    // Tidak mengembalikan baris yang tersimpan: pengirim tidak perlu tahu id
    // internal maupun data pendaftar lain.
    res.status(201).json({ success: true, message: 'Pendaftaran berhasil dikirim.' });
  })
);

// ============================================================================
// Sitemap
// ============================================================================
// Dibuat dari isi basis data, bukan berkas statis, supaya setiap materi dan
// artikel baru langsung terdaftar tanpa perlu menyunting XML secara manual.

const SITUS = 'https://trigantara.web.id';

const HALAMAN_TETAP: Array<{ path: string; ubah: string; prioritas: string }> = [
  { path: '/', ubah: 'weekly', prioritas: '1.0' },
  { path: '/tentang', ubah: 'monthly', prioritas: '0.8' },
  { path: '/materi', ubah: 'weekly', prioritas: '0.9' },
  { path: '/kegiatan', ubah: 'weekly', prioritas: '0.8' },
  { path: '/blog', ubah: 'daily', prioritas: '0.8' },
  { path: '/galeri', ubah: 'weekly', prioritas: '0.7' },
  { path: '/angkatan', ubah: 'monthly', prioritas: '0.6' },
  { path: '/gabung', ubah: 'monthly', prioritas: '0.9' },
];

let sitemapCache: { xml: string; at: number } | null = null;
const SITEMAP_TTL_MS = 60 * 60 * 1000;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get(
  '/sitemap.xml',
  wrap(async (_req: Request, res: Response) => {
    if (sitemapCache && Date.now() - sitemapCache.at < SITEMAP_TTL_MS) {
      res.type('application/xml').send(sitemapCache.xml);
      return;
    }

    const hariIni = new Date().toISOString().slice(0, 10);
    const entri = HALAMAN_TETAP.map(
      (h) =>
        `  <url><loc>${SITUS}${h.path}</loc><lastmod>${hariIni}</lastmod>` +
        `<changefreq>${h.ubah}</changefreq><priority>${h.prioritas}</priority></url>`
    );

    if (supabaseAdmin) {
      const [materi, artikel] = await Promise.all([
        supabaseAdmin.from('materials').select('slug, updated_at').eq('is_published', true).limit(2000),
        supabaseAdmin.from('articles').select('slug, updated_at').eq('is_published', true).limit(2000),
      ]);

      for (const m of materi.data ?? []) {
        if (!m.slug) continue;
        const tgl = String(m.updated_at ?? hariIni).slice(0, 10);
        entri.push(
          `  <url><loc>${SITUS}/materi/${xmlEscape(String(m.slug))}</loc>` +
            `<lastmod>${tgl}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
        );
      }
      for (const a of artikel.data ?? []) {
        if (!a.slug) continue;
        const tgl = String(a.updated_at ?? hariIni).slice(0, 10);
        entri.push(
          `  <url><loc>${SITUS}/blog/${xmlEscape(String(a.slug))}</loc>` +
            `<lastmod>${tgl}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
        );
      }
    }

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      `${entri.join('\n')}\n` +
      '</urlset>\n';

    sitemapCache = { xml, at: Date.now() };
    res.type('application/xml').send(xml);
  })
);

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin', '', `Sitemap: ${SITUS}/sitemap.xml`, ''].join('\n')
  );
});

// ============================================================================
// Rute admin — berkas R2
// ============================================================================

const adminApi = express.Router();
adminApi.use(verifyAdmin);
adminApi.use(rateLimit(600, 60_000, 'admin'));

function requireR2(res: Response): boolean {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(503).json({ error: 'Penyimpanan berkas belum dikonfigurasi.' });
    return false;
  }
  return true;
}

function buildObjectKey(folder: unknown, filename: string): string {
  const prefix = sanitizeKey(folder);
  const objectName = `${Date.now()}-${uuidv4().slice(0, 8)}.${fileExtension(filename)}`;
  return prefix ? `${prefix}/${objectName}` : objectName;
}

function publicUrlFor(key: string): string {
  return `/api/storage/${key.replace(/^\/+/, '')}`;
}

/** URL bertanda tangan untuk unggahan langsung dari peramban ke R2. */
adminApi.post(
  '/upload-url',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const { filename, contentType, folder = 'uploads' } = req.body ?? {};
    if (!isNonEmptyString(filename, 255) || !isNonEmptyString(contentType, 128)) {
      res.status(400).json({ error: 'Nama berkas dan tipe konten wajib diisi.' });
      return;
    }
    if (!ALLOWED_UPLOAD_TYPES.has(contentType)) {
      res.status(415).json({ error: `Tipe berkas "${contentType}" tidak diizinkan.` });
      return;
    }

    const key = buildObjectKey(folder, filename);
    const uploadUrl = await getSignedUrl(
      s3Client!,
      new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, ContentType: contentType }),
      { expiresIn: 600 }
    );

    res.json({ uploadUrl, publicUrl: publicUrlFor(key), key });
  })
);

/** Unggahan lewat server (dipakai bila CORS bucket belum dibuka). */
adminApi.post(
  '/r2/upload-proxy',
  express.raw({ type: '*/*', limit: '25mb' }),
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const filename = req.query.filename;
    const contentType = req.query.contentType;

    if (!isNonEmptyString(filename, 255) || !isNonEmptyString(contentType, 128)) {
      res.status(400).json({ error: 'Parameter filename dan contentType wajib diisi.' });
      return;
    }
    if (!ALLOWED_UPLOAD_TYPES.has(contentType)) {
      res.status(415).json({ error: `Tipe berkas "${contentType}" tidak diizinkan.` });
      return;
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      res.status(400).json({ error: 'Isi berkas tidak terbaca.' });
      return;
    }

    const key = buildObjectKey(req.query.folder ?? 'uploads', filename);
    await s3Client!.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Body: req.body,
      })
    );
    clearR2Cache();

    res.json({ success: true, publicUrl: publicUrlFor(key), key });
  })
);

/** Unduh satu berkas melalui server (memaksa unduhan, bukan tampil di tab). */
adminApi.get(
  '/r2/download',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const key = sanitizeKey(req.query.key);
    if (!key) {
      res.status(400).json({ error: 'Kunci berkas wajib diisi.' });
      return;
    }

    const result = await s3Client!.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    if (!result.Body) {
      res.status(404).json({ error: 'Berkas tidak ditemukan.' });
      return;
    }

    const filename = safeFilename(key.split('/').pop() || 'berkas');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
    // Selalu octet-stream: mencegah berkas HTML/SVG yang diunggah dieksekusi
    // di origin kita sendiri saat diunduh.
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (result.ContentLength) res.setHeader('Content-Length', String(result.ContentLength));

    (result.Body as Readable).pipe(res);
  })
);

async function listAllKeys(prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await s3Client!.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of response.Contents ?? []) {
      if (obj.Key && !obj.Key.endsWith('/')) keys.push(obj.Key);
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return keys;
}

function appendToZip(archive: Archiver, key: string, basePrefix: string): Promise<void> {
  return new Promise((resolve, reject) => {
    s3Client!
      .send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
      .then((response) => {
        if (!response.Body) {
          // Berkas hilang di tengah jalan bukan alasan menggagalkan seluruh
          // arsip — lewati saja.
          resolve();
          return;
        }
        const stream = response.Body as Readable;
        const relativePath = key.startsWith(basePrefix)
          ? key.slice(basePrefix.length)
          : (key.split('/').pop() ?? key);

        stream.on('error', reject);
        archive.append(stream, { name: relativePath || 'berkas' });
        stream.on('end', () => resolve());
      })
      .catch(reject);
  });
}

/** Unduh banyak berkas / satu folder sebagai satu arsip ZIP (streaming). */
adminApi.get(
  '/r2/download-zip',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const raw = req.query.keys;
    if (typeof raw !== 'string' || !raw) {
      res.status(400).json({ error: 'Parameter keys wajib diisi.' });
      return;
    }

    let requested: unknown;
    try {
      requested = JSON.parse(raw);
    } catch {
      requested = [raw];
    }

    const selected = (Array.isArray(requested) ? requested : [requested])
      .map((k) => (typeof k === 'string' && k.endsWith('/') ? sanitizePrefix(k) : sanitizeKey(k)))
      .filter(Boolean)
      .slice(0, 2000); // batas wajar agar satu permintaan tak menahan proses

    if (selected.length === 0) {
      res.status(400).json({ error: 'Daftar berkas kosong atau tidak valid.' });
      return;
    }

    const basePrefix = sanitizePrefix(req.query.basePrefix);
    const zipName = `trigantara-${new Date().toISOString().slice(0, 10)}.zip`;

    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipName}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });

    // archiver v8 memakai kelas; level 1 = kompresi cepat (berkas gambar/PDF
    // sudah terkompresi, jadi level tinggi hanya membuang CPU).
    const archive = new ZipArchive({ zlib: { level: 1 }, forceZip64: true });
    let cancelled = false;

    res.on('close', () => {
      if (!res.writableEnded) {
        cancelled = true;
        archive.abort();
      }
    });
    archive.on('error', (err: Error) => {
      log.error('Arsip ZIP gagal:', err);
      res.destroy(err);
    });
    archive.pipe(res);

    try {
      for (const key of selected) {
        if (cancelled) break;
        if (key.endsWith('/')) {
          for (const fileKey of await listAllKeys(key)) {
            if (cancelled) break;
            await appendToZip(archive, fileKey, basePrefix);
          }
        } else {
          await appendToZip(archive, key, basePrefix);
        }
      }
      if (!cancelled) await archive.finalize();
    } catch (err) {
      log.error('Pembuatan ZIP gagal:', err);
      archive.abort();
      res.destroy(err as Error);
    }
  })
);

// --- Cache daftar berkas R2 ---------------------------------------------------

interface R2Listing {
  folders: Array<{ name: string; key: string; type: 'folder' }>;
  files: Array<{
    name: string;
    key: string;
    size: number;
    lastModified: string;
    type: 'file';
    url: string;
  }>;
  prefix: string;
}

const r2ListCache = new Map<string, { data: R2Listing; at: number }>();
const R2_CACHE_TTL_MS = 30_000;

function clearR2Cache(): void {
  r2ListCache.clear();
}

adminApi.get(
  '/r2/list',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const prefix = sanitizePrefix(req.query.prefix);
    const refresh = req.query.refresh === 'true';

    if (!refresh) {
      const cached = r2ListCache.get(prefix);
      if (cached && Date.now() - cached.at < R2_CACHE_TTL_MS) {
        res.json(cached.data);
        return;
      }
    }

    const result = await s3Client!.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        Delimiter: '/',
        MaxKeys: 1000,
      })
    );

    const data: R2Listing = {
      prefix,
      folders: (result.CommonPrefixes ?? []).map((p) => ({
        name: (p.Prefix ?? '').slice(prefix.length).replace(/\/$/, ''),
        key: p.Prefix ?? '',
        type: 'folder',
      })),
      files: (result.Contents ?? [])
        .filter((obj) => obj.Key && obj.Key !== prefix)
        .map((obj) => ({
          name: obj.Key!.slice(prefix.length),
          key: obj.Key!,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified?.toISOString() ?? '',
          type: 'file' as const,
          url: publicUrlFor(obj.Key!),
        })),
    };

    r2ListCache.set(prefix, { data, at: Date.now() });
    res.json(data);
  })
);

adminApi.delete(
  '/r2/delete',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const key = sanitizeKey(req.body?.key);
    if (!key) {
      res.status(400).json({ error: 'Kunci berkas wajib diisi.' });
      return;
    }

    await s3Client!.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    clearR2Cache();
    res.json({ success: true, message: 'Berkas berhasil dihapus.' });
  })
);

adminApi.post(
  '/r2/create-folder',
  wrap(async (req: Request, res: Response) => {
    if (!requireR2(res)) return;

    const folderName = sanitizeKey(req.body?.folderName);
    if (!folderName) {
      res.status(400).json({ error: 'Nama folder tidak valid.' });
      return;
    }

    const parent = sanitizeKey(req.body?.parentPrefix ?? '');
    const key = `${parent ? `${parent}/` : ''}${folderName}/`;

    await s3Client!.send(
      new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, ContentLength: 0, Body: '' })
    );
    clearR2Cache();
    res.json({ success: true, key, message: 'Folder berhasil dibuat.' });
  })
);

// ============================================================================
// Rute admin — CRUD konten
// ============================================================================
//
// Setiap tabel mencantumkan kolom yang boleh ditulis. Versi sebelumnya
// meneruskan `req.body` apa adanya ke Supabase, sehingga penyerang yang punya
// sesi admin bisa menulis kolom apa pun — termasuk `id` dan `created_at` —
// atau menyisipkan kolom asing. Daftar putih ini menutup celah tersebut.

const WRITABLE_COLUMNS: Record<string, readonly string[]> = {
  articles: [
    'judul', 'slug', 'konten', 'ringkasan', 'thumbnail_url', 'kategori',
    'penulis', 'tags', 'is_published', 'published_at',
  ],
  gallery: ['judul', 'deskripsi', 'foto_url', 'kategori', 'kegiatan_id', 'angkatan_id', 'tanggal', 'urutan'],
  materials: [
    'judul', 'slug', 'deskripsi', 'ringkasan', 'konten', 'kategori', 'file_url',
    'thumbnail_url', 'tingkatan', 'sumber', 'sumber_url', 'durasi_menit',
    'urutan', 'is_published',
  ],
  members: [
    'nama_lengkap', 'nama_panggilan', 'kelas', 'jurusan', 'jabatan', 'ambalan',
    'angkatan_id', 'no_hp', 'alamat', 'foto_url', 'nomor_kta', 'tanggal_bergabung', 'status',
  ],
  events: ['judul', 'deskripsi', 'lokasi', 'tanggal_mulai', 'tanggal_selesai', 'foto_url', 'jenis', 'is_published'],
  angkatan: ['tahun_ajaran', 'nama_angkatan', 'foto_bersama_url', 'deskripsi', 'is_active'],
  pendaftaran: ['status', 'catatan_admin'],
  site_settings: ['key', 'value'],
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function pickWritable(table: string, body: unknown): Record<string, unknown> {
  const allowed = WRITABLE_COLUMNS[table] ?? [];
  const source = (body ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const column of allowed) {
    if (Object.hasOwn(source, column)) out[column] = source[column];
  }
  return out;
}

function registerCrud(table: string, route: string): void {
  const base = `/${route}`;

  adminApi.get(
    base,
    wrap(async (_req: Request, res: Response) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      if (error) {
        log.error(`GET ${table}:`, error.message);
        return res.status(500).json({ error: 'Gagal memuat data.' });
      }
      res.json(data);
    })
  );

  adminApi.get(
    `${base}/:id`,
    wrap(async (req: Request, res: Response) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
      if (!UUID_RE.test(param(req, 'id'))) return res.status(400).json({ error: 'ID tidak valid.' });
      const { data, error } = await supabaseAdmin.from(table).select('*').eq('id', param(req, 'id')).maybeSingle();
      if (error || !data) return res.status(404).json({ error: 'Data tidak ditemukan.' });
      res.json(data);
    })
  );

  adminApi.post(
    base,
    wrap(async (req: Request, res: Response) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
      const payload = pickWritable(table, req.body);
      if (Object.keys(payload).length === 0) {
        return res.status(400).json({ error: 'Tidak ada data yang dapat disimpan.' });
      }
      const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();
      if (error) {
        log.error(`POST ${table}:`, error.message);
        return res.status(400).json({ error: 'Data gagal disimpan. Periksa kembali isian Anda.' });
      }
      res.status(201).json(data);
    })
  );

  adminApi.put(
    `${base}/:id`,
    wrap(async (req: Request, res: Response) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
      if (!UUID_RE.test(param(req, 'id'))) return res.status(400).json({ error: 'ID tidak valid.' });
      const payload = pickWritable(table, req.body);
      if (Object.keys(payload).length === 0) {
        return res.status(400).json({ error: 'Tidak ada perubahan yang dapat disimpan.' });
      }
      const { data, error } = await supabaseAdmin
        .from(table)
        .update(payload)
        .eq('id', param(req, 'id'))
        .select()
        .single();
      if (error) {
        log.error(`PUT ${table}:`, error.message);
        return res.status(400).json({ error: 'Perubahan gagal disimpan.' });
      }
      res.json(data);
    })
  );

  adminApi.delete(
    `${base}/:id`,
    wrap(async (req: Request, res: Response) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
      if (!UUID_RE.test(param(req, 'id'))) return res.status(400).json({ error: 'ID tidak valid.' });
      const { error } = await supabaseAdmin.from(table).delete().eq('id', param(req, 'id'));
      if (error) {
        log.error(`DELETE ${table}:`, error.message);
        return res.status(400).json({ error: 'Data gagal dihapus.' });
      }
      res.json({ success: true });
    })
  );
}

registerCrud('articles', 'articles');
registerCrud('gallery', 'gallery');
registerCrud('materials', 'materials');
registerCrud('members', 'members');
registerCrud('events', 'events');
registerCrud('angkatan', 'angkatan');
registerCrud('pendaftaran', 'pendaftaran');
registerCrud('site_settings', 'settings');

/** Menyetujui pendaftaran: menyalin data pendaftar menjadi anggota. */
adminApi.post(
  '/pendaftaran/:id/approve',
  wrap(async (req: Request, res: Response) => {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
    if (!UUID_RE.test(param(req, 'id'))) return res.status(400).json({ error: 'ID tidak valid.' });

    const { data: pendaftar, error: fetchErr } = await supabaseAdmin
      .from('pendaftaran')
      .select('*')
      .eq('id', param(req, 'id'))
      .maybeSingle();

    if (fetchErr || !pendaftar) return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    if (pendaftar.status === 'diterima') {
      // Idempoten: klik ganda tidak boleh membuat anggota kembar.
      return res.json({ success: true, message: 'Pendaftaran ini sudah disetujui sebelumnya.' });
    }

    const { error: insertErr } = await supabaseAdmin.from('members').insert({
      nama_lengkap: pendaftar.nama_lengkap,
      kelas: pendaftar.kelas,
      jurusan: pendaftar.jurusan,
      no_hp: pendaftar.no_hp,
      alamat: pendaftar.alamat,
      status: 'aktif',
    });

    if (insertErr) {
      log.error('Approve pendaftaran:', insertErr.message);
      return res.status(500).json({ error: 'Gagal membuat data anggota.' });
    }

    await supabaseAdmin.from('pendaftaran').update({ status: 'diterima' }).eq('id', param(req, 'id'));
    res.json({ success: true, message: 'Pendaftaran disetujui.' });
  })
);

adminApi.post(
  '/pendaftaran/:id/reject',
  wrap(async (req: Request, res: Response) => {
    if (!supabaseAdmin) return res.status(503).json({ error: 'Basis data belum siap.' });
    if (!UUID_RE.test(param(req, 'id'))) return res.status(400).json({ error: 'ID tidak valid.' });

    const catatan = typeof req.body?.catatan_admin === 'string' ? req.body.catatan_admin.slice(0, 500) : null;
    const { error } = await supabaseAdmin
      .from('pendaftaran')
      .update({ status: 'ditolak', catatan_admin: catatan })
      .eq('id', param(req, 'id'));

    if (error) return res.status(400).json({ error: 'Gagal memperbarui status pendaftaran.' });
    res.json({ success: true, message: 'Pendaftaran ditolak.' });
  })
);

app.use('/api/admin', adminApi);

// Permintaan API yang tidak dikenali harus berakhir sebagai JSON 404,
// bukan jatuh ke fallback SPA dan mengembalikan HTML.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
});

// ============================================================================
// Menjaga project Supabase tetap aktif
// ============================================================================
// Project Supabase gratis dijeda otomatis setelah beberapa hari tanpa
// aktivitas — dan saat dijeda, seluruh isi website tampak kosong. Ping berkala
// mencegahnya SELAMA server ini hidup.
//
// PENTING: bila server sendiri ikut tidur (Cloud Run min-instances = 0), ping
// ini ikut berhenti. Untuk jaminan penuh, pasang juga cron eksternal yang
// memanggil /api/health. Lihat README bagian "Menjaga database tetap hidup".

let keepAliveTimer: NodeJS.Timeout | null = null;

async function pingSupabase(): Promise<void> {
  if (!supabaseAdmin) return;
  const { error } = await supabaseAdmin.from('site_settings').select('key').limit(1);
  if (error) log.warn('Ping Supabase gagal:', error.message);
}

function startKeepAlive(): void {
  if (!supabaseAdmin) return;
  void pingSupabase();
  keepAliveTimer = setInterval(() => void pingSupabase(), 6 * 60 * 60 * 1000);
  keepAliveTimer.unref();
}

// ============================================================================
// Penangan galat terpusat
// ============================================================================
// Express hanya mengenali middleware berparameter empat sebagai penangan galat,
// dan hanya yang terdaftar PALING AKHIR yang menangkap galat dari seluruh rute
// di atasnya. Karena middleware frontend baru dipasang di `startServer()`,
// penangan ini ikut dipasang di sana — bukan di sini.

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  log.error(`Galat pada ${req.method} ${req.path}:`, err);
  if (res.headersSent) {
    res.destroy();
    return;
  }
  // Detail internal sengaja tidak dikirim ke klien.
  res.status(500).json({ error: 'Terjadi kesalahan di server. Silakan coba lagi.' });
}

// ============================================================================
// Penyajian frontend & start
// ============================================================================

const RUNTIME_ENV_KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_R2_PUBLIC_URL'] as const;

function runtimeEnvScript(): string {
  const values = {
    VITE_SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
    VITE_R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || '',
  } satisfies Record<(typeof RUNTIME_ENV_KEYS)[number], string>;

  // `</script>` di dalam nilai akan menutup tag lebih awal; lolosi agar tidak
  // bisa dipakai menyisipkan skrip.
  const json = JSON.stringify(values).replace(/</g, '\\u003c');
  return `<script>window.ENV=${json};</script>`;
}

async function startServer(): Promise<void> {
  if (IS_PROD) {
    const distPath = path.resolve(process.cwd(), 'dist');

    // Aset ber-hash (dihasilkan Vite) aman di-cache selamanya; berkas lain
    // memakai cache pendek dengan revalidasi.
    app.use(
      express.static(distPath, {
        index: false,
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
        },
      })
    );
    const indexHtml = fs
      .readFileSync(path.join(distPath, 'index.html'), 'utf8')
      .replace('</head>', `${runtimeEnvScript()}</head>`);

    // Fallback SPA. Express 5 tidak lagi menerima pola '*', jadi memakai
    // middleware tanpa path (dijalankan setelah seluruh rute di atas).
    app.use((_req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(indexHtml);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.use(errorHandler);

  startKeepAlive();

  const server = app.listen(PORT, '0.0.0.0', () => {
    log.info(`Trigantara ${IS_PROD ? 'PRODUKSI' : 'PENGEMBANGAN'} berjalan di http://localhost:${PORT}`);
    log.info(`R2: ${s3Client ? 'aktif' : 'nonaktif'} · Supabase: ${supabaseAdmin ? 'aktif' : 'nonaktif'}`);
  });

  // Cloud Run memutus koneksi menganggur di 60 detik; nilai server harus lebih
  // besar agar tidak muncul galat 502 sporadis.
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;

  // Matikan dengan rapi: hentikan penerimaan koneksi baru, tunggu yang berjalan.
  const shutdown = (signal: string) => {
    log.info(`Menerima ${signal}, mematikan server...`);
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Exception yang tak tertangkap menandakan proses berada dalam keadaan tak
// menentu — keluar dan biarkan platform menjalankan ulang.
process.on('uncaughtException', (err) => {
  log.error('Exception tak tertangani:', err);
  process.exit(1);
});

// Sebaliknya, promise yang ditolak biasanya berasal dari satu permintaan.
// Versi lama mematikan seluruh server karenanya, sehingga satu galat jaringan
// kecil menjatuhkan website untuk semua pengunjung. Kini cukup dicatat.
process.on('unhandledRejection', (reason) => {
  log.error('Promise ditolak tanpa penanganan:', reason);
});

startServer().catch((err) => {
  log.error('Server gagal dijalankan:', err);
  process.exit(1);
});
