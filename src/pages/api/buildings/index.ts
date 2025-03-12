import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      search, 
      page = '1', 
      limit = '6' 
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Build where clause for search
    const where: any = {};
    if (search) {
      where.OR = [
        { titleEn: { contains: search as string, mode: 'insensitive' } },
        { titleKu: { contains: search as string, mode: 'insensitive' } },
        { locationEn: { contains: search as string, mode: 'insensitive' } },
        { locationKu: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Fetch buildings
    const buildings = await prisma.building.findMany({
      where,
      include: {
        images: true
      },
      take: pageSize,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform buildings to match the type
    const transformedBuildings = buildings.map(building => ({
      ...building,
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

    res.status(200).json({
      buildings: transformedBuildings
    });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  } finally {
    await prisma.$disconnect();
  }
}