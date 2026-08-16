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

export type KategoriArtikel =
  | 'berita'
  | 'tips'
  | 'cerita'
  | 'pengumuman'
  | 'wawasan'
  | 'sejarah';

export interface Article {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  /** Ringkasan untuk kartu daftar dan pratinjau tautan media sosial. */
  ringkasan?: string;
  thumbnail_url?: string;
  kategori: KategoriArtikel;
  penulis: string;
  tags?: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Proyeksi publik tabel anggota (view `members_public`).
 * Sengaja TIDAK memuat no_hp, alamat, kelas, jurusan, maupun nomor KTA —
 * data pribadi tidak pernah dikirim ke peramban pengunjung.
 */
export interface PublicMember {
  id: string;
  nama_lengkap: string;
  nama_panggilan?: string;
  jabatan?: string;
  ambalan?: 'putra' | 'putri';
  angkatan_id?: string;
  foto_url?: string;
  status: 'aktif' | 'alumni' | 'nonaktif';
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
  /** Bagian URL halaman detail, contoh: `sandi-morse`. */
  slug?: string;
  deskripsi?: string;
  /** Ringkasan satu kalimat untuk kartu dan meta description. */
  ringkasan?: string;
  /** Isi materi lengkap dalam HTML. Dibersihkan sebelum ditampilkan. */
  konten?: string;
  kategori: string;
  file_url?: string;
  thumbnail_url?: string;
  tingkatan: 'siaga' | 'penggalang' | 'penegak' | 'umum';
  /** Nama sumber rujukan, mis. "Wikipedia". */
  sumber?: string;
  sumber_url?: string;
  /** Perkiraan waktu baca dalam menit. */
  durasi_menit?: number;
  urutan?: number;
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

// ============================================
// Bentuk baris untuk tampilan daftar
// ============================================
// Halaman daftar hanya mengambil kolom yang benar-benar ditampilkan — kolom
// berat seperti `konten` tidak ikut diunduh. Tipe di bawah menjaga agar
// kolom yang tidak diminta tidak terpakai tanpa sengaja.

export type MaterialListItem = Pick<
  Material,
  | 'id' | 'judul' | 'slug' | 'deskripsi' | 'ringkasan' | 'kategori'
  | 'tingkatan' | 'thumbnail_url' | 'file_url' | 'durasi_menit' | 'urutan' | 'created_at'
>;

export type ArticleListItem = Pick<
  Article,
  | 'id' | 'judul' | 'slug' | 'ringkasan' | 'thumbnail_url'
  | 'kategori' | 'penulis' | 'published_at' | 'created_at'
>;

export type EventListItem = Pick<
  Event,
  'id' | 'judul' | 'jenis' | 'lokasi' | 'tanggal_mulai' | 'tanggal_selesai'
>;

export type GalleryListItem = Pick<GalleryItem, 'id' | 'judul' | 'foto_url' | 'kategori'>;
