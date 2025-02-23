import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import BuildingDetail from '@/components/buildings/BuildingDetail';
import { Building, Language } from '@/types';

interface BuildingPageProps {
  building: Building;
}

const BuildingPage: React.FC<BuildingPageProps> = ({ building }) => {
  const [language, setLanguage] = React.useState<Language>('ku');
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <BuildingDetail building={building} language={language} onLanguageChange={setLanguage} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    // This will be replaced with actual API call
    const building: Building = {
      id: params?.id as string,
      translations: {
        en: {
          title: "Erbil Citadel",
          alternateNames: ["Qelat", "Hawler Castle"],
          location: "Erbil, Kurdistan Region, Iraq",
          overview: "The Citadel of Erbil is a tell or occupied mound in the historical city of Erbil, Kurdistan Region...",
          architecturalDetails: [
            "Built on an artificial mound rising 32 meters",
            "Oval shape, approximately 430 meters long and 340 meters wide",
            "Three main districts: Serai, Takya and Topkhana"
          ],
          historicalPeriods: [
            {
              era: "Ancient Mesopotamian",
              details: "Early settlement and temple complex"
            },
            {
              era: "Islamic Golden Age",
              details: "Major fortification and urban development"
            }
          ]
        },
        ku: {
          title: "قەڵای هەولێر",
          alternateNames: ["قەڵات", "قەڵای هەولێر"],
          location: "هەولێر، هەرێمی کوردستان، عێراق",
          overview: "قەڵای هەولێر تەلێکە یان گردێکی نیشتەجێبوو لە شاری مێژوویی هەولێر...",
          architecturalDetails: [
            "لەسەر گردێکی دەستکرد دروستکراوە بە بەرزی ٣٢ مەتر",
            "شێوەی هێلکەیی، نزیکەی ٤٣٠ مەتر درێژ و ٣٤٠ مەتر پان",
            "سێ گەڕەکی سەرەکی: سەرای، تەکیە و تۆپخانە"
          ],
          historicalPeriods: [
            {
              era: "سەردەمی مێزۆپۆتامیای کۆن",
              details: "نیشتەجێبوونی سەرەتایی و کۆمپلێکسی پەرستگا"
            },
            {
              era: "سەردەمی زێڕینی ئیسلامی",
              details: "قەڵابەندی و گەشەپێدانی شارستانی"
            }
          ]
        }
      },
      coordinates: {
        lat: 36.19,
        lng: 44.01
      },
      period: "6000 BCE - Present",
      status: "UNESCO World Heritage Site",
      images: [
        "/api/placeholder/1200/400",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      props: {
        building
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

export default BuildingPage;