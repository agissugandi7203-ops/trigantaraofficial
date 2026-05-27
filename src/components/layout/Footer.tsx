import { Link } from 'react-router-dom';
import { FOOTER_LINKS, GUDEP_INFO } from '../../data/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-[#FAF6F0] border-t-4 border-zinc-900 relative overflow-hidden">
      {/* Decorative top border line */}
      <div className="h-2 bg-brand-orange w-full"></div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/assets/logo/LOGO TRIGANTARA (2).webp" alt="Logo Trigantara" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Trigantara</h3>
                <p className="text-[10px] font-kids font-bold text-brand-yellow tracking-wider uppercase">
                  Gudep {GUDEP_INFO.nomorGudep}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-[#FAF6F0]/80 leading-relaxed font-sans">
              Gugus Depan Pramuka {GUDEP_INFO.pangkalan}. Membentuk karakter, membangun persaudaraan, meraih prestasi.
            </p>
            
            {/* Three Logos */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { src: "/assets/logo/LOGO TRIGANTARA (2).webp", alt: "Trigantara" },
                { src: "/assets/logo/LOGO MAHAPUTRA.webp", alt: "Mahaputra" },
                { src: "/assets/logo/marhasupdate.webp", alt: "SMK Marhas" },
              ].map((logo, index) => (
                <img key={index} src={logo.src} alt={logo.alt} className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-300" />
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-kids font-bold text-sm uppercase tracking-wider text-brand-yellow mb-5">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.navigasi.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs font-kids font-medium text-[#FAF6F0]/70 hover:text-brand-orange hover:underline transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links Column */}
          <div>
            <h4 className="font-kids font-bold text-sm uppercase tracking-wider text-brand-yellow mb-5">
              Lainnya
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.lainnya.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-xs font-kids font-medium text-[#FAF6F0]/70 hover:text-brand-orange hover:underline transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-kids font-bold text-sm uppercase tracking-wider text-brand-yellow mb-5">
              Hubungi Kami
            </h4>
            <div className="space-y-2 text-xs text-[#FAF6F0]/80 font-sans">
              <p className="font-bold">{GUDEP_INFO.pangkalan}</p>
              <p className="opacity-90">{GUDEP_INFO.yayasan}</p>
              <p className="opacity-75">{GUDEP_INFO.alamat}</p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  href: FOOTER_LINKS.socialMedia.instagram,
                  label: "Instagram",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                  hoverBg: "hover:bg-brand-orange"
                },
                {
                  href: FOOTER_LINKS.socialMedia.youtube,
                  label: "YouTube",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                  hoverBg: "hover:bg-brand-orange"
                },
                {
                  href: FOOTER_LINKS.socialMedia.tiktok,
                  label: "TikTok",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  ),
                  hoverBg: "hover:bg-brand-blue"
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-xl bg-white border-2 border-zinc-950 flex items-center justify-center text-zinc-900 shadow-[2px_2px_0_#FAF6F0] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-200 ${social.hoverBg} hover:text-white`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 bg-zinc-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-kids text-[#FAF6F0]/50 text-center sm:text-left">
              © {currentYear} Trigantara — Gudep {GUDEP_INFO.nomorGudep}. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/login"
                className="text-xs font-kids text-[#FAF6F0]/40 hover:text-brand-yellow hover:underline transition-all"
              >
                Masuk Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
