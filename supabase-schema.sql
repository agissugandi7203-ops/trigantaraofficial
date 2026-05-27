-- ============================================
-- Trigantara — Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABEL: angkatan
-- ============================================
CREATE TABLE IF NOT EXISTS angkatan (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tahun_ajaran TEXT NOT NULL UNIQUE,
  nama_angkatan TEXT,
  foto_bersama_url TEXT,
  deskripsi TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: members
-- ============================================
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  nama_panggilan TEXT,
  kelas TEXT,
  jurusan TEXT,
  jabatan TEXT,
  ambalan TEXT CHECK (ambalan IN ('putra', 'putri')),
  angkatan_id UUID REFERENCES angkatan(id) ON DELETE SET NULL,
  no_hp TEXT,
  alamat TEXT,
  foto_url TEXT,
  nomor_kta TEXT,
  tanggal_bergabung DATE,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'alumni', 'nonaktif')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: articles
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  konten TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  kategori TEXT DEFAULT 'berita' CHECK (kategori IN ('berita', 'tips', 'cerita', 'pengumuman')),
  penulis TEXT DEFAULT 'Admin',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: gallery
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  foto_url TEXT NOT NULL,
  kategori TEXT DEFAULT 'kegiatan',
  kegiatan_id UUID,
  angkatan_id UUID REFERENCES angkatan(id) ON DELETE SET NULL,
  tanggal DATE,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: materials
-- ============================================
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  kategori TEXT NOT NULL,
  file_url TEXT,
  thumbnail_url TEXT,
  tingkatan TEXT DEFAULT 'umum' CHECK (tingkatan IN ('siaga', 'penggalang', 'penegak', 'umum')),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: events
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  lokasi TEXT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  foto_url TEXT,
  jenis TEXT DEFAULT 'lainnya' CHECK (jenis IN ('latihan', 'perkemahan', 'lomba', 'baksos', 'pelantikan', 'lainnya')),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: pendaftaran
-- ============================================
CREATE TABLE IF NOT EXISTS pendaftaran (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  kelas TEXT NOT NULL,
  jurusan TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  alamat TEXT,
  motivasi TEXT,
  foto_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diterima', 'ditolak')),
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABEL: site_settings (untuk keep-alive + config)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"nama_website": "Trigantara", "tagline": "Gugus Depan Pramuka SMK Marhas Margahayu"}'::jsonb),
  ('social', '{"instagram": "https://instagram.com/trigantara.smkmarhas"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE angkatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (data yang boleh dilihat pengunjung)
CREATE POLICY "Public read angkatan" ON angkatan FOR SELECT USING (true);
CREATE POLICY "Public read members aktif" ON members FOR SELECT USING (status = 'aktif');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read published materials" ON materials FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- PUBLIC INSERT: pendaftaran (anyone can register)
CREATE POLICY "Public insert pendaftaran" ON pendaftaran FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS (authenticated users = admin)
-- Angkatan
CREATE POLICY "Admin full access angkatan" ON angkatan FOR ALL USING (auth.role() = 'authenticated');

-- Members  
CREATE POLICY "Admin full access members" ON members FOR ALL USING (auth.role() = 'authenticated');

-- Articles
CREATE POLICY "Admin full access articles" ON articles FOR ALL USING (auth.role() = 'authenticated');

-- Gallery
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

-- Materials
CREATE POLICY "Admin full access materials" ON materials FOR ALL USING (auth.role() = 'authenticated');

-- Events
CREATE POLICY "Admin full access events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- Pendaftaran (admin bisa read + update)
CREATE POLICY "Admin full access pendaftaran" ON pendaftaran FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings (admin bisa update)
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(tanggal_mulai DESC);
CREATE INDEX IF NOT EXISTS idx_members_angkatan ON members(angkatan_id);
CREATE INDEX IF NOT EXISTS idx_pendaftaran_status ON pendaftaran(status);
CREATE INDEX IF NOT EXISTS idx_gallery_kategori ON gallery(kategori);
CREATE INDEX IF NOT EXISTS idx_materials_kategori ON materials(kategori);

-- ============================================
-- TRIGGERS: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
