import React from 'react';
import { GetServerSideProps } from 'next';
import { Building, Language } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

interface BuildingDetailPageProps {
  building: Building;
}

const BuildingDetailPage: React.FC<BuildingDetailPageProps> = ({ building }) => {
  const router = useRouter();
  const [language, setLanguage] = React.useState<Language>('ku');

  const translations = {
    en: {
      period: "Period",
      location: "Location",
      overview: "Overview",
      backToHome: "Back to Home"
    },
    ku: {
      period: "سەردەم",
      location: "شوێن",
      overview: "پوختە",
      backToHome: "گەڕانەوە بۆ سەرەتا"
    }
  };

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 border-b-4 border-black">
          {building.images && building.images[0] ? (
            <img 
              src={building.images[0]}
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
            className="absolute top-8 left-8 bg-black text-white p-4 hover:bg-white hover:text-black transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="border-4 border-black p-6">
                <h3 className="font-mono mb-4">{translations[language].period}</h3>
                <p className="font-mono">{building.period}</p>
              </div>

              <div className="border-4 border-black p-6">
                <h3 className="font-mono mb-4">{translations[language].location}</h3>
                <p className="font-mono">{building.translations[language].location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/buildings/${params?.id}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch building');
    }

    const building = await response.json();

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