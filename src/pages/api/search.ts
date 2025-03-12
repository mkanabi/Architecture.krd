import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BuildingSearchResult {
  id: string,
  titleEn: string,
  titleKu: string,
  locationEn: string,
  locationKu: string,
  similarity: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q: query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Normalize and sanitize query
    const normalizedQuery = query.toLowerCase().trim();

    // Ensure pg_trgm extension is enabled (this should be done in your initial migration)
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;

    // Advanced fuzzy search using pg_trgm
    const buildings = await prisma.$queryRaw<BuildingSearchResult[]>`
      SELECT 
        "id", 
        "titleEn", 
        "titleKu", 
        "locationEn", 
        "locationKu",
        (
          GREATEST(
            word_similarity(${normalizedQuery}, "titleEn"),
            word_similarity(${normalizedQuery}, "titleKu"),
            word_similarity(${normalizedQuery}, "locationEn"),
            word_similarity(${normalizedQuery}, "locationKu")
          )
        ) as similarity
      FROM "Building"
      WHERE 
        word_similarity(${normalizedQuery}, "titleEn") > 0.3 OR
        word_similarity(${normalizedQuery}, "titleKu") > 0.3 OR
        word_similarity(${normalizedQuery}, "locationEn") > 0.3 OR
        word_similarity(${normalizedQuery}, "locationKu") > 0.3
      ORDER BY similarity DESC
      LIMIT 10
    `;

    // Transform buildings to search results
    const buildingResults = buildings.map(building => ({
      type: 'building' as const,
      id: building.id,
      title: {
        en: building.titleEn,
        ku: building.titleKu
      },
      location: {
        en: building.locationEn,
        ku: building.locationKu
      },
      similarity: building.similarity
    }));

    // Get unique locations with highest similarity
    const locationsMap = new Map<string, { en: string; ku: string }>();
    buildings.forEach(building => {
      const key = `${building.locationEn}-${building.locationKu}`;
      if (!locationsMap.has(key)) {
        locationsMap.set(key, {
          en: building.locationEn,
          ku: building.locationKu
        });
      }
    });

    const locationResults = Array.from(locationsMap.values()).map(location => ({
      type: 'location' as const,
      title: location
    }));

    // Combine results
    const results = [...buildingResults, ...locationResults];

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}