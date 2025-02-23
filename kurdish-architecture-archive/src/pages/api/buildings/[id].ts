import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

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
          where: { id }
        });
        
        if (!building) {
          return res.status(404).json({ error: 'Building not found' });
        }
        
        res.status(200).json(building);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch building' });
      }
      break;

    case 'PUT':
      try {
        const building = await prisma.building.update({
          where: { id },
          data: req.body
        });
        
        res.status(200).json(building);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update building' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.building.delete({
          where: { id }
        });
        
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete building' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}