import React from 'react';
import { Building } from '@/types';
import { buildingsApi } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';

const HomePage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await buildingsApi.getAll();
        setBuildings(data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setError('Failed to load buildings');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-mono">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-mono text-red-500">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-mono mb-8">Buildings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <div key={building.id} className="border-4 border-black p-6">
                <h2 className="text-xl font-mono mb-2">
                  {building.translations.en.title}
                </h2>
                <p className="font-mono mb-4">
                  {building.translations.en.location}
                </p>
                <p className="font-mono">
                  {building.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;