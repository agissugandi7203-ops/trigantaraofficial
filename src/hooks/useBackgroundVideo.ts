import { useEffect, useRef, useState } from 'react';

/**
 * Video latar yang hemat sumber daya: perulangan ditangani atribut `loop`
 * bawaan, pemutaran dihentikan saat video keluar layar atau tab tidak aktif,
 * dan dilewati bila pengguna memilih mengurangi gerakan atau hemat data.
 */
export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sebagian peramban seluler mengekspos preferensi hemat data pengguna.
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;

    if (prefersReducedMotion || saveData) {
      // Tidak memutar apa pun: latar tetap berupa warna solid. Ini bukan
      // kegagalan — ini menghormati pilihan pengguna.
      return;
    }

    let cancelled = false;

    const play = () => {
      // Autoplay bisa ditolak (mis. kebijakan hemat baterai). Itu wajar dan
      // tidak boleh memunculkan galat di konsol pengguna.
      video.play().catch(() => undefined);
    };

    const handleReady = () => {
      if (!cancelled) setIsReady(true);
    };

    if (video.readyState >= 3) handleReady();
    video.addEventListener('canplay', handleReady, { once: true });

    // Hentikan pemutaran saat video tidak terlihat: menghemat CPU dan baterai
    // ketika pengunjung sudah menggulir jauh ke bawah halaman.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.01 }
    );
    observer.observe(video);

    const handleVisibility = () => {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0) play();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      video.removeEventListener('canplay', handleReady);
      video.pause();
    };
  }, []);

  return { videoRef, isReady };
}
