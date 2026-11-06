import { supabase, MEDIA_BUCKET } from '../lib/supabase';

export const canUpload = () => !!supabase;

/** Shrink big photos before upload so the site stays fast (max edge 1800px, WebP/JPEG). */
async function shrink(file: File, maxEdge = 1800): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file; // gif/svg etc. go up untouched
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file;
  const s = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  if (s === 1 && file.size < 900_000) {
    bmp.close();
    return file;
  }
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  const out = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/webp', 0.86));
  return out && out.size < file.size ? out : file;
}

/** Upload an image to the public `site-media` bucket and return its public URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error('Uploads need Supabase.');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 15 * 1024 * 1024) throw new Error('That image is over 15 MB.');
  const blob = await shrink(file);
  const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase();
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'image';
  const path = `${folder}/${Date.now().toString(36)}-${base}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(/row-level|policy|403/i.test(error.message) ? 'Upload refused — is this account on the admin list?' : error.message);
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
