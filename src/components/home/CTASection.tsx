import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';
import SectionDivider from '../shared/SectionDivider';

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-28 lg:py-36 bg-brand-orange relative overflow-hidden">
      {/* Top Wave Divider */}
      <SectionDivider
        variant="wave"
        color="#FAF6F0"
        flip={true}
        className="absolute top-0 left-0 right-0 w-full z-10"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center text-center lg:text-left">
          <div ref={ref} className={`lg:col-span-8 animate-slide-up ${isVisible ? 'visible' : ''} space-y-6`}>
            <span className="inline-block text-4xl select-none">⚜️</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
              Siap Bergabung dengan<br />Trigantara?
            </h2>
            <p className="text-[#FAF6F0] text-sm sm:text-base max-w-xl lg:mx-0 mx-auto leading-relaxed font-sans opacity-95 font-medium">
              Daftarkan dirimu sekarang dan mulai petualangan seru bersama kami. 
              Tidak perlu pengalaman kepramukaan sebelumnya — yang penting semangat dan kemauan kuat!
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/gabung"
                className="px-8 py-4 bg-brand-yellow text-brand-dark font-kids font-bold text-sm sm:text-base rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all flex items-center gap-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/tentang"
                className="px-8 py-4 bg-white text-brand-dark font-kids font-bold text-sm sm:text-base rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          
          {/* Right column: Fahri Anggay Pop-out Card (Hero Reference Style) */}
          <div className="lg:col-span-4 flex justify-center w-full mt-8 lg:mt-0">
            <div className="relative w-[260px] h-[350px] sm:w-[290px] sm:h-[390px] flex items-end justify-center group select-none overflow-visible">
              {/* Backdrop Shape (Rounded like Hero) */}
              <div className="absolute bottom-0 w-full h-[270px] sm:h-[310px] bg-brand-yellow rounded-[110px_110px_35px_35px] border border-brand-dark/10 shadow-soft-lg z-0 transition-transform duration-300 group-hover:scale-[1.02]" />
              
              {/* Character Image popping out */}
              <img 
                src="/assets/model/FAHRI Anggay No BG.webp" 
                alt="Fahri Anggay — Pradana Putra"
                className="absolute bottom-0 z-10 w-full h-[340px] sm:h-[390px] object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
              />

              {/* Name Label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-brand-dark/10 shadow-soft z-20 font-kids text-[11px] font-bold text-brand-dark whitespace-nowrap">
                ⚜️ Fahri — Pradana Putra
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <SectionDivider
        variant="wave"
        color="#FAF6F0"
        className="absolute bottom-0 left-0 right-0 w-full z-10"
      />
    </section>
  );
}
