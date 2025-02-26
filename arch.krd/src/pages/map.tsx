import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import type { Language } from '@/types';

// Filter interfaces
interface Era {
  id: string;
  nameEn: string;
  nameKu: string;
}

interface BuildingType {
  id: string;
  nameEn: string;
  nameKu: string;
}

interface Region {
  id: string;
  nameEn: string;
  nameKu: string;
}

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
  coordinates?: {
    lat: number;
    lng: number;
  };
  latitude?: number;
  longitude?: number;
  period: string;
  eraId?: string;
  buildingTypeId?: string;
  regionId?: string;
}

// Filters component simplified for now
const Filters: React.FC<{
  language: Language;
}> = ({ language }) => {
  const translations = {
    en: {
      filterByEra: "Filter by Era",
      all: "All",
      comingSoon: "Filters coming soon"
    },
    ku: {
      filterByEra: "فلتەر بە سەردەم",
      all: "هەموو",
      comingSoon: "فلتەرەکان بۆ داهاتوو"
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className={`flex ${language === 'ku' ? 'justify-end' : 'justify-start'}`}>
        <span className="font-mono text-sm">
          {translations[language].comingSoon}
        </span>
      </div>
    </div>
  );
};

// Dynamically import the map component
const DynamicMap = dynamic(
  () => import('@/components/map/BuildingsMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] border-4 border-black flex items-center justify-center">
        <div className="animate-pulse text-xl font-mono">Loading map...</div>
      </div>
    )
  }
);

const MapPage = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simplified approach - just fetch buildings first
        const response = await fetch('/api/buildings');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch buildings: ${response.status} ${response.statusText}`);
        }
        
        // Handle unexpected content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Get buildings array from response
        const rawBuildings = data.buildings || data || [];
        console.log('Buildings count:', rawBuildings.length);
        
        // Transform buildings to ensure they have coordinates
        const transformedBuildings = rawBuildings
          .map((building: any) => {
            // Skip buildings without required data
            if (!building || !building.translations) {
              return null;
            }
            
            // Create coordinates object if it doesn't exist
            let coordinates;
            
            if (building.coordinates) {
              coordinates = building.coordinates;
            } else if (building.latitude !== undefined && building.longitude !== undefined) {
              coordinates = {
                lat: parseFloat(building.latitude),
                lng: parseFloat(building.longitude)
              };
            } else {
              return null;
            }
            
            return {
              ...building,
              coordinates
            };
          })
          .filter(Boolean);
        
        console.log('Transformed buildings count:', transformedBuildings.length);
        setBuildings(transformedBuildings);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBuildingSelect = (building: Building) => {
    router.push(`/building/${building.id}`);
  };

  // Translations
  const translations = {
    en: {
      title: 'Architectural Map',
      loading: 'Loading...',
      error: 'Error:',
      noBuildings: 'No buildings found',
      noFilterMatch: 'No buildings match the selected filters'
    },
    ku: {
      title: 'نەخشەی تەلارسازی',
      loading: 'چاوەڕێ بکە...',
      error: 'هەڵە:',
      noBuildings: 'هیچ بینایەک نەدۆزرایەوە',
      noFilterMatch: 'هیچ بینایەک لەگەڵ فلتەرەکان ناگونجێت'
    }
  };

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto space-y-8">
          <h1 className="text-3xl font-mono">
            {translations[language].title}
          </h1>
          
          {/* Temporary simplified filters */}
          <Filters language={language} />
          
          {error ? (
            <div className="h-[600px] border-4 border-black flex items-center justify-center flex-col p-4">
              <p className="text-xl font-mono text-red-600 mb-4">
                {translations[language].error} {error}
              </p>
              <pre className="text-sm overflow-auto max-w-full p-2 bg-gray-100 rounded">
                {error}
              </pre>
            </div>
          ) : loading ? (
            <div className="h-[600px] border-4 border-black flex items-center justify-center">
              <p className="text-xl font-mono animate-pulse">
                {translations[language].loading}
              </p>
            </div>
          ) : buildings.length === 0 ? (
            <div className="h-[600px] border-4 border-black flex items-center justify-center">
              <p className="text-xl font-mono">
                {translations[language].noBuildings}
              </p>
            </div>
          ) : (
            <DynamicMap
              buildings={buildings}
              language={language}
              onBuildingSelect={handleBuildingSelect}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;