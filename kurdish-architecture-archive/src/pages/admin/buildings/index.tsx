import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Building } from '@/types';
import { buildingsApi } from '@/lib/api';
import { Plus, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

const AdminBuildingsPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        await buildingsApi.delete(id);
        setBuildings(buildings.filter(building => building.id !== id));
      } catch (error) {
        console.error('Failed to delete building:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-mono">Manage Buildings</h1>
          <Link 
            href="/admin/buildings/new"
            className="bg-black text-white px-6 py-3 flex items-center gap-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
          >
            <Plus size={20} />
            Add New Building
          </Link>
        </div>

        <div className="border-4 border-black">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Title (EN)</th>
                <th className="p-4 text-left">Title (KU)</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Period</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building.id} className="border-b-2 border-black">
                  <td className="p-4">{building.translations.en.title}</td>
                  <td className="p-4">{building.translations.ku.title}</td>
                  <td className="p-4">{building.translations.en.location}</td>
                  <td className="p-4">{building.period}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/buildings/${building.id}/edit`}
                        className="p-2 hover:bg-black hover:text-white transition-colors"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(building.id)}
                        className="p-2 hover:bg-black hover:text-white transition-colors"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminBuildingsPage;