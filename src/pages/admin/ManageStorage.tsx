import { useEffect, useState, ChangeEvent, MouseEvent as ReactMouseEvent, DragEvent, useRef } from 'react';
import { uploadFileToR2 } from '../../lib/r2';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { 
  FolderOpen, FileImage, Trash2, UploadCloud, FolderPlus, 
  ChevronRight, Home, RefreshCw, File, ArrowLeft, Download,
  X, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp
} from 'lucide-react';

interface R2Item {
  name: string;
  key: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: string;
  url?: string;
}

interface UploadQueueItem {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  file: File;
  xhr?: XMLHttpRequest;
}

export default function ManageStorage() {
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [folders, setFolders] = useState<R2Item[]>([]);
  const [files, setFiles] = useState<R2Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<R2Item | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [showQueueWidget, setShowQueueWidget] = useState(false);
  const [isQueueMinimized, setIsQueueMinimized] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);

  // Clear selection when navigating to another folder
  useEffect(() => {
    setSelectedItems(new Set());
  }, [currentPrefix]);

  const toggleItemSelection = (key: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const allItemsCount = folders.length + files.length;
  const isAllSelected = allItemsCount > 0 && selectedItems.size === allItemsCount;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      const allKeys = [...folders.map((f) => f.key), ...files.map((f) => f.key)];
      setSelectedItems(new Set(allKeys));
    }
  };

  const handleDownloadSelected = () => {
    if (selectedItems.size === 0) return;

    const keysArray = Array.from(selectedItems) as string[];
    
    // If only one file is selected and it is NOT a folder (doesn't end with '/')
    if (keysArray.length === 1 && !keysArray[0].endsWith('/')) {
      const fileKey = keysArray[0];
      const link = document.createElement('a');
      link.href = `/api/admin/r2/download?key=${encodeURIComponent(fileKey)}&token=${encodeURIComponent(token || '')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Multiple items or a folder selected
      const link = document.createElement('a');
      link.href = `/api/admin/r2/download-zip?keys=${encodeURIComponent(JSON.stringify(keysArray))}&basePrefix=${encodeURIComponent(currentPrefix)}&token=${encodeURIComponent(token || '')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const token = localStorage.getItem('trigantara_admin_token');

  const fetchItems = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/r2/list?prefix=${encodeURIComponent(currentPrefix)}&refresh=${forceRefresh}`, {
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

  useEffect(() => { fetchItems(false); }, [currentPrefix]);

  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('label') ||
      target.closest('.modal-content')
    ) {
      return;
    }
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const lastUpdateRef = useRef<number>(0);

  const getSelectionAt = (clientX: number, clientY: number): Set<string> => {
    if (!dragStart) return new Set();

    const x1 = dragStart.x;
    const y1 = dragStart.y;
    const x2 = clientX;
    const y2 = clientY;

    const rectLeft = Math.min(x1, x2);
    const rectTop = Math.min(y1, y2);
    const rectRight = Math.max(x1, x2);
    const rectBottom = Math.max(y1, y2);

    const elements = document.querySelectorAll('.selectable-item');
    const newlySelected = new Set<string>();

    elements.forEach((el) => {
      const itemRect = el.getBoundingClientRect();
      const key = el.getAttribute('data-key');
      if (!key) return;

      const intersects = !(
        itemRect.right < rectLeft ||
        itemRect.left > rectRight ||
        itemRect.bottom < rectTop ||
        itemRect.top > rectBottom
      );

      if (intersects) {
        newlySelected.add(key);
      }
    });

    return newlySelected;
  };

  const triggerSelectionUpdate = (clientX: number, clientY: number) => {
    const newlySelected = getSelectionAt(clientX, clientY);
    const now = Date.now();
    if (now - lastUpdateRef.current > 60) {
      setSelectedItems(newlySelected);
      lastUpdateRef.current = now;
    }
  };

  // Scroll loop during drag selection
  useEffect(() => {
    if (!dragStart) return;

    let animationFrameId: number;

    const scrollLoop = () => {
      if (!mousePosRef.current) {
        animationFrameId = requestAnimationFrame(scrollLoop);
        return;
      }

      const { x, y } = mousePosRef.current;
      const scrollThreshold = 60; // distance from viewport edge in pixels
      const maxSpeed = 15; // pixels per frame

      let scrollDelta = 0;
      if (y < scrollThreshold) {
        // Scroll up
        const ratio = (scrollThreshold - y) / scrollThreshold;
        scrollDelta = -Math.round(ratio * maxSpeed);
      } else if (y > window.innerHeight - scrollThreshold) {
        // Scroll down
        const ratio = (y - (window.innerHeight - scrollThreshold)) / scrollThreshold;
        scrollDelta = Math.round(ratio * maxSpeed);
      }

      if (scrollDelta !== 0) {
        window.scrollBy(0, scrollDelta);
        // Force selection update on scroll because elements have moved relative to the viewport
        triggerSelectionUpdate(x, y);
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dragStart]);

  useEffect(() => {
    if (!dragStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      setDragCurrent({ x: e.clientX, y: e.clientY });
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      triggerSelectionUpdate(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      if (mousePosRef.current) {
        setSelectedItems(getSelectionAt(mousePosRef.current.x, mousePosRef.current.y));
      }
      setDragStart(null);
      setDragCurrent(null);
      mousePosRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart]);

  const [isDragActive, setIsDragActive] = useState(false);

  const parseDroppedItems = async (items: DataTransferItemList) => {
    const files: File[] = [];
    
    const traverseEntry = (entry: any, path = ''): Promise<void> => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          entry.file((file: File) => {
            const relativePath = path ? `${path}/${file.name}` : file.name;
            Object.defineProperty(file, 'webkitRelativePath', {
              value: relativePath,
              writable: true,
              configurable: true,
            });
            files.push(file);
            resolve();
          });
        } else if (entry.isDirectory) {
          const dirReader = entry.createReader();
          const readAllEntries = (): Promise<any[]> => {
            return new Promise((resEntries) => {
              dirReader.readEntries((entries: any[]) => {
                resEntries(entries);
              });
            });
          };

          readAllEntries().then(async (entries) => {
            const promises = entries.map((childEntry) =>
              traverseEntry(childEntry, path ? `${path}/${entry.name}` : entry.name)
            );
            await Promise.all(promises);
            resolve();
          });
        } else {
          resolve();
        }
      });
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          promises.push(traverseEntry(entry));
        }
      }
    }
    await Promise.all(promises);
    return files;
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.items) {
      const files = await parseDroppedItems(e.dataTransfer.items);
      if (files.length > 0) {
        setUploadFiles(files);
      }
    } else if (e.dataTransfer.files) {
      setUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const uploadSingleFile = (
    file: File,
    targetFolder: string,
    itemId: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, xhr } : item))
      );

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, progress: percent } : item))
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            setUploadQueue((prev) =>
              prev.map((item) => (item.id === itemId ? { ...item, progress: 100, status: 'completed' as const } : item))
            );
            resolve(res.publicUrl);
          } catch {
            setUploadQueue((prev) =>
              prev.map((item) => (item.id === itemId ? { ...item, status: 'failed' as const } : item))
            );
            reject(new Error('Gagal mengurai respons server.'));
          }
        } else {
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, status: 'failed' as const } : item))
          );
          reject(new Error(`Upload gagal: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        setUploadQueue((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: 'failed' as const } : item))
        );
        reject(new Error('Koneksi gagal saat upload file.'));
      });

      xhr.addEventListener('abort', () => {
        setUploadQueue((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: 'cancelled' as const } : item))
        );
        reject(new Error('Upload dibatalkan.'));
      });

      const token = localStorage.getItem('trigantara_admin_token');
      const url = `/api/admin/r2/upload-proxy?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&folder=${encodeURIComponent(targetFolder)}`;
      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const cancelUpload = (id: string) => {
    setUploadQueue((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item && item.xhr) {
        item.xhr.abort();
      }
      return prev.map((x) => (x.id === id ? { ...x, status: 'cancelled' as const } : x));
    });
  };

  const cancelAllUploads = () => {
    setUploadQueue((prev) => {
      prev.forEach((item) => {
        if (item.xhr && (item.status === 'uploading' || item.status === 'pending')) {
          item.xhr.abort();
        }
      });
      return prev.map((x) =>
        x.status === 'uploading' || x.status === 'pending' ? { ...x, status: 'cancelled' as const } : x
      );
    });
  };

  const executeUpload = async () => {
    if (uploadFiles.length === 0) return;
    const filesToUpload = [...uploadFiles];
    setUploadFiles([]);

    const newQueueItems: UploadQueueItem[] = filesToUpload.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      fileName: file.name,
      progress: 0,
      status: 'pending',
      file,
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);
    setShowQueueWidget(true);

    const uploadPromises = newQueueItems.map(async (queueItem) => {
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === queueItem.id ? { ...item, status: 'uploading' as const } : item))
      );

      let targetFolder = currentPrefix || 'uploads';
      if (queueItem.file.webkitRelativePath) {
        const pathParts = queueItem.file.webkitRelativePath.split('/');
        pathParts.pop();
        const relativeFolder = pathParts.join('/');
        if (relativeFolder) {
          targetFolder = currentPrefix ? `${currentPrefix}/${relativeFolder}` : relativeFolder;
        }
      }

      try {
        await uploadSingleFile(queueItem.file, targetFolder, queueItem.id);
      } catch (err) {
        console.error('Failed uploading file:', queueItem.fileName, err);
      }
    });

    await Promise.all(uploadPromises);
    fetchItems(true);
  };

  const activeUploads = uploadQueue.filter(
    (item) => item.status === 'uploading' || item.status === 'pending' || item.status === 'completed'
  );
  const totalUploadedProgress = activeUploads.reduce((acc, curr) => acc + curr.progress, 0);
  const overallProgress = activeUploads.length > 0 ? Math.round(totalUploadedProgress / activeUploads.length) : 0;

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    setLoading(true);
    setError(null);
    const itemsToDelete = Array.from(selectedItems) as string[];
    setSelectedItems(new Set());
    try {
      for (const itemKey of itemsToDelete) {
        const res = await fetch('/api/admin/r2/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ key: itemKey }),
        });
        if (!res.ok) throw new Error(`Gagal menghapus "${itemKey.split('/').pop()}".`);
      }
      setSuccess(`${itemsToDelete.length} item berhasil dihapus.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      fetchItems(true);
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
      fetchItems(true);
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
    <div 
      onMouseDown={handleMouseDown} 
      onDragOver={handleDragOver}
      className="max-w-6xl mx-auto space-y-6 font-sans select-none relative min-h-[85vh] pb-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Storage R2</h1>
          <p className="text-zinc-500 text-sm mt-1">Kelola file & folder di Cloudflare R2</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload File
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleUploadChange} className="hidden" />
          </label>
          <label className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload Folder
            <input type="file" {...({ webkitdirectory: "", directory: "" } as any)} onChange={handleUploadChange} className="hidden" />
          </label>
          <button
            onClick={() => setShowNewFolder(true)}
            className="px-4 py-2.5 bg-white text-zinc-700 rounded-xl text-sm font-semibold border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Folder Baru
          </button>
          {allItemsCount > 0 && (
            <button
              onClick={handleSelectAll}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                isAllSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {isAllSelected ? 'Batal Pilih' : 'Pilih Semua'}
            </button>
          )}
          <button onClick={() => fetchItems(true)} className="p-2.5 bg-white text-zinc-500 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer">
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
      {uploadQueue.some(x => x.status === 'uploading' || x.status === 'pending') && (
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm animate-in fade-in duration-300">
          <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-2">
            <span>Mengunggah {uploadQueue.filter(x => x.status === 'uploading' || x.status === 'pending').length} file...</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${overallProgress}%` }} />
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
            <div
              key={folder.key}
              data-key={folder.key}
              onClick={() => setCurrentPrefix(folder.key)}
              className={`selectable-item group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
                selectedItems.has(folder.key) ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.has(folder.key)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleItemSelection(folder.key);
                }}
                className={`absolute top-3 left-3 w-4 h-4 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 transition-opacity ${
                  selectedItems.has(folder.key) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              />
              <FolderOpen className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs font-bold text-zinc-800 text-center truncate w-full">{folder.name}</span>
            </div>
          ))}

          {/* Files */}
          {files.map((file) => (
            <div
              key={file.key}
              data-key={file.key}
              className={`selectable-item group relative bg-white rounded-2xl border transition-all overflow-hidden hover:shadow-md ${
                selectedItems.has(file.key) ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.has(file.key)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleItemSelection(file.key);
                }}
                className={`absolute top-3 left-3 z-20 w-4 h-4 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 transition-opacity ${
                  selectedItems.has(file.key) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              />

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square w-full overflow-hidden bg-zinc-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity block"
                onClick={(e) => e.stopPropagation()}
              >
                {isImage(file.name) && file.url ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <File className="w-10 h-10 text-zinc-300" />
                )}
              </a>
              <div className="p-3 border-t border-zinc-100">
                <p className="text-xs font-bold text-zinc-800 truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{formatSize(file.size || 0)}</p>
              </div>

              {/* Download / Open Button */}
              {file.url && (
                <a
                  href={`/api/admin/r2/download?key=${encodeURIComponent(file.key)}&token=${encodeURIComponent(token || '')}`}
                  className="absolute top-3 right-11 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
                  title="Download File"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteItem(file);
                }}
                className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm text-red-500 border border-zinc-200 hover:bg-red-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Selection Action Bar */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-semibold">{selectedItems.size} item terpilih</span>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSelected}
              className="px-4 py-2 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download (.zip)
            </button>
            <button
              onClick={() => setShowDeleteSelectedConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Terpilih
            </button>
            <button
              onClick={() => setSelectedItems(new Set())}
              className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Drag Selection Marquee Overlay */}
      {dragStart && dragCurrent && (
        <div
          className="fixed pointer-events-none z-50 bg-blue-500/10 border border-blue-500 rounded"
          style={{
            left: Math.min(dragStart.x, dragCurrent.x),
            top: Math.min(dragStart.y, dragCurrent.y),
            width: Math.abs(dragStart.x - dragCurrent.x),
            height: Math.abs(dragStart.y - dragCurrent.y),
          }}
        />
      )}

      {/* Single Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteItem !== null}
        title="Hapus File"
        message={`Apakah Anda yakin ingin menghapus "${deleteItem?.name}"? File akan dihapus permanen dari Cloudflare R2.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />

      {/* Multi Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteSelectedConfirm}
        title="Hapus Banyak Item"
        message={`Apakah Anda yakin ingin menghapus ${selectedItems.size} item terpilih? Semua file dan folder ini akan dihapus permanen dari Cloudflare R2.`}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        onConfirm={async () => {
          setShowDeleteSelectedConfirm(false);
          await handleDeleteSelected();
        }}
        onCancel={() => setShowDeleteSelectedConfirm(false)}
      />

      {/* Upload Confirm Modal */}
      <ConfirmModal
        isOpen={uploadFiles.length > 0}
        title="Konfirmasi Unggah"
        message={`Apakah Anda yakin ingin mengunggah ${uploadFiles.length} file ke folder "${currentPrefix || 'Root'}"?`}
        confirmText="Ya, Unggah"
        cancelText="Batal"
        onConfirm={executeUpload}
        onCancel={() => setUploadFiles([])}
      />

      {/* Drag & Drop Upload Overlay */}
      {isDragActive && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-zinc-400 m-4 rounded-3xl animate-in fade-in duration-200"
        >
          <UploadCloud className="w-16 h-16 text-white animate-bounce mb-4" />
          <h2 className="text-2xl font-bold text-white mb-1">Lepaskan untuk Mengunggah</h2>
          <p className="text-zinc-300 text-sm font-medium">Taruh berkas atau folder di sini untuk mengunggah ke R2</p>
        </div>
      )}

      {/* Google Drive Style Upload Queue Widget */}
      {showQueueWidget && uploadQueue.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-zinc-950 border border-zinc-800 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans animate-in slide-in-from-bottom duration-300 select-none">
          {/* Header */}
          <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
            <span className="text-xs font-bold tracking-wide">
              {uploadQueue.some(x => x.status === 'uploading' || x.status === 'pending')
                ? `Mengunggah ${uploadQueue.filter(x => x.status === 'uploading' || x.status === 'pending').length} file...`
                : `Selesai mengunggah ${uploadQueue.filter(x => x.status === 'completed').length} file`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQueueMinimized(!isQueueMinimized)}
                className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                title={isQueueMinimized ? "Maximize" : "Minimize"}
              >
                {isQueueMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  const hasActive = uploadQueue.some(x => x.status === 'uploading' || x.status === 'pending');
                  if (hasActive) {
                    if (window.confirm("Batalkan semua proses unggah yang sedang berjalan?")) {
                      cancelAllUploads();
                      setShowQueueWidget(false);
                      setUploadQueue([]);
                    }
                  } else {
                    setShowQueueWidget(false);
                    setUploadQueue([]);
                  }
                }}
                className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isQueueMinimized && (
            <>
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-900 bg-zinc-950">
                {uploadQueue.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      {isImage(item.fileName) ? (
                        <FileImage className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      ) : (
                        <File className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                      )}
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold truncate text-zinc-200" title={item.fileName}>
                          {item.fileName}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {item.status === 'uploading' && `Mengunggah (${item.progress}%)`}
                          {item.status === 'pending' && 'Menunggu...'}
                          {item.status === 'completed' && 'Selesai'}
                          {item.status === 'cancelled' && 'Dibatalkan'}
                          {item.status === 'failed' && 'Gagal'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {(item.status === 'uploading' || item.status === 'pending') ? (
                        <button
                          onClick={() => cancelUpload(item.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                          title="Batalkan Unggah"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : item.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : item.status === 'cancelled' ? (
                        <XCircle className="w-4 h-4 text-zinc-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Summary Footer */}
              {uploadQueue.some(x => x.status === 'uploading' || x.status === 'pending') && (
                <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800">
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-400 mb-1.5">
                    <span>Total Progress</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
