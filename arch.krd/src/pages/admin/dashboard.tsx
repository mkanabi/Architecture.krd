import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import UserManagement from '@/components/admin/UserManagement';
import BuildingManagement from '@/components/admin/BuildingManagement';
import { Building, Language } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminDashboardPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage(); // Use the language context
  const [activeTab, setActiveTab] = useState('analytics');

  // Ensure client-side rendering is confirmed
  useEffect(() => {
    setIsClient(true);
  }, []);

  // AbortController to cancel unnecessary requests
  const fetchBuildings = useCallback(async () => {
    if (!isClient) return;

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const url = new URL('/api/buildings', window.location.origin);
      url.searchParams.append('language', language);
      
      const response = await fetch(url.toString(), { signal });
      if (!response.ok) throw new Error('Failed to fetch buildings');
      
      const data = await response.json();
      
      setBuildings(data.buildings);
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
  }, [isClient, language]);

  useEffect(() => {
    if (isClient) {
      fetchBuildings();
    }
  }, [fetchBuildings, isClient, language]);

  const translations = {
    en: {
      analytics: "Analytics",
      buildings: "Buildings",
      users: "Users"
    },
    ku: {
      analytics: "شیکاری",
      buildings: "بیناکان",
      users: "بەکارهێنەران"
    }
  };

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-8">
            {/* Tabs */}
            <div className="border-b-4 border-black flex">
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-8 py-4 font-mono ${
                  activeTab === 'analytics' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                }`}
              >
                {translations[language].analytics}
              </button>
              <button 
                onClick={() => setActiveTab('buildings')}
                className={`px-8 py-4 font-mono ${
                  activeTab === 'buildings' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                }`}
              >
                {translations[language].buildings}
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-8 py-4 font-mono ${
                  activeTab === 'users' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                }`}
              >
                {translations[language].users}
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {loading ? (
                <div className="text-center py-8">
                  {language === 'en' ? 'Loading...' : 'چاوەڕێ بکە...'}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {error}
                </div>
              ) : (
                <>
                  {activeTab === 'analytics' && (
                    <AnalyticsDashboard buildings={buildings} language={language} />
                  )}
                  {activeTab === 'buildings' && (
                    <BuildingManagement buildings={buildings} language={language} />
                  )}
                  {activeTab === 'users' && (
                    <UserManagement language={language} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;