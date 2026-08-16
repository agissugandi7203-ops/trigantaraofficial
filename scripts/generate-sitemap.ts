import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SITUS = 'https://trigantara.web.id';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://vmtljjtksxviwwbmmftd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdGxqanRrc3h2aXd3Ym1tZnRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg2NDY4MywiZXhwIjoyMDk1NDQwNjgzfQ.6my6NE_5sBAt2TZ35wn-gtX2Ut4OoaZJt1yFyIsuK5c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const HALAMAN_TETAP = [
  { path: '', ubah: 'daily', prioritas: '1.0' },
  { path: '/tentang', ubah: 'monthly', prioritas: '0.8' },
  { path: '/materi', ubah: 'weekly', prioritas: '0.9' },
  { path: '/kegiatan', ubah: 'weekly', prioritas: '0.8' },
  { path: '/blog', ubah: 'daily', prioritas: '0.8' },
  { path: '/galeri', ubah: 'weekly', prioritas: '0.7' },
  { path: '/angkatan', ubah: 'monthly', prioritas: '0.6' },
  { path: '/gabung', ubah: 'monthly', prioritas: '0.9' },
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function generate() {
  const hariIni = new Date().toISOString().slice(0, 10);
  const entri = HALAMAN_TETAP.map(
    (h) =>
      `  <url>\n    <loc>${SITUS}${h.path}</loc>\n    <lastmod>${hariIni}</lastmod>\n` +
      `    <changefreq>${h.ubah}</changefreq>\n    <priority>${h.prioritas}</priority>\n  </url>`
  );

  try {
    const [materi, artikel] = await Promise.all([
      supabase.from('materials').select('slug, updated_at, created_at').eq('is_published', true).limit(2000),
      supabase.from('articles').select('slug, updated_at, published_at, created_at').eq('is_published', true).limit(2000),
    ]);

    for (const m of materi.data ?? []) {
      if (!m.slug) continue;
      const tgl = String(m.updated_at ?? m.created_at ?? hariIni).slice(0, 10);
      entri.push(
        `  <url>\n    <loc>${SITUS}/materi/${xmlEscape(String(m.slug))}</loc>\n` +
        `    <lastmod>${tgl}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      );
    }

    for (const a of artikel.data ?? []) {
      if (!a.slug) continue;
      const tgl = String(a.updated_at ?? a.published_at ?? a.created_at ?? hariIni).slice(0, 10);
      entri.push(
        `  <url>\n    <loc>${SITUS}/blog/${xmlEscape(String(a.slug))}</loc>\n` +
        `    <lastmod>${tgl}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      );
    }
  } catch (e) {
    console.error('Sitemap fetch error:', e);
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${entri.join('\n')}\n` +
    '</urlset>\n';

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Generated public/sitemap.xml with ${entri.length} URLs.`);

  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${SITUS}/sitemap.xml`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf-8');
  console.log('Generated public/robots.txt.');
}

generate();
