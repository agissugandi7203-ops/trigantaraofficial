// ============================================
// Trigantara — Static Content & Constants
// Semua teks dalam Bahasa Indonesia
// ============================================

import type { NavItem, StatItem, ProgramCard, TestimonialItem, FAQItem } from '../types';

// ============================================
// NAVIGASI
// ============================================
export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Tentang',
    href: '/tentang',
    children: [
      { label: 'Sejarah Gudep', href: '/tentang#sejarah' },
      { label: 'Visi & Misi', href: '/tentang#visi-misi' },
      { label: 'Struktur Organisasi', href: '/tentang#struktur' },
    ],
  },
  {
    label: 'Kegiatan',
    href: '/kegiatan',
    children: [
      { label: 'Perkemahan', href: '/kegiatan?filter=perkemahan' },
      { label: 'Lomba', href: '/kegiatan?filter=lomba' },
      { label: 'Latihan Rutin', href: '/kegiatan?filter=latihan' },
      { label: 'Bakti Sosial', href: '/kegiatan?filter=baksos' },
    ],
  },
  {
    label: 'Materi',
    href: '/materi',
    children: [
      { label: 'Sandi & Isyarat', href: '/materi?filter=sandi' },
      { label: 'Tali Temali', href: '/materi?filter=tali_temali' },
      { label: 'P3K & Survival', href: '/materi?filter=p3k' },
      { label: 'PBB & Baris Berbaris', href: '/materi?filter=pbb' },
    ],
  },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Angkatan', href: '/angkatan' },
  { label: 'Blog', href: '/blog' },
];

// ============================================
// STATISTIK HERO
// ============================================
export const HERO_STATS: StatItem[] = [
  { value: '10+', label: 'Anggota Aktif', icon: '👥' },
  { value: '20+', label: 'Kegiatan Terlaksana', icon: '🏕️' },
  { value: '5+', label: 'Prestasi Diraih', icon: '🏆' },
  { value: '2', label: 'Angkatan Terdaftar', icon: '📋' },
];

// ============================================
// PROGRAM UNGGULAN
// ============================================
export const PROGRAMS: ProgramCard[] = [
  {
    title: 'Perkemahan & Jelajah Alam',
    description:
      'Kegiatan outdoor yang melatih kemandirian, kerja sama tim, dan cinta lingkungan. Dari hiking gunung hingga survival camp, setiap petualangan membentuk karakter tangguh.',
    icon: '⛺',
    color: 'green',
  },
  {
    title: 'Keterampilan Kepramukaan',
    description:
      'Penguasaan tali temali, sandi morse, semaphore, kompas, P3K, dan pioneering. Skill nyata yang berguna dalam kehidupan sehari-hari dan situasi darurat.',
    icon: '🪢',
    color: 'brown',
  },
  {
    title: 'Kepemimpinan & Pengabdian',
    description:
      'Membentuk jiwa pemimpin melalui latihan dasar kepemimpinan, bakti sosial, dan pengabdian masyarakat. Setiap anggota ditempa menjadi pribadi yang bertanggung jawab.',
    icon: '⚜️',
    color: 'gold',
  },
];

// ============================================
// TESTIMONI
// ============================================
export const TESTIMONIALS: TestimonialItem[] = [
  {
    nama: 'Kaisya',
    jabatan: 'Anggota Penegak Putri',
    pesan:
      'Bergabung di Trigantara mengubah cara pandang saya tentang kebersamaan. Di sini saya belajar bukan hanya keterampilan, tapi juga arti tanggung jawab dan solidaritas. Setiap kegiatan punya makna tersendiri.',
    foto: '/assets/model/kaisya.png',
  },
  {
    nama: 'Fahri Anggay',
    jabatan: 'Anggota Penegak Putra',
    pesan:
      'Awalnya ikut-ikutan teman, tapi lama-lama jadi cinta. Perkemahan, latihan tali temali, sampai ikut lomba — semua pengalaman yang tidak bisa didapat di kelas. Pramuka itu seru!',
    foto: '/assets/model/FAHRI Anggay No BG.png',
  },
  {
    nama: 'Nazwa',
    jabatan: 'Anggota Penegak Putri',
    pesan:
      'Di Trigantara, saya menemukan keluarga kedua. Dari yang tadinya pemalu, sekarang berani tampil di depan dan memimpin kelompok. Terima kasih Pramuka!',
    foto: '/assets/model/nazwa.png',
  },
];

// ============================================
// FAQ
// ============================================
export const FAQ_ITEMS: FAQItem[] = [
  {
    pertanyaan: 'Siapa saja yang bisa bergabung dengan Trigantara?',
    jawaban:
      'Semua siswa/siswi SMK Marhas Margahayu bisa bergabung! Tidak perlu pengalaman Pramuka sebelumnya. Kami menerima semua tingkatan, mulai dari yang baru pertama kali hingga yang sudah berpengalaman.',
  },
  {
    pertanyaan: 'Kapan jadwal latihan rutin?',
    jawaban:
      'Latihan rutin dilaksanakan setiap hari Jumat sore setelah jam pelajaran selesai. Untuk kegiatan besar seperti perkemahan dan lomba, jadwal akan diumumkan khusus melalui website dan grup.',
  },
  {
    pertanyaan: 'Apakah ada biaya pendaftaran?',
    jawaban:
      'Pendaftaran anggota baru gratis. Untuk kegiatan tertentu seperti perkemahan atau lomba, mungkin ada iuran kecil yang digunakan untuk keperluan logistik dan operasional.',
  },
  {
    pertanyaan: 'Apa itu Ambalan Putra dan Putri?',
    jawaban:
      'Ambalan adalah satuan organisasi Pramuka tingkat Penegak. Di Trigantara, Ambalan Putra bernama "Ki Hajar Dewantara" dan Ambalan Putri bernama "Inggit Garnasih" — keduanya merupakan tokoh nasional yang menjadi panutan.',
  },
  {
    pertanyaan: 'Apa keuntungan ikut Pramuka di SMK Marhas?',
    jawaban:
      'Banyak! Selain mendapat keterampilan praktis (P3K, tali temali, navigasi), kamu juga membangun leadership, networking, dan bisa ikut lomba tingkat kota hingga nasional. Plus, pengalaman Pramuka sangat dihargai di dunia kerja dan kampus.',
  },
];

// ============================================
// INFO GUDEP
// ============================================
export const GUDEP_INFO = {
  nama: 'Gugus Depan Trigantara',
  nomorGudep: '29.039 — 29.040',
  pangkalan: 'SMK Marhas Margahayu',
  yayasan: 'Yayasan Pendidikan Marhamah Hasanah Margahayu',
  alamat: 'Jl. Margahayu, Bandung, Jawa Barat',
  ambalanPutra: {
    nama: 'Ki Hajar Dewantara',
    deskripsi:
      'Bapak Pendidikan Nasional Indonesia, sosok yang mengajarkan bahwa pendidikan bukan hanya di dalam kelas. Semangat "Ing Ngarsa Sung Tuladha, Ing Madya Mangun Karsa, Tut Wuri Handayani" menjadi pedoman ambalan putra.',
  },
  ambalanPutri: {
    nama: 'Inggit Garnasih',
    deskripsi:
      'Pahlawan nasional yang dikenal karena kegigihan dan pengorbanannya dalam perjuangan kemerdekaan Indonesia. Sosok wanita tangguh yang menjadi inspirasi bagi seluruh anggota ambalan putri.',
  },
  visi: 'Menjadi Gugus Depan Pramuka yang unggul, kreatif, dan berakhlak mulia di lingkungan SMK Marhas Margahayu.',
  misi: [
    'Menyelenggarakan kegiatan kepramukaan yang inovatif dan menyenangkan.',
    'Membentuk karakter anggota yang disiplin, mandiri, dan bertanggung jawab.',
    'Mengembangkan keterampilan praktis yang bermanfaat untuk kehidupan.',
    'Membangun jiwa kepemimpinan dan semangat gotong royong.',
    'Meningkatkan prestasi Pramuka di tingkat kota, provinsi, dan nasional.',
  ],
  sejarah:
    'Gugus Depan Trigantara berdiri sebagai wadah pembinaan kepramukaan di SMK Marhas Margahayu. Berawal dari semangat beberapa siswa yang ingin mengembangkan soft skill di luar kurikulum, Trigantara tumbuh menjadi organisasi yang aktif dan produktif. Nama "Trigantara" diambil dari bahasa Sansekerta yang berarti "tiga langit" — melambangkan cita-cita tinggi, semangat tanpa batas, dan pengabdian tanpa henti.',
};

// ============================================
// FOOTER
// ============================================
export const FOOTER_LINKS = {
  navigasi: [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/tentang' },
    { label: 'Kegiatan', href: '/kegiatan' },
    { label: 'Materi', href: '/materi' },
  ],
  lainnya: [
    { label: 'Galeri', href: '/galeri' },
    { label: 'Angkatan', href: '/angkatan' },
    { label: 'Blog', href: '/blog' },
    { label: 'Gabung Kami', href: '/gabung' },
  ],
  socialMedia: {
    instagram: 'https://instagram.com/Trigantara_official14',
    youtube: 'https://youtube.com/@marhasupdate',
    tiktok: 'https://tiktok.com/@pramukasmkmarhas',
  },
};

// ============================================
// JURUSAN SMK MARHAS
// ============================================
export const JURUSAN_LIST = [
  'PPLG (Pengembangan Perangkat Lunak dan Gim)',
  'TMS (Teknik Mesin)',
];

// ============================================
// KELAS
// ============================================
export const KELAS_LIST = ['X', 'XI', 'XII'];

// ============================================
// KATEGORI MATERI
// ============================================
export const KATEGORI_MATERI = [
  { value: 'sandi', label: 'Sandi & Isyarat' },
  { value: 'tali_temali', label: 'Tali Temali' },
  { value: 'pbb', label: 'PBB & Baris Berbaris' },
  { value: 'kompas', label: 'Navigasi & Kompas' },
  { value: 'p3k', label: 'P3K & Pertolongan' },
  { value: 'morse', label: 'Sandi Morse' },
  { value: 'semaphore', label: 'Semaphore' },
  { value: 'pioneering', label: 'Pioneering' },
  { value: 'survival', label: 'Survival & Alam' },
  { value: 'lainnya', label: 'Lainnya' },
];

// ============================================
// KATEGORI GALERI
// ============================================
export const KATEGORI_GALERI = [
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'perkemahan', label: 'Perkemahan' },
  { value: 'lomba', label: 'Lomba' },
  { value: 'latihan', label: 'Latihan' },
  { value: 'baksos', label: 'Bakti Sosial' },
  { value: 'pelantikan', label: 'Pelantikan' },
  { value: 'lainnya', label: 'Lainnya' },
];
