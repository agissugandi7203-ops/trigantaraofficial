import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Edit, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { renderContent } from '../../lib/sanitize';
import { KATEGORI_ARTIKEL } from '../../data/constants';
import ConfirmModal from '../../components/admin/ConfirmModal';
import type { Article, KategoriArtikel } from '../../types';

const FORM_KOSONG = {
  judul: '',
  slug: '',
  ringkasan: '',
  konten: '',
  kategori: 'berita' as KategoriArtikel,
  penulis: 'Redaksi Trigantara',
  thumbnail_url: '',
  tags: '',
  is_published: false,
};

type FormArtikel = typeof FORM_KOSONG;

const buatSlug = (judul: string) =>
  judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

export default function ManageArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'tulis' | 'pratinjau'>('tulis');
  const [form, setForm] = useState<FormArtikel>(FORM_KOSONG);

  const muatData = useCallback(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setPesan(`Gagal memuat data: ${error.message}`);
    setArticles((data as Article[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void muatData();
  }, [muatData]);

  const pratinjau = useMemo(() => renderContent(form.konten), [form.konten]);

  const ubah = <K extends keyof FormArtikel>(kunci: K, nilai: FormArtikel[K]) =>
    setForm((f) => ({ ...f, [kunci]: nilai }));

  const handleJudul = (nilai: string) =>
    setForm((f) => ({ ...f, judul: nilai, slug: editing ? f.slug : buatSlug(nilai) }));

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesan(null);

    // Konten disimpan sebagaimana ditulis, bukan sebagai HTML jadi. Dengan
    // begitu penulis tetap bisa menyuntingnya lagi nanti; pemformatan
    // dilakukan saat ditampilkan.
    const muatan = {
      judul: form.judul,
      slug: form.slug || buatSlug(form.judul),
      ringkasan: form.ringkasan || null,
      konten: form.konten,
      kategori: form.kategori,
      penulis: form.penulis,
      thumbnail_url: form.thumbnail_url || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      is_published: form.is_published,
      // Tanggal terbit yang sudah ada dipertahankan agar urutan blog stabil.
      published_at: form.is_published
        ? (editing?.published_at ?? new Date().toISOString())
        : null,
    };

    const { error } = editing
      ? await supabase.from('articles').update(muatan).eq('id', editing.id)
      : await supabase.from('articles').insert(muatan);

    if (error) {
      setPesan(`Gagal menyimpan: ${error.message}`);
      return;
    }

    tutupForm();
    void muatData();
  };

  const hapus = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('articles').delete().eq('id', deleteId);
    if (error) setPesan(`Gagal menghapus: ${error.message}`);
    setDeleteId(null);
    void muatData();
  };

  const bukaEdit = (a: Article) => {
    setEditing(a);
    setForm({
      judul: a.judul,
      slug: a.slug,
      ringkasan: a.ringkasan ?? '',
      konten: a.konten,
      kategori: a.kategori,
      penulis: a.penulis,
      thumbnail_url: a.thumbnail_url ?? '',
      tags: (a.tags ?? []).join(', '),
      is_published: a.is_published,
    });
    setTab('tulis');
    setShowForm(true);
  };

  const tutupForm = () => {
    setForm(FORM_KOSONG);
    setEditing(null);
    setShowForm(false);
    setTab('tulis');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Kelola Artikel</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {articles.length} artikel · {articles.filter((a) => a.is_published).length} terbit
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            tutupForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          + Tambah Artikel
        </button>
      </div>

      {pesan && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {pesan}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">
                {editing ? 'Edit Artikel' : 'Tambah Artikel'}
              </h2>
              <button
                type="button"
                onClick={tutupForm}
                className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-zinc-200 mb-6 gap-5">
              {(['tulis', 'pratinjau'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    tab === t
                      ? 'border-zinc-900 text-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {t === 'tulis' ? 'Tulis Konten' : 'Pratinjau Hasil'}
                </button>
              ))}
            </div>

            <form onSubmit={simpan} className="space-y-5">
              {tab === 'tulis' ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Judul">
                      <input
                        value={form.judul}
                        onChange={(e) => handleJudul(e.target.value)}
                        required
                        className={INPUT}
                      />
                    </Field>
                    <Field label="Slug URL" hint="/blog/slug-ini">
                      <input
                        value={form.slug}
                        onChange={(e) => ubah('slug', buatSlug(e.target.value))}
                        required
                        className={INPUT}
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Kategori">
                      <select
                        value={form.kategori}
                        onChange={(e) => ubah('kategori', e.target.value as KategoriArtikel)}
                        className={INPUT}
                      >
                        {KATEGORI_ARTIKEL.filter((k) => k.value !== 'semua').map((k) => (
                          <option key={k.value} value={k.value}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Penulis">
                      <input
                        value={form.penulis}
                        onChange={(e) => ubah('penulis', e.target.value)}
                        className={INPUT}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Ringkasan"
                    hint="Tampil di kartu daftar dan pratinjau tautan WhatsApp"
                  >
                    <textarea
                      value={form.ringkasan}
                      onChange={(e) => ubah('ringkasan', e.target.value)}
                      rows={2}
                      className={`${INPUT} resize-none`}
                    />
                  </Field>

                  <Field label="URL Gambar Sampul">
                    <input
                      value={form.thumbnail_url}
                      onChange={(e) => ubah('thumbnail_url', e.target.value)}
                      placeholder="https://..."
                      className={INPUT}
                    />
                  </Field>

                  <Field label="Tag" hint="Dipisah koma">
                    <input
                      value={form.tags}
                      onChange={(e) => ubah('tags', e.target.value)}
                      placeholder="sejarah, pramuka indonesia, kemerdekaan"
                      className={INPUT}
                    />
                  </Field>

                  <Field
                    label="Isi Artikel"
                    hint="## judul bagian · - daftar · **tebal** · > kutipan · | tabel"
                  >
                    <textarea
                      value={form.konten}
                      onChange={(e) => ubah('konten', e.target.value)}
                      rows={16}
                      placeholder={'## Judul Bagian\n\nParagraf pembuka.\n\n- Poin pertama\n- Poin kedua'}
                      className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
                    />
                  </Field>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => ubah('is_published', e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-medium text-zinc-700 select-none">
                      Terbitkan artikel ini
                    </span>
                  </label>
                </div>
              ) : (
                <div className="max-h-[55vh] overflow-y-auto p-5 border border-zinc-200 rounded-2xl bg-zinc-50/60 space-y-5">
                  <div>
                    <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 rounded-md text-[10px] uppercase font-bold tracking-wider">
                      {form.kategori}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-zinc-900 mt-2">
                      {form.judul || 'Judul artikel belum diisi'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Oleh {form.penulis}</p>
                    {form.ringkasan && (
                      <p className="text-sm text-zinc-600 mt-3">{form.ringkasan}</p>
                    )}
                  </div>

                  {form.thumbnail_url && (
                    <img
                      src={form.thumbnail_url}
                      alt=""
                      className="w-full max-h-56 object-cover rounded-xl border border-zinc-200 bg-zinc-100"
                    />
                  )}

                  {form.konten ? (
                    <div className="konten-kaya" dangerouslySetInnerHTML={{ __html: pratinjau }} />
                  ) : (
                    <p className="text-sm text-zinc-400 italic">Belum ada konten tertulis.</p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-100 justify-end">
                <button
                  type="button"
                  onClick={tutupForm}
                  className="px-5 py-2 text-sm font-semibold bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                >
                  {editing ? 'Simpan Perubahan' : 'Tambah Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada artikel. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-bold">Judul</th>
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900 line-clamp-1">{a.judul}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {a.penulis} · /blog/{a.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium capitalize">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          a.is_published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {a.is_published ? 'Terbit' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {a.is_published && (
                          <a
                            href={`/blog/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat di website"
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => bukaEdit(a)}
                          title="Edit"
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(a.id)}
                          title="Hapus"
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Artikel"
        message="Artikel ini akan dihapus permanen dari basis data. Tindakan ini tidak dapat dibatalkan."
        onConfirm={hapus}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

const INPUT =
  'w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <label className="block text-xs font-semibold text-zinc-500 uppercase">{label}</label>
        {hint && <span className="text-[10px] text-zinc-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
