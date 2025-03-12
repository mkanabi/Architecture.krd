import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building as BuildingIcon, MapPin } from 'lucide-react';

type Language = 'en' | 'ku';

interface AnalyticsDashboardProps {
  buildings: any[];
  language: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ buildings, language }) => {
  const translations = {
    en: {
      buildingsByRegion: "Buildings by Region",
      totalBuildings: "Total Buildings",
      regions: "Total Regions",
      overview: "Overview",
      noData: "No data available"
    },
    ku: {
      buildingsByRegion: "بیناکان بەپێی ناوچە",
      totalBuildings: "کۆی بیناکان",
      regions: "کۆی ناوچەکان",
      overview: "گشتی",
      noData: "زانیاری بەردەست نییە"
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Ensure buildings is an array
  const safeBuildings = Array.isArray(buildings) ? buildings : [];

  // Calculate statistics
  const totalBuildings = safeBuildings.length;
  
  // Calculate unique regions
  const uniqueRegions = new Set(
    safeBuildings.map(b => b.translations?.[language]?.location || 'Unknown')
  ).size;

  // Prepare data for charts
  const buildingsByRegion = safeBuildings.reduce((acc, building) => {
    const region = building.translations?.[language]?.location || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(buildingsByRegion).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <BuildingIcon size={32} />
            <div>
              <p className="text-sm font-mono">{translations[language].totalBuildings}</p>
              <h3 className="text-2xl font-mono">{totalBuildings}</h3>
            </div>
          </div>
        </div>

        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <MapPin size={32} />
            <div>
              <p className="text-sm font-mono">{translations[language].regions}</p>
              <h3 className="text-2xl font-mono">{uniqueRegions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      
    </div>
  );
};

export default AnalyticsDashboard;