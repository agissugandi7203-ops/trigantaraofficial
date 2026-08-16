/**
 * Mengisi tabel `materials` dan `articles` dengan konten kepramukaan.
 *
 * Aman dijalankan berulang: pencocokan dilakukan berdasarkan `slug`, sehingga
 * baris yang sudah ada diperbarui, bukan digandakan. Gambar yang sudah pernah
 * diunggah ke R2 juga tidak diunduh ulang.
 *
 *   npm run seed          — jalankan sungguhan
 *   npm run seed:dry      — hanya menampilkan rencana, tanpa menulis apa pun
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { PenyimpanGambar } from './lib/gambar';
import { MATERI_ISYARAT } from './content/materi-isyarat';
import { MATERI_KETERAMPILAN } from './content/materi-keterampilan';
import { MATERI_PENGETAHUAN } from './content/materi-pengetahuan';
import { MATERI_LAPANGAN } from './content/materi-lapangan';
import { MATERI_ORGANISASI } from './content/materi-organisasi';
import { MATERI_KESEHATAN_ALAM } from './content/materi-kesehatan-alam';
import { ARTIKEL_SEJARAH } from './content/artikel-sejarah';
import { ARTIKEL_WAWASAN } from './content/artikel-wawasan';
import { ARTIKEL_TIPS } from './content/artikel-tips';
import type { ArtikelSeed, MateriSeed } from './content/types';

const DRY_RUN = process.argv.includes('--dry-run');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di berkas .env');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MATERI: MateriSeed[] = [
  ...MATERI_ISYARAT,
  ...MATERI_KETERAMPILAN,
  ...MATERI_PENGETAHUAN,
  ...MATERI_LAPANGAN,
  ...MATERI_ORGANISASI,
  ...MATERI_KESEHATAN_ALAM,
];
const ARTIKEL: ArtikelSeed[] = [...ARTIKEL_SEJARAH, ...ARTIKEL_WAWASAN, ...ARTIKEL_TIPS];

const r2Siap = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    (process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL)
);

const penyimpan = r2Siap
  ? new PenyimpanGambar({
      accountId: process.env.R2_ACCOUNT_ID!,
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      bucket: process.env.R2_BUCKET_NAME!,
      publicUrl: (process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL)!.replace(/\/+$/, ''),
    })
  : null;

/**
 * Memeriksa kolom apa saja yang benar-benar ada di sebuah tabel.
 * Kolom baru (konten materi, ringkasan artikel, dan lainnya) hanya tersedia
 * setelah migrasi 002 dijalankan; tanpa pemeriksaan ini, seluruh proses gagal
 * dengan pesan galat yang membingungkan.
 */
async function kolomTersedia(tabel: string, kandidat: string[]): Promise<Set<string>> {
  const ada = new Set<string>();
  for (const kolom of kandidat) {
    const { error } = await db.from(tabel).select(kolom).limit(1);
    if (!error) ada.add(kolom);
  }
  return ada;
}

function saring<T extends Record<string, unknown>>(baris: T, diizinkan: Set<string>): Partial<T> {
  const keluar: Record<string, unknown> = {};
  for (const [kunci, nilai] of Object.entries(baris)) {
    if (diizinkan.has(kunci)) keluar[kunci] = nilai;
  }
  return keluar as Partial<T>;
}

async function seedMateri(): Promise<void> {
  console.log(`\n=== MATERI (${MATERI.length} entri) ===`);

  const kolom = await kolomTersedia('materials', [
    'judul', 'slug', 'deskripsi', 'ringkasan', 'konten', 'kategori', 'file_url',
    'thumbnail_url', 'tingkatan', 'sumber', 'sumber_url', 'durasi_menit',
    'urutan', 'is_published',
  ]);

  const kolomBaru = ['slug', 'konten', 'ringkasan', 'sumber', 'sumber_url', 'durasi_menit', 'urutan'];
  const hilang = kolomBaru.filter((k) => !kolom.has(k));
  if (hilang.length > 0) {
    console.warn(
      `\n  PERHATIAN: kolom berikut belum ada di tabel materials: ${hilang.join(', ')}\n` +
        '  Jalankan supabase/migrations/002_security_hardening.sql lebih dulu,\n' +
        '  lalu ulangi perintah ini agar isi materi ikut tersimpan.\n'
    );
  }

  let baru = 0;
  let diperbarui = 0;

  for (const m of MATERI) {
    let thumbnail: string | undefined;

    if (penyimpan && m.gambar && !DRY_RUN) {
      const hasil = await penyimpan.simpan(`materi-${m.slug}`, m.gambar.cari, m.gambar.cadangan);
      if (hasil) {
        thumbnail = hasil.url;
        console.log(`  gambar  ${m.slug} -> ${hasil.lisensi}`);
      } else {
        console.log(`  gambar  ${m.slug} -> tidak ditemukan, dilewati`);
      }
    }

    const baris = {
      judul: m.judul,
      slug: m.slug,
      deskripsi: m.deskripsi,
      ringkasan: m.ringkasan,
      konten: m.konten,
      kategori: m.kategori,
      tingkatan: m.tingkatan,
      sumber: m.sumber,
      sumber_url: m.sumber_url,
      durasi_menit: m.durasi_menit,
      urutan: m.urutan,
      is_published: true,
      thumbnail_url: thumbnail,
    };

    const muatan = saring(baris, kolom);

    if (DRY_RUN) {
      console.log(`  [uji]   ${m.slug} (${Object.keys(muatan).length} kolom)`);
      continue;
    }

    // Dicari berdasarkan slug lebih dulu, lalu judul sebagai cadangan.
    // Pencarian ganda ini penting: bila skrip dijalankan sebelum migrasi 002,
    // baris tersimpan tanpa slug. Setelah migrasi, migrasi itu mengisi slug
    // dengan bentuk berbeda (berakhiran potongan id), sehingga pencarian yang
    // hanya mengandalkan slug akan menganggapnya baris baru dan membuat
    // duplikat.
    let adaSebelumnya: { id: string } | null = null;

    if (kolom.has('slug')) {
      const { data } = await db.from('materials').select('id').eq('slug', m.slug).maybeSingle();
      adaSebelumnya = data as { id: string } | null;
    }
    if (!adaSebelumnya) {
      const { data } = await db.from('materials').select('id').eq('judul', m.judul).maybeSingle();
      adaSebelumnya = data as { id: string } | null;
    }

    if (adaSebelumnya) {
      const { error } = await db.from('materials').update(muatan).eq('id', adaSebelumnya.id);
      if (error) console.error(`  GAGAL   ${m.slug}: ${error.message}`);
      else {
        diperbarui += 1;
        console.log(`  ubah    ${m.slug}`);
      }
    } else {
      const { error } = await db.from('materials').insert(muatan);
      if (error) console.error(`  GAGAL   ${m.slug}: ${error.message}`);
      else {
        baru += 1;
        console.log(`  baru    ${m.slug}`);
      }
    }
  }

  console.log(`  -> ${baru} materi baru, ${diperbarui} diperbarui`);
}

async function seedArtikel(): Promise<void> {
  console.log(`\n=== ARTIKEL (${ARTIKEL.length} entri) ===`);

  const kolom = await kolomTersedia('articles', [
    'judul', 'slug', 'konten', 'ringkasan', 'thumbnail_url', 'kategori',
    'penulis', 'tags', 'is_published', 'published_at',
  ]);

  let baru = 0;
  let diperbarui = 0;

  for (const a of ARTIKEL) {
    let thumbnail: string | undefined;

    if (penyimpan && a.gambar && !DRY_RUN) {
      const hasil = await penyimpan.simpan(`artikel-${a.slug}`, a.gambar.cari, a.gambar.cadangan);
      if (hasil) {
        thumbnail = hasil.url;
        console.log(`  gambar  ${a.slug} -> ${hasil.lisensi}`);
      } else {
        console.log(`  gambar  ${a.slug} -> tidak ditemukan, dilewati`);
      }
    }

    const baris = {
      judul: a.judul,
      slug: a.slug,
      konten: a.konten,
      ringkasan: a.ringkasan,
      kategori: a.kategori,
      penulis: a.penulis,
      tags: a.tags,
      is_published: true,
      published_at: new Date().toISOString(),
      ...(thumbnail ? { thumbnail_url: thumbnail } : {}),
    };

    const muatan = saring(baris, kolom);

    if (DRY_RUN) {
      console.log(`  [uji]   ${a.slug} (${Object.keys(muatan).length} kolom)`);
      continue;
    }

    let adaSebelumnya: { id: string } | null = null;
    {
      const { data } = await db.from('articles').select('id').eq('slug', a.slug).maybeSingle();
      adaSebelumnya = data as { id: string } | null;
    }
    if (!adaSebelumnya) {
      const { data } = await db.from('articles').select('id').eq('judul', a.judul).maybeSingle();
      adaSebelumnya = data as { id: string } | null;
    }

    if (adaSebelumnya) {
      // Tanggal terbit yang sudah ada dipertahankan supaya urutan blog tidak
      // teracak setiap kali skrip ini dijalankan ulang.
      const { published_at: _abaikan, ...tanpaTanggal } = muatan as Record<string, unknown>;
      const { error } = await db.from('articles').update(tanpaTanggal).eq('id', adaSebelumnya.id);
      if (error) console.error(`  GAGAL   ${a.slug}: ${error.message}`);
      else {
        diperbarui += 1;
        console.log(`  ubah    ${a.slug}`);
      }
    } else {
      const { error } = await db.from('articles').insert(muatan);
      if (error) console.error(`  GAGAL   ${a.slug}: ${error.message}`);
      else {
        baru += 1;
        console.log(`  baru    ${a.slug}`);
      }
    }
  }

  console.log(`  -> ${baru} artikel baru, ${diperbarui} diperbarui`);
}

async function main(): Promise<void> {
  console.log('Trigantara — pengisian konten');
  console.log(`Mode        : ${DRY_RUN ? 'UJI COBA (tidak menulis apa pun)' : 'SUNGGUHAN'}`);
  console.log(`Basis data  : ${SUPABASE_URL}`);
  console.log(`Gambar R2   : ${r2Siap ? 'aktif' : 'nonaktif (kredensial R2 belum lengkap)'}`);

  await seedMateri();
  await seedArtikel();

  console.log('\nSelesai.');
}

main().catch((err) => {
  console.error('\nProses gagal:', err);
  process.exit(1);
});
