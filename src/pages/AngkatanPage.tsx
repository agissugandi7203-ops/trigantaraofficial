import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/shared/SectionHeading';
import SubpageHeader from '../components/shared/SubpageHeader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { Angkatan, Member } from '../types';
import { Users } from 'lucide-react';

const FALLBACK_ANGKATAN: Angkatan[] = [
  { id: 'local-1', tahun_ajaran: '2025-2026', nama_angkatan: 'Angkatan Pertama', foto_bersama_url: '/assets/angkatan/2025-2026/fotobersama26.webp', deskripsi: 'Angkatan perintis Trigantara yang membangun fondasi awal organisasi dan tata kelola ambalan.', is_active: false, created_at: '' },
  { id: 'local-2', tahun_ajaran: '2026-2027', nama_angkatan: 'Angkatan Kedua', foto_bersama_url: '/assets/angkatan/2026-2027/fotobersama27.webp', deskripsi: 'Angkatan penerus estafet kepemimpinan Trigantara yang memperluas jangkauan kegiatan Gudep.', is_active: true, created_at: '' },
];

export default function AngkatanPage() {
  const [angkatanList, setAngkatanList] = useState<Angkatan[]>([]);
  const [members, setMembers] = useState<Record<string, Member[]>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: angData } = await supabase.from('angkatan').select('*').order('tahun_ajaran', { ascending: false });
      const list = angData && angData.length > 0 ? angData : FALLBACK_ANGKATAN;
      setAngkatanList(list);
      setActiveTab(list[0]?.id || '');

      // Fetch members for all angkatan
      if (angData && angData.length > 0) {
        const { data: memData } = await supabase.from('members').select('*').neq('status', 'nonaktif');
        if (memData) {
          const grouped: Record<string, Member[]> = {};
          memData.forEach((m) => { if (m.angkatan_id) { (grouped[m.angkatan_id] ||= []).push(m); } });
          setMembers(grouped);
        }
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const activeAngkatan = angkatanList.find((a) => a.id === activeTab);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      {/* SubpageHeader replacing flat hero banner */}
      <SubpageHeader
        badge="Arsip Sejarah"
        title="Arsip Angkatan"
        subtitle="Setiap angkatan punya ceritanya sendiri. Temukan jejak mereka di sini."
        bgVariant="orange"
        modelImage="/assets/model/kaisya.png"
        modelName="Kaisya"
        modelAlign="right"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-orange rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {angkatanList.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveTab(a.id)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-kids font-bold border-2 transition-all cursor-pointer ${
                      activeTab === a.id
                        ? 'bg-brand-dark text-white border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)]'
                        : 'bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark'
                    }`}
                  >
                    <span>TA {a.tahun_ajaran}</span>
                    {a.is_active && <span className="ml-1 text-[10px]">✨ Aktif</span>}
                  </button>
                ))}
              </div>

              {/* Content */}
              {activeAngkatan && (
                <AngkatanDetail angkatan={activeAngkatan} members={members[activeAngkatan.id] || []} />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function AngkatanDetail({ angkatan, members }: { angkatan: Angkatan; members: Member[] }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-slide-up ${isVisible ? 'visible' : ''}`}>
      {/* Foto Bersama */}
      {angkatan.foto_bersama_url && (
        <div className="relative rounded-[2rem] border border-brand-dark/15 overflow-hidden aspect-[21/9] mb-10 bg-cream-dark shadow-soft-lg flex items-end">
          <img
            src={angkatan.foto_bersama_url}
            alt={`Foto bersama ${angkatan.tahun_ajaran}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent pointer-events-none" />
          
          <div className="bg-white border border-brand-dark/10 rounded-2xl p-4 m-4 sm:m-6 shadow-soft relative z-10 text-brand-dark text-left inline-block max-w-sm">
            <h2 className="font-serif text-lg sm:text-2xl font-black leading-tight">
              {angkatan.nama_angkatan || `Angkatan ${angkatan.tahun_ajaran}`}
            </h2>
            <p className="text-[10px] font-kids font-bold text-brand-orange uppercase tracking-wider mt-0.5">Tahun Ajaran {angkatan.tahun_ajaran}</p>
          </div>
        </div>
      )}

      {angkatan.deskripsi && (
        <div className="bg-white/40 p-6 rounded-3xl border-2 border-brand-dark/25 text-center max-w-3xl mx-auto mb-16 shadow-inner">
          <p className="text-brand-dark/85 leading-relaxed text-sm sm:text-base font-sans font-medium">
            {angkatan.deskripsi}
          </p>
        </div>
      )}

      {/* Members */}
      {members.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full text-xs font-kids font-bold uppercase mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Daftar Anggota</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-brand-dark">
              Anggota Aktif & Pengurus ({members.length} Orang)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {members.map((m) => (
              <div key={m.id} className="bg-cream-card rounded-2xl border border-brand-dark/15 p-5 text-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group">
                <div className="w-18 h-18 rounded-full border border-brand-dark/10 overflow-hidden bg-white shadow-soft mb-4 flex items-center justify-center group-hover:scale-105 transition-all shrink-0">
                  {m.foto_url ? (
                    <img src={m.foto_url} alt={m.nama_lengkap} className="w-full h-full object-cover object-top" />
                  ) : (
                    <span className="text-2xl select-none">
                      {m.ambalan === 'putra' ? '👦' : '👧'}
                    </span>
                  )}
                </div>
                
                <p className="text-xs sm:text-sm font-kids font-bold text-brand-dark line-clamp-1">{m.nama_lengkap}</p>
                
                {m.jabatan ? (
                  <span className="px-2.5 py-0.5 mt-1.5 text-[9px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full font-kids font-bold uppercase leading-none">
                    {m.jabatan}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 mt-1.5 text-[9px] bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full font-kids font-bold uppercase leading-none">
                    Anggota
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
