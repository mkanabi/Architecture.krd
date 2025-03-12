import React from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';
import { Language } from '@/types';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  language: Language;
  existingImages?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  language, 
  existingImages = [] 
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string[]>(existingImages);
  const [error, setError] = React.useState<string | null>(null);

  const translations = {
    en: {
      dropzone: "Drop images here or click to upload",
      uploading: "Uploading...",
      remove: "Remove",
      error: "Upload failed. Please try again.",
      maxSize: "Image size should be less than 5MB"
    },
    ku: {
      dropzone: "وێنەکان لێرە دابنێ یان کرتە بکە بۆ بارکردن",
      uploading: "بارکردن...",
      remove: "سڕینەوە",
      error: "بارکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەوە",
      maxSize: "قەبارەی وێنە دەبێت کەمتر بێت لە ٥ مێگابایت"
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    setError(null);

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);

      setPreview(prev => [...prev, ...urls]);
      onUpload([...preview, ...urls]);
    } catch (error) {
      console.error('Upload error:', error);
      setError(translations[language].error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    onUpload(newPreview);
  };

  return (
    <div className="space-y-4">
      <div className="border-4 border-black p-8 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <Upload size={48} />
          <span className="font-mono text-lg">
            {uploading ? translations[language].uploading : translations[language].dropzone}
          </span>
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 p-4 text-red-700 font-mono">
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {preview.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover border-2 border-black"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-black text-white hover:bg-white hover:text-black transition-colors"
                title={translations[language].remove}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;