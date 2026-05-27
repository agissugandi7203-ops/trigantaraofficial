import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import SmoothScroll from './components/layout/SmoothScroll';
import LoadingSpinner from './components/shared/LoadingSpinner';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TentangPage = lazy(() => import('./pages/TentangPage'));
const MateriPage = lazy(() => import('./pages/MateriPage'));
const GaleriPage = lazy(() => import('./pages/GaleriPage'));
const AngkatanPage = lazy(() => import('./pages/AngkatanPage'));
const KegiatanPage = lazy(() => import('./pages/KegiatanPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const GabungPage = lazy(() => import('./pages/GabungPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages
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
      <LoadingSpinner size="lg" text="Memuat halaman..." />
    </div>
  );
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <SmoothScroll>
        <Suspense fallback={<PageLoading />}>
          <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
          <Route path="/tentang" element={<><Navbar /><TentangPage /><Footer /></>} />
          <Route path="/materi" element={<><Navbar /><MateriPage /><Footer /></>} />
          <Route path="/galeri" element={<><Navbar /><GaleriPage /><Footer /></>} />
          <Route path="/angkatan" element={<><Navbar /><AngkatanPage /><Footer /></>} />
          <Route path="/kegiatan" element={<><Navbar /><KegiatanPage /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogDetailPage /><Footer /></>} />
          <Route path="/gabung" element={<><Navbar /><GabungPage /><Footer /></>} />

          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/artikel" element={<ManageArticles />} />
                    <Route path="/galeri" element={<ManageGallery />} />
                    <Route path="/materi" element={<ManageMaterials />} />
                    <Route path="/anggota" element={<ManageMembers />} />
                    <Route path="/kegiatan" element={<ManageEvents />} />
                    <Route path="/angkatan" element={<ManageAngkatan />} />
                    <Route path="/storage" element={<ManageStorage />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ===== 404 ===== */}
          <Route path="*" element={<><Navbar /><NotFoundPage /><Footer /></>} />
        </Routes>
      </Suspense>
    </SmoothScroll>
  </>
  );
}
