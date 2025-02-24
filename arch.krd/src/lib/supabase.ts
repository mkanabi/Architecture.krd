import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file: File): Promise<string> {
  try {
    console.log('Starting upload for file:', file.name);

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('Uploading with filename:', fileName);

    // Upload the file
    const { data, error } = await supabase.storage
      .from('building-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('building-images')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}