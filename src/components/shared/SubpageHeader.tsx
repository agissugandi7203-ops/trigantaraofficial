import SectionDivider from './SectionDivider';

interface SubpageHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  bgVariant?: 'orange' | 'green' | 'blue' | 'yellow';
  modelImage?: string;
  modelName?: string;
  modelAlign?: 'left' | 'right';
  modelSize?: 'normal' | 'large';
}

const BG_CLASSES = {
  orange: 'bg-brand-orange text-white',
  green: 'bg-brand-green text-white',
  blue: 'bg-brand-blue text-white',
  yellow: 'bg-brand-yellow text-brand-dark',
} as const;

const BADGE_CLASSES = {
  orange: 'bg-brand-yellow text-brand-dark border-brand-dark',
  green: 'bg-brand-yellow text-brand-dark border-brand-dark',
  blue: 'bg-brand-yellow text-brand-dark border-brand-dark',
  yellow: 'bg-white text-brand-dark border-brand-dark',
} as const;

const SUBTITLE_CLASSES = {
  orange: 'text-cream-bg/90',
  green: 'text-cream-bg/90',
  blue: 'text-cream-bg/90',
  yellow: 'text-brand-dark/80',
} as const;

export default function SubpageHeader({
  badge,
  title,
  subtitle,
  bgVariant = 'orange',
  modelImage,
  modelName,
  modelAlign = 'right',
  modelSize = 'large',
}: SubpageHeaderProps) {
  const heading = (
    <>
      <span
        className={`inline-block px-5 py-2 rounded-full text-sm font-kids font-bold uppercase border-2 shadow-sticker animate-enter-pop ${BADGE_CLASSES[bgVariant]}`}
      >
        {badge}
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-enter-up delay-100 break-words">
        {title}
      </h1>
      <p
        className={`text-sm sm:text-lg md:text-xl max-w-2xl font-sans font-bold leading-relaxed animate-enter-up delay-200 ${SUBTITLE_CLASSES[bgVariant]}`}
      >
        {subtitle}
      </p>
    </>
  );

  return (
    <section
      className={`relative overflow-hidden ${BG_CLASSES[bgVariant]} pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-44 md:pb-28 min-h-[420px] sm:min-h-[480px] md:min-h-[620px] flex items-center`}
    >
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute top-10 -left-[10%] w-[40%] aspect-square rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] aspect-square rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        {modelImage ? (
          <div className="grid md:grid-cols-12 gap-8 items-center text-center md:text-left">
            <div
              className={`md:col-span-5 flex justify-center w-full ${
                modelAlign === 'left' ? 'md:justify-end md:order-1' : 'md:justify-start md:order-2'
              }`}
            >
              <div
                className="relative flex items-end justify-center select-none w-[220px] h-[300px] sm:w-[280px] sm:h-[380px] md:w-[320px] md:h-[430px]"
              >
                <div
                  aria-hidden="true"
                  className={`absolute bottom-0 w-full h-[230px] sm:h-[300px] md:h-[350px] rounded-[100px_100px_30px_30px] md:rounded-[130px_130px_40px_40px] border border-brand-dark/10 shadow-soft-lg z-0 ${
                    bgVariant === 'yellow' ? 'bg-brand-green' : 'bg-brand-yellow'
                  }`}
                />

                <img
                  src={modelImage}
                  alt={modelName ? `${modelName}, anggota Pramuka Trigantara` : ''}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute bottom-0 z-10 w-full h-[320px] sm:h-[390px] md:h-[450px] object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {modelName && (
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-brand-dark/10 shadow-soft z-20 font-kids text-[11px] font-bold text-brand-dark whitespace-nowrap">
                    ⭐ {modelName}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`md:col-span-7 relative z-20 space-y-6 ${
                modelAlign === 'left' ? 'md:order-2' : 'md:order-1'
              }`}
            >
              {heading}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-5">{heading}</div>
        )}
      </div>

      <SectionDivider
        variant="wave"
        color="#FAF6F0"
        className="absolute bottom-0 left-0 right-0 w-full"
      />
    </section>
  );
}
