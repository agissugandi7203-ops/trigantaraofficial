import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Clock, Download, ArrowRight, Search, X } from 'lucide-react';
import { supabase, query } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import SubpageHeader from '../components/shared/SubpageHeader';
import { CardSkeleton, EmptyState, ErrorState } from '../components/shared/StateViews';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import { KATEGORI_MATERI, TINGKATAN_WARNA } from '../data/constants';
import type { MaterialListItem } from '../types';

const KOLOM_DAFTAR =
  'id, judul, slug, deskripsi, ringkasan, kategori, tingkatan, thumbnail_url, file_url, durasi_menit, urutan, created_at';

export default function MateriPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') ?? 'semua';
  const queryParam = searchParams.get('q') ?? '';

  // Local state for input value (allows typing without URL update on every keystroke)
  const [searchInput, setSearchInput] = useState(queryParam);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync URL -> input when navigating back/forward
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const namaKategori =
    KATEGORI_MATERI.find((k) => k.value === activeFilter)?.label ?? 'Semua Materi';

  useSeo({
    title: activeFilter === 'semua' ? 'Materi Pramuka' : `Materi ${namaKategori}`,
    description:
      'Kumpulan materi kepramukaan lengkap: sandi morse, semaphore, tali temali, PBB, P3K, ' +
      'navigasi kompas, pionering, dan survival. Disusun untuk Penggalang dan Penegak.',
    path: '/materi',
  });

  const fetchMaterials = useCallback(
    (signal: AbortSignal) => {
      let builder = supabase
        .from('materials')
        .select(KOLOM_DAFTAR)
        .eq('is_published', true)
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false })
        .abortSignal(signal);

      if (activeFilter !== 'semua') builder = builder.eq('kategori', activeFilter);
      return query<MaterialListItem[]>(builder);
    },
    [activeFilter]
  );

  const { data: materials, loading, error, reload } = useAsyncData<MaterialListItem[]>(
    fetchMaterials,
    [activeFilter],
    []
  );

  // Client-side search filtering
  const filtered = useMemo(() => {
    const q = queryParam.trim().toLowerCase();
    if (!q) return materials;

    const terms = q.split(/\s+/);
    return materials.filter((m) => {
      const haystack = [
        m.judul,
        m.ringkasan,
        m.deskripsi,
        m.kategori.replace(/_/g, ' '),
        m.tingkatan,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return terms.every((term) => haystack.includes(term));
    });
  }, [materials, queryParam]);

  const setFilter = (value: string) => {
    const next: Record<string, string> = {};
    if (value !== 'semua') next.filter = value;
    if (queryParam) next.q = queryParam;
    setSearchParams(next, { replace: true });
  };

  const updateSearchQuery = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next: Record<string, string> = {};
      if (activeFilter !== 'semua') next.filter = activeFilter;
      if (value.trim()) next.q = value.trim();
      setSearchParams(next, { replace: true });
    }, 300);
  };

  const clearSearch = () => {
    setSearchInput('');
    const next: Record<string, string> = {};
    if (activeFilter !== 'semua') next.filter = activeFilter;
    setSearchParams(next, { replace: true });
  };

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      <SubpageHeader
        badge="Eksplorasi Keilmuan"
        title="Materi Pramuka"
        subtitle="Pelajari keterampilan kepramukaan dari dasar hingga mahir — lengkap, gratis, dan bisa dibaca langsung di sini."
        bgVariant="blue"
        modelImage="/assets/model/Alysia Fasma Nidai No BG.webp"
        modelName="Alysia"
        modelAlign="right"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/35 group-focus-within:text-brand-orange transition-colors pointer-events-none" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => updateSearchQuery(e.target.value)}
                placeholder="Cari materi… misal: morse, tali temali, P3K"
                aria-label="Cari materi kepramukaan"
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-brand-dark/15 bg-white text-sm font-sans text-brand-dark placeholder:text-brand-dark/40 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/50 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-dark/40 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <nav aria-label="Saring materi menurut kategori" className="flex flex-wrap gap-3 mb-12 justify-center">
            <FilterButton label="Semua Materi" value="semua" active={activeFilter} onSelect={setFilter} />
            {KATEGORI_MATERI.map((k) => (
              <FilterButton
                key={k.value}
                label={k.label}
                value={k.value}
                active={activeFilter}
                onSelect={setFilter}
              />
            ))}
          </nav>

          {loading ? (
            <CardSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={queryParam ? Search : BookOpen}
              title={
                queryParam
                  ? `Tidak ditemukan materi untuk "${queryParam}"`
                  : 'Belum ada materi di kategori ini'
              }
              description={
                queryParam
                  ? 'Coba kata kunci lain atau hapus pencarian untuk melihat semua materi.'
                  : activeFilter === 'semua'
                    ? 'Materi sedang disiapkan oleh pengurus Gudep dan akan segera tampil di sini.'
                    : `Belum ada materi bertopik ${namaKategori}. Coba lihat kategori lain.`
              }
              action={
                queryParam ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Hapus Pencarian
                  </button>
                ) : activeFilter !== 'semua' ? (
                  <button
                    type="button"
                    onClick={() => setFilter('semua')}
                    className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Lihat Semua Materi
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-center text-xs font-kids font-bold text-brand-dark/50 mb-8">
                Menampilkan {filtered.length} materi
                {activeFilter !== 'semua' && ` untuk kategori ${namaKategori}`}
                {queryParam && ` · pencarian: "${queryParam}"`}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((m, i) => (
                  <MateriCard key={m.id} material={m} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterButton({
  label,
  value,
  active,
  onSelect,
}: {
  label: string;
  value: string;
  active: string;
  onSelect: (value: string) => void;
}) {
  const isActive = active === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
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

function MateriCard({ material, index }: { material: MaterialListItem; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const tingkatanClass = TINGKATAN_WARNA[material.tingkatan] ?? TINGKATAN_WARNA.umum;
  const detailPath = material.slug ? `/materi/${material.slug}` : null;
  const ringkas = material.ringkasan || material.deskripsi;

  const body = (
    <article className="bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col justify-between w-full h-full group">
      <div>
        {material.thumbnail_url ? (
          <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark">
            <img
              src={getR2PublicUrl(material.thumbnail_url)}
              alt=""
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] border-b border-brand-dark/10 bg-brand-yellow/15 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-brand-orange/40" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full text-[10px] font-kids font-bold uppercase">
              {material.kategori.replace(/_/g, ' ')}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full border border-brand-dark/15 text-[10px] font-kids font-bold uppercase ${tingkatanClass}`}
            >
              {material.tingkatan}
            </span>
            {material.durasi_menit ? (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-kids font-bold text-brand-dark/45">
                <Clock className="w-3 h-3" />
                {material.durasi_menit} menit
              </span>
            ) : null}
          </div>

          <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-orange transition-colors">
            {material.judul}
          </h3>

          {ringkas && (
            <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed line-clamp-3">
              {ringkas}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex items-center gap-3">
        {detailPath && (
          <span className="flex-1 py-3 px-4 rounded-full text-xs font-kids font-bold uppercase tracking-wider text-center border border-brand-dark/15 bg-brand-dark text-white shadow-soft inline-flex items-center justify-center gap-2 group-hover:bg-brand-orange transition-colors">
            <span>Baca Materi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
        {material.file_url && (
          <a
            href={material.file_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Unduh berkas materi ${material.judul}`}
            title="Unduh berkas"
            className="p-3 rounded-full border border-brand-dark/15 bg-white text-brand-dark shadow-soft hover:-translate-y-0.5 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      {detailPath ? (
        <Link to={detailPath} className="block w-full">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}
