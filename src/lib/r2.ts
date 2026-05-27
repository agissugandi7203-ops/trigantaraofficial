/**
 * R2 Upload Helper
 * Handles file upload to Cloudflare R2 via server-generated presigned URLs.
 * 
 * Flow:
 * 1. Client requests presigned URL from /api/admin/upload-url (auth required)
 * 2. Client uploads file directly to R2 using the presigned URL
 * 3. Client gets back the public URL of the uploaded file
 */

const API_BASE = '/api/admin';

interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Request a presigned upload URL from the server.
 * Requires admin authentication (JWT token in header).
 */
export async function getUploadUrl(
  filename: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<UploadUrlResponse> {
  const token = localStorage.getItem('trigantara_admin_token');
  
  if (!token) {
    throw new Error('Anda harus login sebagai admin untuk upload file.');
  }

  const response = await fetch(`${API_BASE}/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ filename, contentType, folder }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload gagal' }));
    throw new Error(err.error || `Upload error: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload file to R2 using presigned URL.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFileToR2(
  file: File,
  folder: string = 'uploads',
  onProgress?: (percent: number) => void
): Promise<string> {
  // Step 1: Get presigned URL
  const { uploadUrl, publicUrl } = await getUploadUrl(
    file.name,
    file.type,
    folder
  );

  // Step 2: Upload directly to R2
  const xhr = new XMLHttpRequest();
  
  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(publicUrl);
      } else {
        reject(new Error(`Upload ke R2 gagal: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Koneksi gagal saat upload file.'));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * Helper untuk memformat URL R2 publik.
 * Jika R2 belum punya custom domain, gunakan URL default.
 */
export function getR2PublicUrl(key: string): string {
  const r2PublicBase = import.meta.env.VITE_R2_PUBLIC_URL || '';
  if (!r2PublicBase) {
    // Placeholder — ganti dengan URL R2 bucket Anda
    return `/api/files/${key}`;
  }
  return `${r2PublicBase}/${key}`;
}
