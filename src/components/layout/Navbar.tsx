import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../../data/constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const scrolledRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 20;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup menu saat berpindah halaman
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Tutup menu saat menekan tombol Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      {/* Backdrop overlay saat menu mobile terbuka */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-brand-dark/25 backdrop-blur-[2px] z-40 lg:hidden cursor-pointer animate-fade-in"
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full py-2.5 sm:py-3 px-3 sm:px-6 pointer-events-none">
        <nav
          aria-label="Navigasi utama"
          className={`pointer-events-auto flex items-center justify-between w-full transition-[max-width,background-color,border-color,box-shadow,padding,border-radius] duration-300 ease-out ${
            isScrolled
              ? 'max-w-[1100px] rounded-full py-2 sm:py-2.5 px-4 sm:px-6 bg-cream-card/95 backdrop-blur-md border border-brand-dark/10 shadow-soft-lg'
              : 'max-w-full rounded-2xl sm:rounded-3xl py-2.5 sm:py-3.5 px-4 sm:px-8 bg-cream-bg/95 backdrop-blur-md border border-brand-dark/5 shadow-soft'
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 select-none group shrink-0"
            aria-label="Trigantara — kembali ke beranda"
          >
            <img
              src="/assets/logo/LOGO TRIGANTARA (2).webp"
              alt=""
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
            <span className="flex flex-col shrink-0">
              <span className="font-serif text-sm sm:text-base font-black leading-tight text-brand-dark whitespace-nowrap">
                Trigantara
              </span>
              <span className="text-[7px] sm:text-[8px] font-kids font-bold tracking-wider uppercase leading-none text-brand-dark/60 whitespace-nowrap">
                SMK Marhas Margahayu
              </span>
            </span>
          </Link>

          {/* Menu desktop */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  aria-expanded={item.children ? openDropdown === item.label : undefined}
                  className={`flex items-center gap-1 text-sm font-kids font-bold transition-colors py-2 ${
                    isActive(item.href)
                      ? 'text-brand-orange underline decoration-2 decoration-brand-orange/40 underline-offset-4'
                      : 'text-brand-dark hover:text-brand-orange'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {item.children && openDropdown === item.label && (
                  <ul className="absolute top-10 left-1/2 -translate-x-1/2 bg-cream-card border border-brand-dark/10 rounded-2xl shadow-soft-lg w-56 p-2 z-50 origin-top animate-dropdown">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          to={child.href}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-brand-yellow/10 rounded-xl text-xs font-kids font-bold text-brand-dark transition-colors group/sub"
                        >
                          <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 group-hover/sub:scale-125 transition-transform" />
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/gabung"
              className="px-6 py-2.5 bg-brand-orange text-white text-xs font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span aria-hidden="true">⚜️</span>
              Gabung Kami
            </Link>
          </div>

          {/* Kendali mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/gabung"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-brand-orange text-white text-[11px] sm:text-xs font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft shrink-0 active:scale-95 transition-transform"
            >
              Gabung
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              className="p-2 bg-white rounded-xl border border-brand-dark/10 shadow-soft cursor-pointer active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-brand-dark" /> : <Menu className="w-5 h-5 text-brand-dark" />}
            </button>
          </div>
        </nav>

        {/* Dropdown Menu Mobile */}
        {mobileMenuOpen && (
          <div
            ref={dropdownRef}
            className="pointer-events-auto absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 bg-cream-card border border-brand-dark/10 rounded-3xl p-4 shadow-soft-xl flex flex-col lg:hidden z-50 origin-top animate-dropdown max-h-[calc(100vh-90px)] overflow-y-auto"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((cur) => (cur === item.label ? null : item.label))
                      }
                      aria-expanded={openDropdown === item.label}
                      className="w-full flex items-center justify-between py-3 px-4 font-kids font-bold text-base text-brand-dark hover:bg-brand-yellow/10 rounded-xl cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.label ? 'rotate-180 text-brand-orange' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 border-l-2 border-brand-orange/30 ml-4 my-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2.5 px-3 hover:bg-brand-yellow/10 rounded-lg text-sm font-kids font-bold text-brand-dark/80"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 font-kids font-bold text-base rounded-xl transition-colors ${
                      isActive(item.href)
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'text-brand-dark hover:bg-brand-yellow/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-brand-dark/10 flex justify-center">
              <Link
                to="/gabung"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-brand-orange text-white text-center font-kids font-bold text-sm rounded-2xl shadow-soft flex items-center justify-center gap-2"
              >
                <span>⚜️</span>
                <span>Gabung Pramuka Trigantara</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
