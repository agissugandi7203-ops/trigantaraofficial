import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Nama bagian yang dijaga — muncul di log agar mudah ditelusuri. */
  area?: string;
}

interface State {
  error: Error | null;
}

/**
 * Menangkap galat render agar satu komponen yang gagal tidak membuat
 * seluruh halaman menjadi putih kosong.
 */
export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[Trigantara] Galat pada ${this.props.area ?? 'aplikasi'}:`, error, info.componentStack);

    // Otomatis pulihkan jika terjadi kegagalan modul chunk akibat pembaruan versi baru di server
    const isChunkError =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('MIME type of "text/html"') ||
      error.message?.includes('error loading dynamically imported module');

    if (isChunkError) {
      const storageKey = 'boundary_chunk_reload_' + window.location.pathname;
      const lastReload = sessionStorage.getItem(storageKey);
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem(storageKey, String(now));
        window.location.reload();
      }
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-cream-bg">
        <div className="bg-white border-4 border-brand-dark rounded-[2rem] p-8 sm:p-10 shadow-[8px_8px_0_#2A1B15] max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-brand-orange" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-black text-brand-dark">
              Ada yang tidak beres di halaman ini
            </h2>
            <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
              Maaf, bagian ini gagal ditampilkan. Sisa website tetap dapat digunakan seperti biasa.
              Silakan muat ulang halaman, atau kembali ke beranda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-2.5 bg-brand-orange text-white rounded-full text-xs font-kids font-bold border-2 border-brand-dark shadow-[3px_3px_0_#2A1B15] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang</span>
            </button>
            <a
              href="/"
              className="px-6 py-2.5 bg-white text-brand-dark rounded-full text-xs font-kids font-bold border-2 border-brand-dark shadow-[3px_3px_0_#2A1B15] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Ke Beranda</span>
            </a>
          </div>

          {import.meta.env.DEV && (
            <pre className="text-left text-[10px] bg-cream-dark border border-brand-dark/15 rounded-xl p-3 overflow-auto max-h-40 text-brand-dark/70">
              {error.stack ?? error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
