import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

/**
 * Penghalus gulir untuk desktop / roda tetikus.
 * Pada perangkat layar sentuh (ponsel/tablet), gulir dibiarkan 100% natif bawaan sistem
 * operasi agar memanfaatkan akselerasi GPU 60Hz/120Hz tanpa tersendat sedikit pun.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Lewati inisialisasi pada perangkat sentuh agar performa gulir di ponsel sangat lancar
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
    });

    return () => lenis.destroy();
  }, [isAdmin]);

  return <>{children}</>;
}
