import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const buildings = await prisma.building.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });

        // Transform buildings to match frontend structure
        const transformedBuildings = buildings.map(building => ({
          id: building.id,
          translations: {
            en: {
              title: building.titleEn,
              alternateNames: building.alternateNamesEn,
              location: building.locationEn,
              overview: building.overviewEn,
              architecturalDetails: building.architecturalDetailsEn,
              historicalPeriods: JSON.parse(building.historicalPeriodsEn.toString())
            },
            ku: {
              title: building.titleKu,
              alternateNames: building.alternateNamesKu,
              location: building.locationKu,
              overview: building.overviewKu,
              architecturalDetails: building.architecturalDetailsKu,
              historicalPeriods: JSON.parse(building.historicalPeriodsKu.toString())
            }
          },
          coordinates: {
            lat: building.latitude,
            lng: building.longitude
          },
          period: building.period,
          status: building.status,
          images: building.images,
          createdAt: building.createdAt,
          updatedAt: building.updatedAt
        }));

        return res.status(200).json(transformedBuildings);

      case 'POST':
        // Your existing POST logic here
        const buildingData = {
          titleEn: req.body.translations.en.title,
          titleKu: req.body.translations.ku.title,
          locationEn: req.body.translations.en.location,
          locationKu: req.body.translations.ku.location,
          overviewEn: req.body.translations.en.overview,
          overviewKu: req.body.translations.ku.overview,
          architecturalDetailsEn: req.body.translations.en.architecturalDetails || [],
          architecturalDetailsKu: req.body.translations.ku.architecturalDetails || [],
          alternateNamesEn: req.body.translations.en.alternateNames || [],
          alternateNamesKu: req.body.translations.ku.alternateNames || [],
          historicalPeriodsEn: JSON.stringify(req.body.translations.en.historicalPeriods || []),
          historicalPeriodsKu: JSON.stringify(req.body.translations.ku.historicalPeriods || []),
          latitude: parseFloat(req.body.coordinates.lat),
          longitude: parseFloat(req.body.coordinates.lng),
          period: req.body.period,
          status: req.body.status,
          images: req.body.images || []
        };

        const createdBuilding = await prisma.building.create({
          data: buildingData
        });

        return res.status(201).json({
          id: createdBuilding.id,
          translations: {
            en: {
              title: createdBuilding.titleEn,
              alternateNames: createdBuilding.alternateNamesEn,
              location: createdBuilding.locationEn,
              overview: createdBuilding.overviewEn,
              architecturalDetails: createdBuilding.architecturalDetailsEn,
              historicalPeriods: JSON.parse(createdBuilding.historicalPeriodsEn.toString())
            },
            ku: {
              title: createdBuilding.titleKu,
              alternateNames: createdBuilding.alternateNamesKu,
              location: createdBuilding.locationKu,
              overview: createdBuilding.overviewKu,
              architecturalDetails: createdBuilding.architecturalDetailsKu,
              historicalPeriods: JSON.parse(createdBuilding.historicalPeriodsKu.toString())
            }
          },
          coordinates: {
            lat: createdBuilding.latitude,
            lng: createdBuilding.longitude
          },
          period: createdBuilding.period,
          status: createdBuilding.status,
          images: createdBuilding.images,
          createdAt: createdBuilding.createdAt,
          updatedAt: createdBuilding.updatedAt
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}