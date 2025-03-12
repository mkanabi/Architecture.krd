import React from 'react';
import { Building, Language } from '@/types';
import { ArrowLeftRight, X } from 'lucide-react';
import Link from 'next/link';

interface BuildingComparisonProps {
  buildings: Building[];
  language: Language;
  onRemoveBuilding: (id: string) => void;
}

const BuildingComparison: React.FC<BuildingComparisonProps> = ({
  buildings,
  language,
  onRemoveBuilding
}) => {
  const translations = {
    en: {
      title: "Building Comparison",
      period: "Period",
      location: "Location",
      status: "Status",
      architecturalDetails: "Architectural Details",
      historicalPeriods: "Historical Periods",
      noBuildings: "No buildings selected for comparison",
      selectMore: "Select buildings to compare",
      viewDetails: "View Details"
    },
    ku: {
      title: "بەراوردی بیناکان",
      period: "سەردەم",
      location: "شوێن",
      status: "دۆخ",
      architecturalDetails: "وردەکاری تەلارسازی",
      historicalPeriods: "سەردەمە مێژووییەکان",
      noBuildings: "هیچ بینایەک هەڵنەبژێردراوە بۆ بەراورد",
      selectMore: "بیناکان هەڵبژێرە بۆ بەراورد",
      viewDetails: "بینینی وردەکارییەکان"
    }
  };

  if (buildings.length === 0) {
    return (
      <div className="text-center p-8 border-4 border-black">
        <p className="text-xl font-mono">{translations[language].noBuildings}</p>
        <p className="mt-4 font-mono">{translations[language].selectMore}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-mono border-b-4 border-black pb-4">
        {translations[language].title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {buildings.map((building) => (
          <div key={building.id} className="border-4 border-black">
            <div className="relative">
              <img 
                src={building.images[0]} 
                alt={building.translations[language].title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => onRemoveBuilding(building.id)}
                className="absolute top-2 right-2 p-2 bg-black text-white hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-mono">
                {building.translations[language].title}
              </h3>

              <dl className="space-y-2">
                <dt className="font-mono font-bold">{translations[language].period}</dt>
                <dd className="font-mono">{building.period}</dd>

                <dt className="font-mono font-bold">{translations[language].location}</dt>
                <dd className="font-mono">{building.translations[language].location}</dd>

                <dt className="font-mono font-bold">{translations[language].status}</dt>
                <dd className="font-mono">{building.status}</dd>
              </dl>

              <Link
                href={`/building/${building.id}`}
                className="inline-block mt-4 bg-black text-white px-4 py-2 font-mono hover:bg-white hover:text-black border-2 border-black transition-colors"
              >
                {translations[language].viewDetails}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-4 border-black">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 font-mono text-left">
                {translations[language].architecturalDetails}
              </th>
              {buildings.map((building) => (
                <th key={building.id} className="p-4 font-mono text-left">
                  {building.translations[language].title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buildings[0].translations[language].architecturalDetails.map((_, index) => (
              <tr key={index} className="border-b-2 border-black">
                <td className="p-4 font-mono font-bold">Detail {index + 1}</td>
                {buildings.map((building) => (
                  <td key={building.id} className="p-4 font-mono">
                    {building.translations[language].architecturalDetails[index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuildingComparison;