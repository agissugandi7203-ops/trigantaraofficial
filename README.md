<div align="center">
  <img src="public/assets/logo/LOGO%20TRIGANTARA%20(2).webp" alt="Logo Trigantara" width="120" />

  # Trigantara

  **Website resmi Gugus Depan Pramuka 29.039 – 29.040**
  Pangkalan SMK Marhas Margahayu · Bandung, Jawa Barat

  [trigantara.web.id](https://trigantara.web.id)
</div>

---

## Daftar Isi

- [Tentang](#tentang)
- [Teknologi](#teknologi)
- [Menjalankan di Komputer Sendiri](#menjalankan-di-komputer-sendiri)
- [Menyiapkan Basis Data](#menyiapkan-basis-data)
- [Mengisi Konten Materi & Artikel](#mengisi-konten-materi--artikel)
- [Struktur Proyek](#struktur-proyek)
- [Keamanan](#keamanan)
- [Menerbitkan ke Internet](#menerbitkan-ke-internet)
- [Perawatan Rutin](#perawatan-rutin)
- [Pemecahan Masalah](#pemecahan-masalah)

---

## Tentang

Website ini adalah rumah digital Gugus Depan Trigantara. Isinya:

| Halaman | Isi |
|---|---|
| **Beranda** | Profil singkat, program unggulan, pengurus, agenda terdekat |
| **Tentang** | Sejarah Gudep, visi misi, Ambalan Putra & Putri, pembina |
| **Materi** | Materi kepramukaan lengkap yang bisa dibaca langsung di website |
| **Kegiatan** | Agenda mendatang dan arsip kegiatan yang telah berlalu |
| **Galeri** | Dokumentasi foto kegiatan |
| **Angkatan** | Arsip angkatan beserta daftar pengurusnya |
| **Blog** | Artikel sejarah, wawasan, tips, dan berita Gudep |
| **Gabung** | Formulir pendaftaran anggota baru |
| **Panel Admin** | Pengelolaan seluruh isi website oleh pengurus |

Seluruh isi website dikelola lewat panel admin di `/admin` — tidak perlu menyentuh kode untuk menambah materi, artikel, foto, atau kegiatan.

---

## Teknologi

| Bagian | Dipakai | Alasan |
|---|---|---|
| Antarmuka | React 19 + TypeScript | Standar industri, dukungan panjang |
| Build | Vite 8 | Cepat, pemecahan bundel otomatis |
| Gaya | Tailwind CSS 4 | Konsisten, tanpa berkas CSS yang menumpuk |
| Server | Express 5 (Node 22) | Sederhana, stabil bertahun-tahun |
| Basis data | Supabase (PostgreSQL) | Gratis untuk skala Gudep, RLS bawaan |
| Penyimpanan berkas | Cloudflare R2 | Tanpa biaya keluar data, dilayani CDN |
| Gulir halus | Lenis | Ringan, tanpa ketergantungan besar |
| Pembersih HTML | DOMPurify | Mencegah penyisipan skrip berbahaya |

**Prasyarat:** Node.js versi 22 atau lebih baru.

---

## Menjalankan di Komputer Sendiri

```bash
# 1. Pasang seluruh paket
npm install

# 2. Salin contoh konfigurasi, lalu isi nilainya
cp .env.example .env

# 3. Jalankan
npm run dev
```

Buka `http://localhost:8080`.

### Isi berkas `.env`

```ini
PORT=8080

# Supabase → Project Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # RAHASIA — hanya untuk server
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...           # boleh terlihat publik

# Cloudflare R2 → R2 → Manage API Tokens
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=trigantara
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

> **`SUPABASE_SERVICE_ROLE_KEY` melewati seluruh aturan keamanan basis data.** Kunci ini hanya boleh berada di berkas `.env` dan di variabel lingkungan server. Jangan pernah menaruhnya di kode frontend, dan jangan pernah meng-commit `.env` (sudah dicegah lewat `.gitignore`).

### Perintah yang tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Jalankan mode pengembangan |
| `npm run build` | Bangun frontend + server untuk produksi |
| `npm start` | Jalankan hasil build |
| `npm run preview` | Bangun lalu jalankan seperti di produksi |
| `npm run lint` | Periksa tipe (frontend + server) |
| `npm run seed` | Isi materi & artikel bawaan ke basis data |
| `npm run seed:dry` | Tinjau rencana pengisian tanpa menulis apa pun |

---

## Menyiapkan Basis Data

Jalankan berkas migrasi secara **berurutan** di Supabase Dashboard → **SQL Editor** → New Query:

### 1. `supabase/migrations/001_initial_schema.sql`

Membuat seluruh tabel. Aman dijalankan berulang. Bila basis data Anda sudah dibuat sebelumnya, berkas ini tidak mengubah apa pun.

### 2. `supabase/migrations/002_security_hardening.sql` — **WAJIB**

Migrasi ini memperbaiki dua celah keamanan serius dan menambahkan kolom isi materi. Rinciannya ada di [bagian Keamanan](#keamanan).

### 3. Matikan pendaftaran akun publik

Dashboard → **Authentication → Sign In / Providers → Email** → matikan **"Allow new users to sign up"**.

Tanpa langkah ini, siapa pun masih bisa membuat akun di project Supabase Anda (walaupun setelah migrasi 002 mereka tidak lagi punya hak tulis apa pun).

### 4. Membuat akun admin

Dashboard → **Authentication → Users → Add user**, lalu daftarkan akun tersebut sebagai admin:

```sql
INSERT INTO admin_users (user_id, email, nama, peran)
SELECT id, email, 'Nama Pengurus', 'admin'
  FROM auth.users
 WHERE email = 'email-pengurus@contoh.com'
ON CONFLICT (user_id) DO NOTHING;
```

Untuk **mencabut** akses seseorang:

```sql
DELETE FROM admin_users WHERE email = 'email-yang-dicabut@contoh.com';
```

Akunnya masih ada, tetapi tidak lagi bisa mengubah apa pun. Perubahan berlaku paling lambat satu menit.

---

## Mengisi Konten Materi & Artikel

Proyek ini datang dengan **19 materi kepramukaan** dan **8 artikel** siap pakai — mulai dari sandi morse, semaphore, tali temali, PBB, P3K, survival, sampai sejarah Gerakan Pramuka.

```bash
npm run seed:dry   # tinjau dulu, tidak menulis apa pun
npm run seed       # jalankan sungguhan
```

Skrip ini aman dijalankan berulang kali: baris yang sudah ada **diperbarui**, bukan digandakan.

Gambar diambil dari **Wikimedia Commons** dengan lisensi bebas pakai (Public Domain, CC0, atau CC BY/BY-SA), lalu **disalin ke bucket R2 milik Gudep sendiri**. Dengan begitu gambar tidak akan hilang bila sumber aslinya berubah, dan pemuatannya dilayani CDN Cloudflare.

Setelah terisi, seluruh materi dan artikel dapat disunting lewat panel admin. Naskahnya ditulis dengan format sederhana:

```
## Judul Bagian
### Sub Bagian

Paragraf biasa. Boleh memakai **teks tebal** dan *miring*.

- Daftar berpoin
- Poin kedua

1. Daftar bernomor
2. Poin kedua

> Kutipan atau catatan penting

| Kolom A | Kolom B |
|---|---|
| Isi 1  | Isi 2  |
```

---

## Struktur Proyek

```
TRIGANTARA/
├─ server.ts                  Server Express: API, sitemap, penyajian frontend
├─ index.html                 Kerangka HTML + metadata SEO
├─ vite.config.ts             Konfigurasi build & pemecahan bundel
│
├─ public/assets/             Gambar, logo, video (ikut ke hasil build)
│
├─ src/
│  ├─ main.tsx                Titik masuk aplikasi
│  ├─ router.tsx              Daftar seluruh halaman
│  ├─ index.css               Gaya global, palet warna, animasi
│  ├─ components/
│  │  ├─ layout/              Navbar, Footer, gulir halus
│  │  ├─ home/                Bagian-bagian halaman beranda
│  │  ├─ shared/              Komponen dipakai bersama
│  │  └─ admin/               Kerangka panel admin
│  ├─ pages/                  Satu berkas per halaman
│  │  └─ admin/               Halaman pengelolaan
│  ├─ hooks/                  useAsyncData, useSeo, useScrollAnimation, …
│  ├─ lib/                    Klien Supabase, pembersih HTML, unggah R2
│  ├─ data/constants.ts       Teks tetap: menu, visi misi, FAQ, kategori
│  └─ types/index.ts          Definisi tipe data
│
├─ scripts/
│  ├─ seed.ts                 Pengisi konten ke basis data
│  ├─ content/                Naskah materi & artikel
│  └─ lib/gambar.ts           Pengambil gambar Commons → R2
│
├─ supabase/migrations/       Berkas SQL, dijalankan berurutan
└─ Dockerfile                 Kemasan untuk Cloud Run
```

**Aturan penempatan berkas:**

- Teks yang tidak berubah-ubah → `src/data/constants.ts`
- Isi yang dikelola pengurus → basis data, lewat panel admin
- Komponen dipakai lebih dari satu halaman → `src/components/shared/`
- Logika yang dipakai berulang → `src/hooks/`

---

## Keamanan

### Celah yang sudah ditutup

**1. Siapa pun yang mendaftar bisa menghapus seluruh isi website**

Kebijakan lama memakai `auth.role() = 'authenticated'`, yang berarti setiap akun yang berhasil dibuat — dan pendaftaran akun saat itu masih terbuka untuk umum — otomatis memperoleh hak baca, tulis, ubah, dan hapus pada **seluruh tabel**. Seseorang cukup mendaftar dengan email apa pun, mengonfirmasi emailnya sendiri, lalu bisa mengosongkan basis data.

Sekarang hak tulis hanya diberikan kepada akun yang terdaftar di tabel `admin_users`, diperiksa di dua lapis: kebijakan RLS di basis data dan `verifyAdmin` di server.

**2. Nomor HP dan alamat rumah siswa terbuka untuk umum**

Tabel `members` dapat dibaca siapa saja tanpa login, **termasuk kolom `no_hp` dan `alamat`** — data pribadi siswa, sebagian besar di bawah umur. Ini melanggar UU No. 27/2022 tentang Pelindungan Data Pribadi.

Sekarang tabel `members` tertutup untuk publik. Halaman Angkatan memakai view `members_public` yang hanya memuat nama, jabatan, ambalan, dan foto.

### Lapisan perlindungan lain

| Perlindungan | Keterangan |
|---|---|
| **Penyaringan HTML** | Isi artikel dibersihkan DOMPurify sebelum ditampilkan — mencegah penyisipan skrip (stored XSS) |
| **Daftar putih kolom** | Server hanya menulis kolom yang diizinkan per tabel, bukan meneruskan isi permintaan mentah |
| **Header keamanan** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options lewat Helmet |
| **Pembatas laju** | 5 pendaftaran per 15 menit per IP; 300 permintaan API per menit |
| **Validasi masukan** | Panjang dan format diperiksa di server dan di basis data |
| **Pembersihan kunci berkas** | Kunci objek R2 dinormalisasi — segmen `..` dan karakter kendali dibuang |
| **Pesan galat tertutup** | Detail internal tidak pernah dikirim ke peramban |
| **Kontainer non-root** | Proses di Docker berjalan sebagai pengguna `node` |

### Yang perlu Anda jaga sendiri

1. **Jangan pernah meng-commit `.env`.**
2. **Matikan pendaftaran akun publik** di Supabase (langkah 3 di atas).
3. **Cabut akses admin** setiap pengurus yang sudah lulus atau tidak lagi menjabat.
4. **Ganti kunci** bila `.env` pernah terkirim ke orang lain — di Supabase (Settings → API → Reset) dan Cloudflare R2 (buat token baru, hapus yang lama).
5. **Jalankan `npm audit`** setiap beberapa bulan.

---

## Menerbitkan ke Internet

Proyek ini dikemas untuk **Google Cloud Run**, tetapi Dockerfile-nya berjalan di layanan mana pun yang menerima kontainer.

```bash
gcloud run deploy trigantara \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars "SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,VITE_SUPABASE_URL=...,VITE_SUPABASE_ANON_KEY=...,R2_ACCOUNT_ID=...,R2_ACCESS_KEY_ID=...,R2_SECRET_ACCESS_KEY=...,R2_BUCKET_NAME=trigantara,R2_PUBLIC_URL=...,VITE_R2_PUBLIC_URL=..."
```

Catatan penting:

- **Jangan menetapkan `PORT`** — Cloud Run menyuntikkannya sendiri.
- Nilai `VITE_*` dibaca saat permintaan tiba, bukan saat build. Mengganti URL Supabase cukup dengan memperbarui variabel lingkungan, tanpa membangun ulang.
- Untuk data yang benar-benar rahasia, pertimbangkan **Secret Manager** daripada `--set-env-vars`.

---

## Perawatan Rutin

### Menjaga basis data tetap hidup

Project Supabase gratis **dijeda otomatis** setelah beberapa hari tanpa aktivitas. Saat dijeda, seluruh isi website tampak kosong.

Server ini sudah melakukan ping setiap 6 jam selama ia berjalan. Namun bila server ikut tidur (Cloud Run dengan `min-instances = 0`), ping itu ikut berhenti.

**Jaminan penuh:** pasang pemantau eksternal gratis — misalnya [UptimeRobot](https://uptimerobot.com) atau [Cron-job.org](https://cron-job.org) — yang memanggil `https://trigantara.web.id/api/health` setiap 15 menit. Satu langkah kecil yang mencegah website tampak kosong tanpa sebab.

### Jadwal pemeriksaan

| Waktu | Yang diperiksa |
|---|---|
| **Tiap bulan** | Buka `/api/health`, pastikan `r2` dan `supabase` bernilai `true` |
| **Tiap semester** | `npm audit` lalu `npm audit fix`; cabut akses admin pengurus yang sudah lulus |
| **Tiap tahun** | `npm outdated`, naikkan versi paket; perbarui daftar pengurus dan angkatan |
| **Tiap ganti pengurus** | Serahkan berkas `.env` secara aman; tambahkan admin baru, cabut yang lama |

### Menambah materi atau artikel baru

Lewat panel admin di `/admin` — tidak perlu menyentuh kode. Isi naskahnya, centang **Terbitkan**, dan halaman langsung tersedia beserta entri sitemap-nya.

---

## Pemecahan Masalah

**Website terbuka tetapi seluruh isinya kosong**
Basis data kemungkinan sedang dijeda. Buka Supabase Dashboard dan klik **Restore project**. Lalu pasang pemantau eksternal seperti dijelaskan di atas.

**Tidak bisa masuk panel admin — muncul "Akun Anda tidak memiliki hak akses pengelola"**
Akun tersebut belum terdaftar di tabel `admin_users`. Jalankan perintah SQL pada bagian [Membuat akun admin](#menyiapkan-basis-data).

**Materi tampil tetapi isinya kosong saat diklik**
Migrasi `002_security_hardening.sql` belum dijalankan, sehingga kolom `konten` belum ada. Jalankan migrasi tersebut lalu ulangi `npm run seed`.

**Unggah berkas gagal**
Periksa kredensial R2 di `.env`, lalu pastikan bucket sudah punya domain publik (R2 → Settings → Public Development URL).

**`npm run dev` gagal dengan "Port already in use"**
Ada proses lain yang memakai port tersebut. Jalankan dengan port lain: `PORT=8123 npm run dev`.

**Perubahan tidak muncul setelah deploy**
Muat ulang tanpa cache (`Ctrl + Shift + R`). Berkas hasil build memakai nama ber-hash, jadi versi lama tidak akan tersangkut di cache.

---

<div align="center">

**Satyaku Kudarmakan, Darmaku Kubaktikan**

Gugus Depan Trigantara · SMK Marhas Margahayu
[Instagram](https://instagram.com/Trigantara_official14) · [YouTube](https://youtube.com/@marhasupdate) · [TikTok](https://tiktok.com/@pramukasmkmarhas)

</div>
