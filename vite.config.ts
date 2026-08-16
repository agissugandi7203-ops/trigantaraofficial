import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.PORT || 8080}`,
          changeOrigin: true,
        },
      },
    },

    build: {
      target: 'es2022',
      // esbuild jauh lebih cepat dari terser dengan hasil ukuran yang setara
      // untuk kode aplikasi seperti ini.
      minify: 'esbuild',
      cssMinify: 'esbuild',
      sourcemap: false,
      // Ambang peringatan dinaikkan sedikit: bagian vendor React memang
      // melewati 500 kB mentah (jauh lebih kecil setelah kompresi gzip).
      chunkSizeWarningLimit: 700,
      reportCompressedSize: false,

      rollupOptions: {
        output: {
          // Pustaka pihak ketiga dipisah dari kode aplikasi supaya tetap
          // tersimpan di cache peramban meski isi website diperbarui.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;

            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
              return 'vendor-react';
            }
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('dompurify')) return 'vendor-sanitize';
            if (id.includes('lenis')) return 'vendor-scroll';

            return 'vendor';
          },

          // Nama berkas ber-hash: aman di-cache selamanya, otomatis berganti
          // saat isinya berubah.
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
