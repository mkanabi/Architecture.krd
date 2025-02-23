import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadBuildingImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('building-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicURL } = supabase.storage
      .from('building-images')
      .getPublicUrl(filePath);

    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}