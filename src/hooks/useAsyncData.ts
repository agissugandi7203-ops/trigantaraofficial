import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T;
  loading: boolean;
  /** Pesan siap tampil dalam Bahasa Indonesia, atau null bila tidak ada galat. */
  error: string | null;
  /** Memuat ulang secara manual — dipakai tombol "Coba lagi". */
  reload: () => void;
}

/**
 * Pemuat data dengan penanganan galat, pembatalan, dan penjagaan urutan hasil.
 * Galat dibedakan dari keadaan kosong supaya halaman tidak menampilkan
 * "belum ada data" padahal koneksinya yang bermasalah.
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList,
  initialValue: T
): AsyncState<T> {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const latestRequest = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++latestRequest.current;

    setLoading(true);
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (controller.signal.aborted || requestId !== latestRequest.current) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || requestId !== latestRequest.current) return;
        console.error('[Trigantara] Gagal memuat data:', err);
        setError(describeError(err));
      })
      .finally(() => {
        if (controller.signal.aborted || requestId !== latestRequest.current) return;
        setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  return { data, loading, error, reload };
}

/**
 * Menerjemahkan galat teknis menjadi kalimat yang berguna bagi pengunjung.
 * Pesan asli tetap dicatat di konsol untuk keperluan penelusuran.
 */
function describeError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (/Failed to fetch|NetworkError|ERR_INTERNET|ERR_NETWORK/i.test(message)) {
    return 'Koneksi internet terputus. Periksa jaringan Anda lalu coba lagi.';
  }
  if (/JWT|token|Invalid API key/i.test(message)) {
    return 'Sesi ke server data tidak sah. Muat ulang halaman ini.';
  }
  if (/timeout|timed out/i.test(message)) {
    return 'Server terlalu lama merespons. Silakan coba beberapa saat lagi.';
  }
  if (/5\d\d|Web server is down|unavailable/i.test(message)) {
    return 'Server data sedang tidak dapat dihubungi. Coba lagi beberapa menit lagi.';
  }
  return 'Data gagal dimuat. Silakan coba lagi.';
}
