import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '9d385f7bb343c82530abac9109c28343';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '38ab18a6316e832c6c6ea1460298f1de';
const R2_SECRET_ACCESS_KEY =
  process.env.R2_SECRET_ACCESS_KEY || '37c2cc1a255a91caedf5ad3aa20fa4092f72f79dfea772cd1c7d9c8c17f2fc59';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'trigantara';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://vmtljjtksxviwwbmmftd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdGxqanRrc3h2aXd3Ym1tZnRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg2NDY4MywiZXhwIjoyMDk1NDQwNjgzfQ.6my6NE_5sBAt2TZ35wn-gtX2Ut4OoaZJt1yFyIsuK5c';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sanitizeKey(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return '';
  return raw
    .replace(/\\/g, '/')
    .split('/')
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .join('/')
    .slice(0, 1024);
}

function sanitizePrefix(raw: unknown): string {
  const key = sanitizeKey(raw);
  return key ? `${key}/` : '';
}

function fileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return /^[a-z0-9]{1,8}$/.test(ext) ? ext : 'bin';
}

function buildObjectKey(folder: unknown, filename: string): string {
  const prefix = sanitizeKey(folder);
  const objectName = `${Date.now()}-${uuidv4().slice(0, 8)}.${fileExtension(filename)}`;
  return prefix ? `${prefix}/${objectName}` : objectName;
}

function publicUrlFor(key: string): string {
  return `/api/storage/${key.replace(/^\/+/, '')}`;
}

async function verifyAdminAuth(req: any): Promise<boolean> {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.query?.token;
  if (!token) return false;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    // Check admin_users table by user_id
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminRow) return true;

    // Fallback check by email
    if (user.email === 'admintrigantara@gmail.com') return true;

    return false;
  } catch {
    return false;
  }
}

async function readBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Parse action from URL or query
  let action = '';
  const qAction = req.query?.action ?? req.query?.['...action'];
  if (qAction) {
    action = Array.isArray(qAction) ? qAction.join('/') : String(qAction);
  } else {
    const url = req.url || '';
    const match = url.match(/\/api\/admin\/(?:r2\/)?([^\?]+)/);
    if (match) {
      action = match[1];
    }
  }

  // Clean action
  action = action.replace(/^r2\//, '');

  // Auth check
  const isAdmin = await verifyAdminAuth(req);
  if (!isAdmin) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Akses ditolak. Sesi pengelola tidak valid atau telah kedaluwarsa.' }));
    return;
  }

  try {
    // 1. LIST
    if (action === 'list' && req.method === 'GET') {
      const prefix = sanitizePrefix(req.query?.prefix);
      const result = await s3.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME,
          Prefix: prefix,
          Delimiter: '/',
          MaxKeys: 1000,
        })
      );

      const listing = {
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

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(listing));
      return;
    }

    // 2. UPLOAD-PROXY
    if (action === 'upload-proxy' && req.method === 'POST') {
      const filename = String(req.query?.filename || 'berkas');
      const contentType = String(req.query?.contentType || 'application/octet-stream');
      const folder = String(req.query?.folder || 'uploads');

      const bodyBuffer = await readBody(req);
      if (bodyBuffer.length === 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Isi berkas tidak boleh kosong.' }));
        return;
      }

      const key = buildObjectKey(folder, filename);
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          ContentType: contentType,
          Body: bodyBuffer,
        })
      );

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, publicUrl: publicUrlFor(key), key }));
      return;
    }

    // 3. UPLOAD-URL
    if (action === 'upload-url' && req.method === 'POST') {
      const bodyBuffer = await readBody(req);
      let parsed: any = {};
      try {
        parsed = JSON.parse(bodyBuffer.toString('utf-8'));
      } catch {
        parsed = {};
      }

      const filename = String(parsed.filename || 'berkas');
      const contentType = String(parsed.contentType || 'application/octet-stream');
      const folder = String(parsed.folder || 'uploads');

      const key = buildObjectKey(folder, filename);
      const uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          ContentType: contentType,
        }),
        { expiresIn: 600 }
      );

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ uploadUrl, publicUrl: publicUrlFor(key), key }));
      return;
    }

    // 4. CREATE FOLDER
    if (action === 'create-folder' && req.method === 'POST') {
      const bodyBuffer = await readBody(req);
      let parsed: any = {};
      try {
        parsed = JSON.parse(bodyBuffer.toString('utf-8'));
      } catch {
        parsed = {};
      }

      const folderName = sanitizeKey(parsed.folderName);
      if (!folderName) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Nama folder tidak valid.' }));
        return;
      }

      const parent = sanitizeKey(parsed.parentPrefix ?? '');
      const key = `${parent ? `${parent}/` : ''}${folderName}/`;

      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          ContentLength: 0,
          Body: '',
        })
      );

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, key, message: 'Folder berhasil dibuat.' }));
      return;
    }

    // 5. DELETE
    if (action === 'delete' && req.method === 'DELETE') {
      const bodyBuffer = await readBody(req);
      let parsed: any = {};
      try {
        parsed = JSON.parse(bodyBuffer.toString('utf-8'));
      } catch {
        parsed = {};
      }

      if (Array.isArray(parsed.keys) && parsed.keys.length > 0) {
        const objectsToDelete = parsed.keys.map((k: string) => ({ Key: sanitizeKey(k) })).filter((o: any) => o.Key);
        if (objectsToDelete.length > 0) {
          await s3.send(
            new DeleteObjectsCommand({
              Bucket: R2_BUCKET_NAME,
              Delete: { Objects: objectsToDelete },
            })
          );
        }
      } else {
        const key = sanitizeKey(parsed.key);
        if (!key) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Kunci berkas wajib diisi.' }));
          return;
        }
        await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Berkas berhasil dihapus.' }));
      return;
    }

    // 6. DOWNLOAD
    if (action === 'download' && req.method === 'GET') {
      const key = sanitizeKey(req.query?.key);
      if (!key) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Kunci berkas wajib diisi.' }));
        return;
      }

      const result = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
      if (!result.Body) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Berkas tidak ditemukan.' }));
        return;
      }

      const filename = key.split('/').pop() || 'berkas';
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      const bytes = await result.Body.transformToByteArray();
      res.statusCode = 200;
      res.end(Buffer.from(bytes));
      return;
    }

    // Fallback unknown action
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Aksi admin "${action}" tidak dikenali.` }));
  } catch (err: any) {
    console.error('Admin R2 API Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Terjadi kesalahan pada server R2.' }));
  }
}
