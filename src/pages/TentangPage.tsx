import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GUDEP_INFO } from '../data/constants';
import SectionHeading from '../components/shared/SectionHeading';
import SubpageHeader from '../components/shared/SubpageHeader';
import { Target, Compass } from 'lucide-react';

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark">
      {/* Hero Banner replaced by SubpageHeader */}
      <SubpageHeader
        badge="Profil Organisasi"
        title={`Gugus Depan ${GUDEP_INFO.nama.replace('Gugus Depan ', '')}`}
        subtitle={`${GUDEP_INFO.pangkalan} — ${GUDEP_INFO.yayasan}`}
        bgVariant="orange"
        modelImage="/assets/model/salsa.png"
        modelName="Salsa"
        modelAlign="right"
        modelSize="large"
      />

      {/* Sejarah */}
      <SejarahSection />

      {/* Visi Misi */}
      <VisiMisiSection />

      {/* Ambalan */}
      <AmbalanSection />

      {/* Pembina */}
      <PembinaSection />
    </main>
  );
}

function SejarahSection() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="sejarah" className="py-20 lg:py-28 bg-[#FAF6F0] relative border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div ref={ref} className={`lg:col-span-7 animate-slide-up ${isVisible ? 'visible' : ''}`}>
            <SectionHeading badge="Sejarah" title="Asal Usul Trigantara" centered={false} />
            <p className="text-brand-dark/85 leading-relaxed text-sm sm:text-base font-sans font-medium">
              {GUDEP_INFO.sejarah}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-brand-dark/10 rounded-xl shadow-soft">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-[10px] font-kids font-bold text-brand-dark/50 leading-none">Nomor Gudep</p>
                  <p className="text-sm font-kids font-bold text-brand-green mt-0.5">{GUDEP_INFO.noGudep}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-brand-dark/10 rounded-xl shadow-soft">
                <span className="text-xl">🏫</span>
                <div>
                  <p className="text-[10px] font-kids font-bold text-brand-dark/50 leading-none">Pangkalan</p>
                  <p className="text-sm font-kids font-bold text-brand-green mt-0.5">{GUDEP_INFO.pangkalan}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-6 bg-white border border-brand-dark/10 rounded-3xl shadow-soft-lg w-64 h-64 flex items-center justify-center animate-float">
              <img
                src="/assets/logo/LOGO TRIGANTARA (2).webp"
                alt="Logo Trigantara"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisiMisiSection() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="visi-misi" className="py-20 lg:py-28 bg-cream-bg relative border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading badge="Visi & Misi" title="Arah dan Tujuan Kami" />
        <div ref={ref} className={`animate-slide-up ${isVisible ? 'visible' : ''} grid md:grid-cols-2 gap-8 max-w-5xl mx-auto`}>
          {/* Visi */}
          <div className="bg-brand-yellow text-brand-dark rounded-[2.5rem] border border-brand-dark/15 p-8 shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white border border-brand-dark/10 rounded-xl flex items-center justify-center text-xl mb-5 shadow-soft">
                <Compass className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="font-serif text-3xl font-black text-brand-dark mb-4">Visi</h3>
              <p className="font-sans text-sm sm:text-base font-semibold leading-relaxed">{GUDEP_INFO.visi}</p>
            </div>
          </div>
          {/* Misi */}
          <div className="bg-brand-green text-white rounded-[2.5rem] border border-brand-dark/15 p-8 shadow-soft">
            <div className="w-12 h-12 bg-white border border-brand-dark/10 rounded-xl flex items-center justify-center text-xl mb-5 shadow-soft">
              <Target className="w-6 h-6 text-brand-orange" />
            </div>
            <h3 className="font-serif text-3xl font-black text-white mb-4">Misi</h3>
            <ol className="space-y-4">
              {GUDEP_INFO.misi.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm font-sans font-semibold leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-yellow border border-brand-dark/10 text-brand-dark rounded-full flex items-center justify-center text-xs font-bold font-kids shadow-soft">
                    {i + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function AmbalanSection() {
  const { ref: ref1, isVisible: v1 } = useScrollAnimation();
  const { ref: ref2, isVisible: v2 } = useScrollAnimation();

  return (
    <section id="struktur" className="py-20 lg:py-28 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Dewan Ambalan"
          title="Ambalan Putra & Putri"
          subtitle="Dua pilar yang menjadi fondasi kepemimpinan di Trigantara."
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ambalan Putra */}
          <div ref={ref1} className={`animate-slide-up ${v1 ? 'visible' : ''} flex`}>
            <div className="bg-white rounded-[2.5rem] border border-brand-dark/15 p-8 text-center w-full shadow-soft hover:shadow-soft-lg flex flex-col justify-between items-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-full flex flex-col items-center">
                {/* Shield Style Sticker Badge */}
                <div className="w-32 h-32 bg-white border border-brand-dark/15 rounded-[2rem] p-3 shadow-soft hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative flex items-center justify-center mb-6">
                  <div className="absolute -top-2 -right-2 bg-brand-green text-white text-[9px] font-kids font-black px-2 py-0.5 rounded-full border border-brand-dark/10 uppercase tracking-wider shadow-soft">
                    Putra
                  </div>
                  <img
                    src="/assets/logo/AMBALAN PUTRA.png"
                    alt="Logo Ambalan Putra"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-serif text-2xl font-black text-brand-dark mb-1">
                  Ambalan Putra
                </h3>
                <p className="font-kids text-sm font-bold text-brand-green mb-4">
                  "{GUDEP_INFO.ambalanPutra.nama}"
                </p>
                <p className="text-xs sm:text-sm text-brand-dark/75 font-sans leading-relaxed">
                  {GUDEP_INFO.ambalanPutra.deskripsi}
                </p>
              </div>
            </div>
          </div>

          {/* Ambalan Putri */}
          <div ref={ref2} className={`animate-slide-up stagger-2 ${v2 ? 'visible' : ''} flex`}>
            <div className="bg-white rounded-[2.5rem] border border-brand-dark/15 p-8 text-center w-full shadow-soft hover:shadow-soft-lg flex flex-col justify-between items-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-full flex flex-col items-center">
                {/* Shield Style Sticker Badge */}
                <div className="w-32 h-32 bg-white border border-brand-dark/15 rounded-[2rem] p-3 shadow-soft hover:scale-105 group-hover:-rotate-3 transition-all duration-300 relative flex items-center justify-center mb-6">
                  <div className="absolute -top-2 -right-2 bg-[#8B5E3C] text-white text-[9px] font-kids font-black px-2 py-0.5 rounded-full border border-brand-dark/10 uppercase tracking-wider shadow-soft">
                    Putri
                  </div>
                  {/* Changed path to AMBALAN PUTRI.png to ensure it exists */}
                  <img
                    src="/assets/logo/AMBALAN PUTRI.png"
                    alt="Logo Ambalan Putri"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-serif text-2xl font-black text-brand-dark mb-1">
                  Ambalan Putri
                </h3>
                {/* Unified Tone text: Earthy/Natural warm brown light */}
                <p className="font-kids text-sm font-bold text-[#8B5E3C] mb-4">
                  "{GUDEP_INFO.ambalanPutri.nama}"
                </p>
                <p className="text-xs sm:text-sm text-brand-dark/75 font-sans leading-relaxed">
                  {GUDEP_INFO.ambalanPutri.deskripsi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PembinaSection() {
  const { ref: ref1, isVisible: v1 } = useScrollAnimation();
  const { ref: ref2, isVisible: v2 } = useScrollAnimation();

  const instructors = [
    {
      nama: 'Kak Heri Hermawan, S.Pd.',
      jabatan: 'Pembina Gugus Depan Putra (Gudep 29.039)',
      kuotes: 'Pramuka melatih kita menjadi pribadi yang mandiri, berkarakter, dan selalu siap sedia berbakti bagi masyarakat.',
      badgeColor: 'bg-brand-green',
      iconColor: 'text-brand-green',
      rotate: 'rotate-[-2deg]',
      logo: '/assets/logo/AMBALAN PUTRA.png'
    },
    {
      nama: 'Kak Rina Mariana, S.Pd.',
      jabatan: 'Pembina Gugus Depan Putri (Gudep 29.040)',
      kuotes: 'Melalui kebersamaan dan kedisiplinan, kita wujudkan generasi muda yang tangguh, cerdas, dan berakhlak mulia.',
      badgeColor: 'bg-[#8B5E3C]',
      iconColor: 'text-[#8B5E3C]',
      rotate: 'rotate-[2deg]',
      logo: '/assets/logo/AMBALAN PUTRI.png'
    }
  ];

  return (
    <section id="pembina" className="py-20 lg:py-28 bg-[#FAF6F0] border-t border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Struktur Pembina"
          title="Pembina Gugus Depan"
          subtitle="Para pembimbing senior yang berdedikasi mengarahkan roda kegiatan Pramuka Trigantara."
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-16">
          {instructors.map((pembina, idx) => {
            const isPutra = idx === 0;
            const ref = isPutra ? ref1 : ref2;
            const isVisible = isPutra ? v1 : v2;

            return (
              <div
                key={idx}
                ref={ref}
                className={`animate-slide-up ${isPutra ? '' : 'stagger-2'} ${isVisible ? 'visible' : ''} flex`}
              >
                <div className="bg-white rounded-[2.5rem] border border-brand-dark/15 p-8 w-full shadow-soft hover:shadow-soft-lg flex flex-col sm:flex-row gap-8 items-center hover:-translate-y-1 transition-all duration-300 group">
                  {/* Pop-out Character Card (Hero reference style) */}
                  <div className="relative w-[180px] h-[220px] shrink-0 flex items-end justify-center select-none overflow-visible">
                    {/* Backdrop Shape */}
                    <div className={`absolute bottom-0 w-full h-[170px] ${isPutra ? 'bg-brand-green' : 'bg-[#8B5E3C]'} rounded-[60px_60px_20px_20px] border border-brand-dark/10 shadow-soft z-0 transition-transform duration-300 group-hover:scale-[1.02]`} />
                    
                    {/* Character image */}
                    <img
                      src={isPutra ? '/assets/model/FAHRI Anggay No BG.png' : '/assets/model/afika.png'}
                      alt={pembina.nama}
                      className="absolute bottom-0 w-[380%] h-[380px] left-[-140%] right-[-140%] mx-auto z-10 max-w-none object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Info text */}
                  <div className="flex-1 text-center sm:text-left space-y-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-kids font-black text-white uppercase tracking-wider ${pembina.badgeColor}`}>
                      {isPutra ? 'Pembina Putra' : 'Pembina Putri'}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-brand-dark">
                      {pembina.nama}
                    </h3>
                    <p className="font-kids text-xs font-bold text-brand-dark/50 leading-none">
                      {pembina.jabatan}
                    </p>
                    <p className="text-xs sm:text-sm text-brand-dark/75 italic font-sans font-medium leading-relaxed pt-2">
                      "{pembina.kuotes}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
