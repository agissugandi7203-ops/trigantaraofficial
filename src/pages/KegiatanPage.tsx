import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubpageHeader from '../components/shared/SubpageHeader';
import type { Event } from '../types';
import { Calendar, MapPin, Compass, AlertCircle } from 'lucide-react';

const JENIS_OPTIONS = [
  { value: 'semua', label: 'Semua Kegiatan' },
  { value: 'latihan', label: 'Latihan' },
  { value: 'perkemahan', label: 'Perkemahan' },
  { value: 'lomba', label: 'Lomba' },
  { value: 'baksos', label: 'Bakti Sosial' },
  { value: 'pelantikan', label: 'Pelantikan' },
];

export default function KegiatanPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const activeFilter = searchParams.get('filter') || 'semua';

  useEffect(() => {
    async function fetch() {
      let query = supabase.from('events').select('*').eq('is_published', true).order('tanggal_mulai', { ascending: false });
      if (activeFilter !== 'semua') query = query.eq('jenis', activeFilter);
      const { data } = await query;
      setEvents(data || []);
      setLoading(false);
    }
    fetch();
  }, [activeFilter]);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter((e) => e.tanggal_mulai >= today);
  const past = events.filter((e) => e.tanggal_mulai < today);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      {/* SubpageHeader replacing flat hero banner */}
      <SubpageHeader
        badge="Kalender Agenda"
        title="Kegiatan Kami"
        subtitle="Agenda dan dokumentasi kegiatan kepramukaan Gudep Trigantara."
        bgVariant="green"
        modelImage="/assets/model/shafa.webp"
        modelName="Shafa"
        modelAlign="left"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {JENIS_OPTIONS.map((j) => (
              <button
                key={j.value}
                onClick={() => setSearchParams(j.value === 'semua' ? {} : { filter: j.value })}
                className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border transition-all cursor-pointer ${
                  activeFilter === j.value
                    ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
                    : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/20'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8 text-brand-orange animate-pulse" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark">Belum ada kegiatan terdaftar</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
                Saat ini belum ada data kegiatan dalam filter yang Anda pilih.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {upcoming.length > 0 && (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white border-2 border-brand-dark rounded-xl shadow-[3px_3px_0_#2A1B15]">
                    <Compass className="w-5 h-5 shrink-0" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black">Agenda Mendatang</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
                  </div>
                </div>
              )}
              
              {past.length > 0 && (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-dark/45 text-white border-2 border-brand-dark rounded-xl shadow-[3px_3px_0_#2A1B15]">
                    <AlertCircle className="w-5 h-5 shrink-0 text-brand-yellow" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black">Kegiatan Telah Berlalu</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {past.map((e, i) => <EventCard key={e.id} event={e} index={i} past />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EventCard({ event, index, past = false }: { event: Event; index: number; past?: boolean }) {
  const { ref, isVisible } = useScrollAnimation();
  const jenisColors: Record<string, string> = {
    latihan: 'bg-brand-green text-white',
    perkemahan: 'bg-brand-orange text-white',
    lomba: 'bg-brand-yellow text-brand-dark',
    baksos: 'bg-brand-blue text-white',
    pelantikan: 'bg-brand-dark text-white',
    lainnya: 'bg-white text-brand-dark',
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div ref={ref} className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}>
      <div className={`bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between w-full group ${past ? 'opacity-75' : ''}`}>
        <div>
          {event.foto_url ? (
            <div className="h-44 overflow-hidden border-b border-brand-dark/10 relative bg-cream-dark">
              <img src={event.foto_url} alt={event.judul} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
            </div>
          ) : (
            <div className="h-44 border-b border-brand-dark/10 bg-brand-yellow/15 flex items-center justify-center relative">
              <Compass className="w-12 h-12 text-brand-orange/40" />
            </div>
          )}
          
          <div className="p-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-kids font-bold border border-brand-dark/15 mb-4 shadow-soft ${jenisColors[event.jenis] || jenisColors.lainnya}`}>
              {event.jenis.toUpperCase()}
            </span>
            
            <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
              {event.judul}
            </h3>
            
            {event.deskripsi && (
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed line-clamp-3 mb-4">
                {event.deskripsi}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 space-y-3 font-kids font-bold text-xs sm:text-sm text-brand-dark/75 border-t border-brand-dark/5">
          <p className="flex items-center gap-2.5 pt-2">
            <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
            <span>{formatDate(event.tanggal_mulai)}{event.tanggal_selesai ? ` — ${formatDate(event.tanggal_selesai)}` : ''}</span>
          </p>
          {event.lokasi && (
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-green shrink-0" />
              <span>{event.lokasi}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
