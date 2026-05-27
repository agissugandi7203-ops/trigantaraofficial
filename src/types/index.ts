// ============================================
// Trigantara — Type Definitions
// ============================================

export interface Member {
  id: string;
  nama_lengkap: string;
  nama_panggilan?: string;
  kelas?: string;
  jurusan?: string;
  jabatan?: string;
  ambalan?: 'putra' | 'putri';
  angkatan_id?: string;
  no_hp?: string;
  alamat?: string;
  foto_url?: string;
  nomor_kta?: string;
  tanggal_bergabung?: string;
  status: 'aktif' | 'alumni' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface Angkatan {
  id: string;
  tahun_ajaran: string;
  nama_angkatan?: string;
  foto_bersama_url?: string;
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  thumbnail_url?: string;
  kategori: 'berita' | 'tips' | 'cerita' | 'pengumuman';
  penulis: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  judul: string;
  deskripsi?: string;
  foto_url: string;
  kategori: string;
  kegiatan_id?: string;
  angkatan_id?: string;
  tanggal?: string;
  urutan: number;
  created_at: string;
}

export interface Material {
  id: string;
  judul: string;
  deskripsi?: string;
  kategori: string;
  file_url?: string;
  thumbnail_url?: string;
  tingkatan: 'siaga' | 'penggalang' | 'penegak' | 'umum';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  judul: string;
  deskripsi?: string;
  lokasi?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  foto_url?: string;
  jenis: 'latihan' | 'perkemahan' | 'lomba' | 'baksos' | 'pelantikan' | 'lainnya';
  is_published: boolean;
  created_at: string;
}

export interface Pendaftaran {
  id: string;
  nama_lengkap: string;
  kelas: string;
  jurusan: string;
  no_hp: string;
  alamat?: string;
  motivasi?: string;
  foto_url?: string;
  status: 'pending' | 'diterima' | 'ditolak';
  catatan_admin?: string;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

// UI-specific types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface ProgramCard {
  title: string;
  description: string;
  icon: string;
  color: 'brown' | 'green' | 'gold';
}

export interface TestimonialItem {
  nama: string;
  jabatan: string;
  pesan: string;
  foto?: string;
}

export interface FAQItem {
  pertanyaan: string;
  jawaban: string;
}
