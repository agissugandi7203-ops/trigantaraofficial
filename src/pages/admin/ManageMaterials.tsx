import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { KATEGORI_MATERI } from '../../data/constants';
import type { Material } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { BookOpen, Edit, Trash2 } from 'lucide-react';

export default function ManageMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    judul: '', 
    deskripsi: '', 
    kategori: 'sandi', 
    file_url: '', 
    thumbnail_url: '', 
    tingkatan: 'penegak' as const, 
    is_published: false 
  });

  const fetchData = async () => { 
    const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false }); 
    setMaterials(data || []); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { 
      await supabase.from('materials').update(form).eq('id', editing.id); 
    } else { 
      await supabase.from('materials').insert(form); 
    }
    resetForm(); 
    fetchData();
  };

  const handleEdit = (m: Material) => {
    setEditing(m);
    setForm({ 
      judul: m.judul, 
      deskripsi: m.deskripsi || '', 
      kategori: m.kategori, 
      file_url: m.file_url || '', 
      thumbnail_url: m.thumbnail_url || '', 
      tingkatan: m.tingkatan, 
      is_published: m.is_published 
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('materials').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => { 
    setForm({ 
      judul: '', 
      deskripsi: '', 
      kategori: 'sandi', 
      file_url: '', 
      thumbnail_url: '', 
      tingkatan: 'penegak', 
      is_published: false 
    }); 
    setEditing(null); 
    setShowForm(false); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Materi</h1>
          <p className="text-zinc-500 text-sm mt-1">{materials.length} materi pembelajaran terdaftar</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        >
          + Tambah Materi
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{editing ? 'Edit' : 'Tambah'} Materi</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Judul Materi</label>
                <input 
                  value={form.judul} 
                  onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} 
                  required 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Kategori</label>
                  <select 
                    value={form.kategori} 
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    {KATEGORI_MATERI.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tingkatan</label>
                  <select 
                    value={form.tingkatan} 
                    onChange={(e) => setForm((f) => ({ ...f, tingkatan: e.target.value as any }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    <option value="siaga">Siaga</option>
                    <option value="penggalang">Penggalang</option>
                    <option value="penegak">Penegak</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Deskripsi Ringkas</label>
                <textarea 
                  value={form.deskripsi} 
                  onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} 
                  rows={3} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 resize-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">URL Berkas / PDF (Unduh)</label>
                <input 
                  value={form.file_url} 
                  onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))} 
                  placeholder="https://..." 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">URL Thumbnail Sampul</label>
                <input 
                  value={form.thumbnail_url} 
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))} 
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
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
                <label htmlFor="pub" className="text-sm font-medium text-zinc-700 cursor-pointer select-none">Publikasikan Materi</label>
              </div>

              <div className="flex gap-3 pt-4 justify-end border-t border-zinc-100">
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
                  {editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada materi pembelajaran. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Tingkatan</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-900">{m.judul}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium capitalize">
                        {m.kategori.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-zinc-500 font-medium">{m.tingkatan}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        m.is_published 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      }`}>
                        {m.is_published ? 'Publik' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button 
                          onClick={() => handleEdit(m)} 
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(m.id)} 
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
        title="Hapus Materi"
        message="Apakah Anda yakin ingin menghapus materi ini? Berkas materi akan dihapus secara permanen."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
