import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase, query } from '../../lib/supabase';
import { getR2PublicUrl } from '../../lib/r2';
import SectionHeading from '../shared/SectionHeading';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { GalleryListItem } from '../../types';

const CADANGAN = [
  { url: '/assets/angkatan/2025-2026/fotobersama26.webp', title: 'Angkatan 2025 – 2026' },
  { url: '/assets/angkatan/2026-2027/fotobersama27.webp', title: 'Angkatan 2026 – 2027' },
];

export default function GalleryPreview() {
  const fetchGallery = useCallback(
    (signal: AbortSignal) =>
      query<GalleryListItem[]>(
        supabase
          .from('gallery')
          .select('id, judul, foto_url, kategori')
          .order('urutan', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(6)
          .abortSignal(signal)
      ),
    []
  );

  // Galeri kosong maupun gagal dimuat sama-sama menampilkan foto angkatan
  // sebagai cadangan — beranda tidak boleh terlihat rusak karenanya.
  const { data: items, loading } = useAsyncData<GalleryListItem[]>(fetchGallery, [], []);

  return (
    <section className="py-20 lg:py-28 bg-cream-bg relative border-t border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Galeri Momen"
          title="Kenangan Tak Terlupakan"
          subtitle="Dokumentasi kegiatan dan kebersamaan anggota Pramuka Trigantara."
        />

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-[2rem] bg-brand-dark/5 border border-brand-dark/10 animate-pulse"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CADANGAN.map((img, i) => (
              <FallbackCard key={img.url} image={img} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/galeri"
            className="px-8 py-4 bg-brand-green text-white font-kids font-bold text-sm sm:text-base rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            Buka Galeri Foto Lengkap <span aria-hidden="true">➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index }: { item: GalleryListItem; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-scale-in stagger-${(index % 5) + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <Link
        to="/galeri"
        className="group relative overflow-hidden rounded-[2rem] border border-brand-dark/15 aspect-[4/3] bg-cream-dark w-full shadow-soft hover:shadow-soft-lg transition-[transform,box-shadow] duration-300 block"
      >
        <img
          src={getR2PublicUrl(item.foto_url)}
          alt={item.judul}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-3 left-3 right-3 bg-white border border-brand-dark/10 rounded-2xl p-3 shadow-soft translate-y-[120%] group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 pointer-events-none block">
          <span className="text-brand-dark font-kids font-bold text-xs sm:text-sm line-clamp-1 block">
            {item.judul}
          </span>
          {item.kategori && (
            <span className="text-brand-orange font-kids font-bold text-[10px] uppercase mt-0.5 block">
              {item.kategori}
            </span>
          )}
        </span>
      </Link>
    </div>
  );
}

function FallbackCard({ image, index }: { image: (typeof CADANGAN)[number]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-scale-in stagger-${index + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <figure className="group bg-white rounded-[2rem] border border-brand-dark/15 overflow-hidden w-full shadow-soft hover:shadow-soft-lg transition-shadow duration-300 flex flex-col">
        <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark relative">
          <img
            src={image.url}
            alt={`Foto bersama ${image.title}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-brand-yellow text-brand-dark border border-brand-dark/10 shadow-soft px-3 py-1 rounded-full text-xs font-kids font-bold">
            Dokumentasi Gudep
          </span>
        </div>
        <figcaption className="p-5 flex-1 flex flex-col justify-center">
          <h3 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
            {image.title}
          </h3>
          <p className="text-xs sm:text-sm text-brand-dark/70 font-sans mt-1">
            Foto bersama angkatan aktif Pramuka Trigantara.
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
