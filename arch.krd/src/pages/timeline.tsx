import React from 'react';
import { GetServerSideProps } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Timeline from '@/components/timeline/ArchitecturalTimeline';
import { Building, Language } from '@/types';

interface TimelinePageProps {
  buildings: Building[];
  eras: any[];
}

const TimelinePage: React.FC<TimelinePageProps> = ({ buildings, eras }) => {
  const [language, setLanguage] = React.useState<Language>('ku');

  return (
    <MainLayout onLanguageChange={setLanguage}>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <Timeline 
            buildings={buildings} 
            language={language}
            eras={eras}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch buildings and eras
    const [buildingsRes, erasRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buildings`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eras`)
    ]);

    if (!buildingsRes.ok || !erasRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const [buildings, eras] = await Promise.all([
      buildingsRes.json(),
      erasRes.json()
    ]);

    return {
      props: {
        buildings,
        eras
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        buildings: [],
        eras: []
      }
    };
  }
};

export default TimelinePage;