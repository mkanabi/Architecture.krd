import React from 'react';
import { Building, Language } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building as BuildingIcon, MapPin, Clock, Users } from 'lucide-react';

interface AnalyticsDashboardProps {
  buildings: Building[];
  language: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ buildings, language }) => {
  const translations = {
    en: {
      buildingsOverTime: "Buildings Over Time",
      buildingsByRegion: "Buildings by Region",
      totalBuildings: "Total Buildings",
      regions: "Total Regions",
      overview: "Overview"
    },
    ku: {
      buildingsOverTime: "بیناکان بەپێی کات",
      buildingsByRegion: "بیناکان بەپێی ناوچە",
      totalBuildings: "کۆی بیناکان",
      regions: "کۆی ناوچەکان",
      overview: "گشتی"
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate statistics
  const totalBuildings = buildings.length;
  const uniqueRegions = new Set(buildings.map(b => b.translations.en.location)).size;

  // Prepare data for charts
  const buildingsByRegion = buildings.reduce((acc, building) => {
    const region = building.translations[language].location;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buildings by Region */}
        <div className="border-4 border-black p-6">
          <h3 className="text-xl font-mono mb-6">{translations[language].buildingsByRegion}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;