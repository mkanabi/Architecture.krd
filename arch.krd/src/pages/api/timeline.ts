// pages/api/timeline.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse pagination params from request
    const { page = '1', limit = '9', eraId } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Build where clause for filtering
    const buildingWhere: any = {};
    if (eraId) {
      buildingWhere.eraId = eraId as string;
    }

    // Fetch all eras (this is a relatively small dataset)
    const eras = await prisma.era.findMany({
      orderBy: {
        startYear: 'asc'
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.building.count({
      where: buildingWhere
    });

    // Fetch paginated buildings
    const buildings = await prisma.building.findMany({
      where: buildingWhere,
      include: {
        era: true,
        images: true
      },
      take: pageSize,
      skip,
      orderBy: [
        { constructionYear: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Transform buildings to match the expected format
    const transformedBuildings = buildings.map(building => ({
      id: building.id,
      eraId: building.eraId,
      constructionYear: building.constructionYear,
      translations: {
        en: {
          title: building.titleEn,
          location: building.locationEn
        },
        ku: {
          title: building.titleKu,
          location: building.locationKu
        }
      },
      images: building.images.map(img => img.url),
      period: building.era?.nameEn || ''
    }));

    // Return data with pagination info
    res.status(200).json({
      buildings: transformedBuildings,
      eras: eras,
      pagination: {
        page: pageNumber,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    res.status(500).json({ error: 'Failed to fetch timeline data' });
  } finally {
    await prisma.$disconnect();
  }
}