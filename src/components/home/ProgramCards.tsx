import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { PROGRAMS } from '../../data/constants';
import SectionHeading from '../shared/SectionHeading';

// Local mapping to augment programs with neo-brutalist layouts and local photos
const programDetails = [
  {
    badge: "Outdoor & Camping",
    bgClass: "bg-brand-green text-white",
    textClass: "text-white",
    badgeStyle: "bg-brand-yellow text-brand-dark",
    btnStyle: "bg-white text-brand-dark",
    image: "/assets/angkatan/2025-2026/fotobersama26.webp",
    link: "/kegiatan?filter=perkemahan"
  },
  {
    badge: "Skill & Pioneering",
    bgClass: "bg-brand-orange text-white",
    textClass: "text-white",
    badgeStyle: "bg-brand-dark text-white",
    btnStyle: "bg-white text-brand-dark",
    image: "/assets/angkatan/2026-2027/fotobersama27.webp",
    link: "/materi"
  },
  {
    badge: "Leadership & Integrity",
    bgClass: "bg-brand-yellow text-brand-dark",
    textClass: "text-brand-dark",
    badgeStyle: "bg-white text-brand-dark border-brand-dark",
    btnStyle: "bg-brand-dark text-white",
    image: "/assets/model/Alysia Fasma Nidai No BG.png",
    link: "/tentang"
  }
];

export default function ProgramCards() {
  return (
    <section className="py-20 lg:py-28 bg-cream-bg relative border-t border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Program Kami"
          title="Apa yang Kami Tawarkan?"
          subtitle="Tiga pilar utama yang menjadi fondasi kegiatan kepramukaan di Trigantara."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {PROGRAMS.map((program, i) => {
            const details = programDetails[i];
            return (
              <ProgramCard
                key={program.title}
                program={program}
                details={details}
                index={i}
              />
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/materi"
            className="px-8 py-4 bg-white text-brand-dark font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Pelajari Materi Pramuka Selengkapnya</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  program,
  details,
  index
}: {
  program: typeof PROGRAMS[0];
  details: typeof programDetails[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-slide-up stagger-${index + 1} ${
        isVisible ? 'visible' : ''
      } flex`}
    >
      <div
        className={`${details.bgClass} ${details.textClass} w-full rounded-[2.5rem] p-8 border border-brand-dark/15 shadow-soft hover:shadow-soft-lg flex flex-col justify-between min-h-[480px] group hover:-translate-y-2 transition-all duration-300`}
      >
        {/* Upper part */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 text-xs font-kids font-bold rounded-full border border-brand-dark/15 ${details.badgeStyle}`}>
              {details.badge}
            </span>
            <span className="text-2xl bg-white/20 w-10 h-10 rounded-full flex items-center justify-center border border-white/20">
              {program.icon}
            </span>
          </div>

          <h3 className="font-serif text-2xl font-bold">{program.title}</h3>
          <p className="text-xs md:text-sm opacity-90 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Picture Cutout Frame with absolute border */}
        <div className={`my-6 relative h-48 w-full rounded-[1.8rem] border border-brand-dark/15 overflow-hidden shadow-inner flex justify-center items-end ${index === 2 ? 'bg-brand-yellow/15 pt-4' : 'bg-cream-bg'}`}>
          <img
            src={details.image}
            alt={program.title}
            className={`${index === 2 ? 'h-[90%] w-auto object-contain' : 'w-full h-full object-cover object-center'} group-hover:scale-105 transition-transform duration-500`}
          />
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-brand-dark text-white text-[9px] font-bold rounded">
            Trigantara Gudep
          </div>
        </div>

        {/* Bottom interactive button */}
        <div>
          <Link
            to={details.link}
            className={`block w-full py-3 px-4 rounded-full text-xs font-kids font-bold uppercase tracking-wider text-center border border-brand-dark/15 ${details.btnStyle} shadow-soft hover:-translate-y-0.5 active:translate-y-0 transition-all`}
          >
            Pelajari Detail ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
