import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Compass, Flame, ArrowUpRight, Check, Star, Target, MapPin, Globe2 } from 'lucide-react';
import { HERO_STATS } from '../../data/constants';
 
export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
 
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
 
    // Explicitly configure video properties for autoplay and smooth preloading
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.play().catch(err => console.log("Initial video play error:", err));
 
    let animationFrameId: number;
 
    const checkTime = () => {
      if (video.duration) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        let opacity = 1;
 
        // Fade in over 0.5s at the start (opacity 0 to 1)
        if (currentTime < 0.5) {
          opacity = currentTime / 0.5;
        }
        // Fade out over 0.5s before the end (opacity 1 to 0)
        else if (duration - currentTime < 0.5) {
          opacity = (duration - currentTime) / 0.5;
        }
 
        video.style.opacity = String(opacity);
      }
      animationFrameId = requestAnimationFrame(checkTime);
    };
 
    animationFrameId = requestAnimationFrame(checkTime);
 
    const handleEnded = () => {
      video.style.opacity = "0";
      // Wait 100ms, reset currentTime = 0, then play() again
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => console.log("Video ended reset error:", err));
        }
      }, 100);
    };
 
    video.addEventListener('ended', handleEnded);
 
    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
 
  return (
    <section id="hero" className="relative py-12 md:py-24 overflow-hidden bg-cream-bg text-brand-dark pt-32">
      {/* Floating elements from the original site layout style */}
      <div className="absolute top-24 left-[8%] select-none z-10 pointer-events-none text-brand-orange hidden sm:block">
        <div className="relative group p-3 bg-white border border-brand-dark/10 rounded-2xl shadow-soft animate-float-slow">
          <Compass className="w-8 h-8" />
        </div>
      </div>
 
      <div className="absolute top-24 right-[12%] select-none z-10 pointer-events-none text-brand-green hidden sm:block">
        <div className="p-3 bg-white border border-brand-dark/10 rounded-full shadow-soft animate-float-delayed">
          <Flame className="w-8 h-8" />
        </div>
      </div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto pt-8">
            Siapkan Generasi <span className="text-brand-orange italic">Tangguh</span> Bersama Trigantara
          </h1>
 
          {/* Hero CTA buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/gabung"
              id="hero-start-learning-btn"
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
 
        {/* Kids visual portrait rows and middle doodle */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12 mt-16 md:mt-24 max-w-6xl mx-auto">
          
          {/* Left Model Container with Pop-out 3D Effect */}
          <div className="relative flex justify-center">
            {/* Outer decorative archery target */}
            <div className="absolute -bottom-4 -left-4 z-30 select-none text-brand-dark">
              <div className="bg-white p-3 rounded-full border border-brand-dark/10 shadow-soft flex items-center justify-center animate-float">
                <Target className="w-6 h-6 text-brand-orange" />
              </div>
            </div>
 
            {/* Container for pop-out layout */}
            <div className="relative w-[280px] h-[380px] flex items-end justify-center group mt-8">
              {/* Green Frame Backdrop Shape */}
              <div className="absolute bottom-0 w-full h-[320px] bg-brand-green rounded-[140px_140px_40px_40px] border border-brand-dark/10 shadow-soft-lg z-0" />
              
              {/* Large overlapping image */}
              <img 
                src="/assets/model/nazwa.png"
                alt="Nazwa Anggota Pramuka"
                className="absolute bottom-0 left-[-100%] right-[-100%] mx-auto z-10 w-[384%] h-[1050px] max-w-none object-contain object-bottom transform translate-x-[-140px] select-none pointer-events-none"
              />
            </div>
          </div>
 
          {/* Center Interactive Laptop Doodle with Quote */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-brand-dark/10 flex flex-col items-center text-center space-y-4 max-w-sm mx-auto shadow-soft-lg">
            <span className="font-kids text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
              Eksplorasi Alam
            </span>
            
            {/* Campfire SVG */}
            <div className="w-24 h-24 relative text-brand-dark shrink-0">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-brand-dark stroke-[2.5] stroke-linejoin-round">
                 <path d="M10 80 L50 20 L90 80 Z" fill="#FFCE3B" />
                 <path d="M50 20 L50 80" />
                 <path d="M40 80 L50 60 L60 80 Z" fill="#2A1B15" />
                 <circle cx="25" cy="40" r="2" fill="#29AC60" stroke="none" />
                 <circle cx="75" cy="50" r="3" fill="#FF6E31" stroke="none" />
               </svg>
            </div>
 
            <p className="font-serif text-base leading-relaxed text-brand-dark/95 italic">
              "Satyaku Kudarmakan, Darmaku Kubaktikan. Di sini kami tidak sekadar berlatih, melainkan membentuk jiwa patriot sejati."
            </p>
            
            <div className="flex gap-1">
              <Star className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
              <Star className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
              <Star className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
              <Star className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
              <Star className="w-4 h-4 fill-brand-yellow stroke-brand-dark/20" />
            </div>
          </div>
 
          {/* Right Model Container with Pop-out 3D Effect */}
          <div className="relative flex justify-center">
            {/* Outer Red mini-backpack decal */}
            <div className="absolute -bottom-2 -right-2 z-30 select-none text-brand-dark">
              <div className="bg-white p-3 rounded-full border border-brand-dark/10 shadow-soft animate-float-delayed">
                <MapPin className="w-6 h-6 text-brand-green" />
              </div>
            </div>
 
            {/* Container for pop-out layout */}
            <div className="relative w-[280px] h-[380px] flex items-end justify-center group mt-8">
              {/* Girl's Frame Backdrop Card */}
              <div className="absolute bottom-0 w-full h-[320px] bg-brand-yellow rounded-[40px_140px_140px_40px] border border-brand-dark/10 shadow-soft-lg z-0" />
              
              {/* Large overlapping image */}
              <img 
                src="/assets/model/Intan Nur Hayati No BG.png"
                alt="Intan Nur Hayati"
                className="absolute bottom-0 left-[-100%] right-[-100%] mx-auto z-10 w-[384%] h-[1050px] max-w-none object-contain object-bottom transform translate-x-[-160px] select-none pointer-events-none"
              />
            </div>
          </div>
      </div>
    </div>
 
    {/* Dark Chocolate Statistics Banner */}
      <div className="py-12 px-4 max-w-7xl mx-auto z-20 relative mt-16 md:mt-24">
        <div className="bg-brand-dark text-[#FAF6F0] rounded-[3rem] p-8 md:p-12 border border-brand-dark/20 relative overflow-hidden shadow-soft-xl">
          {/* Wave background details */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl"></div>
          
          {/* Flying Paper Airplane illustration in top-right */}
          <div className="absolute top-6 right-8 text-brand-yellow select-none z-10 transform rotate-12">
            <Globe2 className="w-10 h-10" />
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#FAF6F0]/20 z-10 relative">
            {HERO_STATS.map((stat, idx) => {
              let badgeColor = "bg-brand-orange";
              if (idx === 1) badgeColor = "bg-brand-yellow text-brand-dark";
              if (idx === 2) badgeColor = "bg-brand-green";
              if (idx === 3) badgeColor = "bg-brand-blue";
 
              return (
                <div key={idx} className="flex items-start gap-4 p-4 md:px-8 first:pl-0 last:pr-0">
                  <span className={`p-3.5 ${badgeColor} rounded-2xl border border-brand-dark/10 shrink-0 shadow-soft`}>
                    <span className="text-xl leading-none block">{stat.icon}</span>
                  </span>
                  <div>
                    <h4 className="font-serif text-3xl font-bold text-brand-yellow">{stat.value}</h4>
                    <p className="text-sm font-semibold text-[#FAF6F0]/90 mt-0.5">{stat.label}</p>
                    <p className="text-[10px] text-[#FAF6F0]/70 uppercase font-bold tracking-wider">SMK Marhas Margahayu</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* Video Background */}
      <div 
        className="absolute inset-x-0 top-0 h-[550px] md:h-full pointer-events-none overflow-hidden select-none z-0" 
      >
        <video
          ref={videoRef}
          src="/assets/video/hero-bg.mp4"
          muted
          playsInline
          autoPlay
          loop
          className="w-full h-full object-cover object-top transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-bg via-transparent to-cream-bg pointer-events-none z-10" />
      </div>
    </section>
  );
}
