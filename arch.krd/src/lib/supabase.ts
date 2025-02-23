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

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('Generated filename:', fileName);

    const { data, error } = await supabase.storage
      .from('building-images')
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    const { data: urlData } = supabase.storage
      .from('building-images')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
}