import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuildingsMap from '@/components/map/BuildingsMap';
import SearchBar from '@/components/search/SearchBar';
import { Building, Language } from '@/types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/map/BuildingsMap'), {
  ssr: false
});

const MapPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [language, setLanguage] = React.useState<Language>('ku');
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/api/buildings');
        if (!response.ok) throw new Error('Failed to fetch buildings');
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/buildings?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingSelect = (building: Building) => {
    router.push(`/building/${building.id}`);
  };

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto space-y-8">
          <h1 className="text-3xl font-mono">
            {language === 'en' ? 'Architectural Map' : 'نەخشەی تەلارسازی'}
          </h1>
          
          <SearchBar onSearch={handleSearch} language={language} />
          
          {loading ? (
            <div className="h-[600px] border-4 border-black flex items-center justify-center">
              <p className="text-xl font-mono">
                {language === 'en' ? 'Loading...' : 'چاوەڕێ بکە...'}
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