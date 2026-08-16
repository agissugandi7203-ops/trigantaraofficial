import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Target, MapPin, Globe2 } from 'lucide-react';
import { HERO_STATS } from '../../data/constants';
import { useBackgroundVideo } from '../../hooks/useBackgroundVideo';

export default function HeroSection() {
  const { videoRef, isReady } = useBackgroundVideo();

  return (
    <section
      id="hero"
      className="relative pt-16 pb-4 md:pt-20 md:pb-6 overflow-hidden bg-cream-bg text-brand-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto pt-4">
            Siapkan Generasi <span className="text-brand-orange italic">Tangguh</span> Bersama Trigantara
          </h1>

          <p className="text-brand-dark/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Website resmi Pramuka SMK Marhas Margahayu (Gugus Depan Trigantara). Kami membina
            kepramukaan modern yang tangguh, mandiri, dan berprestasi.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/gabung"
              className="px-8 py-4 bg-brand-orange text-white text-base sm:text-lg font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft hover:bg-brand-orange/95 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
            >
              <span>Gabung Petualangan</span>
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <Link
              to="/tentang"
              className="px-8 py-4 bg-white text-brand-dark text-base sm:text-lg font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
            >
              <span>Tentang Kami</span>
            </Link>
          </div>
        </div>

        {/* Dua potret anggota mengapit kartu kutipan */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 mt-6 md:mt-10 max-w-6xl mx-auto">
          <ModelFrame
            src="/assets/model/nazwa.webp"
            alt="Nazwa, anggota Pramuka Trigantara"
            backdropClass="bg-brand-green rounded-[140px_140px_40px_40px]"
            decoration={
              <div className="absolute -bottom-4 -left-4 z-30 select-none text-brand-dark">
                <div className="bg-white p-3 rounded-full border border-brand-dark/10 shadow-soft flex items-center justify-center animate-float">
                  <Target className="w-6 h-6 text-brand-orange" />
                </div>
              </div>
            }
          />

          {/* Kartu kutipan tengah */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-brand-dark/10 flex flex-col items-center text-center space-y-4 max-w-sm mx-auto shadow-soft-lg">
            <span className="font-kids text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
              Eksplorasi Alam
            </span>

            <div className="w-24 h-24 relative text-brand-dark shrink-0">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden="true"
                className="w-full h-full stroke-brand-dark stroke-[2.5] stroke-linejoin-round"
              >
                <path d="M10 80 L50 20 L90 80 Z" fill="#FFCE3B" />
                <path d="M50 20 L50 80" />
                <path d="M40 80 L50 60 L60 80 Z" fill="#2A1B15" />
                <circle cx="25" cy="40" r="2" fill="#29AC60" stroke="none" />
                <circle cx="75" cy="50" r="3" fill="#FF6E31" stroke="none" />
              </svg>
            </div>

            <p className="font-serif text-base leading-relaxed text-brand-dark/95 italic">
              &ldquo;Satyaku Kudarmakan, Darmaku Kubaktikan. Di sini kami tidak sekadar berlatih,
              melainkan membentuk jiwa patriot sejati.&rdquo;
            </p>

            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
              ))}
            </div>
          </div>

          <ModelFrame
            src="/assets/model/Intan Nur Hayati No BG.webp"
            alt="Intan Nur Hayati, anggota Pramuka Trigantara"
            backdropClass="bg-brand-yellow rounded-[40px_140px_140px_40px]"
            decoration={
              <div className="absolute -bottom-2 -right-2 z-30 select-none text-brand-dark">
                <div className="bg-white p-3 rounded-full border border-brand-dark/10 shadow-soft animate-float-delayed">
                  <MapPin className="w-6 h-6 text-brand-green" />
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Panel statistik */}
      <div className="py-12 px-4 max-w-7xl mx-auto z-20 relative mt-16 md:mt-24">
        <div className="bg-brand-dark text-[#FAF6F0] rounded-[3rem] p-8 md:p-12 border border-brand-dark/20 relative overflow-hidden shadow-soft-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl" aria-hidden="true" />
          <div className="absolute top-6 right-8 text-brand-yellow select-none z-10 rotate-12" aria-hidden="true">
            <Globe2 className="w-10 h-10" />
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#FAF6F0]/20 z-10 relative">
            {HERO_STATS.map((stat, idx) => (
              <div key={stat.label} className="flex items-start gap-4 p-4 md:px-8 first:pl-0 last:pr-0">
                <span
                  className={`p-3.5 ${STAT_BADGE_COLORS[idx % STAT_BADGE_COLORS.length]} rounded-2xl border border-brand-dark/10 shrink-0 shadow-soft`}
                  aria-hidden="true"
                >
                  <span className="text-xl leading-none block">{stat.icon}</span>
                </span>
                <div>
                  <dd className="font-serif text-3xl font-bold text-brand-yellow">{stat.value}</dd>
                  <dt className="text-sm font-semibold text-[#FAF6F0]/90 mt-0.5">{stat.label}</dt>
                  <p className="text-[10px] text-[#FAF6F0]/70 uppercase font-bold tracking-wider">
                    SMK Marhas Margahayu
                  </p>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Video latar. Dekoratif sepenuhnya — tidak memuat informasi apa pun,
          sehingga aman disembunyikan dari pembaca layar dan dilewati bila
          pengguna memilih mengurangi gerakan. */}
      <div
        className="absolute inset-x-0 -top-24 bottom-0 pointer-events-none overflow-hidden select-none z-0"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="/assets/video/hero-bg.mp4"
          poster="/assets/angkatan/2026-2027/fotobersama27.webp"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          className={`w-full h-full object-cover object-top transition-opacity duration-700 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream-bg/20 via-transparent to-cream-bg z-10" />
      </div>
    </section>
  );
}

const STAT_BADGE_COLORS = [
  'bg-brand-orange',
  'bg-brand-yellow text-brand-dark',
  'bg-brand-green',
  'bg-brand-blue',
] as const;

/**
 * Bingkai potret anggota: gambar besar yang sengaja "meluber" keluar dari
 * kotak berwarna di belakangnya.
 */
function ModelFrame({
  src,
  alt,
  backdropClass,
  decoration,
}: {
  src: string;
  alt: string;
  backdropClass: string;
  decoration: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      {decoration}
      <div className="relative w-[280px] h-[420px] sm:w-[325px] sm:h-[480px] flex items-end justify-center mt-8 select-none group">
        <div
          className={`absolute bottom-0 w-full h-[360px] sm:h-[410px] border border-brand-dark/10 shadow-soft-lg z-0 transition-transform duration-300 group-hover:scale-[1.02] ${backdropClass}`}
          aria-hidden="true"
        />
        <img
          src={src}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute bottom-0 z-10 w-full h-[410px] sm:h-[480px] object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}
