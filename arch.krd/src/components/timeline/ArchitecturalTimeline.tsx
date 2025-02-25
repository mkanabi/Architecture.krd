import React from 'react';
import { Building, Language } from '@/types';
import Link from 'next/link';

interface TimelineProps {
  buildings: Building[];
  language: Language;
  eras: any[]; // Era data
}

const Timeline: React.FC<TimelineProps> = ({ buildings, language, eras }) => {
  const sortedEras = React.useMemo(() => {
    return [...eras].sort((a, b) => (a.startYear || 0) - (b.startYear || 0));
  }, [eras]);

  const buildingsByEra = React.useMemo(() => {
    return sortedEras.map(era => ({
      ...era,
      buildings: buildings.filter(building => building.eraId === era.id)
    }));
  }, [buildings, sortedEras]);

  const translations = {
    en: {
      title: "Architectural Timeline",
      present: "Present",
      viewDetails: "View Details",
      noBuildings: "No buildings found for this era"
    },
    ku: {
      title: "هێڵی کات ئەندازیاری",
      present: "ئێستا",
      viewDetails: "بینینی وردەکارییەکان",
      noBuildings: "هیچ بینایەک نەدۆزرایەوە بۆ ئەم سەردەمە"
    }
  };

  return (
    <div className="space-y-16" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-mono">{translations[language].title}</h1>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>

        {buildingsByEra.map((era) => (
          <div key={era.id} className="relative ml-8 mb-24">
            {/* Era marker */}
            <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-black"></div>

            {/* Era title */}
            <div className="border-b-4 border-black pb-2 mb-8">
              <h2 className="text-2xl font-mono">
                {language === 'en' ? era.nameEn : era.nameKu}
              </h2>
              <p className="font-mono text-lg">
                {era.startYear < 0 ? Math.abs(era.startYear) + ' BCE' : era.startYear} - {
                  era.endYear ? (era.endYear < 0 ? Math.abs(era.endYear) + ' BCE' : era.endYear) : 
                  translations[language].present
                }
              </p>
              <p className="font-mono mt-2">
                {language === 'en' ? era.descriptionEn : era.descriptionKu}
              </p>
            </div>

            {/* Buildings from this era */}
            <div className="pl-4">
              {era.buildings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {era.buildings.map((building) => (
                    <Link 
                      href={`/building/${building.id}`}
                      key={building.id}
                      className="border-4 border-black hover:bg-black hover:text-white transition-colors"
                    >
                      {building.images && building.images[0] && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={building.images[0]} 
                            alt={building.translations[language].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-mono mb-2">
                          {building.translations[language].title}
                        </h3>
                        <p className="font-mono text-sm mb-2">
                          {building.translations[language].location}
                        </p>
                        <p className="font-mono text-sm">
                          {building.constructionYear || "Unknown"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="font-mono italic">
                  {translations[language].noBuildings}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;