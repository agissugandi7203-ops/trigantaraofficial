// ============================================
// GLOBAL CRASH HANDLERS — must be first
// ============================================
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});

console.log('[BOOT] Starting Trigantara server...');
console.log('[BOOT] NODE_ENV =', process.env.NODE_ENV);
console.log('[BOOT] PORT =', process.env.PORT);

import dotenv from 'dotenv';
import fs from 'fs';

// Load dotenv ONLY in dev (in production, env vars are injected by Cloud Run)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('[BOOT] dotenv loaded for development');
}

import express from 'express';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';
import { Readable } from 'stream';

console.log('[BOOT] Modules imported successfully');

const app = express();
app.use(express.json({ limit: '1mb' }));

// ============================================
// Environment & Config
// ============================================
const PORT = parseInt(process.env.PORT || '8080');
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''; // e.g., https://pub-xxx.r2.dev
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('[BOOT] Config parsed. PORT =', PORT);

// ============================================
// S3/R2 Client
// ============================================
let s3Client: S3Client | null = null;
if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('[R2] Client siap.');
} else {
  console.warn('[R2] Belum dikonfigurasi — upload file tidak tersedia.');
}

// ============================================
// Supabase Server Client (service role)
// ============================================
let supabaseAdmin: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('[Supabase] Admin client siap.');
} else if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('[Supabase] Menggunakan anon key (terbatas).');
} else {
  console.warn('[Supabase] Belum dikonfigurasi.');
}

// ============================================
// Auth Middleware — Verifikasi Admin JWT
// ============================================
async function verifyAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
    return;
  }

  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Supabase belum dikonfigurasi.' });
    return;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      console.error('[verifyAdmin] auth.getUser failed. Token:', token ? (token.substring(0, 15) + '...') : token, 'Error:', error);
      res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa.' });
      return;
    }

    // Attach user to request for downstream handlers
    (req as any).user = user;
    next();
  } catch (err) {
    console.error('[verifyAdmin] Exception caught:', err);
    res.status(401).json({ error: 'Gagal memverifikasi token.' });
  }
}

// ============================================
// Rate Limiter (simple in-memory)
// ============================================
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
      return;
    }

    record.count++;
    next();
  };
}

// ============================================
// PUBLIC ROUTES
// ============================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      r2: !!s3Client,
      supabase: !!supabaseAdmin,
    },
  });
});

// Pendaftaran anggota baru (public, rate-limited)
app.post('/api/pendaftaran', rateLimit(5, 60000), async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Database belum dikonfigurasi.' });
    return;
  }

  const { nama_lengkap, kelas, jurusan, no_hp, alamat, motivasi } = req.body;

  if (!nama_lengkap || !kelas || !jurusan || !no_hp) {
    res.status(400).json({ error: 'Data tidak lengkap. Mohon isi semua field wajib.' });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('pendaftaran')
    .insert({
      nama_lengkap,
      kelas,
      jurusan,
      no_hp,
      alamat: alamat || null,
      motivasi: motivasi || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[Pendaftaran] Error:', error);
    res.status(500).json({ error: 'Gagal menyimpan pendaftaran.' });
    return;
  }

  res.json({ success: true, data });
});

// ============================================
// PROTECTED ADMIN ROUTES
// ============================================

// Upload URL (admin only)
app.post('/api/admin/upload-url', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }

  const { filename, contentType, folder = 'uploads' } = req.body;

  if (!filename || !contentType) {
    res.status(400).json({ error: 'Filename dan contentType wajib diisi.' });
    return;
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(contentType)) {
    res.status(400).json({ error: 'Tipe file tidak diizinkan.' });
    return;
  }

  const cleanFolder = folder.split('/').filter(Boolean).join('/');
  const ext = filename.split('.').pop() || 'bin';
  const fileId = `${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;
  const key = cleanFolder ? `${cleanFolder}/${fileId}` : fileId;

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;

    res.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error('[R2] Presigned URL error:', err);
    res.status(500).json({ error: 'Gagal membuat upload URL.' });
  }
});

// R2 Storage Management — Proxy upload (bypasses browser CORS)
app.post(
  '/api/admin/r2/upload-proxy',
  verifyAdmin,
  express.raw({ type: '*/*', limit: '15mb' }),
  async (req, res) => {
    if (!s3Client || !R2_BUCKET_NAME) {
      res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
      return;
    }

    const filename = req.query.filename as string;
    const contentType = req.query.contentType as string;
    const folder = (req.query.folder as string) || 'uploads';

    if (!filename || !contentType) {
      res.status(400).json({ error: 'Query parameters filename dan contentType wajib diisi.' });
      return;
    }

    if (!req.body || !(req.body instanceof Buffer)) {
      res.status(400).json({ error: 'Data file tidak valid.' });
      return;
    }

    const cleanFolder = folder.split('/').filter(Boolean).join('/');
    const ext = filename.split('.').pop() || 'bin';
    const fileId = `${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;
    const key = cleanFolder ? `${cleanFolder}/${fileId}` : fileId;

    try {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Body: req.body,
      });

      await s3Client.send(command);
      clearR2Cache();

      const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
      res.json({ success: true, publicUrl, key });
    } catch (err) {
      console.error('[R2 Proxy Upload] Error:', err);
      res.status(500).json({ error: 'Gagal mengunggah file ke R2 melalui proxy.' });
    }
  }
);

// R2 Storage Management — Download file (proxied to avoid CORS and force direct attachment download)
app.get('/api/admin/r2/download', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }
  const key = req.query.key as string;
  if (!key) {
    res.status(400).json({ error: 'Key file wajib diisi.' });
    return;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    const result = await s3Client.send(command);

    const filename = key.split('/').pop() || 'file';
    // Force browser to download as attachment instead of inline view
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', result.ContentType || 'application/octet-stream');

    if (result.Body) {
      (result.Body as any).pipe(res);
    } else {
      res.status(404).json({ error: 'File kosong.' });
    }
  } catch (err) {
    console.error('[R2 Download Proxy] Error:', err);
    res.status(500).json({ error: 'Gagal mengunduh file dari R2.' });
  }
});

// Helper to recursively fetch all file keys under a folder prefix in R2
async function listAllKeys(prefix: string): Promise<string[]> {
  let keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      for (const obj of response.Contents) {
        // Exclude the folder placeholder itself (which ends with '/')
        if (obj.Key && !obj.Key.endsWith('/')) {
          keys.push(obj.Key);
        }
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return keys;
}

// Helper to get file from R2 and append it to archiver stream
function appendStreamToZip(
  archive: archiver.Archiver,
  key: string,
  basePrefix: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        })
      );

      if (!response.Body) {
        reject(new Error(`File ${key} kosong atau tidak ditemukan.`));
        return;
      }

      const r2Stream = response.Body as Readable;

      // Extract the relative path within the ZIP.
      const relativePath = key.startsWith(basePrefix)
        ? key.substring(basePrefix.length)
        : key.split('/').pop() || key;

      r2Stream.on('error', (err) => {
        reject(err);
      });

      archive.append(r2Stream, { name: relativePath }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

// R2 Storage Management — Download folder or multiple files as ZIP
app.get('/api/admin/r2/download-zip', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }

  const keysParam = req.query.keys as string;
  const basePrefix = (req.query.basePrefix as string) || '';
  
  if (!keysParam) {
    res.status(400).json({ error: 'Parameter keys wajib diisi.' });
    return;
  }

  let selectedKeys: string[] = [];
  try {
    selectedKeys = JSON.parse(keysParam);
    if (!Array.isArray(selectedKeys)) {
      selectedKeys = [keysParam];
    }
  } catch {
    selectedKeys = [keysParam];
  }

  if (selectedKeys.length === 0) {
    res.status(400).json({ error: 'Daftar keys tidak boleh kosong.' });
    return;
  }

  // Set ZIP headers
  const zipName = `trigantara-download-${Date.now()}.zip`;
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(zipName)}"`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  const archive = archiver('zip', {
    zlib: { level: 1 }, // FAST compression
    forceZip64: true,   // ZIP64 support
  });

  archive.pipe(res);

  let isCancelled = false;
  res.on('close', () => {
    isCancelled = true;
    console.log('[R2 Zip Download] Koneksi dibatalkan oleh client.');
  });

  archive.on('error', (err) => {
    console.error('[R2 Zip Download] Archive stream error:', err);
    res.destroy(err);
  });

  try {
    for (const key of selectedKeys) {
      if (isCancelled) break;

      if (key.endsWith('/')) {
        // Virtual Directory: List recursively
        const fileKeys = await listAllKeys(key);
        for (const fKey of fileKeys) {
          if (isCancelled) break;
          await appendStreamToZip(archive, fKey, basePrefix);
        }
      } else {
        // Individual File
        await appendStreamToZip(archive, key, basePrefix);
      }
    }

    if (!isCancelled) {
      await archive.finalize();
    }
  } catch (err) {
    console.error('[R2 Zip Download] Proses zip gagal:', err);
    archive.abort();
    res.destroy(err as Error);
  }
});

// ============================================
// R2 Cache Configuration
// ============================================
interface CachedR2List {
  folders: any[];
  files: any[];
  prefix: string;
}
const r2ListCache = new Map<string, { data: CachedR2List; timestamp: number }>();
const CACHE_TTL_MS = 30000; // Cache for 30 seconds

function clearR2Cache() {
  r2ListCache.clear();
  console.log('[R2 Cache] Cache cleared due to write operation');
}

// R2 Storage Management — List objects
app.get('/api/admin/r2/list', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }
  const prefix = (req.query.prefix as string) || '';
  const refresh = req.query.refresh === 'true';

  // Check cache first if not forcing refresh
  if (!refresh) {
    const cached = r2ListCache.get(prefix);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      console.log(`[R2 Cache] Cache hit for prefix: "${prefix}"`);
      res.json(cached.data);
      return;
    }
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
      MaxKeys: 200,
    });
    const result = await s3Client.send(command);
    
    const folders = (result.CommonPrefixes || []).map(p => ({
      name: p.Prefix?.replace(prefix, '').replace(/\/$/, '') || '',
      key: p.Prefix || '',
      type: 'folder' as const,
    }));
    
    const files = (result.Contents || [])
      .filter(obj => obj.Key !== prefix) // exclude the prefix itself
      .map(obj => ({
        name: obj.Key?.replace(prefix, '') || '',
        key: obj.Key || '',
        size: obj.Size || 0,
        lastModified: obj.LastModified?.toISOString() || '',
        type: 'file' as const,
        url: R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${obj.Key}` : obj.Key,
      }));
    
    const responseData = { folders, files, prefix };
    r2ListCache.set(prefix, { data: responseData, timestamp: Date.now() });
    res.json(responseData);
  } catch (err) {
    console.error('[R2] List error:', err);
    res.status(500).json({ error: 'Gagal mengambil daftar file R2.' });
  }
});

// R2 Storage Management — Delete object
app.delete('/api/admin/r2/delete', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }
  const { key } = req.body;
  if (!key) {
    res.status(400).json({ error: 'Key file wajib diisi.' });
    return;
  }
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }));
    clearR2Cache();
    res.json({ success: true, message: `File "${key}" berhasil dihapus.` });
  } catch (err) {
    console.error('[R2] Delete error:', err);
    res.status(500).json({ error: 'Gagal menghapus file dari R2.' });
  }
});

// R2 Storage Management — Create folder (empty object with trailing /)
app.post('/api/admin/r2/create-folder', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }
  const { folderName, parentPrefix = '' } = req.body;
  if (!folderName) {
    res.status(400).json({ error: 'Nama folder wajib diisi.' });
    return;
  }
  const cleanParent = parentPrefix.split('/').filter(Boolean).join('/');
  const cleanFolder = folderName.split('/').filter(Boolean).join('/');
  const key = cleanParent ? `${cleanParent}/${cleanFolder}/` : `${cleanFolder}/`;
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentLength: 0,
      Body: '',
    }));
    clearR2Cache();
    res.json({ success: true, key, message: `Folder "${folderName}" berhasil dibuat.` });
  } catch (err) {
    console.error('[R2] Create folder error:', err);
    res.status(500).json({ error: 'Gagal membuat folder di R2.' });
  }
});

// Generic CRUD helper
function createCrudRoutes(tableName: string, routePath: string) {
  // List
  app.get(`/api/admin/${routePath}`, verifyAdmin, async (_req, res) => {
    if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
    const { data, error } = await supabaseAdmin.from(tableName).select('*').order('created_at', { ascending: false });
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.json(data);
  });

  // Get single
  app.get(`/api/admin/${routePath}/:id`, verifyAdmin, async (req, res) => {
    if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
    const { data, error } = await supabaseAdmin.from(tableName).select('*').eq('id', req.params.id).single();
    if (error) { res.status(404).json({ error: 'Data tidak ditemukan.' }); return; }
    res.json(data);
  });

  // Create
  app.post(`/api/admin/${routePath}`, verifyAdmin, async (req, res) => {
    if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
    const { data, error } = await supabaseAdmin.from(tableName).insert(req.body).select().single();
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json(data);
  });

  // Update
  app.put(`/api/admin/${routePath}/:id`, verifyAdmin, async (req, res) => {
    if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
    const { data, error } = await supabaseAdmin.from(tableName).update(req.body).eq('id', req.params.id).select().single();
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json(data);
  });

  // Delete
  app.delete(`/api/admin/${routePath}/:id`, verifyAdmin, async (req, res) => {
    if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
    const { error } = await supabaseAdmin.from(tableName).delete().eq('id', req.params.id);
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json({ success: true });
  });
}

// Register CRUD routes for all tables
createCrudRoutes('articles', 'articles');
createCrudRoutes('gallery', 'gallery');
createCrudRoutes('materials', 'materials');
createCrudRoutes('members', 'members');
createCrudRoutes('events', 'events');
createCrudRoutes('angkatan', 'angkatan');
createCrudRoutes('pendaftaran', 'pendaftaran');
createCrudRoutes('site_settings', 'settings');

// Approve pendaftaran (move to members)
app.post('/api/admin/pendaftaran/:id/approve', verifyAdmin, async (req, res) => {
  if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }

  const { data: pendaftaran, error: fetchErr } = await supabaseAdmin
    .from('pendaftaran')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (fetchErr || !pendaftaran) {
    res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    return;
  }

  // Create member from pendaftaran
  const { error: insertErr } = await supabaseAdmin.from('members').insert({
    nama_lengkap: pendaftaran.nama_lengkap,
    kelas: pendaftaran.kelas,
    jurusan: pendaftaran.jurusan,
    no_hp: pendaftaran.no_hp,
    alamat: pendaftaran.alamat,
    status: 'aktif',
  });

  if (insertErr) {
    res.status(500).json({ error: 'Gagal membuat data anggota.' });
    return;
  }

  // Update pendaftaran status
  await supabaseAdmin.from('pendaftaran').update({ status: 'diterima' }).eq('id', req.params.id);

  res.json({ success: true, message: 'Pendaftaran disetujui.' });
});

// Reject pendaftaran
app.post('/api/admin/pendaftaran/:id/reject', verifyAdmin, async (req, res) => {
  if (!supabaseAdmin) { res.status(500).json({ error: 'DB error' }); return; }
  const { catatan_admin } = req.body;
  const { error } = await supabaseAdmin
    .from('pendaftaran')
    .update({ status: 'ditolak', catatan_admin })
    .eq('id', req.params.id);

  if (error) { res.status(400).json({ error: error.message }); return; }
  res.json({ success: true, message: 'Pendaftaran ditolak.' });
});

// ============================================
// SUPABASE KEEP-ALIVE
// ============================================
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function startKeepAlive() {
  if (!supabaseAdmin) return;

  // Ping immediately on start
  pingSupabase();

  // Then ping every 12 hours (43200000 ms)
  keepAliveInterval = setInterval(pingSupabase, 12 * 60 * 60 * 1000);
  console.log('[Keep-Alive] Dijadwalkan setiap 12 jam.');
}

async function pingSupabase() {
  if (!supabaseAdmin) return;
  try {
    const { error } = await supabaseAdmin.from('site_settings').select('key').limit(1);
    if (error) {
      console.error('[Keep-Alive] Gagal ping:', error.message);
    } else {
      console.log('[Keep-Alive] Supabase berhasil di-ping pada', new Date().toISOString());
    }
  } catch (err) {
    console.error('[Keep-Alive] Error:', err);
  }
}

// ============================================
// STARTUP (Dev + Production)
// ============================================
async function startServer() {
  try {
    console.log('[BOOT] startServer() called');
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      console.log('[BOOT] Production mode — setting up static file serving');
      // Production: serve static built files
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath, { index: false }));

      // Also serve /assets and /public from root (logos, angkatan photos, etc.)
      app.use('/assets', express.static(path.resolve(process.cwd(), 'assets')));
      app.use('/public', express.static(path.resolve(process.cwd(), 'public')));

      // SPA fallback: serve index.html for all non-API routes
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
          res.status(404).json({ error: 'API endpoint not found' });
          return;
        }
        
        const htmlPath = path.join(distPath, 'index.html');
        fs.readFile(htmlPath, 'utf8', (err: any, data: string) => {
          if (err) {
            console.error('Failed to read index.html:', err);
            res.status(500).send('Error loading frontend application.');
            return;
          }
          
          // Inject runtime environment variables for Vite frontend
          const envScript = `<script>window.ENV = ${JSON.stringify({
            VITE_SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
            VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
            VITE_R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || '',
          })};</script>`;
          
          const modifiedHtml = data.replace('</head>', `${envScript}</head>`);
          res.send(modifiedHtml);
        });
      });
    } else {
      console.log('[BOOT] Development mode — starting Vite dev server');
      // Development: use Vite dev server
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }

    // Start keep-alive cron
    startKeepAlive();

    console.log('[BOOT] Calling app.listen on port', PORT);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n  🏕️  Trigantara Server (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'})`);
      console.log(`  ➜  http://0.0.0.0:${PORT}`);
      console.log(`  ➜  R2: ${s3Client ? '✅ Aktif' : '❌ Belum dikonfigurasi'}`);
      console.log(`  ➜  Supabase: ${supabaseAdmin ? '✅ Aktif' : '❌ Belum dikonfigurasi'}`);
      console.log(`  ➜  Keep-Alive: ${supabaseAdmin ? '✅ Setiap 12 jam' : '❌ Nonaktif'}\n`);
    });
  } catch (err) {
    console.error('[FATAL] startServer crashed:', err);
    process.exit(1);
  }
}

startServer();
