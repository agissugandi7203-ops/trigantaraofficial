import type { MateriSeed } from './types';

export const MATERI_ISYARAT: MateriSeed[] = [
  {
    slug: 'sandi-morse',
    judul: 'Sandi Morse',
    kategori: 'morse',
    tingkatan: 'penggalang',
    urutan: 10,
    durasi_menit: 12,
    ringkasan:
      'Mengenal huruf morse, cara menyampaikannya lewat peluit, senter, dan bendera, serta teknik menghafal yang terbukti paling cepat.',
    deskripsi:
      'Materi dasar sandi morse untuk Penggalang dan Penegak: tabel lengkap, aturan panjang titik dan garis, empat cara penyampaian, dan metode hafalan Koch.',
    sumber: 'Wikipedia — Kode Morse',
    sumber_url: 'https://id.wikipedia.org/wiki/Kode_Morse',
    gambar: { cari: 'international morse code chart', cadangan: 'International_Morse_Code.svg' },
    konten: `Sandi morse adalah cara menyampaikan huruf dan angka memakai dua tanda saja: **titik** (bunyi pendek) dan **garis** (bunyi panjang). Sistem ini diciptakan Samuel F. B. Morse pada tahun 1837 untuk telegraf, dan sampai hari ini masih dipakai di dunia kepramukaan, penerbangan, dan pelayaran karena satu alasan sederhana — morse bisa dikirim dengan alat apa pun yang bisa dinyalakan-dimatikan.

## Aturan Dasar

Sebelum menghafal hurufnya, pahami dulu aturan waktunya. Inilah yang paling sering dilupakan dan membuat pesan sulit dibaca penerima.

- Satuan waktu terkecil disebut **satu ketuk**.
- Titik ( · ) = satu ketuk.
- Garis ( − ) = tiga ketuk.
- Jeda antar tanda dalam satu huruf = satu ketuk.
- Jeda antar huruf = tiga ketuk.
- Jeda antar kata = tujuh ketuk.

> Kesalahan paling umum di lapangan bukan salah huruf, melainkan jeda yang tidak konsisten. Penerima jadi bingung memisahkan huruf. Latih ketukan dulu, kecepatan belakangan.

## Tabel Huruf

| Huruf | Kode | Huruf | Kode |
|---|---|---|---|
| A | · − | N | − · |
| B | − · · · | O | − − − |
| C | − · − · | P | · − − · |
| D | − · · | Q | − − · − |
| E | · | R | · − · |
| F | · · − · | S | · · · |
| G | − − · | T | − |
| H | · · · · | U | · · − |
| I | · · | V | · · · − |
| J | · − − − | W | · − − |
| K | − · − | X | − · · − |
| L | · − · · | Y | − · − − |
| M | − − | Z | − − · · |

## Tabel Angka

| Angka | Kode | Angka | Kode |
|---|---|---|---|
| 1 | · − − − − | 6 | − · · · · |
| 2 | · · − − − | 7 | − − · · · |
| 3 | · · · − − | 8 | − − − · · |
| 4 | · · · · − | 9 | − − − − · |
| 5 | · · · · · | 0 | − − − − − |

Perhatikan polanya: angka 1 sampai 5 menambah titik dari kiri, angka 6 sampai 0 menambah garis. Sekali paham polanya, angka tidak perlu dihafal satu per satu.

## Empat Cara Penyampaian

#### 1. Suara (peluit)
Cara paling umum di perkemahan. Tiup pendek untuk titik, tiup panjang untuk garis. Pastikan tiupan panjang benar-benar tiga kali lebih lama, bukan sekadar "agak panjang".

#### 2. Sinar (senter atau cermin)
Nyala sebentar untuk titik, nyala lama untuk garis. Efektif pada malam hari dan jarak jauh. Saat siang, cermin dapat memantulkan matahari sampai beberapa kilometer.

#### 3. Gerak (bendera atau asap)
Bendera diayun kecil untuk titik, diayun lebar untuk garis. Cara ini terbaca dari jauh tanpa alat bantu apa pun.

#### 4. Tulisan
Titik ditulis sebagai ( · ) atau angka 1, garis sebagai ( − ) atau angka 0. Dipakai untuk latihan dan soal-soal lomba.

## Cara Menghafal yang Efektif

Menghafal 26 huruf sekaligus hampir selalu gagal. Gunakan pengelompokan berikut — dipakai luas di Gudep se-Indonesia karena berhasil.

**Kelompok berlawanan** — hafalkan berpasangan, karena kodenya saling terbalik:

- E ( · ) lawan T ( − )
- I ( · · ) lawan M ( − − )
- S ( · · · ) lawan O ( − − − )
- H ( · · · · ) lawan KH ( − − − − )
- A ( · − ) lawan N ( − · )
- U ( · · − ) lawan D ( − · · )
- V ( · · · − ) lawan B ( − · · · )
- W ( · − − ) lawan G ( − − · )
- R ( · − · ) lawan K ( − · − )
- F ( · · − · ) lawan L ( · − · · )

**Huruf berdiri sendiri:** C ( − · − · ), J ( · − − − ), P ( · − − · ), Q ( − − · − ), X ( − · · − ), Y ( − · − − ), Z ( − − · · ).

Latihan yang benar: mulai dari dua huruf saja (E dan T), kirim-terima sampai lancar tanpa berpikir, baru tambah dua huruf berikutnya. Menambah huruf sebelum yang lama otomatis akan membuat semuanya berantakan.

## Kode Penting yang Wajib Diketahui

- **SOS** = · · · − − − · · · — tanda bahaya internasional. Dikirim menyambung tanpa jeda antar huruf.
- **AR** = · − · − · — tanda pesan selesai.
- **AS** = · − · · · — tanda "tunggu sebentar".
- **HH** = · · · · · · · · — tanda salah kirim, ulangi kata terakhir.

## Latihan Mandiri

1. Kirimkan nama panggilanmu sendiri dengan peluit, rekam dengan ponsel, lalu dengarkan ulang. Apakah jeda antar hurufmu konsisten?
2. Terjemahkan pesan ini: **− · − · · − · · − · · · · · − − ·** (jawaban ada di akhir latihan regu).
3. Kirim pesan singkat ke teman regumu dengan senter dari jarak 50 meter pada malam hari.`,
  },

  {
    slug: 'semaphore',
    judul: 'Semaphore — Isyarat Bendera',
    kategori: 'semaphore',
    tingkatan: 'penggalang',
    urutan: 20,
    durasi_menit: 10,
    ringkasan:
      'Sistem isyarat bendera untuk komunikasi jarak jauh: posisi tangan, delapan arah dasar, dan cara berlatih agar cepat terbaca.',
    deskripsi:
      'Panduan semaphore lengkap: ukuran bendera standar, sikap dasar, sistem jam untuk menghafal posisi, dan isyarat khusus.',
    sumber: 'Wikipedia — Semafor (isyarat bendera)',
    sumber_url: 'https://id.wikipedia.org/wiki/Semafor',
    gambar: { cari: 'semaphore flag signals alphabet chart', cadangan: 'Semaphore_Signals_A-Z.jpg' },
    konten: `Semaphore adalah cara berkomunikasi dengan sepasang bendera yang dipegang di kedua tangan. Setiap huruf dibentuk dari kombinasi posisi kedua lengan. Berbeda dengan morse yang mengandalkan waktu, semaphore mengandalkan **bentuk** — sehingga bisa dibaca dengan cepat dan tanpa alat bantu, asal penerima berada dalam jarak pandang.

## Peralatan

Bendera semaphore standar Gerakan Pramuka:

- Ukuran kain: **45 cm × 45 cm**, berbentuk persegi.
- Dibagi dua secara diagonal: setengah **merah**, setengah **kuning**.
- Bagian kuning dipasang di sisi tongkat, merah di sisi luar.
- Panjang tongkat: **50 – 55 cm**.

Warna merah-kuning dipilih karena kontrasnya paling kuat terhadap hampir semua latar — langit, pepohonan, maupun bangunan.

## Sikap Dasar

Berdirilah tegak menghadap penerima, kaki dibuka selebar bahu. Kedua bendera disilangkan di depan badan pada posisi bawah — inilah **sikap siap** sekaligus tanda huruf istirahat.

Lengan harus lurus, tidak ditekuk. Lengan yang menekuk membuat sudut jadi tidak jelas dan huruf salah terbaca dari kejauhan.

## Sistem Jam

Cara termudah menghafal semaphore adalah membayangkan tubuhmu sebagai jam dinding, dengan kepala di angka 12.

Delapan posisi dasar lengan:

- **Bawah** (rapat badan) — posisi 0
- **Bawah serong** — 45°
- **Datar** (setinggi bahu) — 90°
- **Atas serong** — 135°
- **Atas** (lurus ke atas) — 180°

Setiap huruf adalah kombinasi dua dari posisi tersebut.

## Kelompok Huruf

Huruf semaphore dikelompokkan dalam tujuh lingkaran. Menghafal per lingkaran jauh lebih mudah daripada per huruf.

**Lingkaran 1 (tangan kanan tetap di bawah):** A, B, C, D, E, F, G
**Lingkaran 2 (tangan kanan di bawah serong):** H, I, K, L, M, N
**Lingkaran 3 (tangan kanan datar):** O, P, Q, R, S
**Lingkaran 4 (tangan kanan atas serong):** T, U, Y
**Lingkaran 5:** J, V
**Lingkaran 6:** W, X
**Lingkaran 7:** Z

Huruf **J** dan **V** sering tertukar bagi pemula. Ingat: J memakai satu lengan lurus ke atas, V memakai lengan atas serong.

## Isyarat Khusus

- **Tanda siap / perhatian:** kedua bendera diayun berulang membentuk lingkaran penuh di atas kepala.
- **Tanda berita dimulai:** huruf **VE** dikirim berulang sampai penerima menjawab.
- **Tanda penerima siap:** huruf **K**.
- **Salah kirim:** huruf **E** delapan kali berturut-turut.
- **Berita selesai:** huruf **AR**.
- **Angka:** kirim tanda angka lebih dulu, lalu huruf A sampai J mewakili angka 1 sampai 0.

## Kesalahan yang Sering Terjadi

1. **Terlalu cepat.** Penerima butuh waktu membaca bentuk. Tahan setiap huruf sekitar satu detik penuh.
2. **Lengan menekuk.** Sudut jadi kabur dan huruf salah terbaca.
3. **Berdiri membelakangi cahaya.** Penerima hanya melihat siluet. Usahakan matahari berada di belakang penerima, bukan di belakang pengirim.
4. **Lupa memberi tanda antar kata.** Kembalikan bendera ke sikap siap sejenak setiap kali kata berganti.

## Latihan Mandiri

1. Latih delapan posisi lengan tanpa bendera sambil bercermin. Pastikan lengan benar-benar lurus.
2. Eja namamu sendiri sepuluh kali sampai tidak perlu berpikir.
3. Berlatih berpasangan dari jarak 30 meter, lalu tambah jarak setiap kali berhasil.`,
  },

  {
    slug: 'kumpulan-sandi-pramuka',
    judul: 'Kumpulan Sandi Pramuka',
    kategori: 'sandi',
    tingkatan: 'penggalang',
    urutan: 30,
    durasi_menit: 15,
    ringkasan:
      'Sandi kotak, sandi AN, sandi rumput, sandi koordinat, sandi angka, dan lainnya — lengkap dengan contoh soal dan kuncinya.',
    deskripsi:
      'Sepuluh jenis sandi yang paling sering muncul di lomba dan latihan rutin, disertai cara membaca dan contoh penyelesaiannya.',
    sumber: 'Wikipedia — Sandi Pramuka',
    sumber_url: 'https://id.wikipedia.org/wiki/Sandi_(Pramuka)',
    gambar: { cari: 'secret code cipher wheel', cadangan: 'Union_cipher_disk.jpg' },
    konten: `Sandi adalah cara menyamarkan pesan supaya hanya bisa dibaca oleh yang tahu kuncinya. Di Pramuka, sandi bukan sekadar permainan — ia melatih ketelitian, kesabaran, dan kerja sama regu. Berikut sandi-sandi yang paling sering dipakai dalam latihan dan lomba.

## 1. Sandi AN

Sandi paling sederhana dan paling sering dipakai. Alfabet dibagi dua, lalu baris atas ditukar dengan baris bawah.

\`\`\`
A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z
\`\`\`

Huruf **A** ditukar dengan **N**, **B** dengan **O**, dan seterusnya. Sandi ini bersifat bolak-balik: cara menyandi dan membaca sama persis.

**Contoh:** PRAMUKA → CENZHXN

## 2. Sandi Kotak I

Alfabet disusun dalam kotak-kotak, lalu setiap huruf diwakili bentuk garis kotak yang mengelilinginya. Huruf pertama dalam kotak ditulis polos, huruf kedua diberi satu titik.

Susunannya:

\`\`\`
AB | CD | EF
---+----+---
GH | IJ | KL
---+----+---
MN | OP | QR
\`\`\`

Sisa huruf S sampai Z disusun dalam bentuk silang (X).

## 3. Sandi Kotak II

Mirip sandi kotak I, tetapi setiap kotak berisi tiga huruf. Huruf pertama polos, kedua satu titik, ketiga dua titik. Lebih ringkas, tetapi menuntut ketelitian lebih tinggi.

## 4. Sandi Rumput

Sandi turunan morse. Titik digambar sebagai rumput pendek, garis sebagai rumput panjang, ditulis menyambung seperti deretan rumput.

\`\`\`
    /\\      /\\/\\/\\
\`\`\`

Setiap kelompok rumput dipisahkan garis tegak untuk menandai pergantian huruf. Sandi ini menguji hafalan morse — kalau morse belum lancar, sandi rumput mustahil dibaca.

## 5. Sandi Koordinat (Sandi Merah Putih)

Membuat tabel 5 × 5 berisi seluruh alfabet, lalu setiap huruf ditulis sebagai pasangan koordinat baris dan kolom.

| | M | E | R | A | H |
|---|---|---|---|---|---|
| **P** | A | B | C | D | E |
| **U** | F | G | H | I | J |
| **T** | K | L | M | N | O |
| **I** | P | Q | R | S | T |
| **H** | U | V | W | X | Y/Z |

Huruf **C** ditulis sebagai **PR**, huruf **N** sebagai **TA**, dan seterusnya.

**Contoh:** PRAMUKA → PM IR PA TM UM TK PA

## 6. Sandi Angka

Setiap huruf diganti nomor urutannya dalam alfabet: A = 1, B = 2, sampai Z = 26. Antar huruf dipisahkan tanda hubung.

**Contoh:** PRAMUKA → 16-18-1-13-21-11-1

Variasi yang lebih sulit: nomor dibalik (A = 26, Z = 1), atau ditambah/dikurangi angka tertentu sesuai kunci.

## 7. Sandi Balik (Sandi Cermin)

Kata dibaca dari belakang. Sederhana, tetapi efektif untuk pemanasan.

**Contoh:** TRIGANTARA → ARATNAGIRT

## 8. Sandi Napoleon

Pesan ditulis membentuk lajur zig-zag, lalu dibaca menurut baris. Kunci sandi ini adalah jumlah lajur yang disepakati.

**Contoh** (3 lajur), pesan SIAP SEDIA:

\`\`\`
S   P   D
 I A  S E I A
\`\`\`

Dibaca per baris menghasilkan susunan huruf yang tampak acak.

## 9. Sandi Jam

Setiap huruf diwakili waktu pada jam, dengan selang lima menit. A = 01.00, B = 01.05, C = 01.10, dan seterusnya. Sandi ini menarik karena bisa "ditulis" hanya dengan menggambar jarum jam.

## 10. Sandi Braille

Sistem huruf timbul untuk tunanetra, memakai enam titik dalam dua kolom. Di Pramuka, sandi ini dipakai bukan hanya sebagai permainan, tetapi juga untuk menumbuhkan kepedulian terhadap penyandang disabilitas — sejalan dengan Dasa Darma poin kedua, *cinta alam dan kasih sayang sesama manusia*.

## Tips Mengerjakan Soal Sandi

1. **Baca instruksi kuncinya lebih dulu.** Banyak regu kehilangan waktu karena langsung menebak.
2. **Cari pola huruf yang sering muncul.** Dalam Bahasa Indonesia, huruf A dan N paling sering muncul.
3. **Bagi tugas dalam regu.** Satu orang membaca sandi, satu menulis, satu memeriksa ulang.
4. **Periksa ulang sebelum menyerahkan.** Satu huruf salah bisa membuat seluruh kalimat tidak bermakna.`,
  },

  {
    slug: 'isyarat-peluit-dan-tanda-jejak',
    judul: 'Isyarat Peluit & Tanda Jejak',
    kategori: 'sandi',
    tingkatan: 'penggalang',
    urutan: 40,
    durasi_menit: 8,
    ringkasan:
      'Aba-aba peluit yang wajib dikenali seluruh anggota, serta tanda jejak alam untuk penjelajahan dan pencarian arah.',
    deskripsi:
      'Kumpulan isyarat peluit standar kepramukaan dan tanda jejak yang dipakai dalam kegiatan penjelajahan.',
    sumber: 'Wikipedia — Kepramukaan',
    sumber_url: 'https://id.wikipedia.org/wiki/Kepanduan',
    gambar: { cari: 'trail blaze marking tree', cadangan: 'NCTBlueBlaze.JPG' },
    konten: `Dalam kegiatan lapangan, suara manusia sering kalah oleh angin, hujan, atau jarak. Peluit menembus semua itu. Karena itu setiap anggota Pramuka wajib mengenal isyarat peluit tanpa perlu berpikir — kalau harus menerka artinya, isyarat itu sudah gagal.

## Isyarat Peluit Standar

| Isyarat | Bunyi | Arti |
|---|---|---|
| Satu tiupan panjang | — | Perhatian, semua diam dan dengarkan |
| Dua tiupan pendek | · · | Maju atau lanjutkan kegiatan |
| Tiga tiupan pendek | · · · | Berkumpul pada pemberi isyarat |
| Empat tiupan pendek | · · · · | Berkumpul membentuk barisan |
| Tiupan pendek berulang cepat | · · · · · · · | Bahaya, segera berkumpul |
| Satu panjang satu pendek | — · | Pemimpin regu dipanggil |
| Panjang berulang | — — — | Bubar atau kegiatan selesai |

> Aturan emas: **jangan meniup peluit tanpa keperluan.** Peluit yang sering ditiup sembarangan akan diabaikan saat benar-benar dibutuhkan — dan saat itu justru keadaan darurat.

## Isyarat Tangan

Ketika keadaan menuntut kesenyapan, isyarat tangan menggantikan peluit.

- **Telapak terbuka diangkat:** berhenti.
- **Tangan melambai ke depan:** maju.
- **Tangan diputar di atas kepala:** berkumpul.
- **Tangan menunjuk ke bawah lalu ditekan:** merunduk atau berlindung.
- **Tangan direntangkan menyamping:** berpencar membentuk garis.

## Tanda Jejak

Tanda jejak dipakai dalam penjelajahan untuk memandu regu yang berjalan di belakang. Tanda dibuat dari bahan yang ada di sekitar — batu, ranting, rumput — sehingga tidak merusak alam.

#### Tanda dari Batu

- Batu besar dengan batu kecil di atasnya: **ikuti arah ini**.
- Batu besar dengan batu kecil di sisi kanan: **belok kanan**.
- Batu besar dengan batu kecil di sisi kiri: **belok kiri**.
- Tiga batu bertumpuk: **bahaya, hati-hati**.
- Batu disusun melingkar: **berkumpul di sini**.

#### Tanda dari Ranting

- Ranting diletakkan mendatar: **jalan terus**.
- Ranting membentuk panah: **arah yang harus diambil**.
- Ranting bersilang: **jangan lewat sini**.
- Ranting ditancapkan miring: **ada pesan tersembunyi di dekat sini**.

#### Tanda dari Rumput

- Seikat rumput diikat lalu ditekuk ke satu arah: **belok ke arah tekukan**.
- Rumput diikat menyilang di tengah jalan: **jalan buntu**.

## Etika Tanda Jejak

Ini bagian yang sering diabaikan, padahal justru paling penting.

1. **Jangan merusak.** Tidak boleh mematahkan dahan pohon hidup, mengukir batang, atau mencoret batu.
2. **Bersihkan setelah selesai.** Regu terakhir bertugas membubarkan seluruh tanda jejak. Tanda yang ditinggalkan bisa menyesatkan pendaki lain di kemudian hari.
3. **Gunakan bahan setempat.** Jangan membawa pita plastik atau cat semprot ke dalam hutan.
4. **Tempatkan setinggi pandangan mata.** Tanda yang terlalu rendah akan tertutup rumput.

Prinsip ini bukan sekadar aturan teknis. Ia lahir dari Dasa Darma poin kedua — *cinta alam dan kasih sayang sesama manusia*. Pramuka yang meninggalkan jejak kerusakan telah gagal, sebagus apa pun tanda jejaknya.

## Latihan Mandiri

1. Hafalkan tujuh isyarat peluit sampai bisa dijawab dengan mata terpejam.
2. Buat jalur tanda jejak sepanjang 200 meter di halaman sekolah, minta regu lain mengikutinya, lalu bersihkan bersama.
3. Latih regumu bergerak hanya dengan isyarat tangan selama satu sesi latihan penuh.`,
  },
];
