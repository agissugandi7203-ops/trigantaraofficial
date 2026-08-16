import { useCallback, useMemo, useEffect, useState } from 'react';
import { Link, useParams, useNavigationType } from 'react-router-dom';
import { ArrowLeft, Calendar, Newspaper, User, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import { renderContent, excerptFromHtml } from '../lib/sanitize';
import { LoadingState, ErrorState, EmptyState } from '../components/shared/StateViews';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo, SITE_URL } from '../hooks/useSeo';
import { WARNA_KATEGORI_ARTIKEL } from '../data/constants';
import type { Article, ArticleListItem } from '../types';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigationType = useNavigationType();

  const fetchArticle = useCallback(
    async (signal: AbortSignal) => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Article | null;
    },
    [slug]
  );

  const { data: article, loading, error, reload } = useAsyncData<Article | null>(
    fetchArticle,
    [slug],
    null
  );

  // Manajemen Posisi Scroll (Scroll Restoration)
  useEffect(() => {
    if (!slug) return;

    const scrollKey = `blog-scroll-${slug}`;

    if (navigationType === 'POP') {
      const savedPosition = sessionStorage.getItem(scrollKey);
      if (savedPosition) {
        window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'instant' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    let scrollTimeout: number | undefined;
    const handleScroll = () => {
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
      scrollTimeout = window.setTimeout(() => {
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
    };
  }, [slug, navigationType]);

  // Pengambilan Rekomendasi Artikel Lainnya
  const [recommendations, setRecommendations] = useState<ArticleListItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    if (!article) return;

    let isMounted = true;

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        let { data, error } = await supabase
          .from('articles')
          .select('id, judul, slug, ringkasan, thumbnail_url, kategori, penulis, published_at, created_at')
          .eq('is_published', true)
          .eq('kategori', article.kategori)
          .neq('id', article.id)
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(5);

        if (error) throw error;

        let recs = (data ?? []) as ArticleListItem[];

        if (recs.length < 3) {
          const { data: otherData, error: otherError } = await supabase
            .from('articles')
            .select('id, judul, slug, ringkasan, thumbnail_url, kategori, penulis, published_at, created_at')
            .eq('is_published', true)
            .neq('kategori', article.kategori)
            .neq('id', article.id)
            .order('published_at', { ascending: false, nullsFirst: false })
            .limit(5 - recs.length);

          if (otherError) throw otherError;
          recs = [...recs, ...((otherData ?? []) as ArticleListItem[])];
        }

        if (isMounted) {
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Failed to fetch article recommendations', err);
      } finally {
        if (isMounted) {
          setLoadingRecommendations(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [article]);

  const html = useMemo(() => (article ? renderContent(article.konten) : ''), [article]);
  const deskripsi = article ? article.ringkasan || excerptFromHtml(html) : '';
  const tanggal = article?.published_at ?? article?.created_at;

  useSeo({
    title: article?.judul ?? 'Artikel',
    description: deskripsi,
    path: `/blog/${slug ?? ''}`,
    type: 'article',
    image: article?.thumbnail_url,
    noIndex: !article,
    jsonLd: article
      ? {
          '@type': 'Article',
          headline: article.judul,
          description: deskripsi,
          image: article.thumbnail_url,
          datePublished: tanggal,
          dateModified: article.updated_at,
          inLanguage: 'id',
          author: { '@type': 'Person', name: article.penulis },
          publisher: {
            '@type': 'Organization',
            name: 'Gugus Depan Trigantara',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/assets/logo/LOGO%20TRIGANTARA%20(2).webp`,
            },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${slug ?? ''}`,
        }
      : undefined,
  });

  if (loading) {
    return (
      <main className="pt-32 min-h-screen bg-cream-bg">
        <LoadingState label="Memuat artikel…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-cream-bg px-4">
        <ErrorState message={error} onRetry={reload} />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-cream-bg px-4">
        <EmptyState
          icon={Newspaper}
          title="Artikel tidak ditemukan"
          description="Artikel yang kamu cari tidak ada atau belum dipublikasikan."
          action={
            <Link
              to="/blog"
              className="px-6 py-2.5 bg-brand-orange text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Blog</span>
            </Link>
          }
        />
      </main>
    );
  }

  const badgeClass = WARNA_KATEGORI_ARTIKEL[article.kategori] ?? 'bg-white text-brand-dark';

  return (
    <main className="pt-28 sm:pt-32 min-h-screen bg-cream-bg text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-w-0">
        <div className="flex flex-col lg:flex-row gap-10 min-w-0">
          
          {/* Konten Utama (Kiri 2/3) */}
          <div className="w-full lg:w-2/3 min-w-0">
            <Link
              to="/blog"
              className="px-4 py-2 bg-white text-brand-dark font-kids font-bold text-xs rounded-xl border border-brand-dark/15 shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Blog</span>
            </Link>

            <article className="bg-white border border-brand-dark/15 rounded-[2rem] p-6 sm:p-10 shadow-soft-lg min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  to={`/blog?kategori=${article.kategori}`}
                  className={`px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase border border-brand-dark/15 hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 ${badgeClass}`}
                >
                  <Tag className="w-3 h-3" />
                  {article.kategori}
                </Link>
                {tanggal && (
                  <time
                    dateTime={tanggal}
                    className="flex items-center gap-1.5 text-[11px] font-kids font-bold text-brand-dark/55"
                  >
                    <Calendar className="w-3.5 h-3.5 text-brand-green" />
                    {new Date(tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
                {article.judul}
              </h1>

              {article.ringkasan && (
                <p className="text-base sm:text-lg text-brand-dark/70 font-sans leading-relaxed mb-6">
                  {article.ringkasan}
                </p>
              )}

              <p className="text-xs font-kids font-bold text-brand-dark/55 mb-8 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-orange" />
                Ditulis oleh <strong className="text-brand-dark">{article.penulis}</strong>
              </p>

              {article.thumbnail_url && (
                <img
                  src={getR2PublicUrl(article.thumbnail_url)}
                  alt={article.judul}
                  width={1200}
                  height={675}
                  loading="eager"
                  decoding="async"
                  className="w-full rounded-2xl border border-brand-dark/15 shadow-soft mb-10 object-cover aspect-[16/9] bg-cream-dark"
                />
              )}

              <div className="konten-kaya" dangerouslySetInnerHTML={{ __html: html }} />

              {article.tags && article.tags.length > 0 && (
                <footer className="mt-12 pt-8 border-t border-brand-dark/10 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-cream-dark text-brand-dark/70 text-[11px] font-kids font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </footer>
              )}
            </article>

            <div className="mt-10 text-center lg:hidden">
              <Link
                to="/blog"
                className="text-xs font-kids font-bold text-brand-orange hover:underline inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Baca artikel lainnya
              </Link>
            </div>
          </div>

          {/* Sidebar Rekomendasi (Kanan 1/3) */}
          <aside className="w-full lg:w-1/3 min-w-0 shrink-0">
            <div className="sticky top-24 min-w-0">
              <div className="bg-white border border-brand-dark/15 rounded-[2rem] p-6 sm:p-8 shadow-soft-lg min-w-0 overflow-hidden">
                <h3 className="font-kids font-bold text-lg text-brand-dark mb-6 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-brand-orange" />
                  Artikel Lainnya
                </h3>

                <div className="flex flex-col gap-6">
                  {loadingRecommendations ? (
                    <p className="text-sm text-brand-dark/50 font-sans italic">Memuat artikel...</p>
                  ) : recommendations.length === 0 ? (
                    <p className="text-sm text-brand-dark/50 font-sans italic">Belum ada artikel lain.</p>
                  ) : (
                    recommendations.map((rec) => {
                      const recBadge = WARNA_KATEGORI_ARTIKEL[rec.kategori] ?? 'bg-white text-brand-dark';
                      const recTanggal = rec.published_at ?? rec.created_at;
                      return (
                        <Link key={rec.id} to={`/blog/${rec.slug}`} className="group flex gap-4 items-start">
                          {rec.thumbnail_url ? (
                            <img
                              src={getR2PublicUrl(rec.thumbnail_url)}
                              alt={rec.judul}
                              className="w-20 h-20 rounded-xl object-cover border border-brand-dark/15 shadow-soft shrink-0 bg-cream-dark transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl border border-brand-dark/15 bg-brand-yellow/15 shadow-soft shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                              <Newspaper className="w-6 h-6 text-brand-orange/40" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-kids font-bold uppercase border border-brand-dark/15 ${recBadge}`}>
                                {rec.kategori}
                              </span>
                              {recTanggal && (
                                <span className="flex items-center gap-1 text-[9px] font-kids font-bold text-brand-dark/50 whitespace-nowrap">
                                  <Calendar className="w-2.5 h-2.5 text-brand-green" />
                                  {new Date(recTanggal).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-brand-dark leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                              {rec.judul}
                            </h4>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-brand-dark/10 text-center hidden lg:block">
                  <Link
                    to="/blog"
                    className="text-xs font-kids font-bold text-brand-orange hover:underline inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Semua Artikel
                  </Link>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
