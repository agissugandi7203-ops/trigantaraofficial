import { createClient } from '@supabase/supabase-js';

/**
 * Nilai konfigurasi dibaca dari dua sumber:
 *
 *  - `import.meta.env` — disematkan Vite saat proses build. Dipakai di
 *    lingkungan pengembangan lokal.
 *  - `window.ENV` — disuntikkan server ke dalam HTML saat permintaan tiba.
 *    Dipakai di produksi, sehingga URL dan kunci dapat diganti lewat variabel
 *    lingkungan Cloud Run TANPA perlu membangun ulang seluruh frontend.
 */
interface RuntimeEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_R2_PUBLIC_URL?: string;
}

function readEnv(key: keyof RuntimeEnv): string {
  const buildTime = import.meta.env[key] as string | undefined;
  const runtime = (window as Window & { ENV?: RuntimeEnv }).ENV?.[key];
  return buildTime || runtime || '';
}

const supabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    '[Trigantara] Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan ' +
      'VITE_SUPABASE_ANON_KEY pada berkas .env (lokal) atau variabel lingkungan (produksi).'
  );
}

/**
 * Klien dibuat meski konfigurasi kosong, memakai URL contoh.
 *
 * Alasannya: `createClient` melempar galat bila URL tidak valid, dan galat itu
 * terjadi saat modul dimuat — sebelum ErrorBoundary sempat terpasang —
 * sehingga menghasilkan halaman putih total tanpa penjelasan. Dengan cara ini,
 * website tetap tampil dan setiap bagian yang memerlukan data menampilkan
 * pesan galat yang jelas.
 */
export const supabase = createClient(
  supabaseUrl || 'https://konfigurasi-belum-diisi.supabase.co',
  supabaseAnonKey || 'kunci-belum-diisi',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: { 'x-application-name': 'trigantara-web' },
    },
  }
);

/**
 * Menjalankan kueri Supabase dan melempar galat bila gagal.
 *
 * Supabase mengembalikan `{ data, error }` alih-alih melempar. Pola itu mudah
 * membuat galat terlewat begitu saja — dan memang itulah yang terjadi di
 * seluruh halaman sebelum perbaikan ini. Pembungkus ini memaksa kegagalan
 * menjadi galat sungguhan sehingga tertangkap `useAsyncData`.
 */
export async function query<T>(
  builder: PromiseLike<{ data: unknown; error: { message: string } | null }>
): Promise<T> {
  const { data, error } = await builder;
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
}
