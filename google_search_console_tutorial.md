# Panduan Lengkap Integrasi Google Search Console (GSC) — trigantara.web.id

Panduan ini disusun untuk membantu Anda mendaftarkan, melakukan verifikasi domain, serta mengindeks website **trigantara.web.id** di Google Search Console agar website Anda muncul di mesin pencarian Google.

---

## 🚀 Apa itu Google Search Console?
**Google Search Console (GSC)** adalah alat gratis dari Google yang membantu pemilik website memantau, mempertahankan, dan memecahkan masalah kehadiran situs mereka di hasil pencarian Google. Tanpa mendaftarkan situs di GSC, Google mungkin butuh waktu berbulan-bulan (atau bahkan tidak sama sekali) untuk menemukan dan mengindeks halaman website Anda.

---

## Step 1: Memilih Tipe Properti di Google Search Console
1. Buka [Google Search Console](https://search.google.com/search-console/) dan masuk menggunakan akun Google (Gmail) Anda.
2. Di pojok kiri atas, klik **Tambahkan Properti** (*Add Property*).
3. Anda akan disuguhkan 2 pilihan tipe properti:
   * **Tipe Domain (Sangat Direkomendasikan):**
     * Memantau seluruh subdomain (seperti `www.trigantara.web.id`, `trigantara.web.id`, `blog.trigantara.web.id`) serta protokol HTTP dan HTTPS sekaligus.
     * *Metode Verifikasi:* Hanya bisa menggunakan **DNS Verification**.
   * **Tipe Awalan URL (URL Prefix):**
     * Hanya memantau satu URL spesifik (contoh: `https://trigantara.web.id`).
     * *Metode Verifikasi:* Bisa menggunakan unggah file HTML, Meta Tag, Google Analytics, dll.

---

## Step 2: Verifikasi Kepemilikan (Pilih Salah Satu Metode)

### Metode A: Verifikasi Tipe Domain via DNS (Direkomendasikan)
Metode ini adalah yang terbaik karena mencakup seluruh domain Anda secara permanen.
1. Pilih opsi **Domain** di Google Search Console, masukkan domain Anda: `trigantara.web.id`.
2. Klik **Lanjutkan**. Google akan memberikan sebuah **TXT Record** berupa kode acak (contoh: `google-site-verification=xxxxxxxxx...`).
3. Salin (*copy*) kode TXT tersebut.
4. Buka penyedia DNS / Domain Registrar tempat Anda membeli domain (misalnya **Cloudflare**, **Niagahoster**, **Namecheap**, atau **cPanel hosting**).
5. Masuk ke menu **DNS Management** atau **Zone Editor** untuk `trigantara.web.id`.
6. Tambahkan record baru dengan konfigurasi berikut:
   * **Type:** `TXT`
   * **Name / Host:** `@` atau kosongkan (mewakili domain utama `trigantara.web.id`)
   * **Content / Value / Text:** Tempel (*paste*) kode verifikasi Google yang disalin tadi.
   * **TTL:** Biarkan default atau pilih `Auto` / `3600`.
7. Klik **Save** / **Add Record**.
8. Kembali ke Google Search Console dan klik tombol **Verifikasi**.
   > 📌 **Catatan:** DNS propagation membutuhkan waktu beberapa menit hingga maksimal 24 jam. Jika gagal pada percobaan pertama, tunggu 10 menit lalu klik verifikasi kembali.

---

### Metode B: Verifikasi Tipe Awalan URL via Meta Tag HTML
Jika Anda kesulitan mengakses pengaturan DNS, Anda dapat menggunakan metode ini.
1. Pilih opsi **Awalan URL** (*URL Prefix*) di GSC, masukkan URL: `https://trigantara.web.id`.
2. Klik **Lanjutkan**.
3. Di bawah menu *"Metode verifikasi lainnya"*, pilih **Tag HTML**.
4. Google akan memberikan tag meta satu baris seperti ini:
   ```html
   <meta name="google-site-verification" content="KODE_ACAK_DARI_GOOGLE" />
   ```
5. Salin kode tag tersebut.
6. Buka file [index.html](file:///c:/Users/arief/Downloads/trigantara/index.html) di proyek website Anda.
7. Tempelkan tag tersebut di dalam bagian `<head>` (misalnya tepat di bawah tag meta keywords/author). Contoh:
   ```html
   <!-- Google Search Console Verification -->
   <meta name="google-site-verification" content="KODE_ACAK_DARI_GOOGLE" />
   ```
8. Simpan file, lalu commit dan deploy/push perubahan tersebut ke server hosting website Anda.
9. Setelah website versi terbaru terbit secara online, kembali ke GSC dan klik **Verifikasi**.

---

## Step 3: Memasang Sitemap dan Robots.txt (Sudah Disediakan!)
Untuk mempercepat Google menemukan halaman-halaman penting di website Anda (seperti halaman Beranda, Tentang, Kegiatan, Galeri, Blog, dll.), kami telah membuat berkas **`sitemap.xml`** dan **`robots.txt`** di dalam folder `public/` proyek Anda:

1. **`public/sitemap.xml`:** Berisi daftar tautan aktif halaman website Anda agar robot pencari Google (*Googlebot*) tahu halaman apa saja yang harus dijelajahi.
2. **`public/robots.txt`:** Memberi tahu semua robot pencari bahwa seluruh bagian website boleh dijelajahi, dan mengarahkan mereka secara otomatis ke lokasi file `sitemap.xml`.

Saat Anda melakukan deploy/push proyek ini, kedua berkas tersebut akan otomatis dapat diakses di:
* `https://trigantara.web.id/robots.txt`
* `https://trigantara.web.id/sitemap.xml`

---

## Step 4: Mendaftarkan Sitemap di Google Search Console
Setelah proses verifikasi kepemilikan (Step 2) selesai:
1. Masuk ke dashboard Google Search Console untuk properti `trigantara.web.id`.
2. Di bilah menu sebelah kiri, cari bagian **Pengindeksan** (*Indexing*) -> klik **Peta Situs** (*Sitemaps*).
3. Di kolom *"Tambahkan peta situs baru"*, masukkan nama file sitemap Anda:
   ```text
   sitemap.xml
   ```
4. Klik **Kirim** (*Submit*).
5. Google akan memproses sitemap tersebut. Awalnya status mungkin bertuliskan *"Dapat diambil"* atau *"Sedang diproses"*. Dalam waktu 1-24 jam, statusnya akan berubah menjadi hijau: **Berhasil** (*Success*).

---

## Step 5: Meminta Google Mengindeks Halaman Secara Instan (Inspeksi URL)
Jika Anda baru saja mempublikasikan artikel blog baru atau halaman baru dan ingin halaman tersebut langsung terdaftar di Google saat itu juga (tanpa menunggu Googlebot menjelajah secara berkala):

1. Salin URL halaman yang ingin diindeks (contoh: `https://trigantara.web.id/blog/artikel-pramuka-terbaru`).
2. Tempelkan URL tersebut ke kolom pencarian **Inspeksi URL** (*URL Inspection*) yang berada di paling atas halaman Google Search Console.
3. Tekan **Enter**. Google akan memeriksa status URL tersebut.
4. Jika tertulis *"URL tidak ada di Google"*, klik tombol **Minta Pengindeksan** (*Request Indexing*).
5. Google akan memasukkan URL Anda ke dalam antrean prioritas pengindeksan. Biasanya halaman akan muncul di hasil pencarian Google dalam waktu beberapa jam hingga beberapa hari!

---

## 🛠️ Pemecahan Masalah (Troubleshooting)

* **Status Sitemap "Tidak dapat diambil" (Couldn't Fetch):**
  * Ini adalah bug visual yang sangat umum terjadi pada sitemap baru di GSC. Jangan panik. Cukup pastikan Anda dapat membuka `https://trigantara.web.id/sitemap.xml` di browser Anda dengan lancar. Jika bisa terbuka, biarkan saja, Google akan mengambilnya secara otomatis dalam waktu 24-48 jam.
* **Perubahan Tidak Terdeteksi saat Verifikasi Meta Tag:**
  * Pastikan Anda sudah mem-build dan men-deploy proyek React Anda ke server produksi. Jika server Anda menggunakan caching (seperti Cloudflare cache), lakukan *purge cache* terlebih dahulu agar Google mendapat versi `index.html` terbaru yang telah disisipkan tag verifikasi Anda.

---

## 🌐 Cara Membuat & Menggunakan Subdomain (Gratis!)
Banyak orang mengira untuk mendapatkan subdomain (seperti `admin.trigantara.web.id` atau `blog.trigantara.web.id`) mereka harus membelinya kembali. Jawabannya adalah **TIDAK**. 

Karena Anda sudah memiliki domain utama **`trigantara.web.id`**, Anda bisa membuat subdomain sebanyak apa pun secara **100% GRATIS** langsung melalui DNS Management (seperti Cloudflare atau Domain Registrar tempat Anda membeli domain).

### Langkah-Langkah Membuat Subdomain:

1. **Masuk ke DNS Manager:**
   * Login ke dashboard **Cloudflare** (jika menggunakan Cloudflare) atau masuk ke portal klien domain registrar Anda (seperti Niagahoster, Namecheap, dll.) dan pilih menu **DNS Zone Editor**.
2. **Tambahkan DNS Record Baru:**
   * Klik tombol **Add Record** (Tambah Record).
   * Isi kolom konfigurasi sebagai berikut:
     * **Type:** Pilih `A` (jika mengarahkan ke IP server VPS) atau `CNAME` (jika mengarahkan ke domain hosting lain seperti Vercel, Netlify, Github Pages, dll.).
     * **Name / Host:** Masukkan nama subdomain yang diinginkan.
       * Contoh: Jika ingin membuat `admin.trigantara.web.id`, cukup ketik **`admin`**.
       * Contoh: Jika ingin membuat `blog.trigantara.web.id`, cukup ketik **`blog`**.
     * **Target / IP Address / Value:** Masukkan IP VPS Anda (untuk tipe `A`) atau target domain hosting (untuk tipe `CNAME`, misalnya `cname.vercel-dns.com`).
     * **Proxy Status (Khusus Cloudflare):** Aktifkan (Proxied / Awan Oranye) untuk keamanan tambahan, atau matikan (DNS Only) tergantung kebutuhan hosting Anda.
3. **Simpan:** Klik **Save** / **Simpan**. Subdomain Anda kini sudah aktif di sisi DNS!

---

## 🔍 Cara Mendaftarkan Subdomain di Google Search Console

Bagaimana agar Google mengenali subdomain baru Anda? Ada dua cara tergantung metode verifikasi awal yang Anda gunakan:

1. **Jika Anda Menggunakan Tipe Properti DOMAIN (`trigantara.web.id`):**
   * **Otomatis Aman!** Anda tidak perlu menambahkan apa-apa lagi di Google Search Console. Properti tipe Domain secara otomatis memantau, mendeteksi, dan mengindeks semua subdomain (misal: `admin.trigantara.web.id`, `blog.trigantara.web.id`, `www.trigantara.web.id`) secara otomatis di bawah satu properti yang sama.
2. **Jika Anda Menggunakan Tipe AWALAN URL (`URL Prefix`):**
   * Anda harus menambahkan properti baru untuk subdomain tersebut.
   * Klik **Tambahkan Properti**, pilih **Awalan URL**, masukkan URL subdomain lengkapnya (misalnya: `https://admin.trigantara.web.id`), lalu lakukan verifikasi ulang seperti pada Step 2.

