import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import UserManagement from '@/components/admin/UserManagement';
import BuildingManagement from '@/components/admin/BuildingManagement';
import { Building, Language } from '@/types';
import { buildingsApi } from '@/lib/api';

const AdminDashboardPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [language, setLanguage] = React.useState<Language>('ku');
  const [activeTab, setActiveTab] = React.useState('analytics');

  React.useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await buildingsApi.getAll();
        setBuildings(data);
      } catch (error) {
        console.error('Failed to fetch buildings:', error);
      }
    };

    fetchBuildings();
  }, []);

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
              {activeTab === 'analytics' && (
                <AnalyticsDashboard buildings={buildings} language={language} />
              )}
              {activeTab === 'buildings' && (
                <BuildingManagement buildings={buildings} language={language} />
              )}
              {activeTab === 'users' && (
                <UserManagement language={language} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;