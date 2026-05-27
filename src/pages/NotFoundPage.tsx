import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Compass, AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-cream-bg text-brand-dark selection:bg-brand-yellow font-sans pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-10 left-[10%] animate-bounce duration-1000 select-none opacity-20 pointer-events-none text-brand-orange text-5xl">
        ⛺
      </div>
      <div className="absolute bottom-16 right-[15%] animate-pulse duration-1000 select-none opacity-20 pointer-events-none text-brand-green text-5xl">
        🔥
      </div>
      <div className="absolute top-1/3 right-[8%] animate-bounce duration-1000 select-none opacity-20 pointer-events-none text-brand-blue text-5xl">
        🌲
      </div>

      <div className="max-w-md w-full mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] border-4 border-brand-dark p-8 md:p-10 shadow-[8px_8px_0_#2A1B15] text-center space-y-6"
        >
          {/* Animated Mascot/Compass Badge */}
          <div className="flex justify-center">
            <div className="relative p-6 bg-brand-yellow border-4 border-brand-dark rounded-full shadow-[4px_4px_0_#2A1B15] animate-float">
              <Compass className="w-16 h-16 text-brand-dark animate-spin-slow" />
              <div className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs px-2 py-1 rounded-full border-2 border-brand-dark font-kids font-bold">
                Waduh!
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-5xl font-black tracking-tight text-brand-orange">
              404
            </h1>
            <h2 className="font-serif text-2xl font-bold">
              Tersesat di Hutan?
            </h2>
            <p className="text-sm text-brand-dark/70 font-medium leading-relaxed">
              Kompas kami tidak bisa membaca koordinat halaman ini. Sepertinya kamu berjalan terlalu jauh di luar bumi perkemahan.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3.5 bg-brand-orange text-white text-sm font-kids font-bold rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Kembali Ke Beranda</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3.5 bg-brand-yellow text-brand-dark text-sm font-kids font-bold rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

