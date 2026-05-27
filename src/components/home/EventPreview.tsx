import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Compass } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SectionHeading from '../shared/SectionHeading';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { Event } from '../../types';

export default function EventPreview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('tanggal_mulai', today)
        .order('tanggal_mulai', { ascending: true })
        .limit(3);

      setEvents(data || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] relative border-t-2 border-b-2 border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Kegiatan Terbaru"
          title="Agenda Mendatang"
          subtitle="Kegiatan-kegiatan seru yang sudah menanti. Jangan sampai terlewat!"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <EmptyEvents />
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
            className="px-8 py-4 bg-brand-orange text-white font-kids font-bold text-sm sm:text-base rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-2"
          >
            <span>Lihat Semua Kegiatan</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  const jenisColors: Record<string, string> = {
    latihan: 'bg-brand-green text-white',
    perkemahan: 'bg-brand-orange text-white',
    lomba: 'bg-brand-yellow text-brand-dark',
    baksos: 'bg-brand-blue text-white',
    pelantikan: 'bg-brand-dark text-white',
    lainnya: 'bg-white text-brand-dark',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${index + 1} ${isVisible ? 'visible' : ''} flex`}
    >
      <div className="bg-cream-card rounded-3xl border-4 border-brand-dark p-6 shadow-[6px_6px_0_#2A1B15] hover:-translate-y-1 transition-all flex flex-col justify-between w-full group">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-kids font-bold border-2 border-brand-dark mb-4 shadow-[1.5px_1.5px_0_#2A1B15] ${jenisColors[event.jenis] || jenisColors.lainnya}`}>
            {event.jenis.toUpperCase()}
          </span>
          
          <h3 className="font-serif text-xl font-bold text-brand-dark mb-4 line-clamp-2 group-hover:text-brand-orange transition-colors">
            {event.judul}
          </h3>
          
          <div className="space-y-3 text-xs sm:text-sm font-kids font-bold text-brand-dark/75">
            <p className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
              <span>{formatDate(event.tanggal_mulai)}</span>
            </p>
            {event.lokasi && (
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                <span>{event.lokasi}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Link
            to={`/kegiatan?id=${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-kids font-bold uppercase tracking-wider text-brand-orange hover:underline cursor-pointer"
          >
            Pelajari Selengkapnya ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyEvents() {
  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] max-w-md mx-auto text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-dark flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8 text-brand-orange animate-spin-slow" />
      </div>
      <h3 className="font-serif text-xl font-bold text-brand-dark">Belum ada kegiatan terjadwal</h3>
      <p className="text-xs sm:text-sm text-brand-dark/70 font-sans">
        Saat ini belum ada agenda kegiatan yang direncanakan. Nantikan agenda seru lainnya dari Trigantara!
      </p>
    </div>
  );
}
