import React from 'react';
import { Building, Language } from '@/types';

interface TimelinePeriod {
  id: string;
  startYear: number;
  endYear: number | null;
  buildings: Building[];
}

interface ArchitecturalTimelineProps {
  buildings: Building[];
  language: Language;
}

const ArchitecturalTimeline: React.FC<ArchitecturalTimelineProps> = ({
  buildings,
  language
}) => {
  const translations = {
    en: {
      title: "Architectural Timeline",
      present: "Present",
      viewBuilding: "View Building",
      period: "Period"
    },
    ku: {
      title: "هێڵی کات تەلارسازی",
      present: "ئێستا",
      viewBuilding: "بینینی بینا",
      period: "سەردەم"
    }
  };

  // Group buildings by historical periods
  const periods: TimelinePeriod[] = [
    { id: 'ancient', startYear: -6000, endYear: -1000, buildings: [] },
    { id: 'medieval', startYear: -1000, endYear: 1500, buildings: [] },
    { id: 'ottoman', startYear: 1500, endYear: 1918, buildings: [] },
    { id: 'modern', startYear: 1918, endYear: null, buildings: [] }
  ];

  // Helper function to determine which period a building belongs to
  const assignBuildingToPeriod = (building: Building) => {
    // This is a simple example - you'd want to make this more sophisticated
    const year = parseInt(building.period.split(' ')[0]);
    if (isNaN(year)) return null;

    return periods.find(period => 
      year >= period.startYear && 
      (period.endYear === null || year <= period.endYear)
    );
  };

  // Assign buildings to periods
  buildings.forEach(building => {
    const period = assignBuildingToPeriod(building);
    if (period) {
      period.buildings.push(building);
    }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-mono border-b-4 border-black pb-4">
        {translations[language].title}
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>

        {periods.map((period) => (
          <div key={period.id} className="relative ml-8 mb-12">
            {/* Period marker */}
            <div className="absolute -left-10 top-0 w-3 h-3 bg-black rounded-full"></div>

            {/* Period content */}
            <div className="border-4 border-black p-6">
              <h3 className="text-xl font-mono mb-4">
                {period.startYear < 0 ? Math.abs(period.startYear) + ' BCE' : period.startYear} - {
                  period.endYear === null 
                    ? translations[language].present 
                    : (period.endYear < 0 ? Math.abs(period.endYear) + ' BCE' : period.endYear)
                }
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {period.buildings.map((building) => (
                  <div key={building.id} className="border-2 border-black p-4">
                    <img 
                      src={building.images[0]} 
                      alt={building.translations[language].title}
                      className="w-full h-32 object-cover mb-4"
                    />
                    <h4 className="font-mono text-lg mb-2">
                      {building.translations[language].title}
                    </h4>
                    <p className="font-mono text-sm mb-4">
                      {building.period}
                    </p>
                    <button className="bg-black text-white px-4 py-2 font-mono hover:bg-white hover:text-black border-2 border-black transition-colors">
                      {translations[language].viewBuilding}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchitecturalTimeline;