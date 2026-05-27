import { Link } from 'react-router-dom';
import SectionHeading from '../shared/SectionHeading';

const MEMBERS = [
  {
    nama: 'Fahri Anggay',
    jabatan: 'Pradana Putra',
    image: '/assets/model/FAHRI Anggay No BG.png',
    blobColor: '#FF6E31', // Orange
    blobClass: 'rounded-[110px_90px_120px_80px]',
    icon: '⚜️',
  },
  {
    nama: 'Nazwa',
    jabatan: 'Pradana Putri',
    image: '/assets/model/nazwa.png',
    blobColor: '#29AC60', // Green
    blobClass: 'rounded-[90px_120px_85px_110px]',
    icon: '⭐',
  },
  {
    nama: 'Kaisya',
    jabatan: 'Pemangku Adat Putri',
    image: '/assets/model/kaisya.png',
    blobColor: '#FFCE3B', // Yellow
    blobClass: 'rounded-[120px_85px_110px_90px]',
    icon: '❤️',
  },
  {
    nama: 'Intan Nur Hayati',
    jabatan: 'Bendahara Ambalan',
    image: '/assets/model/Intan Nur Hayati No BG.png',
    blobColor: '#3482F6', // Blue
    blobClass: 'rounded-[85px_110px_90px_120px]',
    icon: '📋',
  },
];

export default function MemberPods() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] relative border-b-2 border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Keluarga Trigantara"
          title="Mengenal Anggota Kami"
          subtitle="Para pengurus Ambalan penegak aktif yang memimpin roda organisasi kepramukaan Trigantara."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16 max-w-6xl mx-auto justify-items-center">
          {MEMBERS.map((item, idx) => (
            <Link
              key={idx}
              to="/angkatan"
              className="flex flex-col items-center group cursor-pointer w-full max-w-[280px]"
            >
              {/* Image & Blob Container */}
              <div className="relative w-52 h-72 flex items-end justify-center select-none overflow-visible">
                {/* Organic Blob Backdrop - Original compact size */}
                <div 
                  className={`absolute bottom-0 w-44 h-44 left-0 right-0 mx-auto border-4 border-brand-dark shadow-[5px_5px_0_#2A1B15] z-0 transition-transform duration-300 group-hover:scale-[1.03] ${item.blobClass}`}
                  style={{ backgroundColor: item.blobColor }}
                />

                {/* Overlapping Character Image - Balanced Zoom */}
                <img
                  src={item.image}
                  alt={item.nama}
                  className="absolute bottom-0 w-[280px] h-[250px] left-[-100%] right-[-100%] mx-auto z-10 object-cover object-top select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* Floating Badge */}
                <span className="absolute bottom-2 right-6 w-9 h-9 bg-white text-lg rounded-full border-2 border-brand-dark flex items-center justify-center select-none shadow-[2px_2px_0_#2A1B15] z-20 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
              </div>

              {/* Text Info Below */}
              <div className="mt-6 text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors duration-200">
                  {item.nama}
                </h4>
                <p className="text-xs text-brand-dark/65 font-bold uppercase tracking-wider font-kids">
                  {item.jabatan}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
