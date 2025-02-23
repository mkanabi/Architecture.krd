import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import UserManagement from '@/components/admin/UserManagement';
import { Building } from '@/types';
import { buildingsApi } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboardPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [language, setLanguage] = React.useState<'en' | 'ku'>('ku');

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

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <Tabs defaultValue="analytics" className="space-y-8">
            <TabsList className="border-b-4 border-black">
              <TabsTrigger 
                value="analytics"
                className="px-8 py-4 font-mono"
              >
                {language === 'en' ? 'Analytics' : 'شیکاری'}
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="px-8 py-4 font-mono"
              >
                {language === 'en' ? 'Users' : 'بەکارهێنەران'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <AnalyticsDashboard buildings={buildings} language={language} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement language={language} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;