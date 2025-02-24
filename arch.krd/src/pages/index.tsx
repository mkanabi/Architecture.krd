import React from 'react';
import { Building, Language } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import SearchBar from '@/components/search/SearchBar';
import Link from 'next/link';

const HomePage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState<Language>('ku');

  const fetchBuildings = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const url = searchQuery 
        ? `/api/buildings?search=${encodeURIComponent(searchQuery)}`
        : '/api/buildings';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch buildings');
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBuildings();
  }, []);

  const handleSearch = async (query: string) => {
    await fetchBuildings(query);
  };

  const translations = {
    en: {
      title: "Kurdistan Architectural Heritage",
      noBuildings: "No buildings found",
      loading: "Loading...",
      viewDetails: "View Details"
    },
    ku: {
      title: "میراتی تەلارسازیی کوردستان",
      noBuildings: "هیچ بینایەک نەدۆزرایەوە",
      loading: "چاوەڕێ بکە...",
      viewDetails: "بینینی وردەکارییەکان"
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-mono">{translations[language].loading}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-mono mb-8">{translations[language].title}</h1>
          
          <SearchBar onSearch={handleSearch} language={language} />
          
          {buildings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-mono">{translations[language].noBuildings}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildings.map((building) => (
                <Link 
                  href={`/building/${building.id}`}
                  key={building.id} 
                  className="border-4 border-black hover:bg-black hover:text-white transition-colors"
                >
                  {building.images && building.images[0] && (
                    <div className="relative h-48">
                      <img
                        src={building.images[0]}
                        alt={building.translations[language].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-mono mb-2">
                      {building.translations[language].title}
                    </h2>
                    <p className="font-mono mb-4">
                      {building.translations[language].location}
                    </p>
                    <p className="font-mono">
                      {building.period}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;