import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import BuildingForm from '@/components/admin/buildings/BuildingForm';
import { Building } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface EditBuildingPageProps {
  building: Building;
}

const EditBuildingPage: React.FC<EditBuildingPageProps> = ({ building }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-black hover:text-white border-2 border-black transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-mono">
              Edit: {building?.translations?.en?.title}
            </h1>
          </div>

          {building && <BuildingForm initialData={building} />}
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    if (!context.params?.id) {
      return { notFound: true };
    }

    // Use absolute URL for server-side requests
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = context.req ? `${protocol}://${context.req.headers.host}` : '';
    
    const response = await fetch(
      `${baseUrl}/api/buildings/${context.params.id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const building = await response.json();

    return {
      props: {
        building,
      },
    };
  } catch (error) {
    console.error('Error fetching building:', error);
    return {
      notFound: true,
    };
  }
};

export default EditBuildingPage;