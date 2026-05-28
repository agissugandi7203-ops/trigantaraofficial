# Panduan Pengelolaan & Eksport Aset Foto (Trigantara Scout Asset Guidelines)

Dokumen ini berisi panduan untuk developer atau administrator web Gudep Trigantara mengenai cara memotong, meng-export, dan mengoptimalkan gambar/foto model karakter agar tata letak web tetap konsisten, rapi, dan responsif (tanpa merusak layout).

---

## 📌 1. Karakter Penyambut Header Halaman (*Subpage Header*)

Semua halaman dalam menggunakan komponen `SubpageHeader` dengan layout foto model berukuran raksasa yang menonjol keluar dari kapsul latar belakang.

### Spesifikasi Teknis Gambar Model:
1. **Format File**: Wajib `.webp` (direkomendasikan) atau `.png` transparan tanpa latar belakang (*transparent background*).
2. **Posisi Karakter**: Karakter orang harus berdiri tegak di tengah kanvas, dengan bagian paling bawah tubuh (kaki/pinggang) menyentuh batas terbawah kanvas gambar secara presisi (tanpa margin transparan di bawah).
3. **Dimensi Kanvas**:
   * Tinggi kanvas: minimal **`1100px`** hingga **`1200px`**.
   * Lebar kanvas: proporsional mengikuti tubuh karakter (biasanya sekitar **`500px`** hingga **`700px`** tergantung proporsi tubuh).
   * **Mengapa ini penting?** CSS memposisikan gambar ini secara absolut dengan tinggi `h-[850px]` (mobile) / `h-[1100px]` (desktop). Jika terdapat ruang kosong (margin transparan) di bawah kaki model, model akan terlihat "mengambang" dan tidak menapak pada pembatas wave di bawah header.

### Cara Memasang di Halaman:
Pastikan parameter pada pemanggilan komponen `SubpageHeader` diatur secara bergantian untuk menjaga variasi warna dan perataan:
```tsx
<SubpageHeader
  badge="Label Kecil Halaman"
  title="Judul Halaman"
  subtitle="Deskripsi Singkat"
  bgVariant="blue" // Pilihan: 'orange' | 'green' | 'blue' | 'yellow'
  modelImage="/assets/model/nama_file.webp"
  modelName="Nama Model"
  modelAlign="left" // Pilihan: 'left' | 'right' (buat berselingan antar halaman)
  modelSize="large" // Selalu gunakan 'large' untuk halaman utama
/>
```

---

## 📌 2. Karakter Pods (Halaman Utama & Tentang)

Foto anggota/pembina pada halaman utama (seperti di Hero Section dan Member Pods) serta di halaman Tentang Kami (seperti di `PembinaSection`) menggunakan efek *pop-out* di mana kepala model melewati batas kapsul/lingkaran latar belakang.

### Spesifikasi Teknis Gambar Pods:
1. **Format File**: Wajib `.png` atau `.webp` transparan tanpa latar belakang.
2. **Proporsi Potongan**: Tubuh model dipotong sebatas pinggang atau setengah badan.
3. **Dimensi Kanvas**: Sekitar **`300px` x `350px`** (menghindari file terlalu besar karena akan memperlambat load page).
4. **Posisi Kepala**: Berikan margin transparan di bagian atas kanvas sekitar **10% - 15%** agar kepala model memiliki ruang untuk melewati batas lingkaran ketika diposisikan secara absolut dengan properti negatif (e.g. `top-[-20px]`).

---

## ⚡ 3. Panduan Optimasi Performa & Ukuran File (Pencegah Lag)

Memuat gambar beresolusi tinggi yang tidak dikompresi saat pengguna melakukan scroll dapat menyebabkan stutter/patah-patah (lag) pada visual browser.

### Langkah Wajib Sebelum Mengunggah Gambar:
1. **Kompresi Ukuran Gambar**: Gunakan alat kompresi (seperti TinyPNG, Squoosh, atau script Python) untuk memotong ukuran byte.
   * Target ukuran file foto model penyambut: **maksimal 100KB - 200KB**.
   * Target ukuran file foto galeri/blog: **maksimal 80KB - 150KB**.
2. **Gunakan Format Modern**: Konversikan gambar `.png` atau `.jpg` biasa menjadi **`.webp`**. Format ini memberikan kualitas visual yang setara dengan ukuran file hingga 80% lebih kecil.
3. **Lazy Loading**: Pastikan tag gambar untuk konten dinamis (seperti galeri atau artikel blog) memiliki atribut `loading="lazy"` agar browser hanya memuat gambar saat mendekati viewport.
