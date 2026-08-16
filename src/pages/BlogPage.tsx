import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, User, Newspaper, Search, X } from 'lucide-react';
import { supabase, query } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import SubpageHeader from '../components/shared/SubpageHeader';
import { CardSkeleton, EmptyState, ErrorState } from '../components/shared/StateViews';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import { KATEGORI_ARTIKEL, WARNA_KATEGORI_ARTIKEL } from '../data/constants';
import type { ArticleListItem } from '../types';

const KOLOM_DAFTAR =
  'id, judul, slug, ringkasan, thumbnail_url, kategori, penulis, published_at, created_at';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('kategori') ?? 'semua';
  const queryParam = searchParams.get('q') ?? '';

  // Local state untuk input pencarian (memungkinkan pengetikan mulus tanpa update URL setiap ketikan)
  const [searchInput, setSearchInput] = useState(queryParam);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const namaKategori =
    KATEGORI_ARTIKEL.find((c) => c.value === filter)?.label ?? 'Semua Artikel';

  useSeo({
    title: filter === 'semua' ? 'Blog & Artikel Pramuka' : `Artikel ${namaKategori}`,
    description:
      'Artikel seputar kepramukaan Indonesia dan dunia, sejarah gerakan Pramuka, tips keterampilan, ' +
      'serta berita dan cerita dari Gugus Depan Trigantara SMK Marhas Margahayu.',
    path: '/blog',
  });

  const fetchArticles = useCallback(
    (signal: AbortSignal) => {
      let builder = supabase
        .from('articles')
        .select(KOLOM_DAFTAR)
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .abortSignal(signal);

      if (filter !== 'semua') builder = builder.eq('kategori', filter);
      return query<ArticleListItem[]>(builder);
    },
    [filter]
  );

  const { data: articles, loading, error, reload } = useAsyncData<ArticleListItem[]>(
    fetchArticles,
    [filter],
    []
  );

  // Client-side search filtering
  const filtered = useMemo(() => {
    const q = queryParam.trim().toLowerCase();
    if (!q) return articles;

    const terms = q.split(/\s+/);
    return articles.filter((a) => {
      const haystack = [
        a.judul,
        a.ringkasan,
        a.kategori,
        a.penulis,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return terms.every((term) => haystack.includes(term));
    });
  }, [articles, queryParam]);

  const setFilter = (value: string) => {
    const next: Record<string, string> = {};
    if (value !== 'semua') next.kategori = value;
    if (queryParam) next.q = queryParam;
    setSearchParams(next, { replace: true });
  };

  const updateSearchQuery = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next: Record<string, string> = {};
      if (filter !== 'semua') next.kategori = filter;
      if (value.trim()) next.q = value.trim();
      setSearchParams(next, { replace: true });
    }, 300);
  };

  const clearSearch = () => {
    setSearchInput('');
    const next: Record<string, string> = {};
    if (filter !== 'semua') next.kategori = filter;
    setSearchParams(next, { replace: true });
  };

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      <SubpageHeader
        badge="Kabar & Wawasan"
        title="Blog & Artikel"
        subtitle="Sejarah, wawasan, dan cerita kepramukaan — dari Trigantara hingga gerakan Pramuka sedunia."
        bgVariant="green"
        modelImage="/assets/model/mey.webp"
        modelName="Mey"
        modelAlign="left"
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
                placeholder="Cari artikel… misal: sejarah, bapak pramuka, tips packing"
                aria-label="Cari artikel kepramukaan"
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
          <nav aria-label="Saring artikel" className="flex flex-wrap gap-3 mb-12 justify-center">
            {KATEGORI_ARTIKEL.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFilter(c.value)}
                aria-pressed={filter === c.value}
                className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border transition-all cursor-pointer ${
                  filter === c.value
                    ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
                    : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/25'
                }`}
              >
                {c.label}
              </button>
            ))}
          </nav>

          {loading ? (
            <CardSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={queryParam ? Search : Newspaper}
              title={
                queryParam
                  ? `Tidak ditemukan artikel untuk "${queryParam}"`
                  : 'Belum ada artikel di kategori ini'
              }
              description={
                queryParam
                  ? 'Coba kata kunci lain atau hapus pencarian untuk melihat semua artikel.'
                  : filter === 'semua'
                    ? 'Tulisan baru akan segera dipublikasikan oleh pengurus Gudep.'
                    : `Belum ada tulisan di kategori ${namaKategori}. Coba lihat kategori lain.`
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
                ) : filter !== 'semua' ? (
                  <button
                    type="button"
                    onClick={() => setFilter('semua')}
                    className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Lihat Semua Artikel
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-center text-xs font-kids font-bold text-brand-dark/50 mb-8">
                Menampilkan {filtered.length} artikel
                {filter !== 'semua' && ` untuk kategori ${namaKategori}`}
                {queryParam && ` · pencarian: "${queryParam}"`}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((a, i) => (
                  <ArticleCard key={a.id} article={a} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ article, index }: { article: ArticleListItem; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const badgeClass = WARNA_KATEGORI_ARTIKEL[article.kategori] ?? 'bg-white text-brand-dark';

  const tanggal = article.published_at ?? article.created_at;

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <Link to={`/blog/${article.slug}`} className="block w-full group">
        <article className="bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col justify-between h-full">
          <div>
            {article.thumbnail_url ? (
              <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark">
                <img
                  src={getR2PublicUrl(article.thumbnail_url)}
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
                <Newspaper className="w-12 h-12 text-brand-orange/40" />
              </div>
            )}

            <div className="p-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase border border-brand-dark/15 mb-4 ${badgeClass}`}
              >
                {article.kategori}
              </span>

              <h2 className="font-serif text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                {article.judul}
              </h2>

              {article.ringkasan && (
                <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed line-clamp-3">
                  {article.ringkasan}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-3 font-kids font-bold text-[11px] text-brand-dark/70 border-t border-brand-dark/5">
            <span className="flex items-center gap-1.5 min-w-0">
              <User className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span className="truncate">{article.penulis}</span>
            </span>
            {tanggal && (
              <time
                dateTime={tanggal}
                className="flex items-center gap-1.5 shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 text-brand-green" />
                {new Date(tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
}
