import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { KATEGORI_GALERI } from '../../data/constants';
import type { GalleryItem } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { uploadFileToR2 } from '../../lib/r2';
import { Image as ImageIcon, Trash2, Plus, X, UploadCloud, FileImage, Check } from 'lucide-react';

export default function ManageGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form Fields
  const [form, setForm] = useState({ 
    judul: '', 
    deskripsi: '', 
    foto_url: '', 
    kategori: 'kegiatan', 
    tanggal: '' 
  });

  // Single Upload File
  const [singleFile, setSingleFile] = useState<File | null>(null);
  
  // Bulk Upload Files
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  
  // Uploading States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [bulkError, setBulkError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => { 
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false }); 
    setItems(data || []); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, []);

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSingleFile(e.target.files[0]);
    }
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setBulkFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeBulkFile = (index: number) => {
    setBulkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setBulkError(null);

    try {
      if (uploadMode === 'single') {
        let finalUrl = form.foto_url;

        // If a file was selected, upload it first
        if (singleFile) {
          finalUrl = await uploadFileToR2(singleFile, 'galeri', (percent) => {
            setUploadProgress({ [singleFile.name]: percent });
          });
        }

        if (!finalUrl) {
          throw new Error('Harap masukkan URL foto atau unggah berkas gambar.');
        }

        await supabase.from('gallery').insert({ 
          judul: form.judul || singleFile?.name.split('.')[0] || 'Foto Tanpa Judul',
          deskripsi: form.deskripsi,
          foto_url: finalUrl,
          kategori: form.kategori,
          tanggal: form.tanggal || new Date().toISOString().split('T')[0],
          urutan: 0 
        });

      } else {
        // Bulk Upload Mode
        if (bulkFiles.length === 0) {
          throw new Error('Harap pilih minimal satu berkas gambar untuk upload massal.');
        }

        const uploadedUrls: { url: string; title: string }[] = [];

        // Upload all files in parallel
        await Promise.all(bulkFiles.map(async (file, index) => {
          const publicUrl = await uploadFileToR2(file, 'galeri', (percent) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: percent
            }));
          });
          
          // Generate title: base title + index, or original filename
          const cleanName = file.name.split('.').slice(0, -1).join('.');
          const photoTitle = form.judul 
            ? `${form.judul} - ${index + 1}` 
            : cleanName;

          uploadedUrls.push({ url: publicUrl, title: photoTitle });
        }));

        // Bulk insert to Supabase
        const payloads = uploadedUrls.map(item => ({
          judul: item.title,
          deskripsi: form.deskripsi,
          foto_url: item.url,
          kategori: form.kategori,
          tanggal: form.tanggal || new Date().toISOString().split('T')[0],
          urutan: 0
        }));

        const { error } = await supabase.from('gallery').insert(payloads);
        if (error) throw error;
      }

      // Reset states
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error(err);
      setBulkError(err.message || 'Terjadi kesalahan saat menyimpan data galeri.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('gallery').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => {
    setForm({ judul: '', deskripsi: '', foto_url: '', kategori: 'kegiatan', tanggal: '' });
    setSingleFile(null);
    setBulkFiles([]);
    setUploadProgress({});
    setBulkError(null);
    setUploading(false);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Kelola Galeri</h1>
          <p className="text-zinc-500 text-sm mt-1">{items.length} foto terdaftar di galeri</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer animate-in"
        >
          + Tambah Foto / Upload Massal
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-zinc-100 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Unggah Dokumentasi Galeri</h2>
              <button onClick={resetForm} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer">✕</button>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-zinc-200 mb-6 gap-4">
              <button 
                type="button"
                onClick={() => { setUploadMode('single'); setBulkError(null); }}
                className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${uploadMode === 'single' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
              >
                Upload Tunggal
              </button>
              <button 
                type="button"
                onClick={() => { setUploadMode('bulk'); setBulkError(null); }}
                className={`py-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${uploadMode === 'bulk' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
              >
                Upload Massal (Banyak Foto)
              </button>
            </div>

            {bulkError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl mb-4">
                {bulkError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Common Metadata Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                    {uploadMode === 'bulk' ? 'Judul Dasar (Opsional)' : 'Judul Foto'}
                  </label>
                  <input 
                    value={form.judul} 
                    onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} 
                    placeholder={uploadMode === 'bulk' ? 'Contoh: Latihan Rutin (Otomatis Latihan Rutin - 1, dst.)' : 'Judul foto dokumentasi'}
                    required={uploadMode === 'single' && !singleFile}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Kategori</label>
                  <select 
                    value={form.kategori} 
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900"
                  >
                    {KATEGORI_GALERI.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tanggal Dokumentasi</label>
                  <input 
                    type="date" 
                    value={form.tanggal} 
                    onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))} 
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Deskripsi / Keterangan</label>
                  <input 
                    value={form.deskripsi} 
                    onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} 
                    placeholder="Keterangan singkat momen"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                  />
                </div>
              </div>

              {/* Single File Mode */}
              {uploadMode === 'single' ? (
                <div className="space-y-4 pt-2">
                  <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-6 text-center cursor-pointer bg-zinc-50/50 transition-all relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleSingleFileChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                    {singleFile ? (
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">{singleFile.name}</p>
                        <p className="text-xs text-zinc-400 mt-1">{(singleFile.size / 1024).toFixed(1)} KB · Siap diunggah</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500">Klik atau seret file gambar di sini</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Format: PNG, JPG, WEBP (Maksimal 5MB)</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-xs text-zinc-400 font-bold uppercase">— ATAU MASUKKAN URL GAMBAR —</div>

                  <div>
                    <input 
                      value={form.foto_url} 
                      onChange={(e) => setForm((f) => ({ ...f, foto_url: e.target.value }))} 
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:bg-white text-zinc-900 transition-all" 
                    />
                  </div>
                </div>
              ) : (
                /* Bulk Upload Mode */
                <div className="space-y-4 pt-2">
                  <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-6 text-center cursor-pointer bg-zinc-50/50 transition-all relative">
                    <input 
                      type="file" 
                      ref={bulkInputRef}
                      onChange={handleBulkFileChange}
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-500">Klik atau seret banyak file gambar sekaligus di sini</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Pilih beberapa file untuk diunggah massal ke galeri</p>
                    </div>
                  </div>

                  {/* Bulk files preview list */}
                  {bulkFiles.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-zinc-100 rounded-xl p-3 bg-zinc-50/50">
                      <div className="flex justify-between items-center text-xs text-zinc-400 font-bold mb-2">
                        <span>BERKAS YANG DIPILIH ({bulkFiles.length})</span>
                        <button type="button" onClick={() => setBulkFiles([])} className="text-red-500 hover:underline">Hapus Semua</button>
                      </div>
                      
                      <div className="grid gap-2">
                        {bulkFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-zinc-150 text-xs">
                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                              <FileImage className="w-4 h-4 text-zinc-400 shrink-0" />
                              <span className="font-medium text-zinc-800 truncate">{file.name}</span>
                              <span className="text-[10px] text-zinc-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            
                            <button 
                              type="button" 
                              onClick={() => removeBulkFile(idx)} 
                              className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-red-500 shrink-0 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress list */}
                  {uploading && Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-2 border border-zinc-200 rounded-xl p-3 bg-white">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Progres Unggahan Berkas</p>
                      <div className="grid gap-2 max-h-36 overflow-y-auto">
                        {Object.entries(uploadProgress).map(([filename, percent]) => (
                          <div key={filename} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-zinc-600">
                              <span className="truncate max-w-[80%]">{filename}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 justify-end border-t border-zinc-100">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  disabled={uploading}
                  className="px-5 py-2 text-sm font-semibold bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={uploading || (uploadMode === 'bulk' && bulkFiles.length === 0) || (uploadMode === 'single' && !singleFile && !form.foto_url)}
                  className="px-5 py-2 text-sm font-semibold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    'Simpan Foto'
                  )}
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
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Belum ada foto di galeri. Klik tombol di atas untuk menambah.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <div className="aspect-square w-full overflow-hidden bg-zinc-50 relative">
                <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-4 border-t border-zinc-100">
                <p className="text-sm font-bold text-zinc-900 line-clamp-1">{item.judul}</p>
                <p className="text-xs text-zinc-400 mt-1 capitalize font-medium">{item.kategori}</p>
              </div>
              <button 
                onClick={() => handleDeleteClick(item.id)} 
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 border border-zinc-150 hover:bg-red-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer hover:text-red-700"
                title="Hapus Foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini? Foto akan dihapus secara permanen dari galeri."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
