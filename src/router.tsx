import { lazy, Suspense, type ReactNode, type ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import SmoothScroll from './components/layout/SmoothScroll';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

/**
 * Membungkus React.lazy dengan pemulihan otomatis jika berkas chunk lama
 * tidak ditemukan akibat deployment rilis baru ke server.
 */
function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err: any) {
      const isChunkError =
        err?.message?.includes('Failed to fetch dynamically imported module') ||
        err?.message?.includes('Importing a module script failed') ||
        err?.message?.includes('MIME type of "text/html"') ||
        err?.name === 'TypeError';

      if (isChunkError) {
        const storageKey = 'chunk_reload_' + window.location.pathname;
        const lastReload = sessionStorage.getItem(storageKey);
        const now = Date.now();

        if (!lastReload || now - Number(lastReload) > 10000) {
          sessionStorage.setItem(storageKey, String(now));
          window.location.reload();
          return new Promise(() => {}); // tahan render sampai halaman memuat ulang
        }
      }
      throw err;
    }
  });
}

const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const TentangPage = lazyWithRetry(() => import('./pages/TentangPage'));
const MateriPage = lazyWithRetry(() => import('./pages/MateriPage'));
const MateriDetailPage = lazyWithRetry(() => import('./pages/MateriDetailPage'));
const GaleriPage = lazyWithRetry(() => import('./pages/GaleriPage'));
const AngkatanPage = lazyWithRetry(() => import('./pages/AngkatanPage'));
const KegiatanPage = lazyWithRetry(() => import('./pages/KegiatanPage'));
const BlogPage = lazyWithRetry(() => import('./pages/BlogPage'));
const BlogDetailPage = lazyWithRetry(() => import('./pages/BlogDetailPage'));
const GabungPage = lazyWithRetry(() => import('./pages/GabungPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

const LoginPage = lazyWithRetry(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazyWithRetry(() => import('./pages/admin/DashboardPage'));
const ManageArticles = lazyWithRetry(() => import('./pages/admin/ManageArticles'));
const ManageGallery = lazyWithRetry(() => import('./pages/admin/ManageGallery'));
const ManageMaterials = lazyWithRetry(() => import('./pages/admin/ManageMaterials'));
const ManageMembers = lazyWithRetry(() => import('./pages/admin/ManageMembers'));
const ManageEvents = lazyWithRetry(() => import('./pages/admin/ManageEvents'));
const ManageAngkatan = lazyWithRetry(() => import('./pages/admin/ManageAngkatan'));
const ManageStorage = lazyWithRetry(() => import('./pages/admin/ManageStorage'));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-bg">
      <LoadingSpinner size="lg" text="Memuat halaman…" />
    </div>
  );
}

/** Rangka halaman publik: navbar + isi + footer, masing-masing dijaga error boundary. */
function PublicPage({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <ErrorBoundary area="halaman publik">{children}</ErrorBoundary>
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <SmoothScroll>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<PublicPage><HomePage /></PublicPage>} />
            <Route path="/tentang" element={<PublicPage><TentangPage /></PublicPage>} />
            <Route path="/materi" element={<PublicPage><MateriPage /></PublicPage>} />
            <Route path="/materi/:slug" element={<PublicPage><MateriDetailPage /></PublicPage>} />
            <Route path="/galeri" element={<PublicPage><GaleriPage /></PublicPage>} />
            <Route path="/angkatan" element={<PublicPage><AngkatanPage /></PublicPage>} />
            <Route path="/kegiatan" element={<PublicPage><KegiatanPage /></PublicPage>} />
            <Route path="/blog" element={<PublicPage><BlogPage /></PublicPage>} />
            <Route path="/blog/:slug" element={<PublicPage><BlogDetailPage /></PublicPage>} />
            <Route path="/gabung" element={<PublicPage><GabungPage /></PublicPage>} />

            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ErrorBoundary area="panel admin">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/artikel" element={<ManageArticles />} />
                        <Route path="/galeri" element={<ManageGallery />} />
                        <Route path="/materi" element={<ManageMaterials />} />
                        <Route path="/anggota" element={<ManageMembers />} />
                        <Route path="/kegiatan" element={<ManageEvents />} />
                        <Route path="/angkatan" element={<ManageAngkatan />} />
                        <Route path="/storage" element={<ManageStorage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </ErrorBoundary>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<PublicPage><NotFoundPage /></PublicPage>} />
          </Routes>
        </Suspense>
      </SmoothScroll>
    </>
  );
}
