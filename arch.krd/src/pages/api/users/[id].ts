// src/pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, email, role } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: { name, email, role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Prevent deleting the last admin
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      const userToDelete = await prisma.user.findUnique({
        where: { id: id as string }
      });

      if (userToDelete?.role === 'ADMIN' && adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin' });
      }

      await prisma.user.delete({
        where: { id: id as string }
      });
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}