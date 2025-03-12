import React from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface BuildingGalleryProps {
  images: string[];
  language: 'en' | 'ku';
}

const BuildingGallery: React.FC<BuildingGalleryProps> = ({ images, language }) => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const translations = {
    en: {
      viewImage: "View Image",
      previousImage: "Previous Image",
      nextImage: "Next Image",
      closeGallery: "Close Gallery"
    },
    ku: {
      viewImage: "بینینی وێنە",
      previousImage: "وێنەی پێشوو",
      nextImage: "وێنەی داهاتوو",
      closeGallery: "داخستنی گەلەری"
    }
  };

  return (
    <div className="space-y-8" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="border-4 border-black group relative cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Camera size={32} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl mx-auto">
            <img 
              src={images[selectedImage]} 
              alt={`Gallery image ${selectedImage + 1}`}
              className="max-h-[80vh] w-auto"
            />
            
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label={translations[language].closeGallery}
            >
              <X size={32} />
            </button>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              aria-label={translations[language].previousImage}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              aria-label={translations[language].nextImage}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingGallery;