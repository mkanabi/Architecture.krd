import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q: query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search buildings
    const buildings = await prisma.building.findMany({
      where: {
        OR: [
          { titleEn: { contains: query, mode: 'insensitive' } },
          { titleKu: { contains: query, mode: 'insensitive' } },
          { locationEn: { contains: query, mode: 'insensitive' } },
          { locationKu: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        titleEn: true,
        titleKu: true,
        locationEn: true,
        locationKu: true
      }
    });

    // Transform buildings to search results
    const buildingResults = buildings.map(building => ({
      type: 'building' as const,
      id: building.id,
      title: {
        en: building.titleEn,
        ku: building.titleKu
      }
    }));

    // Get unique locations
    const locations = [...new Set(buildings.map(b => ({
      en: b.locationEn,
      ku: b.locationKu
    })))];

    const locationResults = locations.map(location => ({
      type: 'location' as const,
      title: location
    }));

    // Combine and sort results
    const results = [...buildingResults, ...locationResults];

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}