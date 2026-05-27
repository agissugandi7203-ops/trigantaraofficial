import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { JURUSAN_LIST, KELAS_LIST } from '../../data/constants';
import type { Member, Pendaftaran } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { Users, Edit, Trash2, Check, X, ClipboardList } from 'lucide-react';

export default function ManageMembers() {
  const [tab, setTab] = useState<'anggota' | 'pendaftaran'>('anggota');
  const [members, setMembers] = useState<Member[]>([]);
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    nama_lengkap: '', 
    kelas: '', 
    jurusan: '', 
    jabatan: '', 
    ambalan: '' as '' | 'putra' | 'putri', 
    no_hp: '', 
    alamat: '', 
    nomor_kta: '', 
    status: 'aktif' as const 
  });

  const fetchData = async () => {
    const [{ data: m }, { data: p }] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('pendaftaran').select('*').order('created_at', { ascending: false }),
    ]);
    setMembers(m || []); 
    setPendaftaran(p || []); 
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, ambalan: form.ambalan || null, nomor_kta: form.nomor_kta || null };
    if (editing) { 
      await supabase.from('members').update(payload).eq('id', editing.id); 
    } else { 
      await supabase.from('members').insert(payload); 
    }
    resetForm(); 
    fetchData();
  };

  const handleEdit = (m: Member) => {
    setEditing(m);
    setForm({ 
      nama_lengkap: m.nama_lengkap, 
      kelas: m.kelas || '', 
      jurusan: m.jurusan || '', 
      jabatan: m.jabatan || '', 
      ambalan: (m.ambalan || '') as any, 
      no_hp: m.no_hp || '', 
      alamat: m.alamat || '', 
      nomor_kta: m.nomor_kta || '', 
      status: m.status 
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('members').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => { 
    setForm({ 
      nama_lengkap: '', 
      kelas: '', 
      jurusan: '', 
      jabatan: '', 
      ambalan: '', 
      no_hp: '', 
      alamat: '', 
      nomor_kta: '', 
      status: 'aktif' 
    }); 
    setEditing(null); 
    setShowForm(false); 
  };

  const handleApprove = async (p: Pendaftaran) => {
    await fetch(`/api/admin/pendaftaran/${p.id}/approve`, { 
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('trigantara_admin_token')}`, 
        'Content-Type': 'application/json' 
      } 
    });
    fetchData();
  };

  const handleReject = async (p: Pendaftaran) => {
    await fetch(`/api/admin/pendaftaran/${p.id}/reject`, { 
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('trigantara_admin_token')}`, 
        'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify({ catatan_admin: 'Ditolak oleh admin.' }) 
    });
    fetchData();
  };

  const filteredMembers = filterStatus === 'semua' ? members : members.filter((m) => m.status === filterStatus);
  const pendingCount = pendaftaran.filter((p) => p.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Anggota</h1>
          <p className="text-zinc-500 text-sm mt-1">Daftar anggota aktif dan pendaftaran baru</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
        >
          + Tambah Anggota
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button 
          onClick={() => setTab('anggota')} 
          className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            tab === 'anggota' 
              ? 'border-zinc-900 text-zinc-900' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <span>Daftar Anggota</span>
          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold">
            {members.length}
          </span>
        </button>
        <button 
          onClick={() => setTab('pendaftaran')} 
          className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            tab === 'pendaftaran' 
              ? 'border-zinc-900 text-zinc-900' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <span>Pendaftaran Baru</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{editing ? 'Edit' : 'Tambah'} Anggota</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Nama Lengkap</label>
                <input 
                  value={form.nama_lengkap} 
                  onChange={(e) => setForm((f) => ({ ...f, nama_lengkap: e.target.value }))} 
                  required 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Kelas</label>
                  <select 
                    value={form.kelas} 
                    onChange={(e) => setForm((f) => ({ ...f, kelas: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    <option value="">-</option>
                    {KELAS_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Jurusan</label>
                  <select 
                    value={form.jurusan} 
                    onChange={(e) => setForm((f) => ({ ...f, jurusan: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    <option value="">-</option>
                    {JURUSAN_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Jabatan</label>
                  <input 
                    value={form.jabatan} 
                    onChange={(e) => setForm((f) => ({ ...f, jabatan: e.target.value }))} 
                    placeholder="Contoh: Pradana" 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Ambalan</label>
                  <select 
                    value={form.ambalan} 
                    onChange={(e) => setForm((f) => ({ ...f, ambalan: e.target.value as any }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    <option value="">-</option>
                    <option value="putra">Putra (KHD)</option>
                    <option value="putri">Putri (Inggit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">No. HP / WhatsApp</label>
                <input 
                  value={form.no_hp} 
                  onChange={(e) => setForm((f) => ({ ...f, no_hp: e.target.value }))} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">No. KTA (Anggota)</label>
                <input 
                  value={form.nomor_kta} 
                  onChange={(e) => setForm((f) => ({ ...f, nomor_kta: e.target.value }))} 
                  placeholder="Diisi manual oleh admin" 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Status Keanggotaan</label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))} 
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                >
                  <option value="aktif">Aktif</option>
                  <option value="alumni">Alumni</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
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
      ) : tab === 'anggota' ? (
        <>
          {/* Member Status Filters */}
          <div className="flex gap-2">
            {['semua', 'aktif', 'alumni', 'nonaktif'].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilterStatus(s)} 
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer capitalize ${
                  filterStatus === s 
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' 
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
              <Users className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">Tidak ada data anggota terdaftar.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Jabatan</th>
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">KTA</th>
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4.5 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-zinc-900">{m.nama_lengkap}</p>
                          <p className="text-xs text-zinc-400 mt-1 capitalize font-medium">
                            {m.ambalan ? `Ambalan ${m.ambalan}` : 'Pangkalan'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 font-medium">{m.kelas || '-'}</td>
                        <td className="px-6 py-4 text-zinc-500 font-medium">{m.jabatan || '-'}</td>
                        <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{m.nomor_kta || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            m.status === 'aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                            m.status === 'alumni' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                            'bg-zinc-100 text-zinc-500 border border-zinc-200'
                          }`}>
                            {m.status}
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
        </>
      ) : (
        /* Pendaftaran Tab */
        pendaftaran.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
            <ClipboardList className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">Belum ada pendaftaran baru.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendaftaran.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-bold text-zinc-900">{p.nama_lengkap}</p>
                  <p className="text-xs text-zinc-400 mt-1">{p.kelas} — {p.jurusan} · {p.no_hp}</p>
                  {p.motivasi && (
                    <p className="text-xs text-zinc-500 mt-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100 italic">
                      "{p.motivasi}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {p.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleApprove(p)} 
                        className="px-3.5 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Terima
                      </button>
                      <button 
                        onClick={() => handleReject(p)} 
                        className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all border border-red-100 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>
                    </>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      p.status === 'diterima' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {p.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Data Anggota"
        message="Apakah Anda yakin ingin menghapus data anggota ini? Seluruh data anggota akan dihapus secara permanen dari database."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
