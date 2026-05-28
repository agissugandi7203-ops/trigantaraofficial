import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SectionHeading from '../shared/SectionHeading';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { GalleryItem } from '../../types';

const FALLBACK_IMAGES = [
  { url: '/assets/angkatan/2025-2026/fotobersama26.webp', title: 'Angkatan 2025-2026' },
  { url: '/assets/angkatan/2026-2027/fotobersama27.webp', title: 'Angkatan 2026-2027' },
];

export default function GalleryPreview() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      setItems(data || []);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  const hasData = items.length > 0;

  return (
    <section className="py-20 lg:py-28 bg-cream-bg relative border-t border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Galeri Momen"
          title="Kenangan Tak Terlupakan"
          subtitle="Dokumentasi kegiatan dan kebersamaan anggota Pramuka Trigantara."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
          </div>
        ) : hasData ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {FALLBACK_IMAGES.map((img, i) => (
              <FallbackCard key={img.url} image={img} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/galeri"
            className="px-8 py-4 bg-brand-green text-white font-kids font-bold text-sm sm:text-base rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Buka Galeri Foto Lengkap</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-scale-in stagger-${index + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <div className="group relative overflow-hidden rounded-[2rem] border border-brand-dark/15 aspect-[4/3] bg-cream-dark w-full shadow-soft hover:shadow-soft-lg cursor-pointer transition-[transform,box-shadow] duration-300">
        <img
          src={item.foto_url}
          alt={item.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
          loading="lazy"
        />
        
        {/* Floating details box on hover */}
        <div className="absolute bottom-3 left-3 right-3 bg-white border border-brand-dark/10 rounded-2xl p-3 shadow-soft transform translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
          <p className="text-brand-dark font-kids font-bold text-xs sm:text-sm line-clamp-1">{item.judul}</p>
          {item.kategori && (
            <p className="text-brand-orange font-kids font-bold text-[10px] uppercase mt-0.5">{item.kategori}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FallbackCard({ image, index }: { image: typeof FALLBACK_IMAGES[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-scale-in stagger-${index + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <div className="group bg-white rounded-[2rem] border border-brand-dark/15 overflow-hidden w-full shadow-soft hover:shadow-soft-lg transition-[transform,box-shadow] duration-300 flex flex-col">
        <div className="h-64 overflow-hidden border-b border-brand-dark/10 bg-cream-dark relative">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 will-change-transform"
          />
          <div className="absolute top-3 left-3 bg-brand-yellow text-brand-dark border border-brand-dark/10 shadow-soft px-3 py-1 rounded-full text-xs font-kids font-bold">
            Dokumentasi Gudep
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-center">
          <h4 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
            {image.title}
          </h4>
          <p className="text-xs sm:text-sm text-brand-dark/70 font-sans mt-1">
            Foto bersama angkatan aktif Pramuka Trigantara.
          </p>
        </div>
      </div>
    </div>
  );
}
