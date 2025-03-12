// pages/api/regions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const regions = await prisma.region.findMany({
      orderBy: {
        nameEn: 'asc'
      },
      select: {
        id: true,
        nameEn: true,
        nameKu: true
      }
    });

    res.status(200).json({ regions });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  } finally {
    await prisma.$disconnect();
  }
}