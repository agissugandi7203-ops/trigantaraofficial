import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/admin/ConfirmModal';
import {
  LayoutDashboard,
  FileText,
  Image,
  BookOpen,
  Users,
  CalendarDays,
  GraduationCap,
  HardDrive,
  Globe,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
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

const SIDEBAR_EXPANDED_W = 260;
const SIDEBAR_COLLAPSED_W = 80;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo/LOGO TRIGANTARA (2).webp"
            alt="Trigantara"
            className="w-7 h-7"
          />
          <span className="font-serif text-sm font-bold text-zinc-900">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className={`
          fixed z-50 flex flex-col
          bg-white/80 backdrop-blur-xl
          shadow-lg shadow-zinc-200/50
          border border-zinc-200/60
          transition-all duration-300 ease-in-out
          overflow-hidden

          top-0 left-0 bottom-0
          lg:top-3 lg:left-3 lg:bottom-3
          rounded-none lg:rounded-2xl

          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo area */}
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3 min-h-[72px]">
          <img
            src="/assets/logo/LOGO TRIGANTARA (2).webp"
            alt="Trigantara"
            className="w-10 h-10 shrink-0"
          />
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            <p className="font-serif text-zinc-900 font-bold text-lg leading-tight">
              Trigantara
            </p>
            <p className="text-zinc-400 text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.label : undefined}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                ${
                  isActive(link.path)
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }
              `}
            >
              <link.icon className="w-5 h-5 shrink-0 stroke-[1.8]" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-100 space-y-1">
          {/* View website */}
          <Link
            to="/"
            title={collapsed ? 'Lihat Website' : undefined}
            className={`
              flex items-center gap-3 rounded-xl text-sm
              text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100
              transition-colors
              ${collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'}
            `}
          >
            <Globe className="w-5 h-5 shrink-0 stroke-[1.8]" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
            >
              Lihat Website
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Keluar' : undefined}
            className={`
              flex items-center gap-3 w-full rounded-xl text-sm
              text-red-500 hover:text-red-600 hover:bg-red-50
              transition-colors cursor-pointer
              ${collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0 stroke-[1.8]" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
            >
              Keluar
            </span>
          </button>

          {/* Collapse / Expand toggle (desktop only) */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-full py-2 mt-1 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title={collapsed ? 'Perluas sidebar' : 'Kecilkan sidebar'}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5 stroke-[1.8]" />
            ) : (
              <ChevronsLeft className="w-5 h-5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:transition-all lg:duration-300 min-h-screen">
        <div className="pt-16 lg:pt-0 p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Responsive margin that reacts to collapsed state */}
      <style>{`
        @media (min-width: 1024px) {
          main {
            margin-left: ${sidebarWidth + 24}px;
          }
        }
      `}</style>

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
