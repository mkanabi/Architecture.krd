import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const building = await prisma.building.findUnique({
          where: { id },
          include: {
            comments: {
              orderBy: {
                createdAt: 'desc'
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        });
        
        if (!building) {
          return res.status(404).json({ error: 'Building not found' });
        }
        
        const transformedBuilding = {
          id: building.id,
          translations: {
            en: {
              title: building.titleEn,
              alternateNames: building.alternateNamesEn,
              location: building.locationEn,
              overview: building.overviewEn,
              architecturalDetails: building.architecturalDetailsEn,
              historicalPeriods: building.historicalPeriodsEn 
                ? JSON.parse(building.historicalPeriodsEn as string) 
                : []
            },
            ku: {
              title: building.titleKu,
              alternateNames: building.alternateNamesKu,
              location: building.locationKu,
              overview: building.overviewKu,
              architecturalDetails: building.architecturalDetailsKu,
              historicalPeriods: building.historicalPeriodsKu 
                ? JSON.parse(building.historicalPeriodsKu as string) 
                : []
            }
          },
          coordinates: {
            lat: building.latitude,
            lng: building.longitude
          },
          period: building.period,
          status: building.status,
          images: building.images,
          comments: building.comments,
          createdAt: building.createdAt,
          updatedAt: building.updatedAt
        };
        
        res.status(200).json(transformedBuilding);
      } catch (error) {
        console.error('Fetch building error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch building',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        await prisma.$disconnect();
      }
      break;

    case 'PUT':
      try {
        console.log('Update building request body:', req.body);

        const updateData: Prisma.BuildingUpdateInput = {
          titleEn: req.body.translations.en.title,
          titleKu: req.body.translations.ku.title,
          locationEn: req.body.translations.en.location,
          locationKu: req.body.translations.ku.location,
          overviewEn: req.body.translations.en.overview,
          overviewKu: req.body.translations.ku.overview,
          architecturalDetailsEn: req.body.translations.en.architecturalDetails,
          architecturalDetailsKu: req.body.translations.ku.architecturalDetails,
          alternateNamesEn: req.body.translations.en.alternateNames,
          alternateNamesKu: req.body.translations.ku.alternateNames,
          historicalPeriodsEn: JSON.stringify(req.body.translations.en.historicalPeriods),
          historicalPeriodsKu: JSON.stringify(req.body.translations.ku.historicalPeriods),
          latitude: req.body.coordinates.lat,
          longitude: req.body.coordinates.lng,
          period: req.body.period,
          status: req.body.status,
          images: req.body.images
        };

        const building = await prisma.building.update({
          where: { id },
          data: updateData
        });
        
        // Transform the response to match the frontend structure
        const transformedBuilding = {
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
        };
        
        res.status(200).json(transformedBuilding);
      } catch (error) {
        console.error('Update building error:', error);
        res.status(500).json({ 
          error: 'Failed to update building',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        await prisma.$disconnect();
      }
      break;

    case 'DELETE':
      try {
        await prisma.building.delete({
          where: { id }
        });
        
        res.status(204).end();
      } catch (error) {
        console.error('Delete building error:', error);
        res.status(500).json({ 
          error: 'Failed to delete building',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        await prisma.$disconnect();
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}