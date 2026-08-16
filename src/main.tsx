import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router';
import './index.css';

// Otomatis memuat ulang halaman bila chunk lama tidak ditemukan setelah rilis versi baru
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const storageKey = 'vite_preload_reload';
  const lastReload = sessionStorage.getItem(storageKey);
  const now = Date.now();
  if (!lastReload || now - Number(lastReload) > 10000) {
    sessionStorage.setItem(storageKey, String(now));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

