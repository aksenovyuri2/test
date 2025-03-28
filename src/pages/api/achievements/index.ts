import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const userAchievements = await prisma.userAchievement.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            achievement: true,
          },
        });

        return res.status(200).json(userAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        return res.status(500).json({ error: 'Ошибка при получении достижений' });
      }

    case 'POST':
      try {
        const { achievementId } = req.body;

        const userAchievement = await prisma.userAchievement.create({
          data: {
            userId: session.user.id,
            achievementId,
            unlockedAt: new Date(),
          },
        });

        return res.status(201).json(userAchievement);
      } catch (error) {
        console.error('Error creating achievement:', error);
        return res.status(500).json({ error: 'Ошибка при создании достижения' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 