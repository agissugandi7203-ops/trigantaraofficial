import { motion } from 'motion/react';
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

export default function SubpageHeader({
  badge,
  title,
  subtitle,
  bgVariant = 'orange',
  modelImage,
  modelName,
  modelAlign = 'right',
  modelSize = 'normal'
}: SubpageHeaderProps) {
  const bgClasses = {
    orange: 'bg-brand-orange text-white',
    green: 'bg-brand-green text-white',
    blue: 'bg-brand-blue text-white',
    yellow: 'bg-brand-yellow text-brand-dark',
  };

  const badgeClasses = {
    orange: 'bg-brand-yellow text-brand-dark border-brand-dark',
    green: 'bg-brand-yellow text-brand-dark border-brand-dark',
    blue: 'bg-brand-yellow text-brand-dark border-brand-dark',
    yellow: 'bg-white text-brand-dark border-brand-dark',
  };

  const subtitleClasses = {
    orange: 'text-cream-bg/90',
    green: 'text-cream-bg/90',
    blue: 'text-cream-bg/90',
    yellow: 'text-brand-dark/80',
  };

  const imgColClass = modelSize === 'large' ? 'md:col-span-5' : 'md:col-span-4';
  const textColClass = modelSize === 'large' ? 'md:col-span-7' : 'md:col-span-8';

  return (
    <section className={`relative ${
      modelSize === 'large' 
        ? 'pt-36 pb-20 md:pt-44 md:pb-28 min-h-[480px] md:min-h-[620px] flex items-center' 
        : 'pt-32 pb-24 md:pt-40 md:pb-32'
    } overflow-hidden ${bgClasses[bgVariant]}`}>
      {/* Decorative Wavy/Blob Background Details */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-10 left-[-10%] w-[40%] aspect-square rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {modelImage ? (
          <div className="grid md:grid-cols-12 gap-8 items-center text-center md:text-left">
            {/* Model image container */}
            <div className={`${imgColClass} flex justify-center ${modelAlign === 'left' ? 'md:justify-end md:order-1' : 'md:justify-start md:order-2'} w-full`}>
              <div className={`relative ${
                modelSize === 'large' 
                  ? 'w-[250px] h-[320px]' 
                  : 'w-[180px] h-[240px] md:w-[200px] md:h-[260px]'
              } flex items-end justify-center select-none overflow-visible group`}>
                {/* Backdrop Shape */}
                <div 
                  className={`absolute bottom-0 w-full ${
                    modelSize === 'large' ? 'h-[250px] rounded-[110px_110px_30px_30px]' : 'h-[200px] rounded-[90px_90px_25px_25px]'
                  } border border-brand-dark/10 shadow-soft-lg z-0 ${
                    bgVariant === 'yellow' ? 'bg-brand-green' : 'bg-brand-yellow'
                  }`} 
                />
                
                {/* Large Character image popping out (scales up massively) */}
                <img
                  src={modelImage}
                  alt={modelName || 'Pramuka Trigantara'}
                  className={`absolute bottom-0 ${
                    modelSize === 'large' 
                      ? 'w-[320%] h-[850px] md:w-[380%] md:h-[1100px] max-w-none' 
                      : 'w-[210px] h-[240px] md:w-[240px] md:h-[260px]'
                  } left-[-150%] right-[-150%] mx-auto z-10 object-contain object-bottom select-none pointer-events-none`}
                />

                {modelName && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-full border border-brand-dark/10 shadow-soft z-20 font-kids text-[10px] font-bold text-brand-dark whitespace-nowrap">
                    ⭐ {modelName}
                  </div>
                )}
              </div>
            </div>

            {/* Text side info */}
            <div className={`${textColClass} relative z-20 space-y-6 ${modelAlign === 'left' ? 'md:order-2' : 'md:order-1'}`}>
              {/* Playful Sticker Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className={`inline-block px-5 py-2 rounded-full text-sm font-kids font-bold uppercase border-2 shadow-sticker ${badgeClasses[bgVariant]}`}
              >
                {badge}
              </motion.span>

              {/* Playful Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-serif text-5xl sm:text-7xl md:text-8xl font-black tracking-tight drop-shadow-sm leading-[1.05]"
              >
                {title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`text-base sm:text-xl md:text-2xl max-w-2xl font-sans font-bold leading-relaxed opacity-95 ${subtitleClasses[bgVariant]}`}
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Center aligned layout if no modelImage */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-kids font-bold uppercase border-2 shadow-sticker ${badgeClasses[bgVariant]} mb-6`}
            >
              {badge}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-serif text-4xl sm:text-6xl font-black tracking-tight mb-4 drop-shadow-sm"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-sm sm:text-lg max-w-xl mx-auto font-sans font-semibold leading-relaxed opacity-95 ${subtitleClasses[bgVariant]}`}
            >
              {subtitle}
            </motion.p>
          </div>
        )}
      </div>

      {/* SVG Wave Divider at the bottom */}
      <SectionDivider
        variant="wave"
        color="#FAF6F0"
        className="absolute bottom-0 left-0 right-0 w-full"
      />
    </section>
  );
}
