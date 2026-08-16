import { useEffect } from 'react';

const SITE_NAME = 'Trigantara';
const SITE_URL = 'https://trigantara.web.id';
const DEFAULT_IMAGE = `${SITE_URL}/assets/logo/LOGO%20TRIGANTARA%20(2).webp`;

export interface SeoOptions {
  /** Judul halaman tanpa nama situs — nama situs ditambahkan otomatis. */
  title: string;
  description?: string;
  /** Path relatif, contoh: `/materi/sandi-morse`. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  /** Data terstruktur schema.org untuk halaman ini. */
  jsonLd?: Record<string, unknown>;
  /** Minta mesin pencari tidak mengindeks halaman ini (mis. halaman 404). */
  noIndex?: boolean;
}

/**
 * Menyetel judul dan metadata per halaman. Tanpa ini seluruh halaman SPA
 * berbagi satu judul dan satu pratinjau tautan.
 */
export function useSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noIndex = false,
}: SeoOptions): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = fullTitle;

    // Elemen dari render sebelumnya dibuang lebih dulu.
    document.querySelectorAll('[data-seo]').forEach((el) => el.remove());

    const head = document.head;

    const addMeta = (attr: 'name' | 'property', key: string, value: string) => {
      // Tag yang sudah ada di index.html diperbarui nilainya, bukan digandakan,
      // supaya tidak ada dua deskripsi yang saling bertentangan.
      const existing = head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (existing) {
        existing.setAttribute('content', value);
        return;
      }
      const meta = document.createElement('meta');
      meta.setAttribute(attr, key);
      meta.setAttribute('content', value);
      meta.setAttribute('data-seo', '');
      head.appendChild(meta);
    };

    if (description) {
      addMeta('name', 'description', description);
      addMeta('property', 'og:description', description);
      addMeta('name', 'twitter:description', description);
    }

    addMeta('property', 'og:title', fullTitle);
    addMeta('property', 'og:url', url);
    addMeta('property', 'og:type', type);
    addMeta('property', 'og:image', image);
    addMeta('name', 'twitter:title', fullTitle);
    addMeta('name', 'twitter:image', image);
    addMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

    let canonical = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      head.appendChild(canonical);
    }
    canonical.href = url;

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', '');
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...jsonLd });
      head.appendChild(script);
    }

    return () => {
      document.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    };
  }, [title, description, path, image, type, noIndex, jsonLd]);
}

export { SITE_URL, SITE_NAME };
