import { Role } from '@prisma/client';

export type Language = 'en' | 'ku';

export interface Building {
  id: string;
  titleEn: string;
  titleKu: string;
  alternateNamesEn: string[];
  alternateNamesKu: string[];
  translations: {
    en: BuildingTranslation;
    ku: BuildingTranslation;
  };
  locationEn: string;
  locationKu: string;
  overviewEn: string;
  overviewKu: string;
  architecturalDetailsEn: string[];
  architecturalDetailsKu: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  era?: {
    id: string;
    nameEn: string;
    nameKu: string;
  };
  region?: {
    id: string;
    nameEn: string;
    nameKu: string;
  };
  status: string;
  constructionYear?: number;
  renovationYears?: number[];
  architectEn?: string;
  architectKu?: string;
  buildingType?: {
    id: string;
    nameEn: string;
    nameKu: string;
  };
  materials?: Array<{
    id: string;
    nameEn: string;
    nameKu: string;
  }>;
  images: Array<{
    id: string;
    url: string;
    captionEn?: string;
    captionKu?: string;
    isPrimary?: boolean;
  }>;
  sources?: Array<{
    id: string;
    titleEn: string;
    titleKu?: string;
    url?: string;
    description?: string;
  }>;
  period: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingTranslation {
  title: string;
  alternateNames: string[];
  location: string;
  overview: string;
  architecturalDetails: string[];
  architectName?: string;
  historicalPeriods?: {
    era: string;
    details: string;
  }[];
}