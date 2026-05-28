import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/shared/SectionHeading';
import SubpageHeader from '../components/shared/SubpageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { KATEGORI_MATERI } from '../data/constants';
import type { Material } from '../types';
import { Compass, BookOpen, Download } from 'lucide-react';

export default function MateriPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const activeFilter = searchParams.get('filter') || 'semua';

  useEffect(() => {
    async function fetch() {
      let query = supabase.from('materials').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (activeFilter !== 'semua') {
        query = query.eq('kategori', activeFilter);
      }
      const { data } = await query;
      setMaterials(data || []);
      setLoading(false);
    }
    fetch();
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      <SubpageHeader
        badge="Eksplorasi Keilmuan"
        title="Materi Pramuka"
        subtitle="Pelajari berbagai keterampilan kepramukaan dari dasar hingga mahir."
        bgVariant="blue"
        modelImage="/assets/model/Alysia Fasma Nidai No BG.webp"
        modelName="Alysia"
        modelAlign="right"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <FilterBtn label="Semua Materi" value="semua" active={activeFilter} onClick={(v) => setSearchParams(v === 'semua' ? {} : { filter: v })} />
            {KATEGORI_MATERI.map((k) => (
              <FilterBtn key={k.value} label={k.label} value={k.value} active={activeFilter} onClick={(v) => setSearchParams({ filter: v })} />
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-brand-orange animate-pulse" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark">Belum ada materi tersedia</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
                Saat ini belum ada materi untuk kategori ini. Materi akan segera ditambahkan oleh admin Gudep.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {materials.map((m, i) => (
                <MateriCard key={m.id} material={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterBtn({ label, value, active, onClick }: { label: string; value: string; active: string; onClick: (v: string) => void }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border transition-all cursor-pointer ${
        isActive
          ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
          : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/20'
      }`}
    >
      {label}
    </button>
  );
}

function MateriCard({ material, index }: { material: Material; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const tingkatanColors: Record<string, string> = {
    siaga: 'bg-brand-yellow text-brand-dark',
    penggalang: 'bg-brand-green text-white',
    penegak: 'bg-brand-orange text-white',
    umum: 'bg-brand-blue text-white',
  };

  return (
    <div ref={ref} className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}>
      <div className="bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between w-full group">
        <div>
          {material.thumbnail_url ? (
            <div className="h-44 overflow-hidden border-b border-brand-dark/10 relative bg-cream-dark">
              <img src={material.thumbnail_url} alt={material.judul} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
            </div>
          ) : (
            <div className="h-44 border-b border-brand-dark/10 bg-brand-yellow/15 flex items-center justify-center relative">
              <BookOpen className="w-12 h-12 text-brand-orange/40" />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-0.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full text-[10px] font-kids font-bold uppercase">
                {material.kategori.replace('_', ' ')}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border border-brand-dark/20 text-[10px] font-kids font-bold uppercase ${tingkatanColors[material.tingkatan] || tingkatanColors.umum}`}>
                {material.tingkatan.toUpperCase()}
              </span>
            </div>
            
            <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-orange transition-colors">
              {material.judul}
            </h3>
            
            {material.deskripsi && (
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed line-clamp-3 mb-4">
                {material.deskripsi}
              </p>
            )}
          </div>
        </div>

        {material.file_url && (
          <div className="px-6 pb-6 pt-2">
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full text-xs font-kids font-bold uppercase tracking-wider text-center border border-brand-dark/15 bg-white text-brand-dark shadow-soft hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Materi</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
