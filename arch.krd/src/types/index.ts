export type Language = 'en' | 'ku';

export interface Building {
  id: string;
  translations: {
    en: BuildingTranslation;
    ku: BuildingTranslation;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  period: string;
  status: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingTranslation {
  title: string;
  alternateNames: string[];
  location: string;
  overview: string;
  architecturalDetails: string[];
  historicalPeriods: {
    era: string;
    details: string;
  }[];
}