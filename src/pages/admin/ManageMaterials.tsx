import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Edit, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { renderContent } from '../../lib/sanitize';
import { KATEGORI_MATERI } from '../../data/constants';
import ConfirmModal from '../../components/admin/ConfirmModal';
import type { Material } from '../../types';

const FORM_KOSONG = {
  judul: '',
  slug: '',
  ringkasan: '',
  deskripsi: '',
  konten: '',
  kategori: 'sandi',
  file_url: '',
  thumbnail_url: '',
  sumber: '',
  sumber_url: '',
  tingkatan: 'penegak' as Material['tingkatan'],
  durasi_menit: 10,
  urutan: 0,
  is_published: false,
};

type FormMateri = typeof FORM_KOSONG;

// NFD memisahkan huruf beraksen menjadi huruf dasar + tanda; tanda itu dibuang
// supaya "é" menjadi "e", bukan tanda hubung.
const TANDA_AKSEN = /[̀-ͯ]/g;

const buatSlug = (judul: string) =>
  judul
    .toLowerCase()
    .normalize('NFD')
    .replace(TANDA_AKSEN, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export default function ManageMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'data' | 'konten' | 'pratinjau'>('data');
  const [form, setForm] = useState<FormMateri>(FORM_KOSONG);

  const muatData = useCallback(async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) setPesan(`Gagal memuat data: ${error.message}`);
    setMaterials((data as Material[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void muatData();
  }, [muatData]);

  const pratinjau = useMemo(() => renderContent(form.konten), [form.konten]);

  const ubah = <K extends keyof FormMateri>(kunci: K, nilai: FormMateri[K]) =>
    setForm((f) => ({ ...f, [kunci]: nilai }));

  const handleJudul = (nilai: string) => {
    setForm((f) => ({
      ...f,
      judul: nilai,
      // Slug hanya dibuat otomatis untuk materi baru. Mengubah slug materi
      // yang sudah terbit akan mematahkan tautan yang sudah tersebar.
      slug: editing ? f.slug : buatSlug(nilai),
    }));
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesan(null);

    const muatan = { ...form, slug: form.slug || buatSlug(form.judul) };

    const { error } = editing
      ? await supabase.from('materials').update(muatan).eq('id', editing.id)
      : await supabase.from('materials').insert(muatan);

    if (error) {
      setPesan(`Gagal menyimpan: ${error.message}`);
      return;
    }

    tutupForm();
    void muatData();
  };

  const hapus = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('materials').delete().eq('id', deleteId);
    if (error) setPesan(`Gagal menghapus: ${error.message}`);
    setDeleteId(null);
    void muatData();
  };

  const bukaEdit = (m: Material) => {
    setEditing(m);
    setForm({
      judul: m.judul,
      slug: m.slug ?? buatSlug(m.judul),
      ringkasan: m.ringkasan ?? '',
      deskripsi: m.deskripsi ?? '',
      konten: m.konten ?? '',
      kategori: m.kategori,
      file_url: m.file_url ?? '',
      thumbnail_url: m.thumbnail_url ?? '',
      sumber: m.sumber ?? '',
      sumber_url: m.sumber_url ?? '',
      tingkatan: m.tingkatan,
      durasi_menit: m.durasi_menit ?? 10,
      urutan: m.urutan ?? 0,
      is_published: m.is_published,
    });
    setTab('data');
    setShowForm(true);
  };

  const tutupForm = () => {
    setForm(FORM_KOSONG);
    setEditing(null);
    setShowForm(false);
    setTab('data');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Kelola Materi</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {materials.length} materi · {materials.filter((m) => m.is_published).length} terbit
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
          + Tambah Materi
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
                {editing ? 'Edit Materi' : 'Tambah Materi'}
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
              {(['data', 'konten', 'pratinjau'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer capitalize ${
                    tab === t
                      ? 'border-zinc-900 text-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {t === 'data' ? 'Data Materi' : t === 'konten' ? 'Isi Materi' : 'Pratinjau'}
                </button>
              ))}
            </div>

            <form onSubmit={simpan} className="space-y-5">
              {tab === 'data' && (
                <div className="space-y-4">
                  <Field label="Judul Materi">
                    <input
                      value={form.judul}
                      onChange={(e) => handleJudul(e.target.value)}
                      required
                      className={INPUT}
                    />
                  </Field>

                  <Field label="Slug URL" hint="Alamat halaman: /materi/slug-ini">
                    <input
                      value={form.slug}
                      onChange={(e) => ubah('slug', buatSlug(e.target.value))}
                      required
                      className={INPUT}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Kategori">
                      <select
                        value={form.kategori}
                        onChange={(e) => ubah('kategori', e.target.value)}
                        className={INPUT}
                      >
                        {KATEGORI_MATERI.map((k) => (
                          <option key={k.value} value={k.value}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Tingkatan">
                      <select
                        value={form.tingkatan}
                        onChange={(e) => ubah('tingkatan', e.target.value as Material['tingkatan'])}
                        className={INPUT}
                      >
                        <option value="siaga">Siaga</option>
                        <option value="penggalang">Penggalang</option>
                        <option value="penegak">Penegak</option>
                        <option value="umum">Umum</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Ringkasan" hint="Satu kalimat, tampil di kartu daftar materi">
                    <textarea
                      value={form.ringkasan}
                      onChange={(e) => ubah('ringkasan', e.target.value)}
                      rows={2}
                      className={`${INPUT} resize-none`}
                    />
                  </Field>

                  <Field label="Deskripsi Panjang" hint="Dipakai untuk mesin pencari">
                    <textarea
                      value={form.deskripsi}
                      onChange={(e) => ubah('deskripsi', e.target.value)}
                      rows={2}
                      className={`${INPUT} resize-none`}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Durasi Baca (menit)">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={form.durasi_menit}
                        onChange={(e) => ubah('durasi_menit', Number(e.target.value))}
                        className={INPUT}
                      />
                    </Field>
                    <Field label="Urutan Tampil" hint="Angka kecil tampil dulu">
                      <input
                        type="number"
                        value={form.urutan}
                        onChange={(e) => ubah('urutan', Number(e.target.value))}
                        className={INPUT}
                      />
                    </Field>
                    <Field label="Status">
                      <label className="flex items-center gap-2 h-[42px] px-4 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.is_published}
                          onChange={(e) => ubah('is_published', e.target.checked)}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-sm text-zinc-700 select-none">Terbitkan</span>
                      </label>
                    </Field>
                  </div>

                  <Field label="URL Gambar Sampul">
                    <input
                      value={form.thumbnail_url}
                      onChange={(e) => ubah('thumbnail_url', e.target.value)}
                      placeholder="https://..."
                      className={INPUT}
                    />
                  </Field>

                  <Field label="URL Berkas Unduhan" hint="PDF atau dokumen pendukung (opsional)">
                    <input
                      value={form.file_url}
                      onChange={(e) => ubah('file_url', e.target.value)}
                      placeholder="https://..."
                      className={INPUT}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nama Sumber Rujukan">
                      <input
                        value={form.sumber}
                        onChange={(e) => ubah('sumber', e.target.value)}
                        placeholder="Wikipedia — Kode Morse"
                        className={INPUT}
                      />
                    </Field>
                    <Field label="Tautan Sumber">
                      <input
                        value={form.sumber_url}
                        onChange={(e) => ubah('sumber_url', e.target.value)}
                        placeholder="https://..."
                        className={INPUT}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {tab === 'konten' && (
                <Field
                  label="Isi Materi"
                  hint="Boleh teks biasa. ## untuk judul bagian, - untuk daftar, **tebal**, | untuk tabel"
                >
                  <textarea
                    value={form.konten}
                    onChange={(e) => ubah('konten', e.target.value)}
                    rows={20}
                    placeholder={'## Judul Bagian\n\nParagraf penjelasan.\n\n- Poin pertama\n- Poin kedua'}
                    className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
                  />
                </Field>
              )}

              {tab === 'pratinjau' && (
                <div className="max-h-[55vh] overflow-y-auto p-5 border border-zinc-200 rounded-2xl bg-zinc-50/60">
                  <h3 className="font-serif text-2xl font-bold text-zinc-900 mb-2">
                    {form.judul || 'Judul materi belum diisi'}
                  </h3>
                  {form.ringkasan && <p className="text-sm text-zinc-500 mb-6">{form.ringkasan}</p>}
                  {form.konten ? (
                    <div className="konten-kaya" dangerouslySetInnerHTML={{ __html: pratinjau }} />
                  ) : (
                    <p className="text-sm text-zinc-400 italic">Isi materi belum ditulis.</p>
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
                  {editing ? 'Simpan Perubahan' : 'Tambah Materi'}
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
      ) : materials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada materi. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-bold">Judul</th>
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold">Tingkatan</th>
                  <th className="px-6 py-4 font-bold">Isi</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900">{m.judul}</p>
                      {m.slug && <p className="text-xs text-zinc-400 mt-0.5">/materi/{m.slug}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium capitalize">
                        {m.kategori.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-zinc-500">{m.tingkatan}</td>
                    <td className="px-6 py-4">
                      {m.konten && m.konten.length > 50 ? (
                        <span className="text-xs text-emerald-700">
                          {Math.round(m.konten.length / 1000)} rb karakter
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600">belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          m.is_published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {m.is_published ? 'Terbit' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {m.slug && m.is_published && (
                          <a
                            href={`/materi/${m.slug}`}
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
                          onClick={() => bukaEdit(m)}
                          title="Edit"
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(m.id)}
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
        title="Hapus Materi"
        message="Materi ini akan dihapus permanen beserta seluruh isinya. Tindakan ini tidak dapat dibatalkan."
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
