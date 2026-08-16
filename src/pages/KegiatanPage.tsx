import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Compass, AlertCircle } from 'lucide-react';
import { supabase, query } from '../lib/supabase';
import { getR2PublicUrl } from '../lib/r2';
import SubpageHeader from '../components/shared/SubpageHeader';
import { CardSkeleton, EmptyState, ErrorState } from '../components/shared/StateViews';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import type { Event } from '../types';

const JENIS_OPTIONS = [
  { value: 'semua', label: 'Semua Kegiatan' },
  { value: 'latihan', label: 'Latihan' },
  { value: 'perkemahan', label: 'Perkemahan' },
  { value: 'lomba', label: 'Lomba' },
  { value: 'baksos', label: 'Bakti Sosial' },
  { value: 'pelantikan', label: 'Pelantikan' },
];

const WARNA_JENIS: Record<string, string> = {
  latihan: 'bg-brand-green text-white',
  perkemahan: 'bg-brand-orange text-white',
  lomba: 'bg-brand-yellow text-brand-dark',
  baksos: 'bg-brand-blue text-white',
  pelantikan: 'bg-brand-dark text-white',
  lainnya: 'bg-white text-brand-dark',
};

const formatTanggal = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export default function KegiatanPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') ?? 'semua';

  useSeo({
    title: 'Agenda & Kegiatan',
    description:
      'Jadwal latihan rutin, perkemahan, lomba, bakti sosial, dan pelantikan Gugus Depan Trigantara — Pramuka SMK Marhas Margahayu.',
    path: '/kegiatan',
  });

  const fetchEvents = useCallback(
    (signal: AbortSignal) => {
      let builder = supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('tanggal_mulai', { ascending: false })
        .abortSignal(signal);

      if (activeFilter !== 'semua') builder = builder.eq('jenis', activeFilter);
      return query<Event[]>(builder);
    },
    [activeFilter]
  );

  const { data: events, loading, error, reload } = useAsyncData<Event[]>(
    fetchEvents,
    [activeFilter],
    []
  );

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      upcoming: events.filter((e) => (e.tanggal_selesai ?? e.tanggal_mulai) >= today),
      past: events.filter((e) => (e.tanggal_selesai ?? e.tanggal_mulai) < today),
    };
  }, [events]);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
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
          <nav aria-label="Saring kegiatan" className="flex flex-wrap gap-3 mb-12 justify-center">
            {JENIS_OPTIONS.map((j) => (
              <button
                key={j.value}
                type="button"
                onClick={() =>
                  setSearchParams(j.value === 'semua' ? {} : { filter: j.value }, { replace: true })
                }
                aria-pressed={activeFilter === j.value}
                className={`px-4 py-1.5 text-xs sm:text-sm font-kids font-bold rounded-full border transition-all cursor-pointer ${
                  activeFilter === j.value
                    ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
                    : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/25'
                }`}
              >
                {j.label}
              </button>
            ))}
          </nav>

          {loading ? (
            <CardSkeleton count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : events.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="Belum ada kegiatan terdaftar"
              description="Belum ada agenda pada filter yang dipilih. Nantikan kegiatan seru berikutnya!"
            />
          ) : (
            <div className="space-y-16">
              {upcoming.length > 0 && (
                <EventGroup
                  title="Agenda Mendatang"
                  icon={<Compass className="w-5 h-5 shrink-0" />}
                  headerClass="bg-brand-green text-white"
                  events={upcoming}
                />
              )}
              {past.length > 0 && (
                <EventGroup
                  title="Kegiatan Telah Berlalu"
                  icon={<AlertCircle className="w-5 h-5 shrink-0 text-brand-yellow" />}
                  headerClass="bg-brand-dark/50 text-white"
                  events={past}
                  past
                />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EventGroup({
  title,
  icon,
  headerClass,
  events,
  past = false,
}: {
  title: string;
  icon: React.ReactNode;
  headerClass: string;
  events: Event[];
  past?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-soft ${headerClass}`}>
        {icon}
        <h2 className="font-serif text-xl sm:text-2xl font-black">{title}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <EventCard key={e.id} event={e} index={i} past={past} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, index, past }: { event: Event; index: number; past: boolean }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${(index % 3) + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <article
        className={`bg-cream-card rounded-[2rem] border border-brand-dark/15 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col justify-between w-full group ${
          past ? 'opacity-80' : ''
        }`}
      >
        <div>
          {event.foto_url ? (
            <div className="aspect-[16/10] overflow-hidden border-b border-brand-dark/10 bg-cream-dark">
              <img
                src={getR2PublicUrl(event.foto_url)}
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
              <Compass className="w-12 h-12 text-brand-orange/40" />
            </div>
          )}

          <div className="p-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase border border-brand-dark/15 mb-4 ${
                WARNA_JENIS[event.jenis] ?? WARNA_JENIS.lainnya
              }`}
            >
              {event.jenis}
            </span>

            <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
              {event.judul}
            </h3>

            {event.deskripsi && (
              <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed line-clamp-3">
                {event.deskripsi}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-3 space-y-2.5 font-kids font-bold text-xs text-brand-dark/70 border-t border-brand-dark/5">
          <p className="flex items-start gap-2.5 pt-2">
            <Calendar className="w-4 h-4 text-brand-orange shrink-0 mt-px" />
            <time dateTime={event.tanggal_mulai}>
              {formatTanggal(event.tanggal_mulai)}
              {event.tanggal_selesai ? ` — ${formatTanggal(event.tanggal_selesai)}` : ''}
            </time>
          </p>
          {event.lokasi && (
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-px" />
              <span>{event.lokasi}</span>
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
