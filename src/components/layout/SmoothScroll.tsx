import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Disable smooth scrolling on admin panel to keep interactions standard and responsive
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis with smooth desktop configurations
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // Sync ScrollTrigger updates with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker frame callback with Lenis RAF loop for 60fps/120fps sync
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, [location.pathname]);

  return <>{children}</>;
}
