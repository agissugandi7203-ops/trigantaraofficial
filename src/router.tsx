import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import SmoothScroll from './components/layout/SmoothScroll';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const TentangPage = lazy(() => import('./pages/TentangPage'));
const MateriPage = lazy(() => import('./pages/MateriPage'));
const MateriDetailPage = lazy(() => import('./pages/MateriDetailPage'));
const GaleriPage = lazy(() => import('./pages/GaleriPage'));
const AngkatanPage = lazy(() => import('./pages/AngkatanPage'));
const KegiatanPage = lazy(() => import('./pages/KegiatanPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const GabungPage = lazy(() => import('./pages/GabungPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ManageArticles = lazy(() => import('./pages/admin/ManageArticles'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageMaterials = lazy(() => import('./pages/admin/ManageMaterials'));
const ManageMembers = lazy(() => import('./pages/admin/ManageMembers'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const ManageAngkatan = lazy(() => import('./pages/admin/ManageAngkatan'));
const ManageStorage = lazy(() => import('./pages/admin/ManageStorage'));

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
