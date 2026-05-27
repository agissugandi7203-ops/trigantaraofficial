import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Compass, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-28 bg-brand-orange relative overflow-hidden border-t-4 border-b-4 border-brand-dark">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <span className="absolute top-[20%] left-[5%] text-4xl opacity-20 animate-float">⛺</span>
        <span className="absolute bottom-[20%] right-[8%] text-3xl opacity-20 animate-float-delayed">🧭</span>
        <span className="absolute top-[50%] right-[15%] text-3xl opacity-15 animate-float">🪢</span>
      </div>

      <div
        ref={ref}
        className={`animate-slide-up ${isVisible ? 'visible' : ''} max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative`}
      >
        <span className="inline-block text-5xl mb-6 select-none">
          ⚜️
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
          Siap Bergabung dengan<br />Trigantara?
        </h2>

        <p className="text-[#FAF6F0] text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-sans opacity-95">
          Daftarkan dirimu sekarang dan mulai petualangan seru bersama kami. 
          Tidak perlu pengalaman kepramukaan sebelumnya — yang penting semangat dan kemauan kuat!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/gabung"
            className="px-8 py-4 bg-brand-yellow text-brand-dark font-kids font-bold text-sm sm:text-base rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
          >
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            to="/tentang"
            className="px-8 py-4 bg-white text-brand-dark font-kids font-bold text-sm sm:text-base rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </section>
  );
}
