export interface SumberGambar {
  /** Kata kunci pencarian di Wikimedia Commons. */
  cari: string;
  /** Dipakai bila pencarian gagal — nama berkas Commons yang pasti ada. */
  cadangan?: string;
}

export interface MateriSeed {
  slug: string;
  judul: string;
  kategori: string;
  tingkatan: 'siaga' | 'penggalang' | 'penegak' | 'umum';
  ringkasan: string;
  deskripsi: string;
  durasi_menit: number;
  urutan: number;
  /** Ditulis dalam markdown ringan; diubah menjadi HTML saat ditampilkan. */
  konten: string;
  gambar?: SumberGambar;
  sumber?: string;
  sumber_url?: string;
}

export interface ArtikelSeed {
  slug: string;
  judul: string;
  kategori: 'berita' | 'tips' | 'cerita' | 'pengumuman' | 'wawasan' | 'sejarah';
  penulis: string;
  ringkasan: string;
  tags: string[];
  konten: string;
  gambar?: SumberGambar;
}
