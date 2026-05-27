import { useEffect, useState } from 'react';
import { uploadFileToR2 } from '../../lib/r2';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { 
  FolderOpen, FileImage, Trash2, UploadCloud, FolderPlus, 
  ChevronRight, Home, RefreshCw, File, ArrowLeft 
} from 'lucide-react';

interface R2Item {
  name: string;
  key: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: string;
  url?: string;
}

export default function ManageStorage() {
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [folders, setFolders] = useState<R2Item[]>([]);
  const [files, setFiles] = useState<R2Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<R2Item | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('trigantara_admin_token');

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/r2/list?prefix=${encodeURIComponent(currentPrefix)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal memuat data storage.');
      const data = await res.json();
      setFolders(data.folders || []);
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [currentPrefix]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const filesArr = Array.from(e.target.files);
      for (const file of filesArr) {
        await uploadFileToR2(file, currentPrefix || 'uploads', (pct) => setUploadProgress(pct));
      }
      setSuccess(`${filesArr.length} file berhasil diunggah.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch('/api/admin/r2/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: deleteItem.key }),
      });
      if (!res.ok) throw new Error('Gagal menghapus file.');
      setSuccess(`"${deleteItem.name}" berhasil dihapus.`);
      setTimeout(() => setSuccess(null), 3000);
      setDeleteItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch('/api/admin/r2/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ folderName: newFolderName.trim(), parentPrefix: currentPrefix }),
      });
      if (!res.ok) throw new Error('Gagal membuat folder.');
      setNewFolderName('');
      setShowNewFolder(false);
      setSuccess(`Folder "${newFolderName}" berhasil dibuat.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const breadcrumbs = currentPrefix
    .split('/')
    .filter(Boolean)
    .reduce<{ label: string; prefix: string }[]>((acc, part) => {
      const prevPrefix = acc.length > 0 ? acc[acc.length - 1].prefix : '';
      acc.push({ label: part, prefix: `${prevPrefix}${part}/` });
      return acc;
    }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Storage R2</h1>
          <p className="text-zinc-500 text-sm mt-1">Kelola file & folder di Cloudflare R2</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload File
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleUpload} className="hidden" />
          </label>
          <button
            onClick={() => setShowNewFolder(true)}
            className="px-4 py-2.5 bg-white text-zinc-700 rounded-xl text-sm font-semibold border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Folder Baru
          </button>
          <button onClick={fetchItems} className="p-2.5 bg-white text-zinc-500 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm bg-white px-4 py-2.5 rounded-xl border border-zinc-200">
        <button onClick={() => setCurrentPrefix('')} className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 transition-colors font-medium cursor-pointer">
          <Home className="w-4 h-4" />
          <span>Root</span>
        </button>
        {breadcrumbs.map((bc, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <button
              onClick={() => setCurrentPrefix(bc.prefix)}
              className={`font-medium transition-colors cursor-pointer ${i === breadcrumbs.length - 1 ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {bc.label}
            </button>
          </span>
        ))}
      </div>

      {/* Alerts */}
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl">{success}</div>}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-2">
            <span>Mengunggah...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* New Folder Input */}
      {showNewFolder && (
        <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-zinc-400" />
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nama folder baru..."
            className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-500"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
          />
          <button onClick={handleCreateFolder} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 cursor-pointer">Buat</button>
          <button onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-200 cursor-pointer">Batal</button>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80">
          <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Folder ini kosong. Upload file atau buat folder baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Back button */}
          {currentPrefix && (
            <button
              onClick={() => {
                const parts = currentPrefix.split('/').filter(Boolean);
                parts.pop();
                setCurrentPrefix(parts.length > 0 ? parts.join('/') + '/' : '');
              }}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 transition-colors mb-2" />
              <span className="text-xs font-semibold text-zinc-500">Kembali</span>
            </button>
          )}

          {/* Folders */}
          {folders.map((folder) => (
            <button
              key={folder.key}
              onClick={() => setCurrentPrefix(folder.key)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <FolderOpen className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs font-bold text-zinc-800 text-center truncate w-full">{folder.name}</span>
            </button>
          ))}

          {/* Files */}
          {files.map((file) => (
            <div key={file.key} className="group relative bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square w-full overflow-hidden bg-zinc-50 flex items-center justify-center">
                {isImage(file.name) && file.url ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <File className="w-10 h-10 text-zinc-300" />
                )}
              </div>
              <div className="p-3 border-t border-zinc-100">
                <p className="text-xs font-bold text-zinc-800 truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{formatSize(file.size || 0)}</p>
              </div>
              <button
                onClick={() => setDeleteItem(file)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-red-500 border border-zinc-150 hover:bg-red-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteItem !== null}
        title="Hapus File"
        message={`Apakah Anda yakin ingin menghapus "${deleteItem?.name}"? File akan dihapus permanen dari Cloudflare R2.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
