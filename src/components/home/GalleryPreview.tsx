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
    <section className="py-20 lg:py-28 bg-cream-bg relative border-t-2 border-b-2 border-brand-dark/10">
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
            className="px-8 py-4 bg-brand-green text-white font-kids font-bold text-sm sm:text-base rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-2"
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
      <div className="group relative overflow-hidden rounded-3xl border-4 border-brand-dark aspect-[4/3] bg-cream-dark w-full shadow-[4px_4px_0_#2A1B15] cursor-pointer">
        <img
          src={item.foto_url}
          alt={item.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Floating details box on hover */}
        <div className="absolute bottom-3 left-3 right-3 bg-white border-2 border-brand-dark rounded-2xl p-3 shadow-[3px_3px_0_#2A1B15] transform translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
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
      <div className="group bg-white rounded-3xl border-4 border-brand-dark overflow-hidden w-full shadow-[6px_6px_0_#2A1B15] flex flex-col">
        <div className="h-64 overflow-hidden border-b-4 border-brand-dark bg-cream-dark relative">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-brand-yellow text-brand-dark border-2 border-brand-dark px-3 py-1 rounded-full text-xs font-kids font-bold">
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
