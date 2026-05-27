import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Article } from '../types';
import { Calendar, User, Newspaper, ArrowLeft, XCircle } from 'lucide-react';
import { autoFormatHtml } from '../lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!slug) return;
      const { data } = await supabase.from('articles').select('*').eq('slug', slug).eq('is_published', true).single();
      setArticle(data || null);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-24 min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-24 min-h-screen bg-cream-bg flex items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-brand-orange animate-pulse" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-dark">Artikel Tidak Ditemukan</h3>
          <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
            Artikel yang kamu cari tidak ada atau belum dipublikasikan oleh admin.
          </p>
          <div className="pt-4">
            <Link to="/blog" className="px-6 py-2.5 bg-brand-orange text-white font-kids font-bold text-xs rounded-full border-2 border-brand-dark shadow-[3px_3px_0_#2A1B15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Blog</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const katColors: Record<string, string> = {
    berita: 'bg-brand-blue text-white',
    tips: 'bg-brand-green text-white',
    cerita: 'bg-brand-yellow text-brand-dark',
    pengumuman: 'bg-brand-orange text-white',
  };

  return (
    <main className="pt-24 min-h-screen bg-cream-bg text-brand-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="px-4 py-2 bg-white text-brand-dark font-kids font-bold text-xs rounded-xl border-2 border-brand-dark shadow-[3px_3px_0_#2A1B15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Blog</span>
          </Link>
        </div>

        {/* Article Box Container */}
        <article className="bg-white border-4 border-brand-dark rounded-[2rem] p-6 sm:p-10 shadow-[8px_8px_0_#2A1B15] overflow-hidden">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6 select-none">
            <span className={`px-3 py-1 rounded-full text-xs font-kids font-bold border-2 border-brand-dark shadow-[1.5px_1.5px_0_#2A1B15] ${katColors[article.kategori] || 'bg-white text-brand-dark'}`}>
              {article.kategori.toUpperCase()}
            </span>
            {article.published_at && (
              <span className="flex items-center gap-1.5 text-xs font-kids font-bold text-brand-dark/65">
                <Calendar className="w-3.5 h-3.5 text-brand-green" />
                <span>{new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-brand-dark mb-4 leading-tight tracking-tight">
            {article.judul}
          </h1>

          <p className="text-xs sm:text-sm font-kids font-bold text-brand-dark/60 mb-8 flex items-center gap-1.5 select-none">
            <User className="w-4 h-4 text-brand-orange" />
            <span>Ditulis oleh <strong className="text-brand-dark">{article.penulis}</strong></span>
          </p>

          {article.thumbnail_url && (
            <div className="rounded-2xl border-2 border-brand-dark overflow-hidden w-full max-h-96 shadow-[4px_4px_0_#2A1B15] mb-8 bg-cream-dark">
              <img
                src={article.thumbnail_url}
                alt={article.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Block */}
          <div
            className="prose prose-lg max-w-none text-brand-dark/95 leading-relaxed font-sans font-medium
              prose-headings:font-serif prose-headings:text-brand-dark prose-headings:font-black
              prose-a:text-brand-orange prose-a:font-bold prose-a:underline hover:prose-a:text-brand-orange/80
              prose-strong:font-bold prose-strong:text-brand-dark
              prose-img:rounded-2xl prose-img:border-2 prose-img:border-brand-dark prose-img:shadow-[4px_4px_0_#2A1B15]"
            dangerouslySetInnerHTML={{ __html: autoFormatHtml(article.konten) }}
          />
        </article>
      </div>
    </main>
  );
}
