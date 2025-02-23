import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuildingsMap from '@/components/map/BuildingsMap';
import SearchBar from '@/components/search/SearchBar';
import { Building, Language } from '@/types';
import { buildingsApi } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/map/BuildingsMap'), {
  ssr: false
});

const MapPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [language, setLanguage] = React.useState<Language>('ku');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await buildingsApi.getAll();
        setBuildings(data);
      } catch (error) {
        console.error('Failed to fetch buildings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call with search parameters
      const data = await buildingsApi.getAll();
      setBuildings(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-mono mb-8">
            {language === 'en' ? 'Architectural Map' : 'نەخشەی تەلارسازی'}
          </h1>
          
          <SearchBar onSearch={handleSearch} language={language} />
          
          <div className="mt-8">
            <DynamicMap
              buildings={buildings}
              language={language}
              onBuildingSelect={(building) => {
                // Handle building selection
                console.log('Selected building:', building);
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MapPage;