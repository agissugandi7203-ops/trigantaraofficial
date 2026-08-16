import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const UA = 'TrigantaraWebsite/1.0 (https://trigantara.web.id) node-fetch';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

export interface HasilGambar {
  url: string;
  sumberHalaman: string;
  lisensi: string;
  penulis: string;
}

interface KandidatCommons {
  namaBerkas: string;
  urlUnduh: string;
  lisensi: string;
  penulis: string;
  lebar: number;
}

function bersihkanHtml(value: string | undefined): string {
  if (!value) return '';
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

/** Lisensi yang boleh dipakai ulang selama sumbernya dicantumkan. */
const LISENSI_DIIZINKAN = /^(cc[ -]|public domain|pd|gfdl|cc0)/i;

async function cariDiCommons(term: string, lebar = 1200): Promise<KandidatCommons[]> {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap|drawing ${term}`,
    gsrlimit: '8',
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    iiurlwidth: String(lebar),
  }).toString();

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];

  const json = (await res.json()) as {
    query?: { pages?: Record<string, any> };
  };

  const pages = Object.values(json.query?.pages ?? {});

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info?.thumburl) return null;
      const meta = info.extmetadata ?? {};
      return {
        namaBerkas: String(page.title ?? '').replace(/^File:/, ''),
        // Parameter pelacakan dibuang agar URL tetap bersih dan stabil.
        urlUnduh: String(info.thumburl).split('?')[0]!,
        lisensi: bersihkanHtml(meta.LicenseShortName?.value) || 'Tidak diketahui',
        penulis: bersihkanHtml(meta.Artist?.value) || 'Wikimedia Commons',
        lebar: Number(info.thumbwidth ?? info.width ?? 0),
      } satisfies KandidatCommons;
    })
    .filter((k): k is KandidatCommons => k !== null)
    .filter((k) => LISENSI_DIIZINKAN.test(k.lisensi))
    .filter((k) => k.lebar >= 500)
    .filter((k) => /\.(jpe?g|png|webp|svg)$/i.test(k.namaBerkas));
}

async function ambilBerkasCommons(namaBerkas: string, lebar = 1200): Promise<KandidatCommons | null> {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: `File:${namaBerkas}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(lebar),
  }).toString();

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;

  const json = (await res.json()) as { query?: { pages?: Record<string, any> } };
  const page = Object.values(json.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl) return null;

  const meta = info.extmetadata ?? {};
  return {
    namaBerkas,
    urlUnduh: String(info.thumburl).split('?')[0]!,
    lisensi: bersihkanHtml(meta.LicenseShortName?.value) || 'Tidak diketahui',
    penulis: bersihkanHtml(meta.Artist?.value) || 'Wikimedia Commons',
    lebar: Number(info.thumbwidth ?? 0),
  };
}

export interface KonfigurasiR2 {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

/**
 * Mengunduh gambar dari Wikimedia Commons lalu menyimpannya ke bucket R2
 * milik Gudep sendiri.
 *
 * Alasan tidak menautkan langsung ke Commons: tautan pihak ketiga bisa
 * berubah atau dihapus kapan saja, dan menautkan langsung ke server mereka
 * juga membebani infrastruktur yayasan nirlaba. Menyimpan salinannya membuat
 * gambar tetap ada selama bucket ini ada, sekaligus dilayani lewat CDN
 * Cloudflare sehingga jauh lebih cepat bagi pengunjung di Indonesia.
 */
export class PenyimpanGambar {
  private s3: S3Client;

  constructor(private cfg: KonfigurasiR2, private prefix = 'konten') {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    });
  }

  private async sudahAda(key: string): Promise<boolean> {
    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.cfg.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }

  async simpan(
    slug: string,
    cari: string,
    cadangan?: string
  ): Promise<HasilGambar | null> {
    let kandidat: KandidatCommons | null = null;

    const hasil = await cariDiCommons(cari);
    kandidat = hasil[0] ?? null;

    if (!kandidat && cadangan) {
      kandidat = await ambilBerkasCommons(cadangan);
    }
    if (!kandidat) return null;

    const ekstensi = (kandidat.urlUnduh.split('.').pop() ?? 'jpg').toLowerCase();
    const key = `${this.prefix}/${slug}.${ekstensi}`;
    const urlPublik = `${this.cfg.publicUrl}/${key}`;

    // Berkas yang sudah pernah diunggah tidak diunduh ulang, sehingga skrip
    // ini aman dijalankan berkali-kali.
    if (await this.sudahAda(key)) {
      return {
        url: urlPublik,
        sumberHalaman: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(kandidat.namaBerkas)}`,
        lisensi: kandidat.lisensi,
        penulis: kandidat.penulis,
      };
    }

    const unduh = await fetch(kandidat.urlUnduh, { headers: { 'User-Agent': UA } });
    if (!unduh.ok) return null;

    const buffer = Buffer.from(await unduh.arrayBuffer());
    const tipe = unduh.headers.get('content-type') ?? 'image/jpeg';

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.cfg.bucket,
        Key: key,
        Body: buffer,
        ContentType: tipe,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return {
      url: urlPublik,
      sumberHalaman: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(kandidat.namaBerkas)}`,
      lisensi: kandidat.lisensi,
      penulis: kandidat.penulis,
    };
  }
}
