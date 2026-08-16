-- ============================================================================
-- Trigantara — Migrasi 002: Penguatan Keamanan & Privasi  [WAJIB DIJALANKAN]
-- ============================================================================
--
-- MASALAH YANG DIPERBAIKI
-- -----------------------
-- 1. ESKALASI HAK AKSES (kritis)
--    Kebijakan lama memakai `auth.role() = 'authenticated'`. Artinya SIAPA PUN
--    yang berhasil membuat akun di project Supabase ini — dan pendaftaran akun
--    publik masih terbuka — otomatis memperoleh hak BACA, TULIS, UBAH, dan
--    HAPUS pada SELURUH tabel. Satu orang asing cukup mendaftar dengan email
--    apa pun, mengonfirmasi emailnya sendiri, lalu bisa menghapus seluruh isi
--    website. Migrasi ini mengganti pemeriksaan tersebut dengan daftar putih
--    admin yang eksplisit (tabel `admin_users`).
--
-- 2. KEBOCORAN DATA PRIBADI (kritis)
--    Tabel `members` bisa dibaca publik TERMASUK kolom `no_hp` dan `alamat`.
--    Nomor HP dan alamat rumah siswa — sebagian besar di bawah umur — dapat
--    diambil siapa saja tanpa login. Ini melanggar UU No. 27/2022 tentang
--    Pelindungan Data Pribadi. Migrasi ini menutup akses publik ke tabel dasar
--    dan menggantinya dengan view `members_public` yang hanya memuat kolom
--    non-sensitif.
--
-- 3. Kolom konten materi & metadata artikel ditambahkan agar materi dapat
--    dibaca langsung di website (bukan sekadar tautan unduh).
--
-- LANGKAH MENJALANKAN
-- -------------------
--   Supabase Dashboard → SQL Editor → New Query → tempel file ini → Run
--
-- SETELAH MENJALANKAN, WAJIB:
--   Dashboard → Authentication → Sign In / Providers → Email →
--   MATIKAN "Allow new users to sign up".
--   Tanpa langkah ini, orang asing tetap bisa membuat akun (walau kini tidak
--   punya hak tulis apa pun).
-- ============================================================================

BEGIN;

-- ============================================================================
-- BAGIAN 1 — Daftar putih admin
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  nama        TEXT,
  peran       TEXT NOT NULL DEFAULT 'admin' CHECK (peran IN ('admin', 'superadmin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS
  'Daftar putih akun yang boleh mengelola konten. Akun auth yang TIDAK ada di '
  'tabel ini tidak memiliki hak tulis apa pun, sekalipun berhasil login.';

-- Promosikan akun yang SUDAH ADA saat ini menjadi admin, supaya Anda tidak
-- terkunci dari panel admin sendiri. Akun yang mendaftar SETELAH migrasi ini
-- tidak akan otomatis menjadi admin.
INSERT INTO admin_users (user_id, email, peran)
SELECT id, email, 'superadmin' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Fungsi pemeriksa. SECURITY DEFINER agar bisa membaca admin_users tanpa
-- terjebak rekursi kebijakan RLS. search_path dikunci untuk mencegah
-- pembajakan skema (search_path hijacking).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin baca daftar admin" ON admin_users;
CREATE POLICY "Admin baca daftar admin" ON admin_users
  FOR SELECT TO authenticated USING (public.is_admin());
-- Sengaja tidak ada kebijakan INSERT/UPDATE/DELETE: penambahan admin hanya
-- lewat SQL Editor / service_role, tidak pernah lewat browser.

-- ============================================================================
-- BAGIAN 2 — Kolom baru (konten materi, metadata artikel)
-- ============================================================================

ALTER TABLE materials ADD COLUMN IF NOT EXISTS slug          TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS konten        TEXT NOT NULL DEFAULT '';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS ringkasan     TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS sumber        TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS sumber_url    TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS durasi_menit  INT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS urutan        INT NOT NULL DEFAULT 0;

-- Isi slug untuk baris lama yang belum punya, lalu pasang batasan unik.
UPDATE materials
   SET slug = regexp_replace(regexp_replace(lower(judul), '[^a-z0-9]+', '-', 'g'), '^-|-$', '', 'g')
             || '-' || substr(id::text, 1, 6)
 WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_materials_slug     ON materials(slug);
CREATE INDEX        IF NOT EXISTS idx_materials_terbit   ON materials(is_published, urutan, created_at DESC);

ALTER TABLE articles ADD COLUMN IF NOT EXISTS ringkasan  TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags       TEXT[] DEFAULT '{}';

-- Kategori artikel diperluas agar bisa memuat tulisan wawasan & sejarah.
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_kategori_check;
ALTER TABLE articles ADD  CONSTRAINT articles_kategori_check
  CHECK (kategori IN ('berita', 'tips', 'cerita', 'pengumuman', 'wawasan', 'sejarah'));

-- ============================================================================
-- BAGIAN 3 — Batas panjang input (anti-spam & anti-pembengkakan basis data)
-- ============================================================================

ALTER TABLE pendaftaran DROP CONSTRAINT IF EXISTS pendaftaran_panjang_wajar;
ALTER TABLE pendaftaran ADD  CONSTRAINT pendaftaran_panjang_wajar CHECK (
  char_length(nama_lengkap)          BETWEEN 2 AND 100 AND
  char_length(kelas)                 BETWEEN 1 AND 20  AND
  char_length(jurusan)               BETWEEN 1 AND 100 AND
  char_length(no_hp)                 BETWEEN 8 AND 20  AND
  char_length(COALESCE(alamat, ''))   <= 255 AND
  char_length(COALESCE(motivasi, '')) <= 1000
);

-- ============================================================================
-- BAGIAN 4 — Hapus SELURUH kebijakan lama
-- ============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
      FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename IN ('angkatan','members','articles','gallery',
                         'materials','events','pendaftaran','site_settings')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

ALTER TABLE angkatan      ENABLE ROW LEVEL SECURITY;
ALTER TABLE members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery       ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftaran   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BAGIAN 5 — Kebijakan baca publik (hanya konten yang memang untuk umum)
-- ============================================================================

CREATE POLICY "publik baca angkatan"        ON angkatan      FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "publik baca artikel terbit"  ON articles      FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "publik baca galeri"          ON gallery       FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "publik baca materi terbit"   ON materials     FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "publik baca kegiatan terbit" ON events        FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "publik baca pengaturan"      ON site_settings FOR SELECT TO anon, authenticated USING (true);

-- CATATAN: `members` TIDAK punya kebijakan baca publik. Data pribadi anggota
-- (no_hp, alamat, kelas) hanya dapat dibaca admin. Publik memakai view di
-- Bagian 7.

-- ============================================================================
-- BAGIAN 6 — Pendaftaran anggota baru
-- ============================================================================
-- Tamu boleh MENGIRIM formulir, tetapi tidak boleh membaca, mengubah, atau
-- menghapus pendaftaran siapa pun (termasuk miliknya sendiri).

CREATE POLICY "publik kirim pendaftaran" ON pendaftaran
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND catatan_admin IS NULL);

-- ============================================================================
-- BAGIAN 7 — Hak penuh admin
-- ============================================================================

CREATE POLICY "admin kelola angkatan"    ON angkatan      FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola members"     ON members       FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola articles"    ON articles      FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola gallery"     ON gallery       FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola materials"   ON materials     FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola events"      ON events        FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola pendaftaran" ON pendaftaran   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin kelola settings"    ON site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================================
-- BAGIAN 8 — View publik anggota (tanpa data pribadi)
-- ============================================================================
-- View ini sengaja TIDAK memakai security_invoker: ia berjalan dengan hak
-- pemiliknya sehingga dapat melewati RLS tabel `members`, namun hanya
-- memaparkan kolom yang aman. Nomor HP, alamat, kelas, jurusan, nomor KTA,
-- dan tanggal lahir tidak pernah keluar dari server.

DROP VIEW IF EXISTS public.members_public;

CREATE VIEW public.members_public AS
  SELECT id, nama_lengkap, nama_panggilan, jabatan, ambalan,
         angkatan_id, foto_url, status
    FROM public.members
   WHERE status IN ('aktif', 'alumni');

ALTER VIEW public.members_public SET (security_invoker = false);

REVOKE ALL ON public.members_public FROM PUBLIC;
GRANT SELECT ON public.members_public TO anon, authenticated;

COMMENT ON VIEW public.members_public IS
  'Proyeksi aman tabel members untuk konsumsi publik. Kolom data pribadi '
  '(no_hp, alamat, kelas, jurusan, nomor_kta, tanggal_bergabung) sengaja '
  'tidak disertakan — jangan pernah menambahkannya ke view ini.';

-- ============================================================================
-- BAGIAN 9 — Cabut akses langsung yang tidak perlu
-- ============================================================================

REVOKE ALL   ON public.members FROM anon;
GRANT  SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated; -- tetap disaring RLS

REVOKE ALL   ON public.pendaftaran FROM anon;
GRANT  INSERT ON public.pendaftaran TO anon;

COMMIT;

-- ============================================================================
-- VERIFIKASI — jalankan setelah COMMIT untuk memastikan hasilnya benar
-- ============================================================================
--   SELECT tablename, policyname, roles, cmd
--     FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
--
--   SELECT * FROM admin_users;          -- harus berisi akun admin Anda
--   SELECT * FROM members_public;       -- harus TANPA kolom no_hp / alamat
-- ============================================================================
