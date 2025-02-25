import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const building = await prisma.building.findUnique({
        where: { id },
        include: {
          era: true,
          region: true,
          buildingType: true,
          materials: {
            include: {
              material: true
            }
          },
          images: true,
          sources: true
        }
      });
      
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }

      // Log images to debug
      console.log('Building Images:', building.images);

      // Transform the building to match the new type
      const transformedBuilding = {
        ...building,
        translations: {
          en: {
            title: building.titleEn,
            alternateNames: building.alternateNamesEn,
            location: building.locationEn,
            overview: building.overviewEn,
            architecturalDetails: building.architecturalDetailsEn,
            architectName: building.architectEn,
          },
          ku: {
            title: building.titleKu,
            alternateNames: building.alternateNamesKu,
            location: building.locationKu,
            overview: building.overviewKu,
            architecturalDetails: building.architecturalDetailsKu,
            architectName: building.architectKu,
          }
        },
        coordinates: {
          lat: building.latitude,
          lng: building.longitude
        },
        period: building.era?.nameEn || '',
        materials: building.materials.map(m => m.material),
        images: building.images.map(img => img.url), // Direct URL extraction
        sources: building.sources
      };

      res.status(200).json(transformedBuilding);
    } catch (error) {
      console.error('Error fetching building:', error);
      res.status(500).json({ error: 'Failed to fetch building', details: error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}