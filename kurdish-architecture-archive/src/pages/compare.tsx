import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuildingComparison from '@/components/buildings/BuildingComparison';
import { Building, Language } from '@/types';
import { buildingsApi } from '@/lib/api';

const ComparePage = () => {
  const [selectedBuildings, setSelectedBuildings] = React.useState<Building[]>([]);
  const [language, setLanguage] = React.useState<Language>('ku');

  const handleRemoveBuilding = (id: string) => {
    setSelectedBuildings(buildings => buildings.filter(b => b.id !== id));
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <BuildingComparison
            buildings={selectedBuildings}
            language={language}
            onRemoveBuilding={handleRemoveBuilding}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ComparePage;