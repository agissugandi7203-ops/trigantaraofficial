import type { MateriSeed } from './types';

export const MATERI_LAPANGAN: MateriSeed[] = [
  {
    slug: 'memasak-di-alam-terbuka',
    judul: 'Memasak di Alam Terbuka',
    kategori: 'survival',
    tingkatan: 'penggalang',
    urutan: 200,
    durasi_menit: 11,
    ringkasan:
      'Menyusun menu perkemahan, membuat tungku darurat, memasak tanpa kompor, dan menjaga kebersihan makanan agar regu tidak keracunan.',
    deskripsi:
      'Materi masak rimba: jenis tungku, perencanaan logistik, teknik memasak tanpa peralatan modern, dan keamanan pangan di lapangan.',
    sumber: 'Wikipedia — Memasak',
    sumber_url: 'https://id.wikipedia.org/wiki/Memasak',
    gambar: { cari: 'camp cooking pot over fire', cadangan: 'Fondue_au_feu_de_bois.jpg' },
    konten: `Dapur adalah jantung sebuah perkemahan. Regu yang dapurnya berantakan hampir selalu jadi regu yang moralnya paling cepat jatuh — lapar dan lelah membuat hal kecil terasa besar. Karena itu memasak bukan tugas sampingan, melainkan keterampilan yang menentukan keberhasilan kegiatan.

## Merencanakan Menu

Hitung mundur dari jumlah orang dan jumlah hari, bukan dari selera.

**Rumus kasar per orang per hari:** beras 300 gram, lauk 200 gram, sayur 150 gram, minyak 30 ml, gula 30 gram.

Aturan penyusunan menu perkemahan:

1. **Hari pertama pakai bahan yang mudah busuk** — sayur berdaun, tahu, tempe, daging segar.
2. **Hari berikutnya pakai bahan tahan lama** — telur, mi, kentang, wortel, ikan asin, kornet.
3. **Sediakan satu menu darurat** yang bisa dimasak dalam 10 menit bila cuaca buruk.
4. **Lebihkan 10 persen**, jangan pas-pasan. Nafsu makan di lapangan lebih besar daripada di rumah.
5. **Hindari makanan bersantan** untuk hari kedua dan seterusnya — cepat basi dan sering menjadi penyebab diare massal di perkemahan.

## Jenis Tungku

#### Tungku Batu (Tungku Tiga)
Tiga batu disusun membentuk segitiga, panci diletakkan di atasnya. Paling sederhana, cocok untuk satu panci.

#### Tungku Parit
Gali parit sedalam 20 cm, lebar sedikit lebih sempit dari panci. Api di dalam parit terlindung angin dan panasnya lebih terpusat. Bisa menampung dua panci sekaligus.

#### Tungku Kaleng
Kaleng bekas dilubangi di sisi bawah untuk aliran udara. Hemat bahan bakar dan aman dipakai di tanah berumput karena api tidak menyentuh tanah.

#### Tungku Kayu Bersilang
Dua batang kayu besar disusun sejajar, api dinyalakan di antaranya. Cocok untuk memasak dalam jumlah besar.

## Teknik Memasak Tanpa Peralatan Lengkap

**Nasi liwet bambu.** Beras dan air dimasukkan ke ruas bambu muda, ditutup daun, lalu disandarkan miring di dekat bara. Bambu memberi aroma khas dan tidak perlu panci.

**Memanggang dengan daun.** Ikan atau ayam dibungkus daun pisang lalu dikubur di bawah bara. Daun menjaga kelembapan sehingga daging tidak kering.

**Memanggang dengan batu panas.** Batu dipanaskan di api, lalu bahan diletakkan di atasnya. Berguna saat tidak ada wajan.

**Merebus dalam bambu.** Ruas bambu berisi air dan bahan diletakkan miring di atas api. Bambu tidak terbakar habis selama masih ada air di dalamnya.

> Peringatan: jangan memakai **bambu tua yang kering** — ruasnya bisa meledak saat dipanaskan. Pilih bambu muda yang masih hijau dan berair.

## Keamanan Pangan

Diare adalah masalah kesehatan nomor satu di perkemahan, dan hampir selalu berasal dari dapur.

1. **Cuci tangan** sebelum menyentuh bahan makanan dan sebelum makan.
2. **Pisahkan** talenan bahan mentah dan bahan matang.
3. **Masak sampai benar-benar matang.** Daging dan telur setengah matang berisiko tinggi di lapangan.
4. **Habiskan pada hari yang sama.** Jangan menyimpan makanan matang lewat malam tanpa pendingin.
5. **Tutup semua wadah.** Lalat dan semut adalah pengangkut kuman yang efektif.
6. **Rebus air minum** minimal satu menit setelah mendidih, meski airnya terlihat jernih.
7. **Cuci alat masak segera setelah dipakai.** Sisa makanan yang mengering mengundang tikus pada malam hari.

## Pembagian Tugas Dapur

Regu yang dapurnya lancar selalu punya pembagian tugas tertulis, bukan sekadar "siapa yang sempat".

- **Juru masak** — bertanggung jawab atas menu dan rasa.
- **Juru api** — menyiapkan kayu, menyalakan, menjaga api tetap stabil.
- **Juru air** — mengambil dan merebus air.
- **Juru cuci** — membersihkan alat setelah makan.
- **Juru logistik** — mengatur persediaan agar cukup sampai hari terakhir.

Tugas dirotasi setiap hari supaya semua anggota menguasai seluruh peran.

## Mengelola Sampah Dapur

1. **Pisahkan** sampah organik dan anorganik sejak awal.
2. **Sampah organik** boleh dikubur dalam lubang sedalam 30 cm, jauh dari sumber air dan tenda.
3. **Sampah anorganik wajib dibawa pulang.** Tidak ada pengecualian.
4. **Air bekas cucian** dibuang di lubang resapan, bukan ke sungai. Sabun merusak kehidupan air.

## Latihan Mandiri

1. Susun menu tiga hari untuk regu delapan orang beserta daftar belanjanya.
2. Masak nasi liwet bambu bersama regu di bawah pengawasan pembina.
3. Latih menyalakan tungku parit dan menjaganya menyala stabil selama 30 menit.`,
  },

  {
    slug: 'menaksir-berat-kecepatan-dan-jumlah',
    judul: 'Menaksir Berat, Kecepatan & Jumlah',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 210,
    durasi_menit: 10,
    ringkasan:
      'Melanjutkan materi menaksir tinggi dan lebar: cara memperkirakan berat benda, kecepatan gerak, jumlah kerumunan, dan waktu tanpa alat ukur.',
    deskripsi:
      'Teknik penaksiran lanjutan untuk kegiatan lapangan dan lomba, lengkap dengan rumus dan cara memeriksa ketelitiannya.',
    sumber: 'Wikipedia — Estimasi',
    sumber_url: 'https://id.wikipedia.org/wiki/Estimasi',
    gambar: { cari: 'surveying tripod field measurement', cadangan: 'Theodolite.jpg' },
    konten: `Menaksir adalah memperkirakan ukuran dengan cara yang bisa dipertanggungjawabkan — bukan menebak. Bedanya terletak pada satu hal: penaksiran selalu punya **pembanding yang diketahui**. Tanpa pembanding, yang terjadi hanyalah tebakan.

## Prinsip Dasar

Setiap penaksiran mengikuti pola yang sama:

1. Cari satu benda yang ukurannya kamu **ketahui pasti**.
2. Bandingkan benda yang ingin ditaksir dengan pembanding itu.
3. Kalikan atau bagi sesuai perbandingannya.
4. **Bulatkan** hasilnya — ketelitian palsu justru menyesatkan.

Karena itu, hal pertama yang harus kamu punya adalah daftar pembanding pribadi.

## Membuat Pembanding Pribadi

Ukur dan hafalkan angka-angka berikut tentang tubuhmu sendiri. Catat di buku saku:

- Tinggi badan
- Panjang depa (rentang tangan kiri ke kanan) — biasanya sama dengan tinggi badan
- Panjang telapak tangan dan jengkal
- Panjang langkah biasa
- Lebar jari telunjuk
- Panjang lengan bawah (hasta)

Benda yang biasanya berukuran tetap:
- Tongkat Pramuka: **160 cm**
- Kertas A4: **21 × 29,7 cm**
- Uang kertas Rp 50.000: **14,9 × 6,5 cm**
- Botol air mineral 600 ml: tinggi sekitar **23 cm**

## Menaksir Berat

#### Cara Pembanding Langsung
Angkat benda yang beratnya diketahui — misalnya sekantong beras 5 kg — lalu bandingkan dengan benda yang ditaksir. Latih berulang agar tanganmu "terkalibrasi".

#### Cara Tuas Sederhana
Buat neraca dari tongkat yang ditumpu di tengah. Gantung benda yang ditaksir di satu ujung, dan benda yang beratnya diketahui di ujung lain. Geser titik tumpu sampai seimbang.

**Berat benda = (Berat pembanding × Jarak pembanding ke tumpuan) ÷ Jarak benda ke tumpuan**

#### Cara Volume
Untuk benda padat seragam, taksir volumenya lalu kalikan massa jenisnya.

| Bahan | Massa jenis (kg per m³) |
|---|---|
| Air | 1.000 |
| Kayu kering | 400 – 700 |
| Bambu | 300 – 400 |
| Tanah basah | 1.600 |
| Batu | 2.500 |
| Besi | 7.800 |

*Contoh:* balok kayu 20 × 20 × 100 cm = 0,04 m³. Bila kayu kering (±600 kg/m³), beratnya sekitar **24 kg**.

## Menaksir Kecepatan

#### Kecepatan Berjalan
Manusia berjalan santai sekitar **4 – 5 km/jam**, berjalan cepat **6 km/jam**, berlari ringan **8 – 10 km/jam**.

Cara mengukur di lapangan: tandai jarak 50 meter, catat waktu tempuh.

**Kecepatan (km/jam) = (Jarak dalam meter ÷ Waktu dalam detik) × 3,6**

#### Kecepatan Kendaraan
Berdiri di tepi jalan yang aman. Tandai dua titik berjarak 50 meter. Hitung waktu tempuh kendaraan di antaranya, lalu pakai rumus di atas.

#### Kecepatan Angin
Tanpa alat, pakai tanda alam berikut:

| Tanda | Perkiraan |
|---|---|
| Asap naik lurus | di bawah 2 km/jam |
| Daun bergerak pelan | 6 – 11 km/jam |
| Ranting kecil bergoyang, debu beterbangan | 12 – 19 km/jam |
| Dahan besar bergoyang, payung sulit dipegang | 30 – 39 km/jam |
| Pohon bergoyang seluruhnya, berjalan terasa berat | 50 – 61 km/jam |

Angka terakhir adalah batas aman kegiatan lapangan. Di atas itu, kegiatan luar ruang wajib dihentikan.

## Menaksir Jumlah

#### Kerumunan Orang
Bagi area menjadi kotak-kotak khayal. Hitung jumlah orang dalam satu kotak dengan teliti, lalu kalikan jumlah kotaknya.

Perkiraan kepadatan:
- Berdiri longgar: 1 orang per m²
- Berdiri rapat: 2 – 3 orang per m²
- Berbaris teratur: 1 orang per m²

#### Benda Banyak
Timbang atau hitung sebagian kecil, lalu kalikan. *Contoh:* hitung jumlah biji dalam satu genggam, lalu kalikan jumlah genggam dalam karung.

## Menaksir Waktu Tanpa Jam

#### Dengan Matahari
Rentangkan tangan sejauh lengan, telapak menghadap ke dalam. Ukur jarak antara matahari dan garis cakrawala dengan jari.

**Setiap satu jari ≈ 15 menit** menuju terbenam. Empat jari (satu telapak) ≈ 1 jam.

#### Dengan Bayangan
Panjang bayangan terpendek terjadi sekitar tengah hari. Bayangan memanjang ke timur berarti sore, ke barat berarti pagi.

## Memeriksa Ketelitian Sendiri

Ini bagian yang paling sering dilewatkan, padahal justru yang membuat kemampuan menaksir berkembang.

Setiap kali menaksir, **catat perkiraanmu**, lalu ukur yang sebenarnya bila memungkinkan. Hitung selisihnya dalam persen. Penaksir yang baik biasanya meleset di bawah 10 persen — dan angka itu hanya bisa dicapai lewat pencatatan berulang, bukan lewat teori.

## Latihan Mandiri

1. Ukur dan catat seluruh pembanding tubuhmu sendiri di buku saku.
2. Taksir berat lima benda di sekitarmu, lalu timbang sungguhan dan hitung selisihnya.
3. Taksir jumlah peserta upacara di sekolahmu, lalu bandingkan dengan daftar hadir.`,
  },

  {
    slug: 'membaca-peta-topografi',
    judul: 'Membaca Peta Topografi',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 220,
    durasi_menit: 13,
    ringkasan:
      'Memahami garis kontur, skala, koordinat, dan simbol peta — bekal wajib sebelum menjelajah medan yang belum dikenal.',
    deskripsi:
      'Materi kartografi praktis: jenis peta, membaca kontur, menghitung jarak dan kemiringan, serta orientasi peta di lapangan.',
    sumber: 'Wikipedia — Peta topografi',
    sumber_url: 'https://id.wikipedia.org/wiki/Peta_topografi',
    gambar: { cari: 'ordnance survey map detail', cadangan: '1801_Ordnance_Survey_map_of_Kent.jpg' },
    konten: `Peta topografi adalah peta yang menggambarkan **bentuk permukaan bumi** — bukan sekadar jalan dan nama tempat, tetapi juga tinggi rendahnya medan. Bagi seorang penjelajah, kemampuan membacanya adalah pembeda antara perjalanan yang terencana dan perjalanan yang bergantung nasib.

## Unsur Wajib Sebuah Peta

Setiap peta yang benar memuat enam hal berikut. Bila salah satunya hilang, peta itu tidak bisa dipercaya sepenuhnya.

1. **Judul** — wilayah yang digambarkan.
2. **Skala** — perbandingan jarak di peta dengan jarak sebenarnya.
3. **Arah utara** — hampir selalu mengarah ke atas.
4. **Legenda** — arti setiap simbol dan warna.
5. **Koordinat** — sistem penomoran posisi.
6. **Tahun pembuatan** — medan berubah; peta lama bisa menyesatkan.

## Skala

Skala **1 : 25.000** berarti 1 cm di peta sama dengan 25.000 cm (250 meter) di lapangan.

| Skala | 1 cm di peta | Kegunaan |
|---|---|---|
| 1 : 10.000 | 100 m | Perencanaan tapak kemah |
| 1 : 25.000 | 250 m | Penjelajahan, paling umum dipakai |
| 1 : 50.000 | 500 m | Perjalanan jauh |
| 1 : 250.000 | 2,5 km | Gambaran wilayah luas |

**Menghitung jarak sebenarnya:**
Jarak nyata = Jarak di peta × Angka skala

*Contoh:* pada peta 1 : 25.000, dua titik berjarak 4 cm. Jarak sebenarnya = 4 × 25.000 = 100.000 cm = **1 kilometer**.

## Garis Kontur

Ini bagian yang paling menentukan dan paling sering disalahpahami.

**Garis kontur adalah garis yang menghubungkan titik-titik dengan ketinggian sama.** Dengan membacanya, kamu bisa "melihat" bentuk medan hanya dari selembar kertas datar.

Aturan yang selalu berlaku:

1. **Garis kontur tidak pernah berpotongan.** Satu titik hanya punya satu ketinggian.
2. **Garis rapat berarti lereng curam;** garis renggang berarti lereng landai.
3. **Garis kontur selalu membentuk lingkaran tertutup**, meski kadang lingkarannya berada di luar batas peta.
4. **Lingkaran terkecil di tengah adalah puncak** — atau cekungan, bila diberi tanda garis pendek ke dalam.
5. **Kontur yang menekuk ke arah hulu** menandakan lembah atau alur sungai.
6. **Kontur yang menonjol ke arah hilir** menandakan punggungan (igir).

**Interval kontur** adalah beda tinggi antar garis, biasanya tertulis di legenda. Pada peta 1 : 25.000, interval yang umum adalah 12,5 meter.

## Membaca Bentuk Medan

| Pola kontur | Bentuk medan |
|---|---|
| Lingkaran mengecil ke tengah | Bukit atau puncak |
| Lingkaran dengan tanda garis ke dalam | Cekungan atau kawah |
| Huruf V menunjuk ke atas (ke tempat tinggi) | Lembah atau sungai |
| Huruf U atau V menunjuk ke bawah | Punggungan |
| Dua lingkaran berdampingan dengan kontur menyempit | Pelana (sadel) di antara dua puncak |
| Garis sangat rapat sampai menempel | Tebing |

## Warna Peta

- **Hitam** — buatan manusia: jalan, bangunan, batas wilayah.
- **Biru** — perairan: sungai, danau, rawa.
- **Hijau** — tumbuhan: hutan, kebun, perkebunan.
- **Cokelat** — garis kontur dan bentuk tanah.
- **Merah** — jalan utama dan tempat penting.

## Koordinat

Sebagian besar peta Indonesia memakai sistem **UTM (Universal Transverse Mercator)**, yang membagi bumi menjadi zona-zona dan menyatakan posisi dalam meter.

Cara membaca koordinat empat angka (ketelitian 1 km): baca **ke kanan dulu, baru ke atas**. Kalimat pengingat yang dipakai di seluruh dunia: *"masuk rumah dulu, baru naik tangga."*

Untuk ketelitian 100 meter, tambahkan satu angka pada masing-masing sumbu sehingga menjadi koordinat enam angka.

## Orientasi Peta di Lapangan

Peta baru berguna setelah diselaraskan dengan medan sesungguhnya.

1. Bentangkan peta di permukaan datar.
2. Letakkan kompas di atas peta.
3. Putar peta — bukan kompas — sampai arah utara peta sejajar dengan jarum kompas.
4. Sekarang setiap benda di peta menghadap arah yang sama dengan benda aslinya di lapangan.

Setelah peta terorientasi, cocokkan minimal **tiga tanda medan** yang terlihat: puncak bukit, belokan sungai, menara, atau perpotongan jalan. Bila ketiganya cocok, posisimu di peta sudah pasti.

## Menghitung Kemiringan Lereng

Berguna untuk memperkirakan berat-ringannya perjalanan.

**Kemiringan (%) = (Beda tinggi ÷ Jarak mendatar) × 100**

*Contoh:* naik 100 meter dalam jarak mendatar 500 meter → kemiringan 20 persen.

Patokan kasar:
- Di bawah 10% — landai, mudah dilalui
- 10 – 25% — sedang, mulai melelahkan
- 25 – 45% — curam, butuh tenaga besar
- Di atas 45% — sangat curam, sebaiknya dihindari tanpa peralatan

## Latihan Mandiri

1. Ambil peta wilayah sekolahmu, tandai lima tanda medan yang bisa dilihat langsung.
2. Latih membaca koordinat enam angka sampai lancar.
3. Gambar sketsa bentuk medan dari selembar peta kontur, lalu bandingkan dengan foto satelit wilayah yang sama.`,
  },

  {
    slug: 'penjelajahan-dan-halang-rintang',
    judul: 'Penjelajahan & Halang Rintang',
    kategori: 'survival',
    tingkatan: 'penggalang',
    urutan: 230,
    durasi_menit: 11,
    ringkasan:
      'Merancang rute penjelajahan, mengatur pos kegiatan, teknik berjalan yang hemat tenaga, dan aturan keselamatan halang rintang.',
    deskripsi:
      'Panduan menyelenggarakan dan mengikuti penjelajahan: persiapan rute, sistem pos, teknik jalan, dan pengamanan halang rintang.',
    sumber: 'Wikipedia — Hiking',
    sumber_url: 'https://id.wikipedia.org/wiki/Pendakian_gunung',
    gambar: { cari: 'hikers trail forest group', cadangan: 'Hiking_trail.jpg' },
    konten: `Penjelajahan adalah kegiatan berjalan menempuh rute tertentu sambil menyelesaikan tugas di sepanjang jalan. Ia menggabungkan hampir seluruh materi kepramukaan sekaligus — navigasi, sandi, tali temali, P3K, kerja sama — dan karena itu menjadi bentuk ujian keterampilan yang paling menyeluruh.

## Merancang Rute

**Prinsip pertama: jalani sendiri rutenya sebelum dipakai peserta.** Panitia yang merancang rute hanya dari peta hampir selalu salah memperkirakan waktu tempuh.

Hal yang dicatat saat survei rute:

1. **Jarak total** dan waktu tempuh sesungguhnya.
2. **Titik berbahaya** — jurang, sungai deras, jalan raya, tanah longsor.
3. **Sumber air bersih** di sepanjang jalur.
4. **Titik evakuasi** — tempat kendaraan bisa masuk bila terjadi keadaan darurat.
5. **Kekuatan sinyal telepon** di setiap bagian jalur.
6. **Izin** dari pemilik lahan atau pengelola kawasan.

**Patokan jarak menurut golongan:**
- Siaga: maksimal 2 km
- Penggalang: 3 – 6 km
- Penegak: 6 – 12 km

Tambahkan **1 jam untuk setiap 300 meter kenaikan** di luar waktu jalan mendatar.

## Sistem Pos

Rute penjelajahan dibagi menjadi beberapa pos, masing-masing dengan satu tugas.

**Susunan pos yang seimbang** untuk penjelajahan enam pos:

| Pos | Materi | Sifat |
|---|---|---|
| 1 | Sandi dan morse | Berpikir |
| 2 | Tali temali | Keterampilan tangan |
| 3 | P3K dan tandu | Kerja sama |
| 4 | Halang rintang | Fisik |
| 5 | Navigasi kompas | Berpikir |
| 6 | Kekompakan regu | Mental |

Selang-selingkan pos berpikir dan pos fisik. Tiga pos fisik berurutan akan menghabiskan tenaga peserta sebelum penjelajahan selesai.

**Setiap pos wajib punya:** satu penjaga pos, lembar penilaian, air minum cadangan, dan kotak P3K.

## Teknik Berjalan yang Hemat Tenaga

Ini yang membedakan peserta yang sampai di garis akhir dengan senyum dari yang sampai dengan merangkak.

1. **Langkah pendek dan tetap** lebih hemat daripada langkah lebar yang terputus-putus.
2. **Injakkan seluruh telapak kaki** saat menanjak, bukan ujung jari. Ujung jari cepat membuat betis kram.
3. **Menuruni lereng dengan lutut sedikit ditekuk** — lutut lurus menerima seluruh hentakan.
4. **Atur napas mengikuti langkah.** Misalnya tarik napas dua langkah, buang napas dua langkah.
5. **Istirahat pendek dan sering** lebih baik daripada istirahat panjang dan jarang. Lima menit setiap 30 menit sudah cukup.
6. **Minum sedikit tetapi sering,** jangan menunggu haus.
7. **Regu berjalan seirama dengan anggota terlemah** di posisi kedua dari depan, bukan di belakang sendiri.

**Susunan barisan regu:** pemimpin regu di depan, anggota terlemah di urutan kedua, anggota terkuat di paling belakang sebagai penyapu. Dengan begitu tidak ada yang tertinggal tanpa diketahui.

## Halang Rintang

Halang rintang melatih keberanian dan kerja sama, tetapi juga bagian dengan risiko cedera tertinggi dalam kegiatan kepramukaan. Aturan berikut tidak boleh ditawar.

#### Jenis Rintangan Umum
- **Merayap** di bawah tali atau jaring rendah
- **Meniti** balok atau tali tunggal
- **Jaring laba-laba** — melewati lubang jaring tanpa menyentuh tali
- **Jembatan tali** — dua atau tiga tali
- **Panjat dinding** rendah
- **Lorong ban** atau terowongan

#### Aturan Keselamatan Mutlak

1. **Periksa seluruh simpul dan ikatan** sebelum kegiatan dimulai — oleh dua orang berbeda.
2. **Rintangan di atas 1,5 meter wajib memakai pengaman**: matras, tali pengaman, atau penjaga di bawah.
3. **Satu penjaga untuk setiap rintangan**, tanpa kecuali.
4. **Peserta melepas** jam tangan, cincin, kalung, dan benda tajam dari saku.
5. **Rambut panjang diikat.**
6. **Satu peserta pada satu waktu** di setiap rintangan.
7. **Hentikan seluruh kegiatan saat hujan** — tali dan kayu menjadi licin.
8. **Peserta berhak menolak** rintangan tertentu tanpa dipermalukan. Memaksa peserta yang takut ketinggian adalah cara paling cepat menciptakan kecelakaan.
9. **Bongkar seluruh rintangan** setelah kegiatan selesai.

## Perlengkapan Regu

- Peta rute dan lembar tugas dalam wadah tahan air
- Kompas
- Kotak P3K regu
- Air minum minimal 1,5 liter per orang
- Peluit untuk setiap anggota
- Tali kecil 5 meter
- Ponsel dengan daya penuh (satu per regu, disegel dan hanya dibuka untuk keadaan darurat)

## Bila Terjadi Keadaan Darurat

1. **Hentikan perjalanan.** Kumpulkan seluruh anggota regu.
2. **Nilai keadaan** — siapa yang cedera, seberapa parah.
3. **Beri pertolongan pertama** sesuai kemampuan.
4. **Hubungi panitia** lewat ponsel, atau kirim dua orang — jangan pernah satu orang sendirian — ke pos terdekat.
5. **Tetap di tempat terbuka** yang mudah terlihat.
6. **Bunyikan peluit tiga kali berulang** sebagai tanda minta tolong.

## Latihan Mandiri

1. Rancang rute penjelajahan 3 km di sekitar sekolah lengkap dengan enam pos.
2. Latih teknik berjalan menanjak dan menurun di tangga sekolah.
3. Susun daftar periksa keselamatan halang rintang bersama regu, lalu gunakan pada kegiatan berikutnya.`,
  },

  {
    slug: 'keselamatan-di-air',
    judul: 'Keselamatan di Air',
    kategori: 'p3k',
    tingkatan: 'penegak',
    urutan: 240,
    durasi_menit: 11,
    ringkasan:
      'Aturan kegiatan di dekat air, cara menolong korban tenggelam tanpa ikut tenggelam, dan penanganan korban setelah diangkat.',
    deskripsi:
      'Materi keselamatan air untuk kegiatan perkemahan dan penjelajahan: penilaian bahaya, teknik pertolongan, dan penanganan korban.',
    sumber: 'Wikipedia — Tenggelam',
    sumber_url: 'https://id.wikipedia.org/wiki/Tenggelam',
    gambar: { cari: 'life jacket water rescue', cadangan: 'Lifebuoy.jpg' },
    konten: `Air adalah penyebab kecelakaan fatal paling sering dalam kegiatan alam terbuka — dan yang paling sering luput diantisipasi, karena sungai kecil terlihat tidak berbahaya. Materi ini mungkin materi yang paling berharap tidak pernah kamu pakai.

## Mengapa Orang Tenggelam Tanpa Berteriak

Ada satu hal yang harus diketahui setiap Pramuka, dan bertentangan dengan yang digambarkan film.

**Orang yang tenggelam biasanya tidak berteriak dan tidak melambaikan tangan.** Sistem pernapasan diprioritaskan untuk bernapas, bukan untuk berbicara. Lengan secara naluriah menekan ke bawah untuk mengangkat tubuh, sehingga tidak bisa melambai.

Tanda orang sedang tenggelam:

- Kepala tenggelam-timbul, mulut berada di garis air
- Kepala menengadah ke belakang, mulut terbuka
- Mata kosong menatap, atau terpejam
- Rambut menutupi dahi dan mata, tidak disingkirkan
- Tubuh tegak di air, tidak menendang
- Tampak seperti "memanjat tangga tak terlihat"
- **Diam** — inilah yang paling berbahaya

Anak yang bermain air selalu berisik. **Bila tiba-tiba menjadi sunyi, segera periksa.**

## Aturan Sebelum Kegiatan Dekat Air

1. **Survei lokasi lebih dulu** — kedalaman, kecepatan arus, dasar sungai, benda tajam.
2. **Tetapkan batas wilayah** yang boleh dimasuki, tandai dengan jelas.
3. **Tunjuk pengawas khusus** yang tidak ikut bermain dan tidak memegang tugas lain.
4. **Sistem berpasangan** — setiap orang punya satu pasangan yang bertanggung jawab mengawasinya.
5. **Hitung jumlah anggota** sebelum masuk air dan setiap 15 menit.
6. **Sediakan alat pertolongan** di tepi: tali, pelampung, galah panjang.
7. **Larang berenang setelah makan berat** atau saat kelelahan.
8. **Batasi waktu** di air, terutama saat air dingin.

> Arus setinggi lutut dengan kecepatan 1 meter per detik sudah cukup untuk menjatuhkan orang dewasa. Sungai pegunungan bisa naik beberapa meter dalam hitungan menit meski di tempatmu tidak hujan — yang menentukan adalah hujan di hulu.

## Cara Menolong: Urutan yang Aman

Ini urutan yang diajarkan lembaga penyelamatan di seluruh dunia, dari yang paling aman ke yang paling berisiko. **Jangan melompat ke urutan berikutnya bila yang sebelumnya masih mungkin dilakukan.**

#### 1. RAIH (Reach)
Julurkan tangan, tongkat, galah, dahan, atau handuk dari tepi. Berbaring telungkup dan berpegangan pada sesuatu agar tidak ikut tertarik.

#### 2. LEMPAR (Throw)
Lemparkan benda terapung — pelampung, jeriken kosong tertutup, botol besar kosong — yang diikat tali. Lemparkan **melewati** korban, lalu tarik pelan ke arahnya.

#### 3. DAYUNG (Row)
Gunakan perahu atau rakit bila tersedia. Dekati korban dari arah bawah aliran, bukan dari atas.

#### 4. RENANG (Go) — pilihan terakhir
**Hanya bila kamu perenang terlatih dan membawa alat apung.** Korban yang panik akan mencengkeram penolongnya dengan kekuatan luar biasa dan menenggelamkan keduanya.

Bila terpaksa berenang: dekati dari **belakang**, bawa benda apung untuk diberikan ke korban, dan jangan pernah membiarkan korban meraih tubuhmu.

> Setiap tahun, sebagian korban tenggelam adalah **penolong** yang tidak terlatih. Menolong dengan cara yang salah menambah korban, bukan mengurangi.

## Setelah Korban Diangkat

1. **Baringkan** di tempat datar dan aman, jauh dari air.
2. **Periksa kesadaran** — panggil dan tepuk bahunya.
3. **Periksa napas** — lihat dada, dengar, rasakan selama 10 detik.
4. **Bila tidak bernapas:** mulai bantuan hidup dasar (lihat materi RJP) dan panggil bantuan medis segera lewat **119**.
5. **Bila bernapas tetapi tidak sadar:** miringkan tubuhnya (posisi pemulihan) supaya air dan muntahan bisa keluar dan tidak masuk ke paru-paru.
6. **Ganti pakaian basah,** selimuti, jaga kehangatan tubuhnya.
7. **Tetap bawa ke rumah sakit** walaupun korban tampak pulih sepenuhnya.

Poin terakhir sangat penting. Air yang masuk ke paru-paru dapat menimbulkan gangguan pernapasan **berjam-jam kemudian**, ketika korban sudah merasa baik-baik saja. Setiap korban tenggelam wajib diperiksa tenaga medis.

**Yang TIDAK boleh dilakukan:** menggoyang-goyang tubuh korban terbalik untuk "mengeluarkan air", atau menekan perutnya. Kedua tindakan itu menunda pertolongan yang sesungguhnya dibutuhkan dan berisiko membuat isi lambung masuk ke paru-paru.

## Menyeberangi Sungai

Bila penjelajahan mengharuskan menyeberang:

1. **Cari titik terdangkal dan terlebar** — di situ arusnya paling lambat.
2. **Jangan menyeberang bila air melebihi lutut** dan arusnya deras.
3. **Lepaskan tali pinggang ransel** agar bisa dilepas cepat bila terjatuh.
4. **Menyeberang menyerong mengikuti arah arus,** bukan melawannya.
5. **Gunakan tongkat** sebagai kaki ketiga, tancapkan di hulu badan.
6. **Menyeberang berkelompok** sambil berpegangan, dengan anggota terkuat di sisi hulu.
7. **Bila terjatuh:** posisikan kaki ke arah hilir, badan telentang, jangan mencoba berdiri di arus deras.

## Latihan Mandiri

1. Hafalkan urutan RAIH – LEMPAR – DAYUNG – RENANG.
2. Latih melempar tali bertali pelampung ke sasaran sejauh 10 meter.
3. Latih posisi pemulihan bersama regu.
4. Simpan nomor **119** dan nomor Basarnas **115** di ponselmu.`,
  },

  {
    slug: 'astronomi-praktis-dan-navigasi-malam',
    judul: 'Rasi Bintang & Navigasi Malam',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 250,
    durasi_menit: 10,
    ringkasan:
      'Mengenali rasi bintang dari langit Indonesia, menentukan arah dengan Salib Selatan, dan memperkirakan waktu di malam hari.',
    deskripsi:
      'Materi astronomi praktis untuk kegiatan malam: rasi utama, penentuan arah tanpa kompas, dan pengenalan benda langit.',
    sumber: 'Wikipedia — Rasi bintang',
    sumber_url: 'https://id.wikipedia.org/wiki/Rasi_bintang',
    gambar: { cari: 'milky way starry night sky', cadangan: 'ALMA_and_a_Starry_Night.jpg' },
    konten: `Sebelum ada kompas, apalagi GPS, manusia menyeberangi samudra hanya dengan menatap langit. Nenek moyang bangsa Indonesia berlayar dari Nusantara sampai Madagaskar dengan bekal itu. Kemampuan membaca bintang bukan sekadar pengetahuan menarik — ia cadangan terakhir ketika seluruh alat gagal.

## Bekal Awal

Untuk mengamati langit dengan baik:

- **Jauhi cahaya lampu.** Perkemahan di gunung adalah tempat terbaik.
- **Beri waktu mata menyesuaikan** — 20 hingga 30 menit dalam gelap. Sekali kamu melihat layar ponsel, penyesuaian itu hilang dan harus diulang.
- **Gunakan senter bermika merah** bila perlu penerangan; cahaya merah tidak merusak penyesuaian mata.
- **Berbaring telentang** — leher tidak akan pegal dan sudut pandangmu jauh lebih luas.

## Mengukur Sudut dengan Tangan

Rentangkan tangan sejauh lengan. Ukuran ini berlaku untuk hampir semua orang, karena tangan yang lebih besar biasanya menempel pada lengan yang lebih panjang.

| Bagian tangan | Sudut di langit |
|---|---|
| Lebar kelingking | 1° |
| Tiga jari rapat | 5° |
| Kepalan tangan | 10° |
| Rentang jempol – telunjuk | 15° |
| Rentang jempol – kelingking | 25° |

Dari cakrawala sampai titik tepat di atas kepala adalah 90° — atau sembilan kepalan tangan.

## Menentukan Arah Selatan: Rasi Salib Selatan

Ini rasi terpenting bagi kita, karena Indonesia berada di dekat khatulistiwa dan Salib Selatan terlihat hampir sepanjang tahun.

**Rasi Crux (Salib Selatan)** berbentuk salib kecil yang miring, terdiri dari empat bintang terang. Ia sering tertukar dengan "Salib Palsu" yang lebih besar dan lebih redup — Crux yang asli lebih rapat dan dua bintang penunjuknya (Alpha dan Beta Centauri) berada di dekatnya.

**Cara menemukan arah selatan:**

1. Temukan Salib Selatan.
2. Tarik garis khayal memanjang dari sumbu panjang salib (dari bintang atas ke bintang bawah).
3. Perpanjang garis itu sejauh **4,5 kali** panjang salib.
4. Titik yang dicapai adalah **Kutub Selatan Langit**.
5. Tarik garis tegak lurus dari titik itu ke cakrawala — di situlah **arah selatan**.

Setelah tahu selatan, arah lain mengikuti dengan sendirinya.

## Menentukan Arah Utara: Rasi Biduk

Di bagian utara langit, cari **Rasi Ursa Major (Biduk atau Pedati Sungsang)** yang berbentuk gayung.

1. Temukan dua bintang di ujung "gayung" — disebut bintang penunjuk.
2. Tarik garis dari keduanya, perpanjang **5 kali** jaraknya.
3. Bintang terang yang ditemui adalah **Polaris (Bintang Utara)**.
4. Polaris hampir tepat berada di atas kutub utara bumi, jadi arah bawahnya adalah **utara**.

Dari Indonesia, Polaris hanya terlihat rendah di cakrawala utara dan tidak selalu tampak. Karena itu Salib Selatan lebih dapat diandalkan di wilayah kita.

## Rasi Lain yang Mudah Dikenali

**Orion (Waluku)** — paling mudah dikenali dari **tiga bintang sejajar** di tengahnya, yang oleh petani Jawa disebut *lintang waluku* (bintang bajak). Kemunculannya dahulu menjadi penanda mulainya musim tanam. Garis tiga bintang itu menunjuk kira-kira ke arah timur-barat.

**Scorpius (Kalajengking)** — berbentuk seperti kalajengking dengan ekor melengkung, dengan bintang merah terang **Antares** di badannya. Terlihat jelas dari Indonesia pada pertengahan tahun.

**Bimasakti (Milky Way)** — pita samar cahaya yang membentang di langit. Itu adalah galaksi kita sendiri, dilihat dari dalam. Hanya terlihat di tempat yang benar-benar gelap — bila kamu bisa melihatnya, berarti lokasi perkemahanmu sangat baik.

## Membedakan Bintang, Planet, dan Satelit

- **Bintang** berkelip, karena cahayanya melewati lapisan udara yang bergolak.
- **Planet** bersinar tenang tanpa berkelip. Venus adalah yang paling terang, muncul saat senja atau menjelang fajar. Jupiter dan Mars juga mudah terlihat.
- **Satelit** bergerak perlahan dan mantap melintasi langit dalam beberapa menit, tanpa lampu kelip. Stasiun Luar Angkasa Internasional adalah yang paling terang.
- **Pesawat terbang** punya lampu kelip merah dan hijau.
- **Meteor** melintas dalam sekejap, kurang dari satu detik.

## Memperkirakan Waktu Malam

Rasi bintang bergerak sekitar **15 derajat per jam** ke arah barat — akibat perputaran bumi, bukan gerak bintangnya.

Bila kamu tahu posisi sebuah rasi pada awal malam, kamu bisa memperkirakan berapa jam telah berlalu dengan mengukur perpindahannya memakai kepalan tangan: satu setengah kepalan ≈ satu jam.

## Etika Pengamatan Malam

1. **Jangan menyalakan senter ke arah orang lain** yang sedang mengamati.
2. **Jaga suara** — pengamatan malam adalah kegiatan yang tenang.
3. **Beri tahu pembina** sebelum keluar tenda pada malam hari.
4. **Jangan mengamati sendirian** jauh dari perkemahan.

## Latihan Mandiri

1. Hafalkan cara menemukan arah selatan lewat Salib Selatan sampai bisa tanpa berpikir.
2. Ukur sudut lima pasang bintang dengan tanganmu, catat hasilnya.
3. Adakan pengamatan langit bersama regu, catat rasi apa saja yang berhasil dikenali.`,
  },

  {
    slug: 'membaca-cuaca-dan-tanda-alam',
    judul: 'Membaca Cuaca & Tanda Alam',
    kategori: 'survival',
    tingkatan: 'penegak',
    urutan: 260,
    durasi_menit: 10,
    ringkasan:
      'Mengenali jenis awan, membaca tanda datangnya hujan dan badai, serta memutuskan kapan kegiatan lapangan harus dihentikan.',
    deskripsi:
      'Materi pengamatan cuaca praktis untuk kegiatan lapangan: jenis awan, tanda alam, dan prosedur menghadapi cuaca buruk.',
    sumber: 'Wikipedia — Awan',
    sumber_url: 'https://id.wikipedia.org/wiki/Awan',
    gambar: { cari: 'cumulus clouds sky weather', cadangan: 'Fair_weather_clouds_in_California.jpg' },
    konten: `Di lapangan, kemampuan membaca cuaca lebih berguna daripada ramalan di ponsel — karena sinyal sering hilang justru di tempat yang paling membutuhkannya. Langit memberi peringatan; yang diperlukan hanya kebiasaan menengadah.

## Mengenali Jenis Awan

Nama awan tersusun dari kata Latin sederhana: *cirrus* (serat), *cumulus* (tumpukan), *stratus* (lapisan), dan *nimbus* (hujan). Gabungannya menjelaskan bentuk sekaligus artinya.

#### Awan Tinggi (di atas 6 km)

**Cirrus** — tipis berserat seperti bulu, putih. Cuaca masih baik, tetapi bila jumlahnya bertambah dan menebal, perubahan cuaca datang dalam 12 – 24 jam.

**Cirrostratus** — lapisan tipis yang menutupi langit dan sering menimbulkan **lingkaran cahaya (halo)** di sekeliling matahari atau bulan. Halo adalah tanda klasik hujan akan datang dalam 12 – 18 jam.

#### Awan Menengah (2 – 6 km)

**Altocumulus** — gumpalan kecil bergerombol seperti sisik ikan. Bila muncul pada pagi hari yang lembap, sering diikuti hujan petir pada sore harinya.

**Altostratus** — lapisan kelabu yang membuat matahari tampak seperti dilihat lewat kaca buram. Hujan merata biasanya menyusul.

#### Awan Rendah (di bawah 2 km)

**Cumulus** — gumpalan putih berdasar rata seperti kapas. Ini **awan cuaca baik**, khas siang hari cerah.

**Stratus** — lapisan kelabu rata menutupi langit, sering menyentuh puncak bukit. Membawa gerimis, bukan hujan deras.

**Stratocumulus** — lapisan bergumpal kelabu. Jarang menghasilkan hujan berarti.

#### Awan Tumbuh Tegak

**Cumulonimbus** — inilah yang harus kamu kenali di atas segalanya. Awan raksasa menjulang seperti menara dengan puncak melebar berbentuk **landasan pandai besi**, dasarnya gelap.

Cumulonimbus membawa hujan lebat, petir, angin kencang, dan kadang hujan es. **Bila kamu melihat awan ini tumbuh, hentikan kegiatan lapangan dan cari perlindungan — jangan menunggu sampai hujan turun.**

## Tanda Alam Selain Awan

**Angin berubah arah mendadak dan menjadi dingin** — massa udara baru datang; hujan biasanya dalam 30 menit.

**Udara terasa pengap dan lembap** sejak pagi — bahan bakar untuk badai sore hari.

**Asap tidak mau naik lurus, melainkan mendatar dan membumbung rendah** — tekanan udara turun, tanda hujan.

**Bau tanah yang khas sebelum hujan** — bau ini nyata dan punya nama: *petrichor*, berasal dari minyak tanaman dan senyawa tanah yang terangkat oleh kelembapan naik.

**Semut berbaris memindahkan telur ke tempat lebih tinggi** — tanda hujan yang sudah dipakai turun-temurun dan cukup dapat diandalkan.

**Burung terbang rendah** — serangga yang menjadi makanannya turun karena kelembapan naik.

**Bunga tertentu menutup kelopaknya** sebelum hujan.

**Suara terdengar lebih jelas dan jauh dari biasanya** — udara lembap menghantarkan bunyi lebih baik; sering mendahului hujan.

**Langit merah saat senja** biasanya menandakan cuaca baik esok hari; **langit merah saat fajar** sering menandakan cuaca memburuk.

## Perkiraan Musim di Indonesia

Indonesia mengenal dua musim, tetapi waktunya bergeser antar daerah:

- **Musim hujan** — umumnya Oktober sampai Maret, puncaknya Desember – Januari.
- **Musim kemarau** — umumnya April sampai September.
- **Masa peralihan** (Maret – April dan September – Oktober) — paling sulit ditebak, sering muncul hujan lebat mendadak disertai petir. Justru masa inilah yang paling berbahaya untuk kegiatan lapangan.

Di daerah pegunungan, hujan sering turun pada **sore hari** karena udara lembap yang naik sepanjang siang. Karena itu perjalanan gunung dianjurkan dimulai pagi buta dan selesai sebelum pukul dua siang.

## Menghadapi Petir

Petir adalah bahaya cuaca yang paling mematikan dalam kegiatan alam terbuka, dan sering diremehkan.

**Aturan 30 – 30:**
- Bila jeda antara kilat dan guruh **kurang dari 30 detik**, petir sudah dalam jarak berbahaya (di bawah 10 km). Segera berlindung.
- Tunggu **30 menit** setelah guruh terakhir sebelum kembali beraktivitas.

**Menghitung jarak petir:** hitung detik antara kilat dan guruh, lalu **bagi tiga** untuk mendapatkan jarak dalam kilometer.

**Yang harus dilakukan:**
- Masuk ke bangunan permanen atau kendaraan tertutup.
- Bila di alam terbuka: turun dari punggungan dan puncak, jauhi pohon tinggi tunggal, jauhi air.
- Berjongkok dengan kedua kaki rapat, tangan menutup telinga, tumit terangkat. **Jangan berbaring** — tanah dapat menghantarkan arus.
- Regu **memencar** dengan jarak minimal 5 meter antar orang, supaya satu sambaran tidak melukai semua.
- Lepaskan benda logam panjang: tongkat, rangka ransel, payung.

## Kapan Kegiatan Harus Dihentikan

Hentikan kegiatan lapangan bila:

- Terlihat awan cumulonimbus tumbuh
- Terdengar guruh, meski langit di atasmu masih cerah
- Angin berubah kencang mendadak
- Kabut turun sampai jarak pandang di bawah 50 meter
- Hujan deras berlangsung lebih dari 15 menit di daerah aliran sungai

> Keputusan menghentikan kegiatan adalah tanda kepemimpinan yang baik, bukan tanda menyerah. Kegiatan bisa dijadwalkan ulang; nyawa tidak.

## Latihan Mandiri

1. Amati langit setiap sore selama satu minggu, catat jenis awan dan cuaca yang terjadi. Cocokkan tebakanmu dengan kenyataan.
2. Latih menghitung jarak petir saat hujan berikutnya.
3. Susun prosedur cuaca buruk untuk kegiatan Gudep, lalu bahas bersama pembina.`,
  },

  {
    slug: 'panjat-dan-turun-tebing-dasar',
    judul: 'Panjat & Turun Tebing Dasar',
    kategori: 'pioneering',
    tingkatan: 'penegak',
    urutan: 270,
    durasi_menit: 11,
    ringkasan:
      'Pengenalan peralatan panjat, simpul pengaman, teknik dasar naik dan turun, serta aba-aba baku yang wajib dihafal.',
    deskripsi:
      'Materi pengenalan panjat tebing dan rappelling untuk Penegak — dasar teori dan keselamatan, bukan pengganti pelatihan bersertifikat.',
    sumber: 'Wikipedia — Panjat tebing',
    sumber_url: 'https://id.wikipedia.org/wiki/Panjat_tebing',
    gambar: { cari: 'rock climbing rope harness', cadangan: 'Climber_with_equipment.jpg' },
    konten: `> **Peringatan penting.** Materi ini adalah pengenalan teori dan keselamatan. Kegiatan panjat dan turun tebing **wajib** didampingi instruktur bersertifikat dan memakai peralatan berstandar. Jangan pernah melakukannya sendiri berbekal bacaan.

Panjat tebing melatih hal yang jarang disentuh materi lain: mengelola rasa takut sambil tetap berpikir jernih, dan menyerahkan keselamatan diri pada rekan satu tim. Kepercayaan di sini bukan kiasan — ia harfiah.

## Peralatan dan Fungsinya

| Alat | Fungsi |
|---|---|
| **Tali kernmantel** | Tali utama; inti pemikul beban dibungkus selubung pelindung |
| **Harness** | Sabuk pengaman tubuh, tempat mengaitkan tali |
| **Carabiner** | Cincin kait; jenis berkunci (screw gate) untuk titik penting |
| **Figure of eight** | Alat penurun (descender) berbentuk angka delapan |
| **Helm** | Melindungi dari batu jatuh dan benturan |
| **Sepatu panjat** | Sol karet lengket untuk cengkeraman maksimal |
| **Webbing** | Pita datar untuk jangkar dan sabuk darurat |
| **Prusik** | Tali kecil untuk simpul gesek, cadangan pengaman |
| **Chalk bag** | Kantong bubuk magnesium untuk mengeringkan tangan |

**Dua jenis tali yang berbeda dan tidak boleh tertukar:**

- **Tali dinamis** — sedikit melar, menyerap hentakan saat jatuh. Dipakai untuk memanjat.
- **Tali statis** — hampir tidak melar. Dipakai untuk turun (rappelling) dan mengangkut barang. **Tidak boleh dipakai memanjat** karena hentakan jatuh akan diteruskan langsung ke tubuh.

## Simpul Wajib

**Figure of eight follow through** — simpul pengikat tali ke harness. Ini simpul terpenting dalam panjat tebing: mudah diperiksa secara visual dan tidak mudah terurai.

**Simpul kembar (double fisherman)** — menyambung dua tali.

**Simpul prusik** — simpul gesek yang mengunci saat dibebani dan bisa digeser saat tidak dibebani. Dipakai sebagai pengaman cadangan saat menurun.

**Simpul delapan ganda (bunny ears)** — membuat dua sosok untuk jangkar di dua titik.

Setiap simpul wajib diberi **ekor sisa minimal 10 sentimeter** dan diperiksa dua orang sebelum dipakai.

## Aba-aba Baku

Aba-aba ini dipakai di seluruh dunia dan harus diucapkan **lantang dan jelas**. Kesalahpahaman satu kata bisa berakibat fatal.

| Diucapkan pemanjat | Dijawab pengaman | Arti |
|---|---|---|
| "Belay on?" | "Belay on!" | Apakah pengaman siap? — Siap |
| "Climbing!" | "Climb on!" | Saya mulai memanjat — Silakan |
| "Slack!" | — | Kendurkan tali |
| "Up rope!" | — | Kencangkan tali |
| "Tension!" | — | Tahan tali, saya bertumpu |
| "Falling!" | — | Saya jatuh |
| "Rock!" | — | Ada batu jatuh, lindungi kepala |
| "Off belay!" | "Belay off!" | Saya sudah aman, pengaman boleh dilepas |

Aba-aba diucapkan dalam bahasa Inggris karena itulah standar internasional — dan karena dalam keadaan panik, kata yang sudah dilatih berulang akan keluar lebih dulu.

## Teknik Memanjat

1. **Bertumpu pada kaki, bukan tangan.** Otot kaki jauh lebih kuat dan tahan lama. Tangan hanya untuk menjaga keseimbangan.
2. **Jaga tiga titik tumpu.** Saat menggerakkan satu anggota badan, tiga lainnya tetap menempel.
3. **Rentangkan lengan, jangan ditekuk.** Lengan tertekuk terus-menerus cepat kehabisan tenaga.
4. **Dekatkan pinggul ke dinding.** Menjauhkan badan justru memperberat pegangan tangan.
5. **Lihat ke bawah untuk mencari pijakan kaki,** bukan hanya ke atas mencari pegangan.
6. **Bergerak perlahan dan mantap.** Gerakan tersentak menguras tenaga dan memperbesar risiko terpeleset.
7. **Atur napas.** Menahan napas adalah kebiasaan pemula yang mempercepat kelelahan.

## Turun Tebing (Rappelling)

Turun terlihat lebih mudah daripada naik, padahal justru di sinilah lebih banyak kecelakaan terjadi — biasanya karena pemeriksaan yang tergesa.

**Urutan yang wajib diikuti:**

1. **Periksa jangkar** — harus punya minimal dua titik yang tidak saling bergantung.
2. **Periksa tali** — pastikan kedua ujungnya menyentuh tanah, dan buat **simpul di ujung tali** supaya tidak lolos dari alat.
3. **Pasang alat penurun** dan carabiner berkunci; pastikan kuncinya terkunci.
4. **Pasang pengaman cadangan** berupa simpul prusik.
5. **Periksa berpasangan** — rekanmu memeriksa alatmu, kamu memeriksa alatnya.
6. **Uji beban** sambil masih berada di tempat aman.
7. **Turun dengan badan condong ke belakang,** kaki melangkah di dinding, kaki dibuka selebar bahu.
8. **Tangan pengendali di belakang pinggul,** tidak pernah dilepas.
9. **Turun perlahan dan mantap.** Melompat-lompat saat turun adalah gaya film, dan penyebab tali putus di dunia nyata.

## Aturan Keselamatan Mutlak

1. **Helm dipakai sejak masuk area sampai keluar area** — bukan hanya saat memanjat.
2. **Periksa berpasangan sebelum setiap giliran,** tanpa kecuali, termasuk untuk yang paling berpengalaman.
3. **Satu pengaman hanya menangani satu pemanjat** dan tidak boleh mengerjakan apa pun yang lain.
4. **Tali diperiksa setiap kali dipakai** — cari bagian yang menggembung, gepeng, atau berbulu.
5. **Tali yang pernah menerima jatuhan berat wajib dipensiunkan,** meski tampak baik dari luar.
6. **Jangan menginjak tali.** Pasir dan kerikil yang masuk ke serat merusaknya dari dalam.
7. **Hentikan kegiatan saat hujan, angin kencang, atau petir.**
8. **Peserta berhak berhenti kapan saja** tanpa dipermalukan.

## Latihan Mandiri

1. Hafalkan seluruh aba-aba baku beserta jawabannya.
2. Latih simpul figure of eight follow through sampai bisa dalam 30 detik dan periksa hasilnya bersama rekan.
3. Ikuti pelatihan bersertifikat sebelum melakukan kegiatan panjat sesungguhnya.`,
  },

  {
    slug: 'navigasi-gps-dan-peta-digital',
    judul: 'Navigasi GPS & Peta Digital',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 280,
    durasi_menit: 9,
    ringkasan:
      'Memanfaatkan GPS dan peta digital dengan benar, memahami batasannya, dan mengapa kompas tetap wajib dibawa.',
    deskripsi:
      'Materi navigasi modern: cara kerja GPS, membaca koordinat digital, peta luring, dan pengelolaan daya baterai di lapangan.',
    sumber: 'Wikipedia — Sistem Pemosisi Global',
    sumber_url: 'https://id.wikipedia.org/wiki/Sistem_Pemosisi_Global',
    gambar: { cari: 'handheld GPS device hiking', cadangan: 'Garmin_GPS.jpg' },
    konten: `Setiap ponsel hari ini punya kemampuan navigasi yang beberapa dasawarsa lalu hanya dimiliki militer. Itu keuntungan besar — asal kita paham betul di mana batasnya, dan tidak menggantungkan keselamatan regu pada benda yang baterainya bisa habis.

## Cara Kerja GPS Secara Singkat

Ada puluhan satelit mengorbit bumi yang terus memancarkan sinyal berisi waktu dan posisi. Penerima di ponselmu menangkap sinyal dari beberapa satelit sekaligus, menghitung selisih waktu tempuh masing-masing, lalu menentukan posisimu dari perpotongan jarak-jarak itu.

Konsekuensi penting dari cara kerja ini:

- **Butuh minimal tiga satelit** untuk posisi mendatar, empat untuk ketinggian.
- **Butuh langit terbuka.** Di dalam gua, hutan sangat lebat, atau lembah sempit, sinyal terhalang.
- **Tidak memerlukan pulsa atau sinyal telepon.** GPS bekerja meski ponsel tidak punya jaringan sama sekali — ini yang paling sering disalahpahami.
- **Yang butuh sinyal adalah petanya,** bukan penentuan posisinya. Karena itu peta harus diunduh lebih dulu.

## Membaca Koordinat

Koordinat lokasi bisa ditulis dalam beberapa bentuk. Semuanya menunjuk titik yang sama.

| Bentuk | Contoh |
|---|---|
| Derajat desimal | -6.9175, 107.6191 |
| Derajat menit detik | 6°55'03"S 107°37'08"E |
| UTM | 48M 789012 9234567 |

**Angka pertama selalu lintang (utara–selatan), angka kedua bujur (timur–barat).**

Untuk Indonesia: lintang bernilai **negatif** bila berada di selatan khatulistiwa, dan bujur selalu **positif** (di timur).

Catat koordinat lokasi perkemahan dan titik-titik penting sebelum berangkat. Bila terjadi keadaan darurat, koordinat adalah informasi paling berharga yang bisa kamu sampaikan ke tim penyelamat.

## Menyiapkan Peta Luring

Ini langkah yang wajib dilakukan **sebelum** berangkat, ketika masih ada sinyal.

1. Buka aplikasi peta pilihanmu.
2. Cari wilayah tujuan.
3. Unduh peta wilayah itu untuk penggunaan luring.
4. **Uji dengan mengaktifkan mode pesawat** — buka lagi petanya dan pastikan benar-benar terbaca.

Langkah keempat sering dilewatkan, dan baru ketahuan gagal ketika sudah tidak ada sinyal untuk mengulanginya.

## Mengelola Daya Baterai

Baterai habis di tengah hutan mengubah alat navigasi menjadi beban mati. Beberapa cara memperpanjangnya:

1. **Aktifkan mode pesawat**, tetapi biarkan GPS menyala. Yang paling boros justru pencarian sinyal seluler, bukan GPS.
2. **Turunkan kecerahan layar** serendah mungkin.
3. **Matikan aplikasi latar belakang** dan pemberitahuan.
4. **Jangan biarkan layar menyala terus.** Buka hanya saat perlu memeriksa posisi.
5. **Bawa powerbank** minimal 10.000 mAh, terisi penuh.
6. **Jaga kehangatan ponsel.** Baterai kehilangan sebagian besar dayanya di suhu dingin — simpan di saku dalam, bukan di saku luar ransel.
7. **Satu ponsel disegel sebagai cadangan darurat** dalam regu, tidak dipakai untuk memotret.

## Mengapa Kompas Tetap Wajib Dibawa

Ini bukan sikap kolot. Setiap alat elektronik punya titik gagal yang tidak dimiliki kompas:

| Keadaan | GPS | Kompas |
|---|---|---|
| Baterai habis | Mati total | Tetap bekerja |
| Terkena air | Sering rusak | Tetap bekerja |
| Terjatuh | Layar retak, mati | Umumnya tetap bekerja |
| Suhu sangat dingin | Baterai anjlok | Tetap bekerja |
| Hutan sangat lebat | Sinyal hilang | Tetap bekerja |
| Sinyal satelit terganggu | Tidak akurat | Tetap bekerja |

**Aturan yang berlaku di seluruh kegiatan alam terbuka: bawa dua sistem navigasi yang tidak saling bergantung.** GPS untuk kecepatan dan ketelitian, peta dan kompas untuk jaminan.

Dan yang lebih penting: **kuasai peta dan kompas lebih dulu.** Orang yang hanya bisa memakai GPS akan benar-benar tersesat begitu layarnya padam.

## Ketelitian dan Keterbatasan

- Ketelitian GPS ponsel biasa: sekitar **3 – 10 meter** di ruang terbuka.
- Di bawah tajuk hutan lebat atau di antara gedung tinggi: bisa meleset **50 meter atau lebih**.
- **Data ketinggian dari GPS kurang teliti** — bisa meleset puluhan meter. Untuk ketinggian, altimeter barometrik lebih dapat diandalkan.
- Jalur yang tampak ada di peta digital **belum tentu masih ada di lapangan**. Peta rakitan sukarelawan bisa memuat jalur yang sudah lama tertutup semak.

## Etika Penggunaan

1. **Jangan menatap layar sambil berjalan** di medan tidak rata. Berhenti dulu, baru periksa.
2. **Ponsel bukan pengganti pengamatan.** Tetap perhatikan tanda medan di sekitarmu.
3. **Beri tahu orang di rumah** rencana perjalanan dan perkiraan waktu kembali — ini pengaman yang tidak butuh baterai sama sekali.
4. **Bagikan koordinat lokasi kemah** ke panitia dan keluarga sebelum berangkat.

## Latihan Mandiri

1. Unduh peta luring wilayah sekolahmu, lalu uji dengan mode pesawat.
2. Catat koordinat lima tempat penting di sekitarmu dalam bentuk derajat desimal.
3. Bandingkan arah yang ditunjukkan kompas ponsel dengan kompas sungguhan sambil berdiri dekat pagar besi — perhatikan selisihnya.`,
  },
];
