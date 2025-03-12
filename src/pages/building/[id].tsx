import React from 'react';
import { GetServerSideProps } from 'next';
import { Building, Language } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowLeft, MapPin, Clock, FileText, Hammer, CircleCheck } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';


// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/map/SingleBuildingMap'), {
  ssr: false,
  loading: () => (
    <div className="h-40 border-2 border-black flex items-center justify-center">
      <p className="text-sm font-mono">Loading map...</p>
    </div>
  ),
});

interface BuildingDetailPageProps {
  building: Building;
}

const BuildingDetailPage: React.FC<BuildingDetailPageProps> = ({ building }) => {
  const router = useRouter();
    const { language, setLanguage } = useLanguage(); // Use the context properly
  
  const [activeImage, setActiveImage] = React.useState(0);

  const translations = {
    en: {
      period: "Period",
      location: "Location",
      overview: "Overview",
      architecturalDetails: "Architectural Details",
      era: "Historical Era",
      region: "Region",
      buildingType: "Building Type",
      materials: "Materials",
      status: "Status",
      architect: "Architect",
      renovations: "Renovations",
      sources: "Sources",
      backToHome: "Back to Home",
      preserved: "Preserved",
      endangered: "Endangered",
      restored: "Restored",
      ruins: "Ruins",
      constructedIn: "Constructed in",
      renovatedIn: "Renovated in",
      images: "Images",
      moreImages: "More Images",
      viewSource: "Visit Source"
    },
    ku: {
      period: "سەردەم",
      location: "شوێن",
      overview: "پوختە",
      architecturalDetails: "وردەکاری تەلارسازی",
      era: "سەردەمی مێژوویی",
      region: "ناوچە",
      buildingType: "جۆری بینا",
      materials: "کەرەستەکان",
      status: "دۆخ",
      architect: "ئەندازیار",
      renovations: "نۆژەنکردنەوەکان",
      sources: "سەرچاوەکان",
      backToHome: "گەڕانەوە بۆ سەرەتا",
      preserved: "پارێزراو",
      endangered: "لە مەترسیدا",
      restored: "نۆژەنکراوەتەوە",
      ruins: "کاولبوو",
      constructedIn: "لە ساڵی",
      renovatedIn: "نۆژەنکراوەتەوە لە",
      images: "وێنەکان",
      moreImages: "وێنەی زیاتر",
      viewSource: "سەردانی سەرچاوە بکە"
    }
  };

  const statusTranslations = {
    PRESERVED: { en: "Preserved", ku: "پارێزراو" },
    ENDANGERED: { en: "Endangered", ku: "لە مەترسیدا" },
    RESTORED: { en: "Restored", ku: "نۆژەنکراوەتەوە" },
    RUINS: { en: "Ruins", ku: "کاولبوو" }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESERVED':
        return <CircleCheck className="text-green-500" />;
      case 'ENDANGERED':
        return <CircleCheck className="text-red-500" />;
      case 'RESTORED':
        return <Hammer className="text-blue-500" />;
      case 'RUINS':
        return <Hammer className="text-gray-500" />;
      default:
        return <CircleCheck />;
    }
  };

  // Ensure building has images array and it's not empty
  const hasImages = building.images && building.images.length > 0;
  const currentImage = hasImages ? building.images[activeImage] : null;

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="min-h-screen bg-white" dir={language === 'ku' ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <div className="relative h-96 border-b-4 border-black">
          {currentImage ? (
            <img 
              src={currentImage}
              alt={building.translations[language].title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-mono">No image available</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-8">
            <h1 className="text-white font-mono text-4xl mb-2">
              {building.translations[language].title}
            </h1>
            <p className="text-white font-mono">
              {building.period}
            </p>
          </div>
          <button 
            onClick={() => router.back()} 
            className={`absolute top-8 ${language === 'ku' ? 'right-8' : 'left-8'} bg-black text-white p-4 hover:bg-white hover:text-black transition-colors`}
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Image Thumbnails */}
        {hasImages && building.images.length > 1 && (
          <div className="max-w-screen-xl mx-auto p-4 border-b-4 border-black">
            <h3 className="font-mono mb-4">{translations[language].moreImages}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {building.images.map((image, index) => (
                <div 
                  key={index}
                  className={`w-24 h-24 cursor-pointer flex-shrink-0 ${activeImage === index ? 'border-4 border-black' : 'border border-gray-300'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${building.translations[language].title} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-screen-xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-mono mb-4">{translations[language].overview}</h2>
                <p className="font-mono leading-relaxed">
                  {building.translations[language].overview}
                </p>
              </div>

              {building.translations[language].architecturalDetails && 
              building.translations[language].architecturalDetails.length > 0 && (
                <div>
                  <h2 className="text-2xl font-mono mb-4">{translations[language].architecturalDetails}</h2>
                  <ul className="list-disc list-inside font-mono space-y-2">
                    {building.translations[language].architecturalDetails.map((detail, index) => (
                      <li key={index} className="leading-relaxed">{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {building.sources && building.sources.length > 0 && (
                <div>
                  <h2 className="text-2xl font-mono mb-4">{translations[language].sources}</h2>
                  <ul className="list-disc list-inside font-mono space-y-2">
                    {building.sources.map((source, index) => (
                      <li key={index} className="leading-relaxed">
                        {source.title}
                        {source.url && (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block ml-2 text-black underline hover:no-underline"
                          >
                            {translations[language].viewSource}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="border-4 border-black p-6">
                <h3 className="font-mono mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  {translations[language].period}
                </h3>
                <p className="font-mono">
                  <strong>{translations[language].constructedIn}:</strong> {building.constructionYear || "Unknown"}
                </p>
                {building.renovationYears && building.renovationYears.length > 0 && (
                  <p className="font-mono mt-2">
                    <strong>{translations[language].renovatedIn}:</strong> {building.renovationYears.join(', ')}
                  </p>
                )}
              </div>

              <div className="border-4 border-black p-6">
                <h3 className="font-mono mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  {translations[language].location}
                </h3>
                <p className="font-mono">{building.translations[language].location}</p>

                {building.coordinates && (
                  <div className="mt-4 h-40 border-2 border-black">
                    <DynamicMap
                      building={building}
                      language={language}
                    />
                  </div>
                )}
              </div>

              {building.era && (
                <div className="border-4 border-black p-6">
                  <h3 className="font-mono mb-2">{translations[language].era}</h3>
                  <p className="font-mono">
                    {language === 'en' ? building.era.nameEn : building.era.nameKu}
                  </p>
                </div>
              )}

              {building.buildingType && (
                <div className="border-4 border-black p-6">
                  <h3 className="font-mono mb-2">{translations[language].buildingType}</h3>
                  <p className="font-mono">
                    {language === 'en' ? building.buildingType.nameEn : building.buildingType.nameKu}
                  </p>
                </div>
              )}

              {building.materials && building.materials.length > 0 && (
                <div className="border-4 border-black p-6">
                  <h3 className="font-mono mb-2">{translations[language].materials}</h3>
                  <ul className="font-mono">
                    {building.materials.map((material, index) => (
                      <li key={index}>
                        {language === 'en' ? material.nameEn : material.nameKu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {building.status && (
                <div className="border-4 border-black p-6">
                  <h3 className="font-mono mb-2 flex items-center gap-2">
                    {getStatusIcon(building.status)}
                    {translations[language].status}
                  </h3>
                  <p className="font-mono">
                    {statusTranslations[building.status]?.[language] || building.status}
                  </p>
                </div>
              )}

              {building.translations[language].architectName && (
                <div className="border-4 border-black p-6">
                  <h3 className="font-mono mb-2">{translations[language].architect}</h3>
                  <p className="font-mono">{building.translations[language].architectName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_API_URL || 'localhost:3000';
    
    // Make sure we have a full URL
    const baseUrl = host.startsWith('http') ? host : `${protocol}://${host}`;
    
    const response = await fetch(
      `${baseUrl}/api/buildings/${params?.id}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch building: ${response.status}`);
    }

    const building = await response.json();
    console.log("Fetched building data:", JSON.stringify(building).substring(0, 200) + "...");

    return {
      props: {
        building,
      },
    };
  } catch (error) {
    console.error('Error fetching building:', error);
    return {
      notFound: true,
    };
  }
};

export default BuildingDetailPage;