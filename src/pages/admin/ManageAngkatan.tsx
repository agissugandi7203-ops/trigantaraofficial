import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Angkatan } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { GraduationCap, Edit, Trash2 } from 'lucide-react';

export default function ManageAngkatan() {
  const [angkatan, setAngkatan] = useState<Angkatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Angkatan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    tahun_ajaran: '', 
    nama_angkatan: '', 
    deskripsi: '', 
    foto_bersama_url: '', 
    is_active: false 
  });

  const fetchData = async () => { 
    const { data } = await supabase.from('angkatan').select('*').order('tahun_ajaran', { ascending: false }); 
    setAngkatan(data || []); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { 
      await supabase.from('angkatan').update(form).eq('id', editing.id); 
    } else { 
      await supabase.from('angkatan').insert(form); 
    }
    resetForm(); 
    fetchData();
  };

  const handleEdit = (a: Angkatan) => {
    setEditing(a);
    setForm({ 
      tahun_ajaran: a.tahun_ajaran, 
      nama_angkatan: a.nama_angkatan || '', 
      deskripsi: a.deskripsi || '', 
      foto_bersama_url: a.foto_bersama_url || '', 
      is_active: a.is_active 
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('angkatan').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => { 
    setForm({ 
      tahun_ajaran: '', 
      nama_angkatan: '', 
      deskripsi: '', 
      foto_bersama_url: '', 
      is_active: false 
    }); 
    setEditing(null); 
    setShowForm(false); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Angkatan</h1>
          <p className="text-zinc-500 text-sm mt-1">{angkatan.length} angkatan terdaftar</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        >
          + Tambah Angkatan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{editing ? 'Edit' : 'Tambah'} Angkatan</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tahun Ajaran</label>
                <input 
                  value={form.tahun_ajaran} 
                  onChange={(e) => setForm((f) => ({ ...f, tahun_ajaran: e.target.value }))} 
                  required 
                  placeholder="Contoh: 2026-2027" 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Nama Angkatan</label>
                <input 
                  value={form.nama_angkatan} 
                  onChange={(e) => setForm((f) => ({ ...f, nama_angkatan: e.target.value }))} 
                  placeholder="Contoh: Angkatan Garuda" 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Deskripsi Angkatan</label>
                <textarea 
                  value={form.deskripsi} 
                  onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} 
                  rows={3} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 resize-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">URL Foto Bersama</label>
                <input 
                  value={form.foto_bersama_url} 
                  onChange={(e) => setForm((f) => ({ ...f, foto_bersama_url: e.target.value }))} 
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="act" 
                  checked={form.is_active} 
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} 
                  className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-500 cursor-pointer" 
                />
                <label htmlFor="act" className="text-sm font-medium text-zinc-700 cursor-pointer select-none">Angkatan Aktif Saat Ini</label>
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
      ) : angkatan.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <GraduationCap className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada angkatan terdaftar. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {angkatan.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between shadow-sm">
              <div>
                {a.foto_bersama_url ? (
                  <img src={a.foto_bersama_url} alt={a.tahun_ajaran} className="w-full h-44 object-cover border-b border-zinc-100" />
                ) : (
                  <div className="w-full h-44 bg-zinc-50 border-b border-zinc-100 flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-zinc-300" />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-900">{a.tahun_ajaran}</h3>
                    {a.is_active && (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
                        Aktif
                      </span>
                    )}
                  </div>
                  {a.nama_angkatan && <p className="text-sm font-semibold text-zinc-700">{a.nama_angkatan}</p>}
                  {a.deskripsi && <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{a.deskripsi}</p>}
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex gap-2 border-t border-zinc-50">
                <button 
                  onClick={() => handleEdit(a)} 
                  className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(a.id)} 
                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Angkatan"
        message="Apakah Anda yakin ingin menghapus angkatan ini? Data angkatan dan foto bersamanya akan dihapus secara permanen."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
