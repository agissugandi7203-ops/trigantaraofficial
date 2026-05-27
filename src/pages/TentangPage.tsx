import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GUDEP_INFO } from '../data/constants';
import SectionHeading from '../components/shared/SectionHeading';
import { Target, Compass } from 'lucide-react';

export default function TentangPage() {
  return (
    <main className="pt-24 min-h-screen bg-cream-bg text-brand-dark">
      {/* Hero Banner */}
      <section className="bg-brand-orange py-20 lg:py-28 relative overflow-hidden border-b-4 border-brand-dark">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 right-10 text-8xl opacity-15">⚜️</div>
          <div className="absolute bottom-5 left-10 text-5xl opacity-10 animate-bounce">⛺</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-kids font-bold uppercase bg-brand-yellow text-brand-dark border-2 border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)] mb-4">
            TENTANG KAMI
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
            Gugus Depan {GUDEP_INFO.nama.replace('Gugus Depan ', '')}
          </h1>
          <p className="text-[#FAF6F0] text-sm sm:text-lg max-w-2xl mx-auto font-sans font-medium opacity-90">
            {GUDEP_INFO.pangkalan} — {GUDEP_INFO.yayasan}
          </p>
        </div>
      </section>

      {/* Sejarah */}
      <SejarahSection />

      {/* Visi Misi */}
      <VisiMisiSection />

      {/* Ambalan */}
      <AmbalanSection />
    </main>
  );
}

function SejarahSection() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="sejarah" className="py-20 lg:py-28 bg-[#FAF6F0] relative border-b-2 border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div ref={ref} className={`lg:col-span-7 animate-slide-up ${isVisible ? 'visible' : ''}`}>
            <SectionHeading badge="Sejarah" title="Asal Usul Trigantara" centered={false} />
            <p className="text-brand-dark/85 leading-relaxed text-sm sm:text-base font-sans font-medium">
              {GUDEP_INFO.sejarah}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-brand-dark rounded-xl shadow-[3px_3px_0_#2A1B15]">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-[10px] font-kids font-bold text-brand-dark/50 leading-none">Nomor Gudep</p>
                  <p className="text-sm font-kids font-bold text-brand-orange mt-0.5">{GUDEP_INFO.nomorGudep}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-brand-dark rounded-xl shadow-[3px_3px_0_#2A1B15]">
                <span className="text-xl">🏫</span>
                <div>
                  <p className="text-[10px] font-kids font-bold text-brand-dark/50 leading-none">Pangkalan</p>
                  <p className="text-sm font-kids font-bold text-brand-green mt-0.5">{GUDEP_INFO.pangkalan}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-6 bg-white border-4 border-brand-dark rounded-3xl shadow-[8px_8px_0_#2A1B15] w-64 h-64 flex items-center justify-center animate-float">
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
    <section id="visi-misi" className="py-20 lg:py-28 bg-cream-bg relative border-b-2 border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading badge="Visi & Misi" title="Arah dan Tujuan Kami" />
        <div ref={ref} className={`animate-slide-up ${isVisible ? 'visible' : ''} grid md:grid-cols-2 gap-8 max-w-5xl mx-auto`}>
          {/* Visi */}
          <div className="bg-brand-yellow text-brand-dark rounded-3xl border-4 border-brand-dark p-8 shadow-[6px_6px_0_#2A1B15] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white border-2 border-brand-dark rounded-xl flex items-center justify-center text-xl mb-5 shadow-[2px_2px_0_#2A1B15]">
                <Compass className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="font-serif text-3xl font-black text-brand-dark mb-4">Visi</h3>
              <p className="font-sans text-sm sm:text-base font-medium leading-relaxed">{GUDEP_INFO.visi}</p>
            </div>
          </div>
          {/* Misi */}
          <div className="bg-brand-green text-white rounded-3xl border-4 border-brand-dark p-8 shadow-[6px_6px_0_#2A1B15]">
            <div className="w-12 h-12 bg-white border-2 border-brand-dark rounded-xl flex items-center justify-center text-xl mb-5 shadow-[2px_2px_0_#2A1B15]">
              <Target className="w-6 h-6 text-brand-orange" />
            </div>
            <h3 className="font-serif text-3xl font-black text-white mb-4">Misi</h3>
            <ol className="space-y-4">
              {GUDEP_INFO.misi.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm font-sans font-medium leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-yellow border-2 border-brand-dark text-brand-dark rounded-full flex items-center justify-center text-xs font-bold font-kids">
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
            <div className="bg-white rounded-3xl border-4 border-brand-dark p-8 text-center w-full shadow-[6px_6px_0_#2A1B15] flex flex-col justify-between items-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-full flex flex-col items-center">
                <div className="w-28 h-28 rounded-2xl border-2 border-brand-dark p-2 bg-white shadow-[3px_3px_0_#29AC60] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
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
            <div className="bg-white rounded-3xl border-4 border-brand-dark p-8 text-center w-full shadow-[6px_6px_0_#2A1B15] flex flex-col justify-between items-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-full flex flex-col items-center">
                <div className="w-28 h-28 rounded-2xl border-2 border-brand-dark p-2 bg-white shadow-[3px_3px_0_#FF6E31] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/assets/logo/AMBALAN PUTRI.webp"
                    alt="Logo Ambalan Putri"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-serif text-2xl font-black text-brand-dark mb-1">
                  Ambalan Putri
                </h3>
                <p className="font-kids text-sm font-bold text-brand-orange mb-4">
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
