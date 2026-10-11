export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp';

/** Quick client-side check for instant feedback; the server re-validates. */
export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_ACCEPT.split(',').includes(file.type)) return 'Please choose a JPEG, PNG or WebP image.';
  if (file.size > MAX_AVATAR_BYTES) return 'Photo must be 5 MB or smaller.';
  return null;
}

/** Uploads the logged-in user's avatar and returns its public URL. */
export async function uploadAvatar(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in to upload a photo.');

  const form = new FormData();
  form.append('file', file); // key must match the FastAPI parameter name

  const res = await fetch(`${API_URL}/api/players/me/avatar`, {
    method: 'POST',
    // No Content-Type here: the browser sets multipart/form-data with its boundary
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof json.detail === 'string' ? json.detail : 'Photo upload failed');
  }

  const url: string = json.data.avatar_url;

  // Keep the cached user in sync so other pages see the new photo
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) localStorage.setItem('user', JSON.stringify({ ...user, avatar_url: url }));
  } catch {
    // ignore corrupt cache
  }

  return url;
}
