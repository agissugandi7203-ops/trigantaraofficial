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
    image: "/assets/model/Intan tari No BG.png",
    link: "/tentang"
  }
];

export default function ProgramCards() {
  return (
    <section className="py-20 lg:py-28 bg-cream-bg relative border-t-2 border-b-2 border-brand-dark/10">
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
            className="px-6 py-3 bg-white text-brand-dark font-kids font-bold rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-2"
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
        className={`${details.bgClass} ${details.textClass} w-full rounded-3xl p-6 border-4 border-brand-dark shadow-[6px_6px_0_#2A1B15] flex flex-col justify-between min-h-[460px] group hover:-translate-y-2 transition-transform duration-300`}
      >
        {/* Upper part */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 text-xs font-kids font-bold rounded-full border border-brand-dark ${details.badgeStyle}`}>
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
        <div className="my-6 relative h-48 w-full rounded-2xl border-2 border-brand-dark bg-cream-bg overflow-hidden shadow-inner flex justify-center items-center">
          <img
            src={details.image}
            alt={program.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-brand-dark text-white text-[9px] font-bold rounded">
            Trigantara Gudep
          </div>
        </div>

        {/* Bottom interactive button */}
        <div>
          <Link
            to={details.link}
            className={`block w-full py-2.5 px-4 rounded-xl text-xs font-kids font-bold uppercase tracking-wider text-center border-2 border-brand-dark ${details.btnStyle} shadow-[2px_2px_0_rgba(42,27,21,1)] active:translate-y-[1px] hover:-translate-y-0.5 transition-all`}
          >
            Pelajari Detail ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
