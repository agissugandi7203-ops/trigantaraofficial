import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '9d385f7bb343c82530abac9109c28343';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '38ab18a6316e832c6c6ea1460298f1de';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '37c2cc1a255a91caedf5ad3aa20fa4092f72f79dfea772cd1c7d9c8c17f2fc59';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'trigantara';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  avif: 'image/avif',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Parse object key from query param, dynamic route, or URL
  let rawKey = '';
  const qKey = req.query?.key ?? req.query?.['...key'] ?? req.query?.params;
  if (qKey) {
    rawKey = Array.isArray(qKey) ? qKey.join('/') : String(qKey);
  } else {
    const url = req.url || '';
    const match = url.match(/\/api\/storage\/(.+?)(\?.*)?$/);
    if (match) {
      rawKey = decodeURIComponent(match[1]);
    }
  }

  // Sanitize path traversal
  const key = rawKey
    .replace(/\\/g, '/')
    .split('/')
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .join('/');

  if (!key) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Kunci berkas tidak valid.' }));
    return;
  }

  try {
    const result = await s3.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );

    if (!result.Body) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Berkas tidak ditemukan.' }));
      return;
    }

    const ext = key.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || result.ContentType || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    if (result.ETag) res.setHeader('ETag', result.ETag);

    const bytes = await result.Body.transformToByteArray();
    res.statusCode = 200;
    res.end(Buffer.from(bytes));
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Berkas tidak ditemukan di storage.' }));
      return;
    }
    console.error('Storage proxy error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Gagal memuat berkas dari storage.' }));
  }
}
