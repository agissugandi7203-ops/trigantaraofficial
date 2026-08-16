import DOMPurify from 'dompurify';

/**
 * Pembersih HTML untuk isi artikel dan materi.
 * Konten dari basis data disuntikkan lewat dangerouslySetInnerHTML, jadi harus
 * disaring lebih dulu terhadap daftar putih tag dan atribut (anti stored XSS).
 */

/** Tag yang boleh muncul di isi artikel dan materi. */
const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'span', 'div',
  'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'q', 'cite', 'figure', 'figcaption',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'code', 'pre', 'kbd', 'abbr',
];

const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel',
  'src', 'alt', 'width', 'height', 'loading', 'decoding',
  'class', 'id',
  'colspan', 'rowspan', 'scope',
  'datetime', 'cite',
];

/** Tautan luar otomatis diberi rel="noopener noreferrer" (anti tabnabbing). */
let hookRegistered = false;

function registerHooks(): void {
  if (hookRegistered) return;
  hookRegistered = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      const href = node.getAttribute('href') ?? '';
      const isExternal = /^https?:\/\//i.test(href);
      if (isExternal) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (node.tagName === 'IMG') {
      // Gambar di dalam artikel selalu berada jauh di bawah lipatan layar.
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
    }
  });
}

/** Membersihkan HTML sehingga aman ditampilkan di halaman. */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  registerHooks();

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Skema URL selain berikut (mis. `javascript:`, `data:` untuk HTML)
    // dibuang seluruhnya.
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):|^\/(?!\/)|^#/i,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  });
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (text: string): string =>
  text
    .replace(/`([^`]+)`/g, (_, code: string) => `<code>${escapeHtml(code)}</code>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)([^*]+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');

/** Tabel bergaya markdown: baris pertama judul, baris kedua pemisah. */
function renderTable(block: string): string {
  const rows = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (rows.length < 2) return '';

  const cells = (line: string) =>
    line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim());

  const head = cells(rows[0]!);
  const body = rows.slice(2).map(cells);

  const thead = `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;

  return `<table>${thead}${tbody}</table>`;
}

/**
 * Mengubah markdown ringan menjadi HTML, supaya pengurus Gudep bisa menulis
 * di panel admin tanpa perlu tahu HTML. Blok yang sudah berupa HTML dilewatkan
 * apa adanya dan tetap disaring `sanitizeHtml` sebelum ditampilkan.
 */
export function formatContent(content: string): string {
  if (!content) return '';

  const normalized = content.replace(/\r\n/g, '\n').trim();

  // Blok kode dipisah lebih dulu supaya isinya tidak ikut diformat.
  const segments = normalized.split(/\n?```\n?/);

  return segments
    .map((segment, index) => {
      // Indeks ganjil berada di antara sepasang pagar kode.
      if (index % 2 === 1) return `<pre><code>${escapeHtml(segment)}</code></pre>`;

      return segment
        .split(/\n{2,}/)
        .map((block) => {
          const text = block.trim();
          if (!text) return '';

          // Blok yang sudah berupa HTML dibiarkan apa adanya — pembersih
          // DOMPurify tetap menyaringnya sebelum ditampilkan.
          if (text.startsWith('<')) return text;

          if (text.startsWith('#### ')) return `<h4>${inline(text.slice(5))}</h4>`;
          if (text.startsWith('### ')) return `<h3>${inline(text.slice(4))}</h3>`;
          if (text.startsWith('## ')) return `<h2>${inline(text.slice(3))}</h2>`;
          if (text.startsWith('# ')) return `<h2>${inline(text.slice(2))}</h2>`;
          if (text === '---' || text === '***') return '<hr />';

          if (text.startsWith('|')) return renderTable(text);

          if (text.startsWith('> ')) {
            const quote = text
              .split('\n')
              .map((line) => line.replace(/^>\s?/, ''))
              .filter(Boolean)
              .join(' ');
            return `<blockquote><p>${inline(quote)}</p></blockquote>`;
          }

          if (/^[-*]\s/.test(text)) {
            const items = text
              .split('\n')
              .map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
              .join('');
            return `<ul>${items}</ul>`;
          }

          if (/^\d+\.\s/.test(text)) {
            const items = text
              .split('\n')
              .map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`)
              .join('');
            return `<ol>${items}</ol>`;
          }

          return `<p>${inline(text).replace(/\n/g, '<br />')}</p>`;
        })
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean)
    .join('\n');
}

/** Jalur cepat: format lalu bersihkan dalam satu langkah. */
export function renderContent(content: string): string {
  return sanitizeHtml(formatContent(content));
}

/**
 * Mengambil ringkasan teks polos dari HTML — dipakai untuk meta description
 * dan pratinjau kartu.
 */
export function excerptFromHtml(html: string, maxLength = 160): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  // Dipotong pada batas kata terdekat agar tidak memenggal kata di tengah.
  return `${text.slice(0, text.lastIndexOf(' ', maxLength) || maxLength).trim()}…`;
}
