import React, { useState, useEffect, useCallback } from 'react';
import { Building, Language } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import SearchBar from '@/components/search/SearchBar';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Skeleton Component with static rendering
const BuildingCardSkeleton = () => (
  <div className="border-4 border-black">
    <div className="h-48 bg-gray-300 animate-pulse"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-200 w-1/3"></div>
    </div>
  </div>
);

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage(); // Use the context properly
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Responsive pagination with client-side check
  const getPageSize = () => {
    if (!isClient) return 6;
    
    const width = window.innerWidth;
    if (width >= 1024) return 9;  // Large screens
    if (width >= 768) return 6;   // Medium screens
    return 3;  // Small screens
  };

  // Ensure client-side rendering is confirmed
  useEffect(() => {
    setIsClient(true);
  }, []);

  // AbortController to cancel unnecessary requests
  const fetchBuildings = useCallback(async (searchQuery?: string, currentPage = 1) => {
    if (!isClient) return;

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const pageSize = getPageSize();
      const url = new URL('/api/buildings', window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', pageSize.toString());
      url.searchParams.append('language', language); // Include current language in API request
      
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }

      const response = await fetch(url.toString(), { signal });
      if (!response.ok) throw new Error('Failed to fetch buildings');
      
      const data = await response.json();
      
      // Update buildings based on page
      if (currentPage === 1) {
        setBuildings(data.buildings);
      } else {
        setBuildings(prev => [...prev, ...data.buildings]);
      }
      
      // Check if there are more buildings
      setHasMore(data.buildings.length === pageSize);
      setError(null);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        setError('Failed to load buildings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup function
  }, [isClient, language]); // Add language as dependency

  useEffect(() => {
    if (isClient) {
      fetchBuildings();
    }
  }, [fetchBuildings, isClient, language]); // Add language as dependency

  const handleSearch = useCallback((query: string) => {
    setPage(1);
    fetchBuildings(query);
  }, [fetchBuildings]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBuildings(undefined, nextPage);
  };

  const translations = {
    en: {
      title: "Kurdistan Architectural Heritage",
      noBuildings: "No buildings found",
      loading: "Loading...",
      viewDetails: "View Details",
      loadMore: "Load More",
    },
    ku: {
      title: "میراتی تەلارسازیی کوردستان",
      noBuildings: "هیچ بینایەک نەدۆزرایەوە",
      loading: "چاوەڕێ بکە...",
      viewDetails: "بینینی وردەکارییەکان",
      loadMore: "بارکردنی زیاتر",
    },
  };

  // Skeleton count based on page size
  const skeletonCount = isClient ? getPageSize() : 6;

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-mono mb-8">{translations[language].title}</h1>
          
          <div className="mb-12">
            <SearchBar onSearch={handleSearch} language={language} />
          </div>

          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(skeletonCount)].map((_, index) => (
                <BuildingCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-mono">
              {error}
            </div>
          ) : buildings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-mono">{translations[language].noBuildings}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map((building) => (
                  <Link 
                    href={`/building/${building.id}`}
                    key={building.id} 
                    className="border-4 border-black hover:bg-black hover:text-white transition-colors group"
                  >
                    {building.images && building.images[0] && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={building.images[0]}
                          alt={building.translations[language].title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          loading="lazy"
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

              {hasMore && (
                <div className="text-center mt-8">
                  <button 
                    onClick={loadMore}
                    className="bg-black text-white px-6 py-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
                  >
                    {translations[language].loadMore}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;