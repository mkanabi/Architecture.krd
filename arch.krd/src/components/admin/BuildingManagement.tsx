import React from 'react';
import { Building, Language } from '@/types';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BuildingManagementProps {
  buildings: Building[];
  language: Language;
}

const BuildingManagement: React.FC<BuildingManagementProps> = ({ buildings, language }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredBuildings, setFilteredBuildings] = React.useState(buildings);
  const router = useRouter();

  const translations = {
    en: {
      manageBuildings: "Manage Buildings",
      addNewBuilding: "Add New Building",
      search: "Search buildings...",
      titleEn: "Title (EN)",
      titleKu: "Title (KU)",
      location: "Location",
      period: "Period",
      status: "Status",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      noBuildings: "No buildings found"
    },
    ku: {
      manageBuildings: "بەڕێوەبردنی بیناکان",
      addNewBuilding: "زیادکردنی بینایەکی نوێ",
      search: "گەڕان بۆ بیناکان...",
      titleEn: "ناونیشان (ئینگلیزی)",
      titleKu: "ناونیشان (کوردی)",
      location: "شوێن",
      period: "سەردەم",
      status: "دۆخ",
      actions: "کردارەکان",
      edit: "دەستکاری",
      delete: "سڕینەوە",
      noBuildings: "هیچ بینایەک نەدۆزرایەوە"
    }
  };

  React.useEffect(() => {
    const filtered = buildings.filter(building => 
      building.translations[language].title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.translations[language].location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [searchQuery, buildings, language]);

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this building?' : 'دڵنیای لە سڕینەوەی ئەم بینایە؟')) {
      try {
        await fetch(`/api/buildings/${id}`, { method: 'DELETE' });
        setFilteredBuildings(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        console.error('Failed to delete building:', error);
      }
    }
  };

  return (
    <div className="space-y-8" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-mono">{translations[language].manageBuildings}</h2>
        <Link 
          href="/admin/buildings/new"
          className="bg-black text-white px-6 py-3 flex items-center gap-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <Plus size={20} />
          {translations[language].addNewBuilding}
        </Link>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={translations[language].search}
          className="w-full border-4 border-black p-4 font-mono"
          dir={language === 'ku' ? 'rtl' : 'ltr'}
        />
        <Search 
          size={24} 
          className={`absolute top-1/2 transform -translate-y-1/2 ${language === 'ku' ? 'left-4' : 'right-4'}`}
        />
      </div>

      <div className="border-4 border-black overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left font-mono">{translations[language].titleEn}</th>
              <th className="p-4 text-left font-mono">{translations[language].titleKu}</th>
              <th className="p-4 text-left font-mono">{translations[language].location}</th>
              <th className="p-4 text-left font-mono">{translations[language].status}</th>
              <th className="p-4 text-left font-mono">{translations[language].actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((building) => (
                <tr key={building.id} className="border-b-2 border-black last:border-b-0">
                  <td className="p-4 font-mono">
                    {building.translations.en.title}
                  </td>
                  <td className="p-4 font-mono">
                    {building.translations.ku.title}
                  </td>
                  <td className="p-4 font-mono">
                    {building.translations[language].location}
                  </td>
                  <td className="p-4 font-mono">
                    {building.status}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/buildings/${building.id}/edit`}
                        className="p-2 hover:bg-black hover:text-white transition-colors"
                        title={translations[language].edit}
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(building.id)}
                        className="p-2 hover:bg-black hover:text-white transition-colors"
                        title={translations[language].delete}
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center font-mono">
                  {translations[language].noBuildings}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuildingManagement;