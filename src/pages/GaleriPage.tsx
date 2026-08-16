import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { supabase, query } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import SubpageHeader from '../components/shared/SubpageHeader';
import { CardSkeleton, EmptyState, ErrorState } from '../components/shared/StateViews';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import { KATEGORI_GALERI } from '../data/constants';
import type { GalleryItem } from '../types';

const DOKUMENTASI_ANGKATAN = [
  { url: '/assets/angkatan/2025-2026/fotobersama26.webp', label: 'Angkatan 2025 – 2026' },
  { url: '/assets/angkatan/2026-2027/fotobersama27.webp', label: 'Angkatan 2026 – 2027' },
];

export default function GaleriPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const activeFilter = searchParams.get('filter') ?? 'semua';

  useSeo({
    title: 'Galeri Foto',
    description:
      'Dokumentasi perkemahan, lomba, latihan rutin, dan bakti sosial Gugus Depan Trigantara — Pramuka SMK Marhas Margahayu.',
    path: '/galeri',
  });

  const fetchGallery = useCallback(
    (signal: AbortSignal) => {
      let builder = supabase
        .from('gallery')
        .select('*')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false })
        .abortSignal(signal);

      if (activeFilter !== 'semua') builder = builder.eq('kategori', activeFilter);
      return query<GalleryItem[]>(builder);
    },
    [activeFilter]
  );

  const { data: items, loading, error, reload } = useAsyncData<GalleryItem[]>(
    fetchGallery,
    [activeFilter],
    []
  );

  // Lightbox harus bisa ditutup dengan Esc, dan halaman di belakangnya
  // tidak boleh ikut tergulir saat lightbox terbuka.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      <SubpageHeader
        badge="Dokumentasi Kegiatan"
        title="Galeri Foto"
        subtitle="Momen-momen berkesan bersama Pramuka Trigantara."
        bgVariant="yellow"
        modelImage="/assets/model/afika.webp"
        modelName="Afika"
        modelAlign="left"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Saring galeri" className="flex flex-wrap gap-3 mb-12 justify-center">
            <FilterBtn label="Semua" value="semua" active={activeFilter} onSelect={setSearchParams} />
            {KATEGORI_GALERI.map((k) => (
              <FilterBtn
                key={k.value}
                label={k.label}
                value={k.value}
                active={activeFilter}
                onSelect={setSearchParams}
              />
            ))}
          </nav>

          {loading ? (
            <CardSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : items.length === 0 ? (
            <GaleriKosong />
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {items.map((item, i) => (
                <GaleriCard
                  key={item.id}
                  item={item}
                  index={i}
                  onOpen={() => setLightbox({ url: item.foto_url, title: item.judul })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white border-2 border-brand-dark rounded-3xl p-4 shadow-soft-xl relative max-w-4xl max-h-[90vh] flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Tutup gambar"
              autoFocus
              className="absolute -top-3 -right-3 w-10 h-10 bg-brand-orange text-white rounded-full border-2 border-brand-dark flex items-center justify-center shadow-soft hover:scale-105 transition-transform cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="overflow-hidden rounded-2xl border border-brand-dark/15 max-h-[75vh]">
              <img
                src={getR2PublicUrl(lightbox.url)}
                alt={lightbox.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>
            {lightbox.title && (
              <p className="pt-4 text-center text-brand-dark font-kids font-bold text-base">
                {lightbox.title}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function FilterBtn({
  label,
  value,
  active,
  onSelect,
}: {
  label: string;
  value: string;
  active: string;
  onSelect: (params: Record<string, string>, opts?: { replace?: boolean }) => void;
}) {
  const isActive = active === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value === 'semua' ? {} : { filter: value }, { replace: true })}
      aria-pressed={isActive}
      className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border transition-all cursor-pointer ${
        isActive
          ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
          : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/25'
      }`}
    >
      {label}
    </button>
  );
}

function GaleriCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-scale-in stagger-${(index % 5) + 1} ${isVisible ? 'visible' : ''} break-inside-avoid`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Perbesar foto: ${item.judul}`}
        className="group relative overflow-hidden rounded-[2rem] border border-brand-dark/15 bg-cream-dark cursor-zoom-in shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 w-full block text-left"
      >
        <img
          src={getR2PublicUrl(item.foto_url)}
          alt={item.judul}
          loading="lazy"
          decoding="async"
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-3 left-3 right-3 bg-white border border-brand-dark/10 rounded-2xl p-2.5 shadow-soft translate-y-[120%] group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 pointer-events-none block">
          <span className="text-brand-dark font-kids font-bold text-xs sm:text-sm line-clamp-1 block">
            {item.judul}
          </span>
          {item.kategori && (
            <span className="text-brand-orange font-kids font-bold text-[9px] uppercase mt-0.5 block">
              {item.kategori}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

function GaleriKosong() {
  return (
    <div className="space-y-12">
      <EmptyState
        icon={Camera}
        title="Belum ada foto di galeri"
        description="Dokumentasi kegiatan akan segera diunggah pengurus. Sementara itu, berikut foto bersama angkatan kami."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {DOKUMENTASI_ANGKATAN.map((img) => (
          <figure
            key={img.url}
            className="bg-white rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-300 flex flex-col group"
          >
            <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark relative">
              <img
                src={img.url}
                alt={`Foto bersama ${img.label}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-brand-yellow text-brand-dark border border-brand-dark/10 px-3 py-1 rounded-full text-xs font-kids font-bold shadow-soft">
                Pramuka Marhas
              </span>
            </div>
            <figcaption className="p-5 text-left">
              <h3 className="font-serif text-xl font-bold text-brand-dark">{img.label}</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans mt-1">
                Foto kenang-kenangan bersama pengurus dan anggota Pramuka.
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
