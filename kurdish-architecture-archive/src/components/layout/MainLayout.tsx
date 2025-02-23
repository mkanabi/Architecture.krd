import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Building } from '@/types';
import Link from 'next/link';

const HomePage = () => {
  // This would eventually come from your API
  const featuredBuildings: Building[] = [
    {
      id: '1',
      translations: {
        en: {
          title: "Erbil Citadel",
          alternateNames: ["Qelat", "Hawler Castle"],
          location: "Erbil, Kurdistan Region",
          overview: "The oldest continuously inhabited settlement in the world...",
          architecturalDetails: [],
          historicalPeriods: []
        },
        ku: {
          title: "قەڵای هەولێر",
          alternateNames: ["قەڵات", "قەڵای هەولێر"],
          location: "هەولێر، هەرێمی کوردستان",
          overview: "کۆنترین شوێنی نیشتەجێبوونی بەردەوام لە جیهاندا...",
          architecturalDetails: [],
          historicalPeriods: []
        }
      },
      coordinates: {
        lat: 36.19,
        lng: 44.01
      },
      period: "6000 BCE - Present",
      status: "UNESCO World Heritage Site",
      images: ["/api/placeholder/400/300"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBuildings.map((building) => (
            <Link 
              href={`/building/${building.id}`} 
              key={building.id}
              className="border-4 border-black hover:bg-black hover:text-white transition-colors"
            >
              <img 
                src={building.images[0]} 
                alt={building.translations.en.title}
                className="w-full h-64 object-cover border-b-4 border-black"
              />
              <div className="p-6">
                <h2 className="font-mono text-3xl mb-2">{building.translations.en.title}</h2>
                <div className="font-mono mb-4 text-sm">
                  {building.period} | {building.translations.en.location}
                </div>
                <p className="font-mono text-lg">{building.translations.en.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;