import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { LayoutDashboard, FileText, Image, BookOpen, Users, CalendarDays, GraduationCap, HardDrive, Globe, LogOut } from 'lucide-react';
import type { ReactNode, ElementType } from 'react';

const NAV_LINKS: { path: string; label: string; icon: ElementType }[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/artikel', label: 'Artikel', icon: FileText },
  { path: '/admin/galeri', label: 'Galeri', icon: Image },
  { path: '/admin/materi', label: 'Materi', icon: BookOpen },
  { path: '/admin/anggota', label: 'Anggota', icon: Users },
  { path: '/admin/kegiatan', label: 'Kegiatan', icon: CalendarDays },
  { path: '/admin/angkatan', label: 'Angkatan', icon: GraduationCap },
  { path: '/admin/storage', label: 'Storage R2', icon: HardDrive },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/logo/LOGO TRIGANTARA (2).webp" alt="Trigantara" className="w-7 h-7" />
          <span className="font-serif text-sm font-bold text-zinc-900">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <img src="/assets/logo/LOGO TRIGANTARA (2).webp" alt="Trigantara" className="w-10 h-10" />
              <div>
                <p className="font-serif text-white font-bold text-lg">Trigantara</p>
                <p className="text-white/40 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <link.icon className="w-5 h-5 stroke-[1.8]" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-900 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Globe className="w-5 h-5 stroke-[1.8]" /> Lihat Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 stroke-[1.8]" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Keluar dari Admin"
        message="Apakah Anda yakin ingin keluar dari panel admin?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
