import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Types
interface Building {
  id: string;
  translations: {
    en: {
      title: string;
      location: string;
    };
    ku: {
      title: string;
      location: string;
    };
  };
  eraId: string;
  constructionYear?: number;
  images: string[]; // Array of image URLs
}

interface Era {
  id: string;
  nameEn: string;
  nameKu: string;
  descriptionEn: string;
  descriptionKu: string;
  startYear?: number;
  endYear?: number;
}

type Language = 'en' | 'ku';

interface TimelineProps {
  buildings: Building[];
  language: Language;
  eras: Era[];
}

const Timeline: React.FC<TimelineProps> = ({ buildings, language, eras }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const buildingsPerPage = 9; // Show 9 buildings per page (3x3 grid)
  
  // Sort eras chronologically
  const sortedEras = useMemo(() => {
    return [...eras].sort((a, b) => (a.startYear || 0) - (b.startYear || 0));
  }, [eras]);

  // Group buildings by era
  const buildingsByEra = useMemo(() => {
    return sortedEras.map(era => ({
      ...era,
      buildings: buildings.filter(building => building.eraId === era.id)
    }));
  }, [buildings, sortedEras]);

  // Calculate total buildings for pagination
  const totalBuildings = useMemo(() => {
    return buildings.length;
  }, [buildings]);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalBuildings / buildingsPerPage);
  
  // Get paginated buildings
  const paginatedBuildings = useMemo(() => {
    // Get all buildings, grouped by era but flattened for pagination
    const allBuildings = buildings;
    
    // Get current page buildings
    const startIndex = (currentPage - 1) * buildingsPerPage;
    const endIndex = startIndex + buildingsPerPage;
    
    return allBuildings.slice(startIndex, endIndex);
  }, [buildings, currentPage, buildingsPerPage]);
  
  // Regrouped paginated buildings by era for display
  const paginatedBuildingsByEra = useMemo(() => {
    // Create map of paginated building IDs for quick lookup
    const paginatedBuildingIds = new Set(paginatedBuildings.map(b => b.id));
    
    // Filter buildingsByEra to only include buildings in current page
    return buildingsByEra
      .map(era => ({
        ...era,
        buildings: era.buildings.filter(building => paginatedBuildingIds.has(building.id))
      }))
      .filter(era => era.buildings.length > 0); // Only show eras with buildings in current page
  }, [buildingsByEra, paginatedBuildings]);

  // Prefetch building details on hover
  const prefetchBuilding = (buildingId: string) => {
    router.prefetch(`/building/${buildingId}`);
  };

  // Handle manual navigation with visual feedback
  const handleBuildingClick = (e: React.MouseEvent, buildingId: string) => {
    e.preventDefault(); // Prevent default link navigation
    
    // Navigate programmatically after a brief delay
    setTimeout(() => {
      router.push(`/building/${buildingId}`);
    }, 10);
  };

  const translations = {
    en: {
      title: "Architectural Timeline",
      present: "Present",
      viewDetails: "View Details",
      noBuildings: "No buildings found for this era",
      page: "Page",
      of: "of",
      next: "Next",
      previous: "Previous"
    },
    ku: {
      title: "هێڵی کات ئەندازیاری",
      present: "ئێستا",
      viewDetails: "بینینی وردەکارییەکان",
      noBuildings: "هیچ بینایەک نەدۆزرایەوە بۆ ئەم سەردەمە",
      page: "لاپەڕە",
      of: "لە",
      next: "دواتر",
      previous: "پێشتر"
    }
  };

  return (
    <div className="space-y-16" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-mono mb-8">{translations[language].title}</h1>

      <div className="relative">
        {/* Timeline line */}
        <div className={`absolute ${language === 'ku' ? 'right-8' : 'left-8'} top-0 bottom-0 w-1 bg-black`}></div>

        {paginatedBuildingsByEra.map((era) => (
          <div key={era.id} className={`relative ${language === 'ku' ? 'mr-24' : 'ml-24'} mb-24`}>
            {/* Era marker - FIXED: Significantly increased spacing and positioning */}
            <div className={`absolute ${language === 'ku' ? '-right-8' : '-left-8'} top-3 w-6 h-6 rounded-full bg-black`}></div>

            {/* Era title - FIXED: Clear separation from dot with proper margin */}
            <div className="border-b-4 border-black pb-2 mb-8 mt-1">
              <h2 className="text-2xl font-mono pt-2">
                {language === 'en' ? era.nameEn : era.nameKu}
              </h2>
              <p className="font-mono text-lg">
                {era.startYear && era.startYear < 0 ? Math.abs(era.startYear) + ' BCE' : era.startYear} - {
                  era.endYear ? (era.endYear < 0 ? Math.abs(era.endYear) + ' BCE' : era.endYear) : 
                  translations[language].present
                }
              </p>
              <p className="font-mono mt-2">
                {language === 'en' ? era.descriptionEn : era.descriptionKu}
              </p>
            </div>

            {/* Buildings from this era */}
            <div className={`${language === 'ku' ? 'pr-4' : 'pl-4'}`}>
              {era.buildings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {era.buildings.map((building) => (
                    <Link 
                      href={`/building/${building.id}`}
                      key={building.id}
                      className="border-4 border-black hover:bg-black hover:text-white transition-colors group"
                      onMouseEnter={() => prefetchBuilding(building.id)}
                      onClick={(e) => handleBuildingClick(e, building.id)}
                      prefetch={false}
                    >
                      {building.images && building.images[0] && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={building.images[0]}
                            alt={building.translations[language].title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className={`flex ${language === 'ku' ? 'justify-end' : 'justify-start'} items-center mt-8 space-x-4`}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border-2 border-black font-mono ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
          >
            {translations[language].previous}
          </button>
          
          <span className="font-mono">
            {translations[language].page} {currentPage} {translations[language].of} {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border-2 border-black font-mono ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
          >
            {translations[language].next}
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;