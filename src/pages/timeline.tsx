import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import Timeline from '@/components/timeline/ArchitecturalTimeline';
import { useLanguage } from '@/contexts/LanguageContext';

// Updated interfaces
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
  images: string[];
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

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Skeleton Component for Timeline
const TimelineSkeleton = () => (
  <div className="space-y-16">
    <div className="h-10 bg-gray-200 animate-pulse w-64 mb-16"></div>

    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 bg-black"></div>

      {/* Multiple era skeletons */}
      {[...Array(2)].map((_, index) => (
        <div key={index} className="relative ml-12 mb-24">
          {/* Era marker */}
          <div className="absolute -left-4 top-0 w-6 h-6 rounded-full bg-black"></div>

          {/* Era title skeleton */}
          <div className="border-b-4 border-black pb-2 mb-8">
            <div className="h-8 bg-gray-200 animate-pulse w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 animate-pulse w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-3/4 mt-2"></div>
          </div>

          {/* Buildings skeleton */}
          <div className="pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, buildingIndex) => (
                <div key={buildingIndex} className="border-4 border-black">
                  <div className="h-48 bg-gray-300 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface TimelinePageProps {
  buildings: Building[];
  eras: Era[];
  pagination: PaginationInfo;
  isLoading?: boolean;
}

const TimelinePage: React.FC<TimelinePageProps> = ({ 
  buildings, 
  eras, 
  pagination, 
  isLoading = false 
}) => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(isLoading);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setLoading(true);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    });
  };

  // Set loading to false after component mounts
  React.useEffect(() => {
    if (loading) {
      // Small delay to allow for smoother transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loading, router.query]);

  const translations = {
    en: {
      title: "Architectural Timeline",
      noData: "No timeline data available. Please check back later.",
      totalBuildings: "Total Buildings: "
    },
    ku: {
      title: "هێڵی کات ئەندازیاری",
      noData: "هیچ داتایەک بەردەست نییە. تکایە دواتر بگەڕێوە.",
      totalBuildings: "کۆی بیناکان: "
    }
  };

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          {loading ? (
            <TimelineSkeleton />
          ) : buildings && buildings.length > 0 && eras && eras.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-mono">
                  {translations[language].title}
                </h1>
                <div className="text-md font-mono">
                  {translations[language].totalBuildings} {pagination.totalCount}
                </div>
              </div>
              
              <Timeline 
                buildings={buildings} 
                language={language}
                eras={eras}
              />
              
              {/* Server-side pagination controls */}
              {pagination.totalPages > 1 && (
                <div className={`flex ${language === 'ku' ? 'justify-end' : 'justify-start'} items-center mt-12 space-x-4`}>
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 border-2 border-black font-mono ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                  >
                    {language === 'en' ? 'Previous' : 'پێشتر'}
                  </button>
                  
                  <span className="font-mono">
                    {language === 'en' ? 'Page ' : 'لاپەڕە '}
                    {pagination.page}
                    {language === 'en' ? ' of ' : ' لە '}
                    {pagination.totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-4 py-2 border-2 border-black font-mono ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                  >
                    {language === 'en' ? 'Next' : 'دواتر'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-3xl font-mono mb-8">
                {translations[language].title}
              </h1>
              <p className="text-lg font-mono">
                {translations[language].noData}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${protocol}://localhost:3000`;
    
    // Ensure baseUrl is properly formatted
    const apiBaseUrl = baseUrl.startsWith('http') ? baseUrl : `${protocol}://${baseUrl}`;
    
    // Get pagination parameters from query
    const page = context.query.page || '1';
    const limit = context.query.limit || '9';
    const eraId = context.query.eraId || '';
    
    // Fetch timeline data with pagination
    const timelineRes = await fetch(
      `${apiBaseUrl}/api/timeline?page=${page}&limit=${limit}${eraId ? `&eraId=${eraId}` : ''}`,
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );

    if (!timelineRes.ok) {
      console.error("API response not OK:", timelineRes.status);
      throw new Error('Failed to fetch timeline data');
    }

    const timelineData = await timelineRes.json();
    
    return {
      props: {
        buildings: timelineData.buildings || [],
        eras: timelineData.eras || [],
        pagination: timelineData.pagination || {
          page: parseInt(page as string, 10),
          pageSize: parseInt(limit as string, 10),
          totalCount: 0,
          totalPages: 0
        },
        isLoading: false
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        buildings: [],
        eras: [],
        pagination: {
          page: 1,
          pageSize: 9,
          totalCount: 0,
          totalPages: 0
        },
        isLoading: false
      }
    };
  }
};

export default TimelinePage;