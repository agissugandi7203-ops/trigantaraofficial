import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubpageHeader from '../components/shared/SubpageHeader';
import type { Article } from '../types';
import { Calendar, User, Newspaper } from 'lucide-react';

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');

  useEffect(() => {
    async function fetch() {
      let query = supabase.from('articles').select('*').eq('is_published', true).order('published_at', { ascending: false });
      if (filter !== 'semua') query = query.eq('kategori', filter);
      const { data } = await query;
      setArticles(data || []);
      setLoading(false);
    }
    fetch();
  }, [filter]);

  const categories = [
    { value: 'semua', label: 'Semua Artikel' },
    { value: 'berita', label: 'Berita Gudep' },
    { value: 'tips', label: 'Tips Pramuka' },
    { value: 'cerita', label: 'Cerita Anggota' },
    { value: 'pengumuman', label: 'Pengumuman' },
  ];

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      {/* SubpageHeader replacing flat hero banner */}
      <SubpageHeader
        badge="Kabar & Informasi"
        title="Blog & Artikel"
        subtitle="Berita, tips, dan cerita dari keluarga besar Gudep Trigantara."
        bgVariant="green"
        modelImage="/assets/model/mey.png"
        modelName="Mey"
        modelAlign="left"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border-2 transition-all cursor-pointer ${
                  filter === c.value
                    ? 'bg-brand-dark text-white border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)]'
                    : 'bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
                <Newspaper className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark">Belum ada artikel dipublikasikan</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
                Admin belum mempublikasikan tulisan apapun untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  
  const katColors: Record<string, string> = {
    berita: 'bg-brand-blue text-white',
    tips: 'bg-brand-green text-white',
    cerita: 'bg-brand-yellow text-brand-dark',
    pengumuman: 'bg-brand-orange text-white',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div ref={ref} className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}>
      <Link to={`/blog/${article.slug}`} className="block w-full group">
        <div className="bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col justify-between h-full">
          <div>
            {article.thumbnail_url ? (
              <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark">
                <img src={article.thumbnail_url} alt={article.judul} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 will-change-transform" loading="lazy" />
              </div>
            ) : (
              <div className="aspect-[16/10] border-b border-brand-dark/10 bg-brand-yellow/15 flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-brand-orange/40" />
              </div>
            )}
            
            <div className="p-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-kids font-bold border border-brand-dark/15 mb-4 shadow-soft ${katColors[article.kategori] || 'bg-white text-brand-dark'}`}>
                {article.kategori.toUpperCase()}
              </span>
              
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                {article.judul}
              </h3>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 flex flex-col gap-2.5 font-kids font-bold text-xs text-brand-dark/75 border-t border-brand-dark/5">
            <div className="flex items-center justify-between pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>{article.penulis}</span>
              </span>
              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span>{formatDate(article.published_at)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
