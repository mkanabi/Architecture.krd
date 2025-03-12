// pages/api/building-types.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buildingTypes = await prisma.buildingType.findMany({
      orderBy: {
        nameEn: 'asc'
      },
      select: {
        id: true,
        nameEn: true,
        nameKu: true
      }
    });

    res.status(200).json({ buildingTypes });
  } catch (error) {
    console.error('Error fetching building types:', error);
    res.status(500).json({ error: 'Failed to fetch building types' });
  } finally {
    await prisma.$disconnect();
  }
}