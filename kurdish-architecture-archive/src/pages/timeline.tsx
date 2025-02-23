import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ArchitecturalTimeline from '@/components/timeline/ArchitecturalTimeline';
import { Building, Language } from '@/types';
import { buildingsApi } from '@/lib/api';

const TimelinePage = () => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <ArchitecturalTimeline
            buildings={buildings}
            language={language}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TimelinePage;