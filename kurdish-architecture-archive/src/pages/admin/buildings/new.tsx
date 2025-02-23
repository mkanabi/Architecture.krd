import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuildingForm from '@/components/admin/BuildingForm';

const NewBuildingPage = () => {
  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-3xl font-mono mb-8">Add New Building</h1>
        <BuildingForm />
      </div>
    </MainLayout>
  );
};

export default NewBuildingPage;