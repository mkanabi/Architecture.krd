import React from 'react';
import { ArrowLeft, Camera, Map, Clock, Ruler, Download, Share2 } from 'lucide-react';
import { Building, Language } from '@/types';

interface BuildingDetailProps {
  building: Building;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const BuildingDetail: React.FC<BuildingDetailProps> = ({
  building,
  language,
  onLanguageChange
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'architecture' | 'history' | 'gallery'>('overview');

  const translations = {
    en: {
      overview: "Overview",
      architecture: "Architecture",
      history: "History",
      gallery: "Gallery",
      architecturalDetails: "Architectural Details",
      historicalPeriods: "Historical Periods",
      download: "Download PDF",
      share: "Share"
    },
    ku: {
      overview: "گشتی",
      architecture: "تەلارسازی",
      history: "مێژوو",
      gallery: "گەلەری",
      architecturalDetails: "وردەکاری تەلارسازی",
      historicalPeriods: "سەردەمە مێژووییەکان",
      download: "داگرتنی PDF",
      share: "هاوبەشکردن"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 border-b-4 border-black">
        <img 
          src={building.images[0]}
          alt={building.translations[language].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-8">
          <h1 className="text-white font-mono text-4xl mb-2">
            {building.translations[language].title}
          </h1>
          <p className="text-white font-mono">
            {building.period}
          </p>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="absolute top-8 left-8 bg-black text-white p-4 hover:bg-white hover:text-black transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-black text-white p-4 flex justify-center gap-8 font-mono">
        <div className="flex items-center gap-2">
          <Clock size={20} />
          {building.period}
        </div>
        <div className="flex items-center gap-2">
          <Map size={20} />
          {building.translations[language].location}
        </div>
        <div className="flex items-center gap-2">
          <Ruler size={20} />
          {building.status}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b-4 border-black">
        <div className="max-w-screen-xl mx-auto flex font-mono">
          {(Object.keys(translations[language]) as Array<keyof typeof translations[typeof language]>)
            .slice(0, 4)
            .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-8 py-4 uppercase ${
                  activeTab === tab 
                    ? 'bg-black text-white' 
                    : 'hover:bg-black hover:text-white'
                }`}
              >
                {translations[language][tab]}
              </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto p-8">
        {/* Content sections based on activeTab */}
        {activeTab === 'overview' && (
          <div className="font-mono space-y-8">
            <p className="text-xl leading-relaxed">
              {building.translations[language].overview}
            </p>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-white hover:text-black border-2 border-black transition-colors">
                <Download size={20} />
                {translations[language].download}
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-white hover:text-black border-2 border-black transition-colors">
                <Share2 size={20} />
                {translations[language].share}
              </button>
            </div>
          </div>
        )}

        {/* Add other tab content here */}
      </main>
    </div>
  );
};

export default BuildingDetail;