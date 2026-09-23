import { supabase } from './supabase';

const maxBytes = 8 * 1024 * 1024;
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

export type ImageDetails = { width: number; height: number; size: number; type: string };

export async function readImageDetails(file: File): Promise<ImageDetails> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('This image could not be read.')); image.src = url; });
    return { width: image.naturalWidth, height: image.naturalHeight, size: file.size, type: file.type };
  } finally { URL.revokeObjectURL(url); }
}

export async function uploadAiifImage(file: File, folder: 'media' | 'leadership' | 'pages') {
  if (!acceptedTypes.includes(file.type)) throw new Error('Use a JPG, PNG or WebP image.');
  if (file.size > maxBytes) throw new Error('The image must be 8 MB or smaller.');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName || `image.${extension}`}`;
  const { error } = await supabase.storage.from('aiif-media').upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('aiif-media').getPublicUrl(path);
  return { path, publicUrl: data.publicUrl, details: await readImageDetails(file) };
}

export const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
