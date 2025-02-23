import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        search,
        period,
        region,
        status
      } = req.query;

      // Build the where clause based on search parameters
      const where: any = {};

      if (search) {
        where.OR = [
          { titleEn: { contains: search as string, mode: 'insensitive' } },
          { titleKu: { contains: search as string, mode: 'insensitive' } },
          { locationEn: { contains: search as string, mode: 'insensitive' } },
          { locationKu: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      if (period) {
        where.period = { contains: period as string, mode: 'insensitive' };
      }

      if (status) {
        where.status = { contains: status as string, mode: 'insensitive' };
      }

      if (region) {
        where.OR = [
          { locationEn: { contains: region as string, mode: 'insensitive' } },
          { locationKu: { contains: region as string, mode: 'insensitive' } }
        ];
      }

      const buildings = await prisma.building.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.status(200).json(buildings);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Failed to fetch buildings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}