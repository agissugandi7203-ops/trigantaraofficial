import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Tent } from 'lucide-react';
import { NAV_ITEMS } from '../../data/constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full transition-all duration-500 ease-out py-3 px-4 md:px-6">
      <motion.nav
        initial={false}
        animate={{
          y: 0,
          borderRadius: isScrolled ? '9999px' : '24px',
          width: isScrolled ? 'min(100%, 1100px)' : '100%',
          paddingTop: isScrolled ? '0.6rem' : '1rem',
          paddingBottom: isScrolled ? '0.6rem' : '1rem',
          paddingLeft: isScrolled ? '1.5rem' : '2rem',
          paddingRight: isScrolled ? '1.5rem' : '2rem',
          backgroundColor: isScrolled ? 'rgba(253, 251, 247, 0.85)' : 'rgba(250, 246, 240, 0.95)',
          boxShadow: isScrolled ? '0 10px 30px -10px rgba(42, 27, 21, 0.08), 0 1px 3px rgba(42, 27, 21, 0.02)' : '0 4px 20px -10px rgba(42, 27, 21, 0.03)',
          borderColor: isScrolled ? 'rgba(42, 27, 21, 0.08)' : 'rgba(42, 27, 21, 0.04)',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="backdrop-blur-xl border flex items-center justify-between w-full"
      >
        {/* Logo wrapped in a badge/container for contrast */}
        <Link to="/" className="flex items-center gap-3 select-none group shrink-0" aria-label="Trigantara Beranda">
          <img
            src="/assets/logo/LOGO TRIGANTARA (2).webp"
            alt="Logo Trigantara"
            className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300"
          />
          <div className="flex flex-col shrink-0">
            <span className="font-serif text-base font-black leading-tight text-brand-dark whitespace-nowrap">
              Trigantara
            </span>
            <span className="text-[8px] font-kids font-bold tracking-wider uppercase leading-none text-brand-dark/60 whitespace-nowrap">
              SMK Marhas Margahayu
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative group h-full"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className={`flex items-center gap-1 text-sm font-kids font-bold transition-colors cursor-pointer py-2 ${
                  isActive(item.href)
                    ? 'text-brand-orange underline decoration-2 decoration-brand-orange/40 underline-offset-4'
                    : 'text-brand-dark hover:text-brand-orange'
                }`}
              >
                <span>{item.label}</span>
                {item.children && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
              </Link>

              {/* Sub-menu */}
              {item.children && (
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="absolute top-10 left-1/2 -translate-x-1/2 bg-cream-card border border-brand-dark/10 rounded-2xl shadow-soft-lg w-56 p-2 z-50"
                    >
                      {item.children.map((child, i) => (
                        <Link
                          key={i}
                          to={child.href}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-brand-yellow/10 rounded-xl text-xs font-kids font-bold text-brand-dark transition-colors group/sub"
                        >
                          <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 group-hover/sub:scale-125 transition-transform" />
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Action / CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/gabung"
            className="px-6 py-2.5 bg-brand-orange text-white text-xs font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>⚜️</span>
            <span>Gabung Kami</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            to="/gabung"
            className="px-4 py-2 bg-brand-orange text-white text-xs font-kids font-bold rounded-full border border-brand-dark/10 shadow-soft shrink-0"
          >
            Gabung
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white rounded-xl border border-brand-dark/10 shadow-soft cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand-dark" /> : <Menu className="w-5 h-5 text-brand-dark" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute top-full left-4 right-4 mt-2 bg-cream-card border border-brand-dark/10 rounded-3xl p-4 shadow-soft-xl flex flex-col lg:hidden z-40 overflow-hidden"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <div
                  className="flex items-center justify-between py-3 px-4 font-kids font-bold text-base text-brand-dark hover:bg-brand-yellow/10 rounded-xl cursor-pointer"
                  onClick={() => {
                    if (item.children) {
                      setActiveDropdown(activeDropdown === item.label ? null : item.label);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {item.children ? (
                    <span>{item.label}</span>
                  ) : (
                    <Link to={item.href} className="w-full" onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
                  )}
                  {item.children && <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                </div>
                {item.children && activeDropdown === item.label && (
                  <div className="pl-6 border-l border-brand-dark/10 ml-6 pb-2 space-y-1">
                    {item.children.map((child, i) => (
                      <Link
                        key={i}
                        to={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-2 hover:text-brand-orange text-sm font-kids font-bold text-brand-dark/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
