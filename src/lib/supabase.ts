import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Trigantara] Supabase belum dikonfigurasi. ' +
    'Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase Keep-Alive — ping database setiap hari
 * Mencegah project Supabase auto-pause karena inactivity.
 * Dipanggil dari server.ts via cron schedule.
 */
export async function keepAlive(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_settings')
      .select('key')
      .limit(1);
    
    if (error) {
      console.error('[Keep-Alive] Gagal ping Supabase:', error.message);
      return false;
    }
    
    console.log('[Keep-Alive] Supabase berhasil di-ping pada', new Date().toISOString());
    return true;
  } catch (err) {
    console.error('[Keep-Alive] Error:', err);
    return false;
  }
}
