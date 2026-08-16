import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Compass } from 'lucide-react';
import { supabase, query } from '../../lib/supabase';
import SectionHeading from '../shared/SectionHeading';
import { CardSkeleton, EmptyState, ErrorState } from '../shared/StateViews';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { EventListItem } from '../../types';

const WARNA_JENIS: Record<string, string> = {
  latihan: 'bg-brand-green text-white',
  perkemahan: 'bg-brand-orange text-white',
  lomba: 'bg-brand-yellow text-brand-dark',
  baksos: 'bg-brand-blue text-white',
  pelantikan: 'bg-brand-dark text-white',
  lainnya: 'bg-white text-brand-dark',
};

export default function EventPreview() {
  const fetchEvents = useCallback((signal: AbortSignal) => {
    const today = new Date().toISOString().slice(0, 10);
    return query<EventListItem[]>(
      supabase
        .from('events')
        .select('id, judul, jenis, lokasi, tanggal_mulai, tanggal_selesai')
        .eq('is_published', true)
        .gte('tanggal_mulai', today)
        .order('tanggal_mulai', { ascending: true })
        .limit(3)
        .abortSignal(signal)
    );
  }, []);

  const { data: events, loading, error, reload } = useAsyncData<EventListItem[]>(fetchEvents, [], []);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] relative border-t border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Kegiatan Terbaru"
          title="Agenda Mendatang"
          subtitle="Kegiatan-kegiatan seru yang sudah menanti. Jangan sampai terlewat!"
        />

        {loading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Belum ada kegiatan terjadwal"
            description="Belum ada agenda yang direncanakan. Nantikan kegiatan seru berikutnya dari Trigantara!"
          />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/kegiatan"
            className="px-8 py-4 bg-brand-orange text-white font-kids font-bold text-sm sm:text-base rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            Lihat Semua Kegiatan <span aria-hidden="true">➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: EventListItem; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${index + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <article className="bg-cream-card rounded-[2rem] border border-brand-dark/15 p-7 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col justify-between w-full group">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] font-kids font-bold uppercase border border-brand-dark/15 mb-4 ${
              WARNA_JENIS[event.jenis] ?? WARNA_JENIS.lainnya
            }`}
          >
            {event.jenis}
          </span>

          <h3 className="font-serif text-xl font-bold text-brand-dark mb-4 line-clamp-2 group-hover:text-brand-orange transition-colors">
            {event.judul}
          </h3>

          <div className="space-y-3 text-xs sm:text-sm font-kids font-bold text-brand-dark/70">
            <p className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-orange shrink-0 mt-px" />
              <time dateTime={event.tanggal_mulai}>
                {new Date(event.tanggal_mulai).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </p>
            {event.lokasi && (
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-px" />
                <span>{event.lokasi}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Link
            to="/kegiatan"
            className="inline-flex items-center gap-1.5 text-xs font-kids font-bold uppercase tracking-wider text-brand-orange hover:underline"
          >
            Pelajari Selengkapnya <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
