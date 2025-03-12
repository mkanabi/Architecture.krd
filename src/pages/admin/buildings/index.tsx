import React from 'react';
import { Building } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { Plus, Edit, Trash } from 'lucide-react';

const AdminBuildingsPage = () => {
  const [buildings, setBuildings] = React.useState<Building[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/buildings');
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      const data = await response.json();
      console.log('Fetched buildings:', data); // Debug log
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch buildings');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBuildings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this building?')) return;

    try {
      const response = await fetch(`/api/buildings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete building');
      }

      setBuildings(buildings.filter(building => building.id !== id));
    } catch (error) {
      console.error('Error deleting building:', error);
      alert('Failed to delete building');
    }
  };

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

          {buildings.length === 0 ? (
            <div className="text-center py-12 border-4 border-black">
              <p className="text-xl font-mono">No buildings found</p>
              <Link 
                href="/admin/buildings/new"
                className="inline-block mt-4 px-6 py-3 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors"
              >
                Add your first building
              </Link>
            </div>
          ) : (
            <div className="border-4 border-black">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-4 text-left">Title (EN)</th>
                    <th className="p-4 text-left">Title (KU)</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buildings.map((building) => (
                    <tr key={building.id} className="border-b-2 border-black">
                      <td className="p-4">{building.translations.en.title}</td>
                      <td className="p-4">{building.translations.ku.title}</td>
                      <td className="p-4">{building.translations.en.location}</td>
                      <td className="p-4">{building.status}</td>
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
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminBuildingsPage;