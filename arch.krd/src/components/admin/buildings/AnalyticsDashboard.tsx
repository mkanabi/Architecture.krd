import React from 'react';
import { Building, Language } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Users, Building as BuildingIcon, Map } from 'lucide-react';

interface AnalyticsDashboardProps {
  buildings: Building[];
  language: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  buildings,
  language
}) => {
  const translations = {
    en: {
      title: "Analytics Dashboard",
      buildingsOverTime: "Buildings Over Time",
      buildingsByRegion: "Buildings by Region",
      buildingsByPeriod: "Buildings by Historical Period",
      totalBuildings: "Total Buildings",
      regions: "Regions",
      visitors: "Monthly Visitors",
      overview: "Overview"
    },
    ku: {
      title: "داشبۆردی شیکاری",
      buildingsOverTime: "بیناکان بە پێی کات",
      buildingsByRegion: "بیناکان بە پێی ناوچە",
      buildingsByPeriod: "بیناکان بە پێی سەردەمی مێژوویی",
      totalBuildings: "کۆی بیناکان",
      regions: "ناوچەکان",
      visitors: "سەردانکەرانی مانگانە",
      overview: "پوختە"
    }
  };

  // Sample analytics data - replace with real data
  const stats = {
    totalBuildings: buildings.length,
    totalRegions: 5,
    monthlyVisitors: 12000,
    documentsUploaded: 150
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Sample time series data
  const timeSeriesData = [
    { month: 'Jan', buildings: 10 },
    { month: 'Feb', buildings: 15 },
    { month: 'Mar', buildings: 18 },
    { month: 'Apr', buildings: 25 },
    { month: 'May', buildings: 30 }
  ];

  // Sample region data
  const regionData = [
    { name: 'Hewlêr', value: 30 },
    { name: 'Silêmanî', value: 25 },
    { name: 'Duhok', value: 20 },
    { name: 'Kermanshah', value: 15 },
    { name: 'Sanandaj', value: 10 }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <BuildingIcon size={32} />
            <div>
              <p className="text-sm font-mono">{translations[language].totalBuildings}</p>
              <h3 className="text-2xl font-mono">{stats.totalBuildings}</h3>
            </div>
          </div>
        </div>

        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <Map size={32} />
            <div>
              <p className="text-sm font-mono">{translations[language].regions}</p>
              <h3 className="text-2xl font-mono">{stats.totalRegions}</h3>
            </div>
          </div>
        </div>

        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <Users size={32} />
            <div>
              <p className="text-sm font-mono">{translations[language].visitors}</p>
              <h3 className="text-2xl font-mono">{stats.monthlyVisitors}</h3>
            </div>
          </div>
        </div>

        <div className="border-4 border-black p-6">
          <div className="flex items-center gap-4">
            <Clock size={32} />
            <div>
              <p className="text-sm font-mono">Documents</p>
              <h3 className="text-2xl font-mono">{stats.documentsUploaded}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buildings Over Time */}
        <div className="border-4 border-black p-6">
          <h3 className="text-xl font-mono mb-6">{translations[language].buildingsOverTime}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="buildings" stroke="#000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Buildings by Region */}
        <div className="border-4 border-black p-6">
          <h3 className="text-xl font-mono mb-6">{translations[language].buildingsByRegion}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
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
  );
};

export default AnalyticsDashboard;