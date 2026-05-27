import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../../data/constants';
import SectionHeading from '../shared/SectionHeading';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="py-20 lg:py-28 bg-brand-yellow relative overflow-hidden border-b-2 border-brand-dark/10">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 right-10 text-6xl opacity-20">⚜️</div>
        <div className="absolute bottom-10 left-10 text-8xl opacity-15">❝</div>
        <div className="absolute top-1/2 left-8 text-4xl opacity-15 animate-bounce">🏕️</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          badge="Testimoni"
          title="Kata Mereka Tentang Kami"
          subtitle="Pengalaman nyata dari para penegak dan anggota aktif Gugus Depan Trigantara."
        />

        <div
          ref={ref}
          className={`animate-slide-up ${isVisible ? 'visible' : ''}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Card Quote */}
            <div className="bg-white border-4 border-brand-dark rounded-[2rem] p-8 sm:p-12 mb-8 min-h-[220px] flex flex-col items-center justify-center shadow-[8px_8px_0_#2A1B15] relative">
              {/* Star ratings */}
              <div className="flex gap-1.5 mb-6">
                <Star className="w-5 h-5 fill-brand-yellow text-brand-dark stroke-[2.5]" />
                <Star className="w-5 h-5 fill-brand-yellow text-brand-dark stroke-[2.5]" />
                <Star className="w-5 h-5 fill-brand-yellow text-brand-dark stroke-[2.5]" />
                <Star className="w-5 h-5 fill-brand-yellow text-brand-dark stroke-[2.5]" />
                <Star className="w-5 h-5 fill-brand-yellow text-brand-dark stroke-[2.5]" />
              </div>

              <p className="text-brand-dark font-serif text-lg sm:text-xl leading-relaxed italic mb-8 font-medium">
                "{testimonial.pesan}"
              </p>

              <div className="flex items-center gap-4">
                {testimonial.foto && (
                  <img
                    src={testimonial.foto}
                    alt={testimonial.nama}
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-brand-dark bg-cream-bg shadow-[2px_2px_0_#2A1B15] shrink-0"
                  />
                )}
                <div className="text-left select-none">
                  <p className="text-brand-dark font-kids font-bold text-sm">{testimonial.nama}</p>
                  <p className="text-brand-dark/65 font-kids text-xs font-semibold">{testimonial.jabatan}</p>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-3">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3.5 h-3.5 rounded-full border-2 border-brand-dark transition-all duration-300 ${
                    i === current
                      ? 'bg-brand-orange w-10 shadow-[1.5px_1.5px_0_#2A1B15]'
                      : 'bg-white hover:bg-brand-orange/20 shadow-[1px_1px_0_#2A1B15]'
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
