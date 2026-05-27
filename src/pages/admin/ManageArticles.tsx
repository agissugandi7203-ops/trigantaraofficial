import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Article } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { autoFormatHtml } from '../../lib/utils';
import { FileText, Edit, Trash2, Eye, EyeOff, Layout, List } from 'lucide-react';

export default function ManageArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    judul: '', 
    slug: '', 
    konten: '', 
    kategori: 'berita', 
    thumbnail_url: '', 
    is_published: false, 
    penulis: 'Admin' 
  });

  const fetchData = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === 'judul') updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto format content to HTML if it isn't raw HTML
    const processedKonten = autoFormatHtml(form.konten);
    
    const payload = { 
      ...form, 
      konten: processedKonten,
      published_at: form.is_published ? new Date().toISOString() : null 
    };

    if (editing) {
      await supabase.from('articles').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('articles').insert(payload);
    }
    resetForm();
    fetchData();
  };

  const handleEdit = (a: Article) => {
    setEditing(a);
    setForm({ 
      judul: a.judul, 
      slug: a.slug, 
      konten: a.konten, 
      kategori: a.kategori, 
      thumbnail_url: a.thumbnail_url || '', 
      is_published: a.is_published, 
      penulis: a.penulis 
    });
    setActiveTab('write');
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('articles').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => {
    setForm({ 
      judul: '', 
      slug: '', 
      konten: '', 
      kategori: 'berita', 
      thumbnail_url: '', 
      is_published: false, 
      penulis: 'Admin' 
    });
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Artikel</h1>
          <p className="text-zinc-500 text-sm mt-1">{articles.length} artikel terdaftar</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        >
          + Tambah Artikel
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{editing ? 'Edit Artikel' : 'Tambah Artikel'}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>
            
            {/* Tab Editor / Preview */}
            <div className="flex border-b border-zinc-200 mb-6 gap-4">
              <button 
                type="button"
                onClick={() => setActiveTab('write')}
                className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'write' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
              >
                Tulis Konten
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'preview' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
              >
                Pratinjau Hasil
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'write' ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Judul</label>
                      <input 
                        name="judul" 
                        value={form.judul} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white transition-all text-zinc-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Slug URL</label>
                      <input 
                        name="slug" 
                        value={form.slug} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white transition-all text-zinc-900" 
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Kategori</label>
                      <select 
                        name="kategori" 
                        value={form.kategori} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                      >
                        <option value="berita">Berita</option>
                        <option value="tips">Tips</option>
                        <option value="cerita">Cerita</option>
                        <option value="pengumuman">Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Penulis</label>
                      <input 
                        name="penulis" 
                        value={form.penulis} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white transition-all text-zinc-900" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">URL Thumbnail Gambar</label>
                    <input 
                      name="thumbnail_url" 
                      value={form.thumbnail_url} 
                      onChange={handleChange} 
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white transition-all text-zinc-900" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-500 uppercase">Konten Artikel</label>
                      <span className="text-[10px] text-zinc-400 font-medium">Bisa ketik teks biasa/markdown (otomatis terformat)</span>
                    </div>
                    <textarea 
                      name="konten" 
                      value={form.konten} 
                      onChange={handleChange} 
                      rows={9} 
                      placeholder="Tulis artikel di sini..."
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white transition-all text-zinc-900 resize-none font-sans" 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="pub" 
                      checked={form.is_published} 
                      onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} 
                      className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-500 cursor-pointer" 
                    />
                    <label htmlFor="pub" className="text-sm font-medium text-zinc-700 cursor-pointer select-none">Publikasikan Artikel Ini</label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-h-[50vh] overflow-y-auto p-4 border border-zinc-100 rounded-2xl bg-zinc-50/50">
                  {/* Article Title Preview */}
                  <div>
                    <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 rounded-md text-[10px] uppercase font-bold tracking-wider">
                      {form.kategori}
                    </span>
                    <h1 className="text-2xl font-bold font-serif text-zinc-900 mt-2">{form.judul || 'Judul Artikel Kosong'}</h1>
                    <p className="text-xs text-zinc-400 mt-1">Oleh {form.penulis} · Pratinjau Otomatis</p>
                  </div>

                  {form.thumbnail_url && (
                    <div className="rounded-xl overflow-hidden max-h-48 w-full border border-zinc-200 bg-zinc-100">
                      <img src={form.thumbnail_url} alt="Pratinjau" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Rendered HTML */}
                  <div 
                    className="prose prose-sm max-w-none text-zinc-800 font-sans"
                    dangerouslySetInnerHTML={{ __html: autoFormatHtml(form.konten) || '<p class="text-zinc-400 italic">Belum ada konten tertulis.</p>' }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-100 justify-end">
                <button 
                  type="button" 
                  onClick={resetForm} 
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada artikel. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900 text-sm line-clamp-1">{a.judul}</p>
                      <p className="text-xs text-zinc-400 mt-1">Penulis: {a.penulis}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium capitalize">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        a.is_published 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      }`}>
                        {a.is_published ? 'Publik' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button 
                          onClick={() => handleEdit(a)} 
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(a.id)} 
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Hapus"
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini akan menghapus artikel secara permanen dari database."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
