import type { MateriSeed } from './types';

export const MATERI_KETERAMPILAN: MateriSeed[] = [
  {
    slug: 'simpul-dan-ikatan',
    judul: 'Tali Temali — Simpul & Ikatan',
    kategori: 'tali_temali',
    tingkatan: 'penggalang',
    urutan: 50,
    durasi_menit: 14,
    ringkasan:
      'Simpul dan ikatan yang wajib dikuasai setiap Pramuka: kegunaan masing-masing, cara membuatnya, dan kesalahan yang berbahaya.',
    deskripsi:
      'Panduan tali temali lengkap — perbedaan simpul, ikatan, dan jerat, ditambah dua belas simpul dasar beserta penggunaannya di lapangan.',
    sumber: 'Wikipedia — Simpul',
    sumber_url: 'https://id.wikipedia.org/wiki/Simpul',
    gambar: { cari: 'reef knot square knot rope', cadangan: 'Reef_knot.jpg' },
    konten: `Tali temali adalah keterampilan Pramuka yang paling sering dipakai dan paling sering diremehkan. Simpul yang salah bukan hanya membuat tenda roboh — pada kegiatan panjat, penyeberangan, atau evakuasi, simpul yang salah bisa mencelakai orang. Karena itu materi ini menuntut latihan berulang, bukan sekadar hafalan.

## Tiga Istilah yang Sering Tertukar

Banyak anggota baru menyebut semuanya "simpul". Padahal ketiganya berbeda dan tidak bisa saling menggantikan.

- **Simpul** — hubungan antara **tali dengan tali**. Contoh: simpul mati, simpul anyam.
- **Ikatan** — hubungan antara **tali dengan benda**, biasanya kayu atau tongkat. Contoh: ikatan palang, ikatan silang.
- **Jerat** — hubungan antara **tali dengan benda** yang membentuk lingkaran mengunci. Contoh: jerat tiang.

## Bagian-bagian Tali

Sebelum praktik, kenali istilahnya supaya instruksi mudah diikuti:

- **Ujung tali** — bagian paling akhir, yang digerakkan saat menyimpul.
- **Badan tali** — bagian tengah yang panjang.
- **Sosok** — lengkungan tali yang belum menyilang.
- **Sosok silang** — lengkungan yang sudah menyilang.

## Simpul Dasar

#### 1. Simpul Mati (Reef Knot)
Menyambung dua tali yang **sama besar** dan **sama bahan**. Ini simpul paling dasar sekaligus paling sering salah dibuat.

Cara: kanan di atas kiri, lalu kiri di atas kanan. Kalau urutannya sama dua kali, yang terbentuk adalah **simpul nenek** — simpul palsu yang mudah lepas dan tidak boleh dipakai untuk beban.

> Uji sederhana: simpul mati yang benar bentuknya simetris seperti dua huruf U saling mengunci. Kalau bentuknya melintir, itu simpul nenek. Bongkar dan ulangi.

#### 2. Simpul Hidup
Sama seperti simpul mati, tetapi salah satu ujung dilipat sehingga mudah dilepas dengan sekali tarik. Cocok untuk ikatan sementara.

#### 3. Simpul Anyam (Sheet Bend)
Menyambung dua tali yang **berbeda besar**. Tali yang lebih besar dibentuk sosok, tali yang lebih kecil dimasukkan dan dililitkan. Kalau memakai simpul mati untuk tali beda ukuran, sambungan akan slip.

#### 4. Simpul Anyam Berganda
Versi simpul anyam dengan lilitan dua kali. Dipakai untuk tali yang perbedaan ukurannya jauh, atau tali basah dan licin.

#### 5. Simpul Pangkal (Clove Hitch)
Simpul pengunci untuk memulai hampir semua ikatan pada tongkat. Wajib dikuasai sebelum belajar pionering, karena setiap ikatan dimulai dan diakhiri dengannya.

#### 6. Simpul Jangkar (Cow Hitch)
Mengikat tali pada cincin, gelang, atau tongkat melintang. Sering dipakai untuk membuat tandu darurat.

#### 7. Simpul Tarik
Menambatkan tali pada tiang, tetapi mudah dilepas saat sudah tidak dipakai. Berguna saat turun dari ketinggian.

#### 8. Simpul Kembar (Double Fisherman)
Menyambung dua tali **licin atau basah**. Simpul ini paling kuat di antara simpul penyambung dan tidak akan slip.

#### 9. Simpul Erat
Memendekkan tali tanpa harus memotongnya. Berguna saat tali terlalu panjang untuk pasak tenda.

#### 10. Simpul Kursi
Mengangkat atau menurunkan orang. Membentuk dua lingkaran — satu untuk badan, satu untuk kaki. Wajib diperiksa dua kali sebelum dipakai.

#### 11. Simpul Penarik
Menarik benda berat seperti balok kayu.

#### 12. Simpul Laso
Membentuk lingkaran yang bisa mengecil, dipakai untuk menjerat benda atau hewan ternak.

## Tiga Ikatan Utama

#### Ikatan Palang
Menyatukan dua tongkat yang bersilangan **tegak lurus**. Dipakai untuk rangka menara, tiang bendera, dan rak dapur perkemahan.

Urutannya: simpul pangkal → lilitkan tegak lurus tiga sampai empat putaran → lilitkan menyilang di antara kedua tongkat (frapping) dua sampai tiga putaran → kunci dengan simpul pangkal.

Bagian melintang inilah yang mengencangkan sambungan. Tanpa itu, ikatan akan longgar begitu dibebani.

#### Ikatan Silang
Menyatukan dua tongkat yang bersilangan **tidak tegak lurus**. Dimulai dengan simpul tambat, bukan simpul pangkal.

#### Ikatan Canggah
Menyambung dua tongkat menjadi satu tongkat yang lebih panjang. Kunci kekuatannya ada pada panjang tumpang tindih — minimal seperempat panjang tongkat.

## Perawatan Tali

Tali yang dirawat baik bisa bertahan bertahun-tahun; yang diabaikan rusak dalam satu musim.

1. **Keringkan sebelum disimpan.** Tali basah yang digulung akan berjamur dan lapuk dari dalam.
2. **Gulung dengan benar,** jangan dikusutkan. Tali kusut akan melintir permanen.
3. **Bakar atau lakban ujungnya** supaya seratnya tidak terurai.
4. **Jangan diinjak.** Menginjak tali menekan pasir dan kerikil ke dalam serat, dan itulah yang benar-benar memutuskan tali — bukan bebannya.
5. **Jauhkan dari minyak dan bahan kimia,** yang melemahkan serat tanpa terlihat dari luar.

## Latihan Mandiri

1. Buat sepuluh simpul dasar sampai bisa dalam waktu di bawah 20 detik per simpul.
2. Latih simpul mati dan simpul pangkal **dengan mata tertutup** — di lapangan, sering kali kamu harus menyimpul dalam gelap.
3. Buat satu rak piring perkemahan bersama regu hanya memakai tongkat dan ikatan palang.`,
  },

  {
    slug: 'pionering',
    judul: 'Pionering — Bangunan dari Tongkat & Tali',
    kategori: 'pioneering',
    tingkatan: 'penegak',
    urutan: 60,
    durasi_menit: 12,
    ringkasan:
      'Membangun menara pandang, jembatan, gapura, dan tiang bendera dari tongkat dan tali — beserta perhitungan keamanannya.',
    deskripsi:
      'Materi pionering untuk Penegak: jenis bangunan, prinsip kekuatan struktur segitiga, dan prosedur keselamatan kerja.',
    sumber: 'Wikipedia — Pioneering (Scouting)',
    sumber_url: 'https://en.wikipedia.org/wiki/Pioneering_(scouting)',
    gambar: { cari: 'scout pioneering lashing', cadangan: 'Tripod_scout.JPG' },
    konten: `Pionering adalah seni membangun sesuatu yang berguna hanya dari tongkat dan tali, tanpa paku dan tanpa sekrup. Di baliknya ada tiga hal yang dilatih sekaligus: penguasaan tali temali, pemahaman dasar kekuatan struktur, dan yang paling penting — kerja sama regu. Menara setinggi lima meter tidak mungkin berdiri kalau satu orang bekerja sendiri.

## Prinsip Dasar: Segitiga Itu Kaku

Ini satu-satunya teori yang wajib dipahami sebelum menyentuh tali.

Bentuk **persegi** dapat berubah menjadi jajar genjang jika didorong dari samping — ia tidak stabil. Bentuk **segitiga** tidak bisa berubah bentuk tanpa mematahkan salah satu sisinya. Karena itu setiap bangunan pionering yang baik selalu memuat segitiga, entah sebagai penopang silang atau sebagai kaki penyangga.

Kalau menara yang kamu bangun terasa goyang, jawabannya hampir selalu sama: **tambahkan penopang diagonal**.

## Bahan dan Ukuran

**Tongkat (stok):**
- Tongkat Pramuka standar: panjang **160 cm**, diameter 3 – 4 cm.
- Bambu untuk bangunan besar: panjang 3 – 6 m.
- Pilih tongkat yang lurus, tidak retak, dan tidak berlubang bekas rayap.

**Tali:**
- Tali pionering: diameter 6 – 10 mm.
- Panjang untuk satu ikatan palang: sekitar **4 – 5 meter**.
- Tali serat alam (goni) untuk latihan; tali sintetis untuk beban berat.

## Jenis Bangunan Pionering

#### 1. Tiang Bendera
Bangunan paling dasar. Biasanya berbentuk kaki tiga (tripod) dengan satu tiang tengah. Melatih ikatan canggah dan ikatan kaki tiga.

#### 2. Gapura
Pintu masuk perkemahan. Selain fungsional, gapura adalah wajah regu — sering dinilai dalam lomba perkemahan. Struktur dasarnya dua tiang tegak dengan palang atas, diperkuat penopang diagonal di kedua sisi.

#### 3. Menara Pandang
Bangunan tiga atau empat kaki dengan lantai pengamatan di atas. Ini bangunan yang paling menuntut ketelitian karena akan dinaiki orang.

Aturan mutlak menara pandang:
- Tinggi maksimal untuk kegiatan Penegak: **5 meter**.
- Setiap sisi wajib punya penopang diagonal.
- Kaki menara ditanam atau diganjal, tidak boleh berdiri di tanah gembur.
- Diuji dengan pemberat dulu, **tidak langsung dinaiki orang**.

#### 4. Jembatan
Menyeberangi parit atau sungai kecil. Jenis yang umum: jembatan monyet (satu tali kaki, dua tali pegangan) dan jembatan rakit.

#### 5. Rak Dapur dan Meja Perkemahan
Bangunan yang paling sering benar-benar dipakai selama berkemah. Melatih ikatan palang dalam jumlah banyak.

## Tahap Pembangunan

1. **Gambar rencana lebih dulu.** Tentukan jumlah tongkat, titik ikatan, dan panjang tali yang dibutuhkan. Regu yang langsung mengikat tanpa rencana hampir selalu kehabisan tali di tengah jalan.
2. **Siapkan seluruh bahan** di satu tempat. Hitung ulang.
3. **Rangkai bagian per bagian di tanah,** jangan langsung berdiri. Mengikat sambil berdiri jauh lebih sulit dan berbahaya.
4. **Dirikan bersama-sama** dengan aba-aba satu komando. Ini bagian paling rawan cedera.
5. **Pasang penopang diagonal** segera setelah berdiri.
6. **Uji beban** sebelum dipakai.

## Keselamatan Kerja

Bagian ini tidak boleh dilewati, dan pembina wajib mengawasinya langsung.

- **Gunakan helm** saat mendirikan bangunan tinggi.
- **Jangan berdiri di bawah bangunan** yang sedang didirikan.
- **Periksa setiap ikatan** sebelum menaiki bangunan — periksa oleh dua orang berbeda, bukan satu.
- **Bangunan setinggi lebih dari 3 meter wajib diawasi pembina.**
- **Bongkar bangunan sebelum meninggalkan lokasi.** Bangunan pionering yang ditinggalkan bisa roboh menimpa orang lain.
- **Hentikan pekerjaan saat hujan atau angin kencang.** Tali basah kehilangan sebagian kekuatannya dan tongkat menjadi licin.

## Kesalahan yang Sering Terjadi

1. **Ikatan kurang kencang.** Bagian melintang (frapping) yang mengunci kekuatan ikatan sering dilewatkan karena dianggap tambahan.
2. **Lupa penopang diagonal.** Bangunan berdiri, tetapi goyang dan akhirnya roboh.
3. **Tali terlalu pendek.** Ikatan tidak cukup lilitan sehingga tidak kuat.
4. **Tongkat retak dipaksa dipakai.** Retak kecil akan menjadi patah saat dibebani.

## Latihan Mandiri

1. Bangun kaki tiga sederhana bersama regu dalam waktu 15 menit.
2. Hitung kebutuhan tali untuk gapura setinggi 3 meter sebelum mulai membangun, lalu bandingkan dengan pemakaian sebenarnya.
3. Bangun rak piring perkemahan dan pakai selama satu kegiatan penuh — bangunan yang benar-benar dipakai akan langsung menunjukkan kelemahannya.`,
  },

  {
    slug: 'peraturan-baris-berbaris',
    judul: 'Peraturan Baris-Berbaris (PBB)',
    kategori: 'pbb',
    tingkatan: 'umum',
    urutan: 70,
    durasi_menit: 13,
    ringkasan:
      'Aba-aba, gerakan di tempat, gerakan berjalan, dan formasi barisan — dasar kedisiplinan setiap kegiatan kepramukaan.',
    deskripsi:
      'Panduan PBB sesuai Perpang TNI Nomor 58 Tahun 2018, disesuaikan untuk penggunaan di lingkungan Gerakan Pramuka.',
    sumber: 'Wikipedia — Baris-berbaris',
    sumber_url: 'https://id.wikipedia.org/wiki/Baris-berbaris',
    gambar: { cari: 'baris berbaris pramuka', cadangan: 'Baris_Berbaris_Pramuka.jpg' },
    konten: `Peraturan Baris-Berbaris bukan sekadar latihan berjalan rapi. Tujuannya membentuk sikap jasmani yang tegap, rasa persatuan, dan yang paling utama — **kepatuhan pada perintah yang benar**. Regu yang bergerak serentak adalah regu yang saling percaya.

## Tujuan PBB

Menurut ketentuan resmi, PBB bertujuan menumbuhkan:

1. Sikap jasmani yang tegap dan tangkas.
2. Rasa persatuan dan kebersamaan.
3. Rasa disiplin dan tanggung jawab.
4. Kesigapan dalam melaksanakan perintah.

## Tiga Jenis Aba-aba

Setiap perintah dalam PBB tersusun dari tiga bagian. Salah menyusun aba-aba akan membuat barisan bergerak tidak serentak.

#### 1. Aba-aba Petunjuk
Menjelaskan kepada siapa perintah ditujukan. Dipakai hanya bila diperlukan.
*Contoh:* "Kepada Pembina Upacara —"

#### 2. Aba-aba Peringatan
Inti perintahnya, diucapkan jelas dan agak panjang.
*Contoh:* "Lencang kanan —"

#### 3. Aba-aba Pelaksanaan
Perintah untuk bergerak, diucapkan tegas dan pendek. Ada tiga bentuk:

- **GERAK** — untuk gerakan tanpa meninggalkan tempat, atau gerakan kaki tanpa berjalan.
- **JALAN** — untuk gerakan yang meninggalkan tempat.
- **MULAI** — untuk gerakan yang dilakukan berturut-turut.

> Contoh lengkap: "Hadap kanan — **GERAK**", "Maju — **JALAN**", "Berhitung — **MULAI**".

## Sikap Sempurna

Semua gerakan dimulai dan diakhiri dari sikap ini, jadi harus benar sejak awal.

- Badan tegak, dada dibusungkan, perut ditarik.
- Tumit rapat, ujung kaki membentuk sudut **45 derajat**.
- Lutut lurus, tetapi tidak kaku terkunci.
- Tangan lurus di samping badan, jari-jari menggenggam ringan, ibu jari lurus ke bawah menempel jahitan celana.
- Pandangan lurus ke depan, dagu tidak terangkat.
- Bernapas wajar.

## Gerakan di Tempat

| Aba-aba | Gerakan |
|---|---|
| Siap — GERAK | Kembali ke sikap sempurna |
| Istirahat di tempat — GERAK | Kaki kiri dibuka selebar bahu, tangan di belakang punggung |
| Lencang kanan — GERAK | Tangan kanan diangkat lurus ke samping, meluruskan barisan |
| Setengah lencang kanan — GERAK | Tangan kanan bertolak pinggang, jarak dipersempit |
| Hadap kanan — GERAK | Berputar 90° ke kanan |
| Hadap kiri — GERAK | Berputar 90° ke kiri |
| Balik kanan — GERAK | Berputar 180° ke kanan |
| Hormat — GERAK | Tangan kanan ke pelipis, siku 15° ke depan |
| Berhitung — MULAI | Menyebut nomor urut dari kanan depan |

## Gerakan Berjalan

**Langkah biasa** — panjang langkah 65 cm, tempo 96 langkah per menit. Lengan diayun 45° ke depan dan 30° ke belakang.

**Langkah tegap** — panjang langkah sama, tetapi kaki dihentakkan dan telapak tangan mengepal. Dipakai saat melewati mimbar upacara.

**Langkah perlahan** — untuk upacara pemakaman atau penghormatan khusus, tempo 30 langkah per menit.

**Langkah ke samping / ke belakang / ke depan** — maksimal **empat langkah**, dilakukan tanpa mengayun lengan.

**Lari maju** — tempo 165 langkah per menit, kedua tangan mengepal di depan pinggang.

## Formasi Barisan

- **Bersaf** — anggota berdiri berjajar menyamping. Dipakai untuk apel dan pemeriksaan.
- **Berbanjar** — anggota berdiri berurutan ke belakang. Dipakai untuk perpindahan.
- **Angkare** — berbentuk huruf U, dipakai untuk upacara pelantikan.
- **Lingkaran** — dipakai untuk api unggun dan diskusi regu.

## Kesalahan yang Sering Terjadi

1. **Aba-aba pelaksanaan diucapkan terlalu cepat** setelah aba-aba peringatan. Barisan tidak sempat bersiap sehingga gerakan tidak serentak.
2. **Memakai GERAK untuk gerakan berjalan.** Yang benar JALAN.
3. **Pandangan melirik** saat lencang kanan. Yang bergerak hanya kepala, sesuai ketentuan.
4. **Menurunkan tangan sebelum aba-aba "tegak — gerak"** pada gerakan hormat.
5. **Barisan tidak lurus karena tidak berhitung ulang** setelah ada anggota yang keluar barisan.

## Latihan Mandiri

1. Latih sikap sempurna selama dua menit penuh tanpa bergerak. Ini lebih berat dari yang dibayangkan, dan menjadi dasar semua gerakan lain.
2. Bergiliranlah menjadi pemimpin barisan agar setiap anggota terbiasa memberi aba-aba.
3. Rekam latihan regu dengan ponsel dari depan — kesalahan barisan jauh lebih mudah terlihat lewat rekaman daripada dari dalam barisan.`,
  },

  {
    slug: 'kompas-dan-navigasi',
    judul: 'Kompas & Navigasi Darat',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 80,
    durasi_menit: 14,
    ringkasan:
      'Membaca kompas, menentukan azimuth dan back azimuth, serta menemukan arah tanpa kompas ketika alat tidak tersedia.',
    deskripsi:
      'Materi navigasi darat: bagian kompas bidik, perhitungan sudut kompas, resection, dan teknik penentuan arah alami.',
    sumber: 'Wikipedia — Kompas',
    sumber_url: 'https://id.wikipedia.org/wiki/Kompas',
    gambar: { cari: 'orienteering compass map navigation', cadangan: 'Kompass_Silva.jpg' },
    konten: `Kompas adalah alat penunjuk arah yang bekerja karena jarumnya selalu menghadap medan magnet bumi. Sederhana, tidak perlu baterai, dan tidak bergantung sinyal — itulah alasan kompas masih dipakai meski setiap ponsel sudah punya GPS. Ketika sinyal hilang dan baterai habis, kompas tetap bekerja.

## Bagian-bagian Kompas Bidik

- **Dial** — permukaan bulat berisi angka derajat 0° sampai 360°.
- **Jarum magnet** — ujung berwarna selalu menunjuk **utara magnetis**.
- **Visir** — lubang bidik untuk membidik sasaran.
- **Kaca pembesar** — untuk membaca angka derajat dengan tepat.
- **Tutup dengan garis rambut** — garis bantu pembidikan.
- **Alat penyangkut** — untuk mengaitkan kompas pada ibu jari.

## Delapan Arah Mata Angin

| Arah | Singkatan | Derajat |
|---|---|---|
| Utara | U / N | 0° atau 360° |
| Timur Laut | TL / NE | 45° |
| Timur | T / E | 90° |
| Tenggara | TG / SE | 135° |
| Selatan | S | 180° |
| Barat Daya | BD / SW | 225° |
| Barat | B / W | 270° |
| Barat Laut | BL / NW | 315° |

## Cara Menggunakan Kompas Bidik

1. **Berdiri tegak** dan buka tutup kompas sampai membentuk sudut 90°.
2. **Masukkan ibu jari** ke alat penyangkut, telunjuk menopang badan kompas.
3. **Dekatkan visir ke mata,** bidik sasaran melalui garis rambut.
4. **Baca angka derajat** yang ditunjuk melalui kaca pembesar.
5. **Catat angkanya** — inilah **azimuth** atau sudut kompas menuju sasaran.

> Menjauhlah dari benda logam, kabel listrik, dan ponsel saat membidik. Semua itu membelokkan jarum magnet, kadang sampai puluhan derajat, dan kamu tidak akan sadar sedang salah arah.

## Azimuth dan Back Azimuth

**Azimuth** adalah sudut dari posisimu menuju sasaran. **Back azimuth** adalah sudut sebaliknya — dari sasaran kembali ke posisimu. Ini yang dipakai untuk kembali ke titik awal.

Rumusnya sederhana:

- Jika azimuth **kurang dari 180°**, maka back azimuth = azimuth **+ 180°**.
- Jika azimuth **lebih dari 180°**, maka back azimuth = azimuth **− 180°**.

**Contoh:** azimuth ke pos berikutnya 60°. Maka back azimuth untuk kembali adalah 60° + 180° = **240°**.

## Menentukan Posisi (Resection)

Teknik untuk mengetahui di mana kamu berada, memakai dua atau tiga tanda medan yang terlihat dan tercantum di peta.

1. Bidik tanda medan pertama, catat azimuthnya, lalu hitung back azimuth-nya.
2. Tarik garis dari tanda medan itu di peta sesuai back azimuth.
3. Ulangi untuk tanda medan kedua dan ketiga.
4. Titik perpotongan ketiga garis adalah posisimu.

Tiga tanda medan lebih baik daripada dua: perpotongan tiga garis membentuk segitiga kecil, dan besarnya segitiga itu menunjukkan seberapa teliti pembidikanmu.

## Menentukan Arah Tanpa Kompas

Kompas bisa hilang atau rusak. Cara-cara berikut wajib dikuasai sebagai cadangan.

#### Dengan Matahari
Matahari terbit di timur dan terbenam di barat. Pada pukul 12 siang, bayangan benda menunjuk ke selatan bila kamu berada di sebelah utara garis khatulistiwa, dan menunjuk ke utara bila di sebelah selatannya.

#### Dengan Jam Analog
Arahkan jarum pendek ke matahari. Sudut antara jarum pendek dan angka 12, dibagi dua, menunjuk ke arah utara-selatan.

#### Dengan Bintang
Di belahan bumi selatan, cari **Rasi Salib Selatan (Crux)**. Tarik garis khayal memanjang dari sumbu panjangnya sejauh 4,5 kali panjangnya — titik itu menunjuk arah selatan.

Di belahan bumi utara, cari **Bintang Utara (Polaris)** lewat Rasi Biduk.

#### Dengan Tanda Alam
- Lumut tumbuh lebih lebat pada sisi pohon yang lembap dan kurang terkena matahari.
- Masjid di Indonesia menghadap ke arah barat laut (kiblat).
- Ujung bayangan tongkat yang ditandai dua kali dengan jeda 15 menit membentuk garis timur-barat.

Perlu diingat: cara-cara alami ini memberi **perkiraan**, bukan ketepatan. Jangan pertaruhkan keselamatan regu hanya pada lumut.

## Latihan Mandiri

1. Bidik lima benda di sekitar sekolah, catat azimuthnya, lalu hitung back azimuth masing-masing.
2. Buat jalur berbentuk segitiga: berjalan 50 langkah pada azimuth 0°, 50 langkah pada 120°, lalu 50 langkah pada 240°. Kalau perhitunganmu benar, kamu akan kembali ke titik awal.
3. Tentukan arah utara dengan tiga cara berbeda tanpa kompas, lalu bandingkan hasilnya dengan kompas sungguhan.`,
  },

  {
    slug: 'peta-pita-dan-menaksir',
    judul: 'Peta Pita, Peta Panorama & Menaksir',
    kategori: 'kompas',
    tingkatan: 'penegak',
    urutan: 90,
    durasi_menit: 12,
    ringkasan:
      'Merekam perjalanan dalam bentuk peta pita, menggambar peta panorama, serta menaksir tinggi, lebar, dan kecepatan arus.',
    deskripsi:
      'Keterampilan pemetaan dan penaksiran untuk kegiatan penjelajahan, lengkap dengan rumus dan contoh perhitungannya.',
    sumber: 'Wikipedia — Kartografi',
    sumber_url: 'https://id.wikipedia.org/wiki/Kartografi',
    gambar: { cari: 'topographic map contour lines hiking', cadangan: 'Topographic_map_example.png' },
    konten: `Ketika berjalan menembus daerah yang belum dikenal, catatan perjalanan yang rapi lebih berharga daripada ingatan. Tiga keterampilan berikut — peta pita, peta panorama, dan menaksir — adalah cara Pramuka merekam dan mengukur medan hanya dengan alat sederhana.

## Peta Pita

Peta pita adalah catatan perjalanan berbentuk pita memanjang, dibuat sambil berjalan. Ia merekam arah, jarak, dan tanda medan sepanjang rute.

**Alat yang dibutuhkan:** kertas panjang (atau kertas biasa yang disambung), pensil, penggaris, kompas, dan alat ukur jarak (langkah atau meteran).

**Format kolomnya:**

| Nomor | Waktu | Jarak | Arah (°) | Gambar Kiri | Gambar Kanan | Keterangan |
|---|---|---|---|---|---|---|
| 1 | 08.00 | 0 m | 45° | sawah | rumah | titik awal |
| 2 | 08.15 | 250 m | 90° | sungai | pohon beringin | belok kanan |

**Aturan penting:**

1. Peta pita digambar **dari bawah ke atas**, karena itulah arah perjalananmu.
2. Arah utara selalu digambar mengarah ke atas kertas.
3. Setiap pergantian arah dicatat sebagai baris baru.
4. Gunakan simbol yang konsisten dan sertakan legenda.
5. Catat **saat itu juga**, jangan menunda sampai istirahat. Ingatan berjalan cepat memudar.

## Peta Panorama

Peta panorama adalah gambar pemandangan yang terlihat dari satu titik, digambar dengan sudut pandang mendatar. Fungsinya menggambarkan keadaan medan secara nyata, bukan dari atas seperti peta biasa.

**Cara membuatnya:**

1. Tentukan titik berdiri dan catat koordinat serta arah pandangnya.
2. Tentukan **sudut pandang** — biasanya 45° hingga 90°.
3. Bagi kertas menjadi beberapa kolom vertikal sesuai sudut, supaya perbandingan jaraknya tetap.
4. Gambar garis cakrawala lebih dulu, baru isi objek dari yang terjauh ke yang terdekat.
5. Objek jauh digambar tipis dan samar; objek dekat digambar tebal dan jelas — inilah yang menciptakan kesan kedalaman.
6. Beri arsiran, keterangan, dan arah mata angin.

## Menaksir Tinggi

#### Cara Bayangan
Paling mudah, tetapi butuh matahari.

Rumus:

**Tinggi benda = (Panjang bayangan benda × Tinggi tongkat) ÷ Panjang bayangan tongkat**

*Contoh:* tongkat setinggi 1,6 m memiliki bayangan 2 m. Sebuah pohon memiliki bayangan 15 m. Maka tinggi pohon = (15 × 1,6) ÷ 2 = **12 meter**.

#### Cara Segitiga Sebangun
Tanpa perlu matahari.

1. Tancapkan tongkat setinggi yang diketahui pada jarak tertentu dari pohon.
2. Berbaringlah sehingga ujung tongkat dan ujung pohon terlihat segaris dari matamu.
3. Ukur jarak matamu ke tongkat dan jarak matamu ke pohon.

**Tinggi pohon = (Jarak mata ke pohon × Tinggi tongkat) ÷ Jarak mata ke tongkat**

## Menaksir Lebar Sungai

Cara segitiga siku, tanpa perlu menyeberang:

1. Tentukan titik **A** di seberang sungai — misalnya sebatang pohon mencolok.
2. Berdirilah tepat di seberangnya, tandai sebagai titik **B**.
3. Berjalanlah menyusuri tepi sungai sejauh tertentu, misalnya 10 langkah, tandai sebagai titik **C**.
4. Lanjutkan berjalan dengan jarak yang sama persis, tandai sebagai titik **D**.
5. Dari titik D, berjalanlah menjauhi sungai tegak lurus sampai titik A, titik C, dan posisimu tampak segaris. Tandai titik **E**.

Jarak **D ke E** sama dengan lebar sungai.

## Menaksir Kecepatan Arus

1. Ukur jarak 10 meter di tepi sungai, tandai dengan dua patok.
2. Lemparkan benda terapung — ranting atau daun — dari patok pertama.
3. Catat waktu tempuhnya sampai patok kedua.

**Kecepatan = Jarak ÷ Waktu**

*Contoh:* 10 meter ditempuh dalam 8 detik → kecepatan arus 1,25 meter per detik.

Angka ini penting sebelum memutuskan menyeberang. Arus di atas 1 meter per detik sudah cukup untuk menjatuhkan orang dewasa yang berdiri di air setinggi lutut.

## Menaksir Jarak dengan Langkah

Setiap orang punya panjang langkah berbeda, jadi ukurlah milikmu sendiri:

1. Ukur jarak 100 meter dengan meteran.
2. Berjalanlah dengan langkah biasa, hitung jumlah langkahnya.
3. Ulangi tiga kali, lalu ambil rata-ratanya.

**Panjang langkahmu = 100 meter ÷ jumlah langkah rata-rata**

Catat angka ini dan hafalkan. Ia akan berguna di setiap penjelajahan sepanjang hidup kepramukaanmu.

## Latihan Mandiri

1. Buat peta pita perjalanan dari sekolah ke rumahmu.
2. Ukur panjang langkahmu sendiri dan catat di buku saku.
3. Taksir tinggi tiang bendera sekolah dengan dua cara berbeda, lalu bandingkan hasilnya dengan ukuran sebenarnya.`,
  },

  {
    slug: 'p3k-pertolongan-pertama',
    judul: 'P3K — Pertolongan Pertama',
    kategori: 'p3k',
    tingkatan: 'umum',
    urutan: 100,
    durasi_menit: 16,
    ringkasan:
      'Prinsip pertolongan pertama, penanganan luka, patah tulang, pingsan, dan keadaan darurat yang paling sering terjadi di lapangan.',
    deskripsi:
      'Materi P3K yang wajib dikuasai setiap anggota: urutan penilaian korban, isi kotak P3K, dan penanganan kasus umum.',
    sumber: 'Wikipedia — Pertolongan pertama',
    sumber_url: 'https://id.wikipedia.org/wiki/Pertolongan_pertama',
    gambar: { cari: 'first aid kit bandage medical', cadangan: 'First_aid_kit.jpg' },
    konten: `P3K adalah pertolongan sementara yang diberikan kepada korban sebelum tenaga medis datang. Kata kuncinya: **sementara**. Tujuan P3K bukan menyembuhkan, melainkan **mencegah keadaan bertambah buruk** dan menjaga nyawa sampai bantuan tiba.

> Materi ini adalah pengetahuan dasar, bukan pengganti pelatihan resmi. Untuk keterampilan lanjutan seperti RJP (CPR), ikutilah pelatihan bersertifikat dari PMI atau instansi kesehatan.

## Tiga Tujuan P3K

1. **Menyelamatkan jiwa** — menangani hal yang mengancam nyawa lebih dulu.
2. **Mencegah cacat** — menghindari tindakan yang memperparah cedera.
3. **Meringankan penderitaan** — memberi rasa aman dan mengurangi nyeri.

## Sebelum Menolong: Amankan Diri Sendiri

Ini aturan pertama yang paling sering dilanggar karena panik. **Penolong yang ikut menjadi korban tidak menolong siapa pun.**

1. **Pastikan lokasi aman** — periksa kabel listrik, kendaraan, api, tebing, atau air.
2. **Gunakan pelindung** — sarung tangan jika ada, atau kantong plastik bersih sebagai penggantinya.
3. **Panggil bantuan** — minta orang lain menghubungi **119** (layanan gawat darurat), pembina, atau puskesmas terdekat. Tunjuk orang tertentu: "Kamu, telepon 119 sekarang." Perintah yang ditujukan pada semua orang biasanya tidak dikerjakan siapa pun.

## Urutan Penilaian Korban

Gunakan urutan **D-R-C-A-B**:

- **D — Danger.** Apakah lokasi aman?
- **R — Response.** Apakah korban sadar? Panggil dan tepuk bahunya.
- **C — Circulation.** Apakah ada perdarahan hebat? Hentikan lebih dulu.
- **A — Airway.** Apakah jalan napas bebas? Bersihkan mulut dari benda asing.
- **B — Breathing.** Apakah korban bernapas? Lihat dada, dengar, dan rasakan napasnya.

## Isi Kotak P3K

**Bahan habis pakai:** kasa steril, perban gulung, plester, kapas, kain segitiga (mitella), sarung tangan sekali pakai.

**Cairan:** cairan pembersih luka (NaCl atau air matang), antiseptik povidone iodine, alkohol 70% untuk membersihkan alat.

**Alat:** gunting, pinset, peniti, senter kecil, bidai, selimut darurat.

**Obat dasar:** parasetamol, oralit, minyak kayu putih, salep luka bakar.

Periksa isi kotak P3K **setiap bulan** dan buang obat yang sudah kedaluwarsa. Kotak P3K yang isinya kedaluwarsa memberi rasa aman palsu.

## Penanganan Kasus yang Sering Terjadi

#### Luka Lecet dan Luka Sayat
1. Cuci tangan dan pakai sarung tangan.
2. Bersihkan luka dengan air mengalir atau cairan NaCl.
3. Beri antiseptik di sekitar luka.
4. Tutup dengan kasa steril, lalu balut.
5. Jangan pakai kapas langsung pada luka terbuka — seratnya akan menempel dan sulit diangkat.

#### Perdarahan Hebat
1. **Tekan langsung** pada luka dengan kain bersih selama 10 – 15 menit tanpa dilepas untuk mengintip.
2. **Tinggikan** bagian yang terluka melebihi posisi jantung, kecuali bila diduga ada patah tulang.
3. Jika darah menembus kain, **tambahkan kain di atasnya** — jangan melepas kain yang pertama, karena akan merusak gumpalan darah yang mulai terbentuk.
4. Segera bawa ke fasilitas kesehatan.

#### Patah Tulang
1. **Jangan menggerakkan** bagian yang patah.
2. **Jangan mencoba meluruskan** tulang yang bengkok. Ini dapat merusak pembuluh darah dan saraf.
3. Pasang **bidai** yang melewati dua sendi — di atas dan di bawah patahan.
4. Ikat bidai di beberapa titik, tetapi **jangan tepat di lokasi patahan**.
5. Periksa ujung jari: bila membiru atau dingin, ikatan terlalu kencang.

#### Pingsan
1. Baringkan korban di tempat teduh dan berudara segar.
2. **Tinggikan kedua tungkai** sekitar 30 cm agar darah mengalir ke otak.
3. Longgarkan pakaian yang ketat, terutama di leher dan pinggang.
4. **Jangan memberi minum** kepada orang yang belum sepenuhnya sadar — cairan bisa masuk ke paru-paru.
5. Bila tidak sadar dalam satu menit, segera cari bantuan medis.

#### Sengatan Panas (Heat Stroke)
Bahaya nyata di kegiatan lapangan siang hari. Tandanya: kulit panas dan kering, suhu tubuh sangat tinggi, kebingungan atau hilang kesadaran.

1. Pindahkan ke tempat teduh.
2. Dinginkan tubuh dengan air atau kain basah, terutama pada leher, ketiak, dan selangkangan.
3. Kipasi tubuhnya.
4. **Segera cari pertolongan medis** — sengatan panas dapat mematikan.

#### Gigitan Ular
1. **Tenangkan korban** dan batasi geraknya. Panik mempercepat penyebaran bisa.
2. Posisikan bagian yang tergigit **lebih rendah** dari jantung.
3. Lepaskan cincin, jam, dan benda yang menekan sebelum terjadi pembengkakan.
4. Balut longgar dengan perban elastis.
5. **Segera bawa ke rumah sakit.**

Yang **tidak boleh** dilakukan: menyedot bisa dengan mulut, menyayat luka, memberi es, atau mengikat sangat kencang seperti torniket. Semua tindakan itu memperburuk keadaan dan sudah lama ditinggalkan dalam panduan medis.

#### Luka Bakar
1. Aliri dengan **air mengalir bersuhu biasa selama 20 menit**.
2. Jangan pakai es, pasta gigi, mentega, atau kecap. Semua itu menahan panas di dalam jaringan dan meningkatkan risiko infeksi.
3. Tutup dengan kasa steril tidak lengket.
4. **Jangan memecahkan lepuh.**
5. Luka bakar luas, mengenai wajah, atau mengenai saluran napas wajib dirujuk ke rumah sakit.

## Latihan Mandiri

1. Hafalkan urutan D-R-C-A-B sampai bisa diucapkan tanpa berpikir.
2. Latih pembalutan luka pada lengan dan kepala bersama regu.
3. Periksa dan lengkapi kotak P3K Gudep bulan ini.
4. Simpan nomor darurat **119** dan nomor puskesmas terdekat di ponselmu sekarang juga.`,
  },

  {
    slug: 'evakuasi-dan-tandu-darurat',
    judul: 'Evakuasi & Tandu Darurat',
    kategori: 'p3k',
    tingkatan: 'penegak',
    urutan: 110,
    durasi_menit: 10,
    ringkasan:
      'Teknik memindahkan korban dengan aman, membuat tandu dari tongkat dan tali, serta aturan kapan korban tidak boleh dipindahkan.',
    deskripsi:
      'Materi lanjutan P3K: metode angkut satu dan dua penolong, pembuatan tandu darurat, dan prosedur evakuasi.',
    sumber: 'Wikipedia — Tandu',
    sumber_url: 'https://id.wikipedia.org/wiki/Tandu',
    gambar: { cari: 'stretcher rescue evacuation first aid', cadangan: 'Stretcher.jpg' },
    konten: `Memindahkan korban adalah tindakan berisiko. Setiap perpindahan berpotensi memperparah cedera, terutama cedera tulang belakang. Karena itu aturan pertamanya bukan "bagaimana cara mengangkat", melainkan **"apakah korban ini memang perlu dipindahkan?"**

## Kapan Korban TIDAK Boleh Dipindahkan

Jangan pindahkan korban bila:

- Diduga ada **cedera tulang belakang atau leher** — misalnya korban jatuh dari ketinggian, tertimpa benda berat, atau mengeluh kesemutan pada tangan dan kaki.
- Korban **tidak sadar** dan penyebabnya belum diketahui.
- Terdapat **patah tulang besar** yang belum dibidai.
- Bantuan medis akan tiba dalam waktu dekat dan lokasi aman.

Dalam keadaan tersebut: jaga korban tetap diam, jaga jalan napasnya, lindungi dari cuaca, dan tunggu tenaga medis.

## Kapan Korban HARUS Segera Dipindahkan

Pindahkan segera hanya bila lokasi mengancam nyawa:

- Ada kebakaran atau bahaya ledakan.
- Ada risiko kejatuhan benda atau longsor.
- Air pasang atau banjir sedang naik.
- Ada gas beracun atau asap.
- Korban perlu dibaringkan datar untuk tindakan penyelamatan nyawa.

## Metode Angkut Satu Penolong

**Memapah** — untuk korban sadar yang cedera ringan pada satu kaki. Lengan korban dilingkarkan ke bahu penolong.

**Menggendong di punggung** — untuk korban sadar, ringan, dan tidak ada cedera tulang.

**Mengangkat depan (cradle)** — untuk korban ringan atau anak-anak, jarak dekat.

**Menyeret dengan selimut** — untuk keadaan darurat di ruang berasap. Korban dibaringkan di atas selimut lalu ditarik dari bagian kepala. Cara ini menjaga tubuh tetap sejajar.

**Menyeret dengan pakaian** — pegang kerah baju korban sambil menopang kepalanya dengan lengan. Hanya untuk jarak sangat pendek dan keadaan sangat mendesak.

## Metode Angkut Dua Penolong

**Angkut kursi (human chair)** — kedua penolong menyilangkan lengan membentuk dudukan. Untuk korban sadar yang tidak bisa berjalan.

**Angkut depan-belakang** — satu penolong memegang ketiak korban dari belakang, satu lagi memegang kedua lutut. Aba-aba harus diberikan satu orang saja.

**Angkut sejajar** — kedua penolong berdiri di sisi yang sama, satu menopang bahu dan punggung, satu menopang pinggul dan kaki.

## Membuat Tandu Darurat

#### Tandu dari Tongkat dan Tali

**Bahan:** dua tongkat panjang (± 2,2 m), dua tongkat pendek (± 60 cm), tali pionering ± 15 meter.

**Langkah:**
1. Letakkan dua tongkat panjang sejajar dengan jarak 60 cm.
2. Pasang tongkat pendek melintang di kedua ujung, kunci dengan **ikatan palang**.
3. Anyam tali menyilang di antara kedua tongkat panjang membentuk pola zig-zag rapat.
4. Kencangkan anyaman, lalu kunci dengan simpul pangkal.
5. **Uji dengan beban** seberat korban sebelum dipakai — jangan pernah menguji langsung dengan orang sungguhan.

#### Tandu dari Jaket

**Bahan:** dua atau tiga jaket berlengan panjang, dua tongkat panjang.

**Langkah:**
1. Balikkan lengan jaket ke dalam, ritsleting ditutup rapat.
2. Masukkan kedua tongkat melalui lengan jaket.
3. Susun jaket berjajar sampai panjangnya cukup menopang seluruh tubuh.

Cara ini cepat dan bahannya hampir selalu tersedia, tetapi hanya untuk jarak dekat.

## Aturan Mengangkat Tandu

1. **Satu orang memimpin aba-aba.** Semua bergerak pada hitungan yang sama.
2. **Angkat dengan kekuatan kaki,** punggung tetap lurus. Membungkuk saat mengangkat adalah penyebab cedera pinggang penolong.
3. **Korban diangkut dengan kepala di depan** saat berjalan mendatar, agar keadaannya dapat terus diawasi.
4. **Saat menuruni tanjakan, kaki korban di depan;** saat menaiki tanjakan, kepala korban di depan. Tujuannya menjaga aliran darah ke otak.
5. **Jalan pelan dan langkah tidak seirama.** Kalau semua pengangkut melangkah bersamaan, tandu akan berayun naik-turun.
6. **Periksa keadaan korban** setiap beberapa menit selama perjalanan.

## Latihan Mandiri

1. Buat tandu tongkat bersama regu dalam waktu 10 menit, lalu uji dengan karung berisi pasir.
2. Latih metode angkut kursi dua penolong dengan anggota regu bergantian.
3. Simulasikan evakuasi dari titik terjauh perkemahan menuju jalan raya, catat waktunya, lalu cari cara memperpendeknya.`,
  },

  {
    slug: 'survival-di-alam-bebas',
    judul: 'Survival di Alam Bebas',
    kategori: 'survival',
    tingkatan: 'penegak',
    urutan: 120,
    durasi_menit: 15,
    ringkasan:
      'Prioritas bertahan hidup, membuat tempat berlindung, memperoleh air bersih, dan memberi tanda bahaya ketika tersesat.',
    deskripsi:
      'Materi survival dasar: aturan tiga, membuat bivak, penjernihan air, tanda darurat, dan pengendalian panik.',
    sumber: 'Wikipedia — Survival',
    sumber_url: 'https://id.wikipedia.org/wiki/Survival',
    gambar: { cari: 'lean-to shelter forest', cadangan: 'Roninmaan_laavu-1024.jpg' },
    konten: `Survival adalah keterampilan bertahan hidup ketika keadaan berubah di luar rencana. Yang paling menentukan keselamatan bukan peralatan mahal, melainkan **urutan keputusan yang benar** pada jam-jam pertama.

## Aturan Tiga

Ini kerangka prioritas yang dipakai di seluruh dunia. Hafalkan, karena ia menentukan apa yang harus dikerjakan lebih dulu.

Manusia rata-rata dapat bertahan sekitar:

- **3 menit** tanpa udara
- **3 jam** tanpa perlindungan dari cuaca ekstrem
- **3 hari** tanpa air
- **3 minggu** tanpa makanan

Karena itu urutan penanganannya: **udara → tempat berlindung → air → makanan.** Banyak orang yang tersesat langsung sibuk mencari makanan, padahal itu prioritas paling akhir.

## STOP — Hal Pertama Saat Tersesat

Ketika sadar bahwa kamu tersesat, berhentilah. Berjalan terus dalam keadaan panik hampir selalu memperburuk keadaan dan membuat tim pencari semakin sulit menemukanmu.

- **S — Stop.** Berhenti bergerak. Duduk. Tarik napas.
- **T — Thinking.** Pikirkan: di mana terakhir kali kamu yakin posisimu?
- **O — Observe.** Amati sekeliling: sumber air, tempat berlindung, tanda medan.
- **P — Planning.** Susun rencana sebelum bertindak.

> Aturan yang berlaku umum dalam pencarian dan penyelamatan: **tetaplah di tempat** bila kamu yakin ada orang yang akan mencarimu. Korban yang diam jauh lebih cepat ditemukan daripada korban yang terus berpindah.

## Tempat Berlindung (Bivak)

Bivak melindungi dari hujan, angin, dan dingin — tiga hal yang membunuh jauh lebih cepat daripada lapar.

**Memilih lokasi:**
- **Jangan** di dasar lembah — udara dingin mengendap di sana dan air mengalir ke sana saat hujan.
- **Jangan** di bawah pohon mati atau dahan besar yang rapuh.
- **Jangan** di tepi sungai — air bisa naik mendadak.
- **Pilih** tanah datar sedikit meninggi, terlindung angin.

**Jenis bivak sederhana:**

- **Bivak alam** — memanfaatkan pohon tumbang, cekungan batu, atau akar besar, ditambah dedaunan sebagai penutup.
- **Bivak ponco** — ponco atau jas hujan direntangkan dengan tali sebagai atap miring.
- **Bivak lean-to** — satu sisi miring menghadap angin, sisi lain terbuka menghadap api.

**Yang sering dilupakan:** alas tidur. Tanah menyerap panas tubuh jauh lebih cepat daripada udara. Beri alas dedaunan kering setebal minimal 10 cm. Tidur langsung di tanah membuat tubuh kedinginan meski atapnya sempurna.

## Air

Air adalah prioritas setelah tempat berlindung. Namun air yang tampak jernih belum tentu aman.

**Sumber air yang relatif aman:**
- Mata air yang keluar langsung dari tanah.
- Air hujan yang ditampung.
- Embun pagi yang dikumpulkan dengan kain.
- Air dari tanaman rambat besar dan ruas bambu muda.

**Sumber yang harus diwaspadai:** air tergenang, air berbusa, air berbau, air di dekat bangkai hewan, dan air di daerah pertanian yang mungkin tercemar pestisida.

**Cara membuat air lebih aman:**

1. **Merebus** — cara paling andal. Didihkan selama minimal **satu menit** setelah air benar-benar mendidih.
2. **Menyaring** — buat saringan berlapis dari botol bekas: kain, arang, pasir halus, pasir kasar, kerikil. Ini menghilangkan kotoran dan bau, **tetapi tidak membunuh kuman**. Tetap harus direbus setelahnya.
3. **Penyulingan matahari** — gali lubang, letakkan wadah di tengah, tutup dengan plastik bening, beri pemberat kecil di tengah plastik. Uap air akan mengembun dan menetes ke wadah.

## Api

Api memberi kehangatan, memasak, menjernihkan air, mengusir hewan, dan — yang sering dilupakan — memberi ketenangan psikologis.

**Tiga bahan yang harus disiapkan berurutan:**
1. **Bahan penyala** — serat kering, daun kering yang diremas, serutan kayu halus.
2. **Kayu kecil** — seukuran jari, disusun renggang agar udara mengalir.
3. **Kayu besar** — ditambahkan setelah api stabil.

Susun berbentuk kerucut (tipi) atau pagar. **Siapkan seluruh bahan sebelum menyalakan api.** Api yang mati karena kamu masih sibuk mencari kayu adalah kesalahan pemula yang paling sering terjadi.

## Tanda Darurat

- **Aturan tiga** — tiga tiupan peluit, tiga kilatan senter, atau tiga kali apa pun berarti **minta tolong** dan dikenali secara internasional.
- **Asap** — asap putih tebal terlihat dari jauh pada siang hari. Bakar daun basah atau rumput hijau untuk menghasilkannya.
- **Cermin** — pantulan matahari terlihat dari jarak beberapa kilometer, termasuk oleh pesawat.
- **Tanda darat** — susun batu atau ranting membentuk huruf **SOS** atau **V** berukuran besar di tempat terbuka.
- **Warna mencolok** — bentangkan pakaian atau kain berwarna terang di tempat terbuka.

## Mengendalikan Panik

Ini bagian yang paling sering diabaikan dalam materi survival, padahal paling menentukan.

Panik menyebabkan tiga hal berbahaya: keputusan tergesa, tenaga terbuang percuma, dan kemampuan berpikir menurun tajam.

Cara mengendalikannya:
1. Atur napas — tarik empat hitungan, tahan empat, buang empat.
2. Kerjakan **satu tugas nyata** — membuat bivak, mengumpulkan kayu. Tangan yang sibuk menenangkan pikiran.
3. Bicaralah dengan lantang, meskipun sendirian. Ini membantu menata pikiran.
4. Ingat: ada orang yang mencarimu. Kamu tidak sendirian.

## Latihan Mandiri

1. Buat bivak dari ponco dan tali dalam waktu 20 menit.
2. Buat saringan air botol bekas dan uji dengan air keruh.
3. Nyalakan api dengan bahan alami tanpa kertas, di bawah pengawasan pembina.
4. Susun daftar isi tas survival pribadi dan siapkan benar-benar di rumah.`,
  },

  {
    slug: 'perkemahan-dan-tenda',
    judul: 'Perkemahan & Manajemen Tenda',
    kategori: 'survival',
    tingkatan: 'penggalang',
    urutan: 130,
    durasi_menit: 12,
    ringkasan:
      'Memilih lokasi kemah, mendirikan tenda dengan benar, menata perkemahan regu, dan menjaga kebersihan selama kegiatan.',
    deskripsi:
      'Panduan praktis perkemahan: pemilihan lokasi, tata letak tapak kemah, pendirian tenda, dan pengelolaan sampah.',
    sumber: 'Wikipedia — Perkemahan',
    sumber_url: 'https://id.wikipedia.org/wiki/Berkemah',
    konten: `Perkemahan adalah kegiatan yang paling dikenang dari masa kepramukaan. Tetapi kenangan yang baik atau buruk sering ditentukan pada satu jam pertama — saat memilih lokasi dan mendirikan tenda. Tenda yang salah didirikan berarti tiga malam yang tidak nyaman.

## Memilih Lokasi Kemah

Perhatikan enam hal berikut, berurutan:

1. **Tanah datar dan agak meninggi.** Cekungan akan menjadi kubangan saat hujan.
2. **Dekat sumber air bersih,** tetapi **tidak di tepi sungai.** Air sungai bisa naik dalam hitungan menit saat hulu diguyur hujan.
3. **Jauh dari pohon mati atau dahan besar yang rapuh.** Dahan jatuh adalah penyebab kecelakaan berkemah yang serius.
4. **Bukan jalur air.** Perhatikan alur bekas aliran di tanah, dan tanda endapan di bebatuan.
5. **Terlindung dari angin kencang,** tetapi tetap berudara segar.
6. **Ada akses keluar yang jelas** untuk keadaan darurat.

## Mendirikan Tenda

1. **Bersihkan lahan** dari batu, ranting, dan akar menonjol. Batu sekecil apa pun akan terasa sepanjang malam.
2. **Bentangkan alas tenda,** pastikan tidak ada bagian yang terlipat.
3. **Dirikan rangka,** biasanya dimulai dari tiang utama.
4. **Pasang pasak dengan sudut 45 derajat** menjauhi tenda. Pasak yang tegak lurus akan mudah tercabut saat tali ditarik angin.
5. **Kencangkan tali** secara berpasangan dan berseberangan agar tarikannya seimbang.
6. **Buat parit di sekeliling tenda,** dengan saluran keluar menjauhi tenda. Ini menyelamatkan malammu saat hujan turun.
7. **Pasang lapisan luar (flysheet)** dan pastikan tidak menempel pada dinding dalam. Bila menempel, air akan merembes lewat titik sentuhnya.

## Tata Letak Tapak Kemah Regu

Perkemahan yang tertata bukan sekadar soal keindahan — ia menyangkut kebersihan dan keselamatan.

- **Tenda tidur** — di bagian paling dalam dan paling terlindung.
- **Dapur** — minimal 5 meter dari tenda, di arah bawah angin agar asap tidak masuk tenda.
- **Tempat sampah** — terpisah, tertutup, dan tidak dekat dapur.
- **Jemuran** — di tempat terbuka yang terkena matahari.
- **Gapura dan tiang bendera** — di bagian depan.
- **Jamban** — minimal 15 meter dari sumber air dan berada di posisi lebih rendah dari sumber air.

## Perlengkapan Pribadi

**Wajib:** seragam Pramuka, pakaian ganti secukupnya, jaket, jas hujan, sepatu lapangan, sandal, alat mandi, alat makan, alat ibadah, obat pribadi, senter, dan botol minum.

**Sangat dianjurkan:** matras atau alas tidur, sarung atau selimut, topi, tali kecil, buku catatan dan pensil.

**Dilarang:** benda tajam yang tidak diperlukan, barang berharga berlebihan, dan barang yang tidak masuk daftar tanpa izin pembina.

**Aturan sederhana yang selalu benar:** siapkan pakaian tidur yang dijaga tetap kering, dan jangan pernah memakainya di siang hari. Tidur dengan pakaian lembap adalah penyebab utama masuk angin di perkemahan.

## Kebersihan dan Kesehatan

1. **Cuci tangan sebelum makan.** Di perkemahan, diare menyebar cepat karena semua orang berbagi peralatan.
2. **Jangan berbagi alat makan dan botol minum.**
3. **Masak sampai benar-benar matang;** habiskan makanan pada hari yang sama.
4. **Simpan makanan dalam wadah tertutup** agar tidak didatangi semut dan tikus.
5. **Buang air besar di jamban,** atau gali lubang sedalam 20 cm lalu timbun kembali.
6. **Minum cukup,** meski tidak merasa haus. Dehidrasi ringan menyebabkan pusing dan mudah lelah.

## Prinsip Tidak Meninggalkan Jejak

Ini yang membedakan Pramuka dari sekadar orang yang berkemah.

1. **Rencanakan sebelum berangkat** — bawa hanya yang perlu, kurangi kemasan sekali pakai.
2. **Berkemah di tanah yang tahan** — jangan di atas tanaman muda atau lumut.
3. **Bawa pulang seluruh sampah,** termasuk sampah organik. Kulit pisang butuh berbulan-bulan untuk terurai dan mengganggu satwa.
4. **Tinggalkan apa yang ditemukan** — jangan mengambil batu, tanaman, atau memindahkan benda alam.
5. **Kelola api dengan hati-hati** — gunakan bekas perapian yang sudah ada, padamkan sampai benar-benar dingin, lalu ratakan kembali.
6. **Hormati satwa liar** — jangan memberi makan hewan liar; hewan yang terbiasa diberi makan menjadi berbahaya bagi pengunjung berikutnya.
7. **Hormati pengunjung lain** — jaga suara, terutama pada malam hari.

> Ukuran keberhasilan sebuah perkemahan sederhana: setelah regumu pergi, orang lain tidak bisa tahu bahwa di situ pernah ada perkemahan.

## Latihan Mandiri

1. Latih mendirikan dan membongkar tenda regu sampai bisa di bawah 15 menit.
2. Gambar rencana tapak kemah regumu lengkap dengan ukuran, sebelum kegiatan sesungguhnya.
3. Susun daftar perlengkapan pribadi, lalu timbang tasmu. Bila melebihi seperempat berat badanmu, kurangi isinya.`,
  },

  {
    slug: 'api-unggun',
    judul: 'Api Unggun — Teknik & Makna',
    kategori: 'survival',
    tingkatan: 'penggalang',
    urutan: 140,
    durasi_menit: 8,
    ringkasan:
      'Jenis susunan kayu api unggun, tata cara upacara api unggun, serta aturan keselamatan yang tidak boleh dilanggar.',
    deskripsi:
      'Materi api unggun: makna filosofis, empat bentuk susunan, tata upacara, dan prosedur pemadaman yang aman.',
    sumber: 'Wikipedia — Api unggun',
    sumber_url: 'https://id.wikipedia.org/wiki/Api_unggun',
    gambar: { cari: 'campfire bonfire night scouts', cadangan: 'Campfire.jpg' },
    konten: `Api unggun adalah puncak acara hampir setiap perkemahan. Tetapi di balik nyanyian dan pentas seni, api unggun punya makna yang lebih dalam — dan risiko yang nyata bila dikelola sembarangan.

## Makna Api Unggun

Dalam tradisi kepramukaan, nyala api melambangkan:

- **Cahaya** — pengetahuan yang menerangi dan menghalau kegelapan ketidaktahuan.
- **Panas** — semangat yang menghangatkan persaudaraan.
- **Bentuk yang selalu menjulang ke atas** — cita-cita yang terus meninggi.
- **Lingkaran di sekelilingnya** — kesetaraan. Di sekeliling api unggun, tidak ada yang duduk lebih tinggi dari yang lain.

## Empat Bentuk Susunan Kayu

#### 1. Susunan Piramida
Kayu disusun berlapis membentuk piramida, dari yang besar di bawah ke yang kecil di atas. Nyalanya tinggi dan tahan lama. Paling cocok untuk upacara api unggun besar.

#### 2. Susunan Kerucut (Tipi)
Kayu disandarkan saling bertemu di puncak membentuk kerucut. Cepat menyala karena aliran udaranya baik, tetapi cepat pula habis. Cocok untuk api pemanas dan memasak cepat.

#### 3. Susunan Pagar
Kayu disusun berselang-seling menyilang seperti pagar. Nyalanya merata dan stabil, baik untuk memasak.

#### 4. Susunan Bintang
Lima batang kayu besar disusun menyebar seperti bintang, dengan ujung-ujungnya bertemu di tengah. Kayu didorong ke tengah secara berkala saat terbakar. Hemat kayu dan bisa menyala semalaman — pilihan terbaik untuk perkemahan panjang.

## Tata Cara Upacara Api Unggun

1. **Persiapan** — kayu disusun sejak sore, sebelum gelap.
2. **Barisan melingkar** — seluruh peserta membentuk lingkaran mengelilingi tumpukan kayu.
3. **Penyalaan** — dilakukan pembina atau petugas yang ditunjuk, biasanya diiringi pembacaan Dasa Darma.
4. **Pembacaan Dasa Darma** — sepuluh anggota membawa obor, masing-masing membacakan satu butir.
5. **Sambutan pembina.**
6. **Pentas seni antar regu** — pentas, nyanyian, dan permainan.
7. **Renungan malam** — bagian paling bermakna: peserta diajak merenungkan perjalanan diri dan tanggung jawabnya.
8. **Pemadaman** — api dipadamkan bersama, ditandai lagu penutup.

## Aturan Keselamatan

Bagian ini tidak boleh dinegosiasikan.

1. **Minta izin pengelola lahan** sebelum menyalakan api. Di banyak kawasan konservasi, api unggun dilarang total.
2. **Buat sekat api** — gali parit atau susun batu melingkar, dengan jarak minimal 2 meter dari benda mudah terbakar.
3. **Jarak minimal 5 meter dari tenda.** Percikan bara dapat melubangi tenda dalam hitungan detik.
4. **Jangan menyalakan api di bawah dahan pohon** yang menjulur.
5. **Siapkan air dan pasir** di dekat lokasi sebelum api dinyalakan, bukan sesudahnya.
6. **Dilarang memakai bensin, spiritus, atau bahan bakar cair** untuk menyalakan atau membesarkan api. Uapnya dapat menyambar balik dan menyebabkan luka bakar berat. Ini penyebab kecelakaan api unggun yang paling sering terjadi.
7. **Jangan tinggalkan api tanpa pengawasan,** meski sebentar.
8. **Jangan melompati api unggun.**
9. **Rambut panjang diikat,** pakaian berbahan sintetis dihindari karena mudah meleleh.
10. **Selalu ada satu orang bertugas mengawasi api** sepanjang acara.

## Cara Memadamkan dengan Benar

Ini tahap yang paling sering dikerjakan asal-asalan, padahal justru paling menentukan.

1. **Berhenti menambah kayu** sekitar 30 menit sebelum acara berakhir.
2. **Sebarkan bara** dengan tongkat agar cepat dingin.
3. **Siram dengan air perlahan,** sambil terus diaduk.
4. **Aduk dan siram berulang** sampai tidak terdengar bunyi mendesis lagi.
5. **Periksa dengan punggung tangan** dari jarak dekat — bila masih terasa panas, siram lagi.
6. **Kembalikan tanah dan dedaunan** ke lokasi seperti semula.

> Bara yang tampak mati bisa menyala kembali berjam-jam kemudian ketika tertiup angin. Sejumlah kebakaran hutan besar bermula dari perapian yang "sudah dipadamkan". Padamkan sampai dingin — bukan sampai tidak terlihat apinya.

## Latihan Mandiri

1. Latih menyusun empat bentuk api unggun tanpa menyalakannya.
2. Susun rencana pentas seni regu untuk acara api unggun berikutnya.
3. Hafalkan sepuluh butir Dasa Darma sampai bisa dibacakan tanpa teks.`,
  },
];
