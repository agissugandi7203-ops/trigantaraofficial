import 'dotenv/config'; // MUST be first — loads .env into process.env
import express from 'express';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json({ limit: '1mb' }));

// ============================================
// Environment & Config
// ============================================
const PORT = parseInt(process.env.PORT || '3000');
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''; // e.g., https://pub-xxx.r2.dev
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

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
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Supabase belum dikonfigurasi.' });
    return;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa.' });
      return;
    }

    // Attach user to request for downstream handlers
    (req as any).user = user;
    next();
  } catch {
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

  const ext = filename.split('.').pop() || 'bin';
  const key = `${folder}/${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;

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

// R2 Storage Management — List objects
app.get('/api/admin/r2/list', verifyAdmin, async (req, res) => {
  if (!s3Client || !R2_BUCKET_NAME) {
    res.status(500).json({ error: 'R2 belum dikonfigurasi.' });
    return;
  }
  const prefix = (req.query.prefix as string) || '';
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
    
    res.json({ folders, files, prefix });
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
  const key = `${parentPrefix}${folderName}/`;
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentLength: 0,
      Body: '',
    }));
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
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // Production: serve static built files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Also serve /assets and /public from root (logos, angkatan photos, etc.)
    app.use('/assets', express.static(path.resolve(process.cwd(), 'assets')));
    app.use('/public', express.static(path.resolve(process.cwd(), 'public')));

    // SPA fallback: serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
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

  app.listen(PORT, () => {
    console.log(`\n  🏕️  Trigantara Server (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'})`);
    console.log(`  ➜  http://localhost:${PORT}`);
    console.log(`  ➜  R2: ${s3Client ? '✅ Aktif' : '❌ Belum dikonfigurasi'}`);
    console.log(`  ➜  Supabase: ${supabaseAdmin ? '✅ Aktif' : '❌ Belum dikonfigurasi'}`);
    console.log(`  ➜  Keep-Alive: ${supabaseAdmin ? '✅ Setiap 12 jam' : '❌ Nonaktif'}\n`);
  });
}

startServer();
