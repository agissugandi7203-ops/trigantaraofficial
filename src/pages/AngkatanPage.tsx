import { useCallback, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase, query } from '../lib/supabase';
import SubpageHeader from '../components/shared/SubpageHeader';
import { LoadingState, ErrorState } from '../components/shared/StateViews';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeo } from '../hooks/useSeo';
import type { Angkatan, PublicMember } from '../types';

const ANGKATAN_CADANGAN: Angkatan[] = [
  {
    id: 'lokal-2025',
    tahun_ajaran: '2025-2026',
    nama_angkatan: 'Angkatan Pertama',
    foto_bersama_url: '/assets/angkatan/2025-2026/fotobersama26.webp',
    deskripsi:
      'Angkatan perintis Trigantara yang membangun fondasi awal organisasi dan tata kelola ambalan.',
    is_active: false,
    created_at: '',
  },
  {
    id: 'lokal-2026',
    tahun_ajaran: '2026-2027',
    nama_angkatan: 'Angkatan Kedua',
    foto_bersama_url: '/assets/angkatan/2026-2027/fotobersama27.webp',
    deskripsi:
      'Angkatan penerus estafet kepemimpinan Trigantara yang memperluas jangkauan kegiatan Gudep.',
    is_active: true,
    created_at: '',
  },
];

interface DataAngkatan {
  angkatan: Angkatan[];
  anggota: PublicMember[];
}

export default function AngkatanPage() {
  const [tabAktif, setTabAktif] = useState<string | null>(null);

  useSeo({
    title: 'Arsip Angkatan',
    description:
      'Arsip angkatan dan pengurus Ambalan Ki Hajar Dewantara & Inggit Garnasih, Gugus Depan Trigantara SMK Marhas Margahayu.',
    path: '/angkatan',
  });

  const fetchData = useCallback(async (signal: AbortSignal): Promise<DataAngkatan> => {
    const angkatan = await query<Angkatan[]>(
      supabase.from('angkatan').select('*').order('tahun_ajaran', { ascending: false }).abortSignal(signal)
    );

    // Daftar anggota diambil dari view `members_public` — proyeksi tanpa nomor
    // HP, alamat, maupun data pribadi lain. Bila view belum ada (migrasi 002
    // belum dijalankan), daftar anggota dikosongkan. Sengaja TIDAK jatuh ke
    // tabel `members` sebagai cadangan: itu justru akan membocorkan data yang
    // ingin dilindungi.
    const { data, error } = await supabase
      .from('members_public')
      .select('*')
      .eq('status', 'aktif')
      .abortSignal(signal);

    if (error) {
      console.warn('[Trigantara] members_public belum tersedia — daftar anggota disembunyikan.');
      return { angkatan, anggota: [] };
    }

    return { angkatan, anggota: (data as PublicMember[]) ?? [] };
  }, []);

  const { data, loading, error, reload } = useAsyncData<DataAngkatan>(fetchData, [], {
    angkatan: [],
    anggota: [],
  });

  const daftarAngkatan = data.angkatan.length > 0 ? data.angkatan : ANGKATAN_CADANGAN;

  const anggotaPerAngkatan = useMemo(() => {
    const grup: Record<string, PublicMember[]> = {};
    for (const m of data.anggota) {
      if (!m.angkatan_id) continue;
      (grup[m.angkatan_id] ??= []).push(m);
    }
    return grup;
  }, [data.anggota]);

  const idAktif = tabAktif ?? daftarAngkatan[0]?.id ?? '';
  const angkatanAktif = daftarAngkatan.find((a) => a.id === idAktif);

  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      <SubpageHeader
        badge="Arsip Sejarah"
        title="Arsip Angkatan"
        subtitle="Setiap angkatan punya ceritanya sendiri. Temukan jejak mereka di sini."
        bgVariant="orange"
        modelImage="/assets/model/kaisya.webp"
        modelName="Kaisya"
        modelAlign="right"
        modelSize="large"
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState label="Memuat data angkatan…" />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : (
            <>
              <div role="tablist" aria-label="Pilih angkatan" className="flex flex-wrap gap-3 mb-12 justify-center">
                {daftarAngkatan.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    aria-selected={idAktif === a.id}
                    onClick={() => setTabAktif(a.id)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-kids font-bold border transition-all cursor-pointer ${
                      idAktif === a.id
                        ? 'bg-brand-dark text-white border-brand-dark shadow-soft'
                        : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-dark/25'
                    }`}
                  >
                    TA {a.tahun_ajaran}
                    {a.is_active && <span className="ml-1.5 text-[10px]">✨ Aktif</span>}
                  </button>
                ))}
              </div>

              {angkatanAktif && (
                <DetailAngkatan
                  key={angkatanAktif.id}
                  angkatan={angkatanAktif}
                  anggota={anggotaPerAngkatan[angkatanAktif.id] ?? []}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function DetailAngkatan({ angkatan, anggota }: { angkatan: Angkatan; anggota: PublicMember[] }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-slide-up ${isVisible ? 'visible' : ''}`}>
      {angkatan.foto_bersama_url && (
        <figure className="relative rounded-[2rem] border border-brand-dark/15 overflow-hidden aspect-[21/9] mb-10 bg-cream-dark shadow-soft-lg flex items-end">
          <img
            src={angkatan.foto_bersama_url}
            alt={`Foto bersama angkatan ${angkatan.tahun_ajaran}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent"
            aria-hidden="true"
          />
          <figcaption className="bg-white border border-brand-dark/10 rounded-2xl p-4 m-4 sm:m-6 shadow-soft relative z-10 max-w-sm">
            <h2 className="font-serif text-lg sm:text-2xl font-black leading-tight">
              {angkatan.nama_angkatan || `Angkatan ${angkatan.tahun_ajaran}`}
            </h2>
            <p className="text-[10px] font-kids font-bold text-brand-orange uppercase tracking-wider mt-0.5">
              Tahun Ajaran {angkatan.tahun_ajaran}
            </p>
          </figcaption>
        </figure>
      )}

      {angkatan.deskripsi && (
        <div className="bg-white/60 p-6 rounded-3xl border border-brand-dark/15 text-center max-w-3xl mx-auto mb-16 shadow-soft">
          <p className="text-brand-dark/85 leading-relaxed text-sm sm:text-base font-sans">
            {angkatan.deskripsi}
          </p>
        </div>
      )}

      {anggota.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full text-xs font-kids font-bold uppercase mb-2">
              <Users className="w-3.5 h-3.5" />
              Daftar Anggota
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-brand-dark">
              Anggota Aktif &amp; Pengurus ({anggota.length} orang)
            </h3>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {anggota.map((m) => (
              <li
                key={m.id}
                className="bg-cream-card rounded-2xl border border-brand-dark/15 p-5 text-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-full border border-brand-dark/10 overflow-hidden bg-white shadow-soft mb-4 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  {m.foto_url ? (
                    <img
                      src={m.foto_url}
                      alt={m.nama_lengkap}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-2xl" aria-hidden="true">
                      {m.ambalan === 'putra' ? '👦' : '👧'}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-kids font-bold text-brand-dark line-clamp-2">
                  {m.nama_lengkap}
                </p>

                <span
                  className={`px-2.5 py-0.5 mt-1.5 text-[9px] rounded-full font-kids font-bold uppercase leading-none border ${
                    m.jabatan
                      ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
                      : 'bg-brand-green/10 text-brand-green border-brand-green/20'
                  }`}
                >
                  {m.jabatan || 'Anggota'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
