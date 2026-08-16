import { useCallback, useMemo, useEffect, useState } from 'react';
import { Link, useParams, useNavigationType } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Download, ExternalLink, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import { renderContent, excerptFromHtml } from '../lib/sanitize';
import { LoadingState, ErrorState, EmptyState } from '../components/shared/StateViews';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import { KATEGORI_MATERI, TINGKATAN_WARNA } from '../data/constants';
import type { Material, MaterialListItem } from '../types';

export default function MateriDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigationType = useNavigationType();

  const fetchMaterial = useCallback(
    async (signal: AbortSignal) => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Material | null;
    },
    [slug]
  );

  const { data: material, loading, error, reload } = useAsyncData<Material | null>(
    fetchMaterial,
    [slug],
    null
  );

  // Scroll Position Management
  useEffect(() => {
    if (!slug) return;

    const scrollKey = `materi-scroll-${slug}`;

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

  // Sidebar Recommendations Fetching
  const [recommendations, setRecommendations] = useState<MaterialListItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    if (!material) return;

    let isMounted = true;

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        let { data, error } = await supabase
          .from('materials')
          .select('id, judul, slug, deskripsi, ringkasan, kategori, tingkatan, thumbnail_url, file_url, durasi_menit, urutan, created_at')
          .eq('is_published', true)
          .eq('kategori', material.kategori)
          .neq('id', material.id)
          .order('urutan', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        let recs = data as MaterialListItem[];
        
        if (recs.length < 3) {
          const { data: otherData, error: otherError } = await supabase
            .from('materials')
            .select('id, judul, slug, deskripsi, ringkasan, kategori, tingkatan, thumbnail_url, file_url, durasi_menit, urutan, created_at')
            .eq('is_published', true)
            .neq('kategori', material.kategori)
            .neq('id', material.id)
            .order('urutan', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(5 - recs.length);
            
          if (otherError) throw otherError;
          recs = [...recs, ...(otherData as MaterialListItem[])];
        }
        
        if (isMounted) {
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
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
  }, [material]);

  const html = useMemo(() => (material?.konten ? renderContent(material.konten) : ''), [material]);

  const namaKategori = material
    ? (KATEGORI_MATERI.find((k) => k.value === material.kategori)?.label ?? material.kategori)
    : '';

  const deskripsi = material
    ? material.ringkasan || material.deskripsi || excerptFromHtml(html)
    : '';

  useSeo({
    title: material ? material.judul : 'Materi',
    description: deskripsi,
    path: `/materi/${slug ?? ''}`,
    type: 'article',
    image: material?.thumbnail_url,
    noIndex: !material,
    jsonLd: material
      ? {
          '@type': 'LearningResource',
          name: material.judul,
          description: deskripsi,
          educationalLevel: material.tingkatan,
          learningResourceType: 'Materi kepramukaan',
          inLanguage: 'id',
          provider: { '@type': 'Organization', name: 'Gugus Depan Trigantara' },
        }
      : undefined,
  });

  if (loading) {
    return (
      <main className="pt-32 min-h-screen bg-cream-bg">
        <LoadingState label="Memuat materi…" />
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

  if (!material) {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-cream-bg px-4">
        <EmptyState
          icon={BookOpen}
          title="Materi tidak ditemukan"
          description="Materi yang kamu cari tidak ada atau belum dipublikasikan."
          action={
            <Link
              to="/materi"
              className="px-6 py-2.5 bg-brand-orange text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Materi</span>
            </Link>
          }
        />
      </main>
    );
  }

  const tingkatanClass = TINGKATAN_WARNA[material.tingkatan] ?? TINGKATAN_WARNA.umum;

  return (
    <main className="pt-28 sm:pt-32 min-h-screen bg-cream-bg text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-w-0">
        <div className="flex flex-col lg:flex-row gap-10 min-w-0">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3 min-w-0">
            <Link
              to="/materi"
              className="px-4 py-2 bg-white text-brand-dark font-kids font-bold text-xs rounded-xl border border-brand-dark/15 shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Semua Materi</span>
            </Link>

            <article className="bg-white border border-brand-dark/15 rounded-[2rem] p-6 sm:p-10 shadow-soft-lg min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <Link
                  to={`/materi?filter=${material.kategori}`}
                  className="px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase bg-brand-orange/10 text-brand-orange border border-brand-orange/20 hover:bg-brand-orange/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3" />
                  {namaKategori}
                </Link>
                <span className={`px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase border border-brand-dark/15 ${tingkatanClass}`}>
                  {material.tingkatan}
                </span>
                {material.durasi_menit ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-kids font-bold text-brand-dark/50">
                    <Clock className="w-3.5 h-3.5" />
                    {material.durasi_menit} menit baca
                  </span>
                ) : null}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
                {material.judul}
              </h1>

              {(material.ringkasan || material.deskripsi) && (
                <p className="text-base sm:text-lg text-brand-dark/70 font-sans leading-relaxed mb-8">
                  {material.ringkasan || material.deskripsi}
                </p>
              )}

              {material.thumbnail_url && (
                <img
                  src={getR2PublicUrl(material.thumbnail_url)}
                  alt={material.judul}
                  width={1200}
                  height={675}
                  loading="eager"
                  decoding="async"
                  className="w-full rounded-2xl border border-brand-dark/15 shadow-soft mb-10 object-cover aspect-[16/9] bg-cream-dark"
                />
              )}

              {html ? (
                <div className="konten-kaya" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-brand-dark/60 italic">
                  Isi materi ini belum ditulis. Silakan unduh berkasnya di bawah.
                </p>
              )}

              {(material.file_url || material.sumber_url) && (
                <footer className="mt-12 pt-8 border-t border-brand-dark/10 flex flex-wrap gap-3">
                  {material.file_url && (
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-brand-orange text-white rounded-full text-xs font-kids font-bold shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Materi</span>
                    </a>
                  )}
                  {material.sumber_url && (
                    <a
                      href={material.sumber_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-white text-brand-dark rounded-full text-xs font-kids font-bold border border-brand-dark/15 shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Sumber: {material.sumber || 'Rujukan'}</span>
                    </a>
                  )}
                </footer>
              )}
            </article>

            <div className="mt-10 text-center lg:hidden">
              <Link
                to="/materi"
                className="text-xs font-kids font-bold text-brand-orange hover:underline inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Jelajahi materi kepramukaan lainnya
              </Link>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="w-full lg:w-1/3 min-w-0 shrink-0">
            <div className="sticky top-24 min-w-0">
              <div className="bg-white border border-brand-dark/15 rounded-[2rem] p-6 sm:p-8 shadow-soft-lg min-w-0 overflow-hidden">
                <h3 className="font-kids font-bold text-lg text-brand-dark mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-orange" />
                  Materi Lainnya
                </h3>
                
                <div className="flex flex-col gap-6">
                  {loadingRecommendations ? (
                    <p className="text-sm text-brand-dark/50 font-sans italic">Memuat rekomendasi...</p>
                  ) : recommendations.length === 0 ? (
                    <p className="text-sm text-brand-dark/50 font-sans italic">Belum ada materi lain.</p>
                  ) : (
                    recommendations.map(rec => {
                      const recKategori = KATEGORI_MATERI.find((k) => k.value === rec.kategori)?.label ?? rec.kategori;
                      return (
                        <Link key={rec.id} to={`/materi/${rec.slug}`} className="group flex gap-4 items-start">
                          {rec.thumbnail_url ? (
                            <img 
                              src={getR2PublicUrl(rec.thumbnail_url)} 
                              alt={rec.judul}
                              className="w-20 h-20 rounded-xl object-cover border border-brand-dark/15 shadow-soft shrink-0 bg-cream-dark transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl border border-brand-dark/15 bg-cream-dark shadow-soft shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                              <BookOpen className="w-6 h-6 text-brand-dark/20" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-kids font-bold uppercase bg-brand-orange/10 text-brand-orange border border-brand-orange/20 truncate">
                                {recKategori}
                              </span>
                              {rec.durasi_menit && (
                                <span className="flex items-center gap-1 text-[9px] font-kids font-bold text-brand-dark/50 whitespace-nowrap">
                                  <Clock className="w-2.5 h-2.5" />
                                  {rec.durasi_menit} mnt
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-brand-dark leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                              {rec.judul}
                            </h4>
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-brand-dark/10 text-center hidden lg:block">
                  <Link
                    to="/materi"
                    className="text-xs font-kids font-bold text-brand-orange hover:underline inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Semua Materi
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
