import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ badge, title, subtitle, centered = true, light = false }: SectionHeadingProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-slide-up ${isVisible ? 'visible' : ''} mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}
    >
      {badge && (
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-kids font-bold uppercase tracking-wider mb-4 border-2 border-brand-dark shadow-[2px_2px_0_rgba(42,27,21,0.15)] ${
            light
              ? 'bg-brand-yellow text-brand-dark'
              : 'bg-brand-orange/10 text-brand-orange'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`font-serif text-3xl md:text-5xl font-black leading-tight tracking-tight ${
          light ? 'text-white' : 'text-brand-dark'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-sm md:text-base max-w-2xl leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-white/80' : 'text-brand-dark/80'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
