import type { ComponentType } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

/** Tampilan status bersama: sedang memuat, gagal memuat, dan kosong. */

/** Cakram berputar sederhana untuk masa tunggu singkat. */
export function LoadingState({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <div className="w-8 h-8 border-4 border-brand-dark/15 border-t-brand-orange rounded-full animate-spin" />
      <p className="text-xs font-kids font-bold text-brand-dark/50">{label}</p>
    </div>
  );
}

/**
 * Kerangka kartu (skeleton) untuk daftar.
 * Lebih nyaman dipandang daripada cakram berputar karena bentuk halaman sudah
 * terlihat sejak awal, sehingga isi tidak "melompat" saat data tiba.
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-cream-card rounded-[2rem] border border-brand-dark/10 overflow-hidden shadow-soft"
        >
          <div className="h-44 bg-brand-dark/5 animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-24 bg-brand-dark/5 rounded-full animate-pulse" />
            <div className="h-5 w-3/4 bg-brand-dark/10 rounded-full animate-pulse" />
            <div className="h-3 w-full bg-brand-dark/5 rounded-full animate-pulse" />
            <div className="h-3 w-5/6 bg-brand-dark/5 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Kotak galat dengan tombol coba lagi. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="bg-white p-8 md:p-10 rounded-[2rem] border-2 border-brand-orange/30 shadow-soft max-w-md mx-auto text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto">
        <WifiOff className="w-8 h-8 text-brand-orange" />
      </div>
      <h3 className="font-serif text-xl font-bold text-brand-dark">Gagal memuat data</h3>
      <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2.5 bg-brand-orange text-white rounded-full text-xs font-kids font-bold shadow-soft hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}

/** Kotak "belum ada isi" — keadaan normal, bukan kegagalan. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-brand-dark/15 shadow-soft max-w-md mx-auto text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-brand-yellow/15 border border-brand-dark/10 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8 text-brand-orange" />
      </div>
      <h3 className="font-serif text-xl font-bold text-brand-dark">{title}</h3>
      <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
