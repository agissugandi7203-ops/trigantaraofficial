import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Event } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { Calendar, Edit, Trash2 } from 'lucide-react';

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    judul: '', 
    deskripsi: '', 
    lokasi: '', 
    tanggal_mulai: '', 
    tanggal_selesai: '', 
    foto_url: '', 
    jenis: 'latihan' as Event['jenis'], 
    is_published: false 
  });

  const fetchData = async () => { 
    const { data } = await supabase.from('events').select('*').order('tanggal_mulai', { ascending: false }); 
    setEvents(data || []); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, tanggal_selesai: form.tanggal_selesai || null };
    if (editing) { 
      await supabase.from('events').update(payload).eq('id', editing.id); 
    } else { 
      await supabase.from('events').insert(payload); 
    }
    resetForm(); 
    fetchData();
  };

  const handleEdit = (ev: Event) => {
    setEditing(ev);
    setForm({ 
      judul: ev.judul, 
      deskripsi: ev.deskripsi || '', 
      lokasi: ev.lokasi || '', 
      tanggal_mulai: ev.tanggal_mulai, 
      tanggal_selesai: ev.tanggal_selesai || '', 
      foto_url: ev.foto_url || '', 
      jenis: ev.jenis, 
      is_published: ev.is_published 
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('events').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => { 
    setForm({ 
      judul: '', 
      deskripsi: '', 
      lokasi: '', 
      tanggal_mulai: '', 
      tanggal_selesai: '', 
      foto_url: '', 
      jenis: 'latihan', 
      is_published: false 
    }); 
    setEditing(null); 
    setShowForm(false); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Kegiatan</h1>
          <p className="text-zinc-500 text-sm mt-1">{events.length} kegiatan Pramuka terdaftar</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        >
          + Tambah Kegiatan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{editing ? 'Edit' : 'Tambah'} Kegiatan</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Judul Kegiatan</label>
                <input 
                  value={form.judul} 
                  onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} 
                  required 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Jenis Kegiatan</label>
                <select 
                  value={form.jenis} 
                  onChange={(e) => setForm((f) => ({ ...f, jenis: e.target.value as any }))} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                >
                  <option value="latihan">Latihan</option>
                  <option value="perkemahan">Perkemahan</option>
                  <option value="lomba">Lomba</option>
                  <option value="baksos">Bakti Sosial</option>
                  <option value="pelantikan">Pelantikan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tanggal Mulai</label>
                  <input 
                    type="date" 
                    value={form.tanggal_mulai} 
                    onChange={(e) => setForm((f) => ({ ...f, tanggal_mulai: e.target.value }))} 
                    required 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tanggal Selesai</label>
                  <input 
                    type="date" 
                    value={form.tanggal_selesai} 
                    onChange={(e) => setForm((f) => ({ ...f, tanggal_selesai: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Lokasi</label>
                <input 
                  value={form.lokasi} 
                  onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Deskripsi Kegiatan</label>
                <textarea 
                  value={form.deskripsi} 
                  onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} 
                  rows={3} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 resize-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">URL Foto Dokumentasi</label>
                <input 
                  value={form.foto_url} 
                  onChange={(e) => setForm((f) => ({ ...f, foto_url: e.target.value }))} 
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
                <label htmlFor="pub" className="text-sm font-medium text-zinc-700 cursor-pointer select-none">Publikasikan Kegiatan</label>
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
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <Calendar className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada kegiatan. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900">{ev.judul}</p>
                      {ev.lokasi && <p className="text-xs text-zinc-400 mt-1">📍 {ev.lokasi}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium capitalize">
                        {ev.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium text-xs">
                      {new Date(ev.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        ev.is_published 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      }`}>
                        {ev.is_published ? 'Publik' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button 
                          onClick={() => handleEdit(ev)} 
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(ev.id)} 
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
        title="Hapus Kegiatan"
        message="Apakah Anda yakin ingin menghapus kegiatan ini? Informasi kegiatan akan dihapus secara permanen."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
