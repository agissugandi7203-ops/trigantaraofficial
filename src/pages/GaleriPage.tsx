import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { KATEGORI_GALERI } from '../data/constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { GalleryItem } from '../types';
import { Camera, X } from 'lucide-react';

export default function GaleriPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const activeFilter = searchParams.get('filter') || 'semua';

  useEffect(() => {
    async function fetch() {
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (activeFilter !== 'semua') query = query.eq('kategori', activeFilter);
      const { data } = await query;
      setItems(data || []);
      setLoading(false);
    }
    fetch();
  }, [activeFilter]);

  const openLightbox = (url: string, title: string) => {
    setLightboxUrl(url);
    setLightboxTitle(title);
  };

  return (
    <main className="pt-24 min-h-screen bg-cream-bg text-brand-dark">
      {/* Hero Banner */}
      <section className="bg-brand-orange py-16 lg:py-20 text-center border-b-4 border-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-5 left-10 text-4xl opacity-15">📸</div>
          <div className="absolute bottom-5 right-10 text-4xl opacity-15">⛺</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-kids font-bold uppercase bg-brand-yellow text-brand-dark border-2 border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)] mb-4">
            Dokumentasi Kegiatan
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">Galeri Foto</h1>
          <p className="text-[#FAF6F0] text-sm sm:text-lg max-w-xl mx-auto font-sans font-medium opacity-90">Dokumentasi momen-momen berkesan bersama Pramuka Trigantara.</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <FilterBtn label="Semua" value="semua" active={activeFilter} onClick={(v) => setSearchParams(v === 'semua' ? {} : { filter: v })} />
            {KATEGORI_GALERI.map((k) => (
              <FilterBtn key={k.value} label={k.label} value={k.value} active={activeFilter} onClick={(v) => setSearchParams({ filter: v })} />
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <EmptyGallery />
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {items.map((item, i) => (
                <GaleriCard key={item.id} item={item} index={i} onClick={() => openLightbox(item.foto_url, item.judul)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <div 
            className="bg-white border-4 border-brand-dark rounded-3xl p-4 shadow-[8px_8px_0_#2A1B15] relative max-w-4xl max-h-[90vh] flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute -top-3 -right-3 w-10 h-10 bg-brand-orange text-white rounded-full border-2 border-brand-dark flex items-center justify-center font-bold shadow-[2px_2px_0_#2A1B15] hover:scale-105 active:translate-y-[1px] cursor-pointer"
              onClick={() => setLightboxUrl(null)}
              aria-label="Tutup"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="overflow-hidden rounded-2xl border-2 border-brand-dark max-h-[75vh]">
              <img
                src={lightboxUrl}
                alt={lightboxTitle}
                className="w-full h-full object-contain bg-cream-dark"
              />
            </div>
            {lightboxTitle && (
              <div className="pt-4 text-center">
                <p className="text-brand-dark font-kids font-bold text-base">{lightboxTitle}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function FilterBtn({ label, value, active, onClick }: { label: string; value: string; active: string; onClick: (v: string) => void }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border-2 transition-all cursor-pointer ${
        isActive
          ? 'bg-brand-dark text-white border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)]'
          : 'bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark'
      }`}
    >
      {label}
    </button>
  );
}

function GaleriCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`animate-scale-in stagger-${(index % 5) + 1} ${isVisible ? 'visible' : ''} break-inside-avoid`}>
      <div className="group relative overflow-hidden rounded-3xl border-4 border-brand-dark bg-cream-dark cursor-pointer shadow-[4px_4px_0_#2A1B15] hover:-translate-y-1 transition-all w-full" onClick={onClick}>
        <img src={item.foto_url} alt={item.judul} className="w-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
        
        {/* Floating detail popup */}
        <div className="absolute bottom-3 left-3 right-3 bg-white border-2 border-brand-dark rounded-2xl p-2.5 shadow-[3px_3px_0_#2A1B15] transform translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
          <p className="text-brand-dark font-kids font-bold text-xs sm:text-sm line-clamp-1">{item.judul}</p>
          {item.kategori && (
            <p className="text-brand-orange font-kids font-bold text-[9px] uppercase mt-0.5">{item.kategori}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="text-center py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8 text-brand-orange animate-pulse" />
        </div>
        <h3 className="font-serif text-xl font-bold text-brand-dark">Belum ada foto di galeri</h3>
        <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
          Foto kegiatan akan segera diupload oleh admin Gudep. Sebagai gantinya, berikut dokumentasi angkatan kami:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
        {[
          { url: '/assets/angkatan/2025-2026/fotobersama26.webp', label: 'Angkatan 2025-2026' },
          { url: '/assets/angkatan/2026-2027/fotobersama27.webp', label: 'Angkatan 2026-2027' },
        ].map((img) => (
          <div key={img.url} className="bg-white rounded-3xl border-4 border-brand-dark overflow-hidden shadow-[6px_6px_0_#2A1B15] flex flex-col group">
            <div className="h-64 overflow-hidden border-b-4 border-brand-dark bg-cream-dark relative">
              <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-brand-yellow text-brand-dark border-2 border-brand-dark px-3 py-1 rounded-full text-xs font-kids font-bold shadow-[2px_2px_0_#2A1B15]">
                Pramuka Marhas
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center text-left">
              <h4 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                {img.label}
              </h4>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans mt-1">
                Foto kenang-kenangan bersama pengurus dan anggota Pramuka.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
