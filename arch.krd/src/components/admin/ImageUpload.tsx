import React from 'react';
import { Upload, X } from 'lucide-react';
import { Language } from '@/types';
import { uploadImage } from '@/lib/supabase';

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

  const validateFile = (file: File): boolean => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError(translations[language].maxSize);
      return false;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload only image files');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    setError(null);
    const files = Array.from(e.target.files);
    const urls: string[] = [];

    try {
      for (const file of files) {
        if (validateFile(file)) {
          const url = await uploadImage(file);
          urls.push(url);
        }
      }

      if (urls.length > 0) {
        const newPreview = [...preview, ...urls];
        setPreview(newPreview);
        onUpload(newPreview);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(translations[language].error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files?.length) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.files = e.dataTransfer.files;
      handleFileChange({ target: input } as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = (index: number) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    onUpload(newPreview);
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-4 border-black p-8 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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