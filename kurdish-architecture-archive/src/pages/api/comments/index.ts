import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { buildingId } = req.query;
        
        const comments = await prisma.comment.findMany({
          where: {
            buildingId: buildingId as string,
            parentId: null // Get only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
      }
      break;

    case 'POST':
      try {
        const { content, buildingId, parentId } = req.body;

        const comment = await prisma.comment.create({
          data: {
            content,
            buildingId,
            parentId,
            authorId: session.user.id
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });

        res.status(201).json(comment);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}