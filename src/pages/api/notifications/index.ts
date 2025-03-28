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
        const alerts = await prisma.metricAlert.findMany({
          where: {
            userId: session.user.id,
            isRead: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        });

        return res.status(200).json(alerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        return res.status(500).json({ error: 'Ошибка при получении уведомлений' });
      }

    case 'POST':
      try {
        const { metricId, message, severity } = req.body;

        const alert = await prisma.metricAlert.create({
          data: {
            userId: session.user.id,
            metricId,
            message,
            severity,
            isRead: false,
          },
        });

        return res.status(201).json(alert);
      } catch (error) {
        console.error('Error creating alert:', error);
        return res.status(500).json({ error: 'Ошибка при создании уведомления' });
      }

    case 'PUT':
      try {
        const { alertId } = req.body;

        const alert = await prisma.metricAlert.update({
          where: {
            id: alertId,
          },
          data: {
            isRead: true,
          },
        });

        return res.status(200).json(alert);
      } catch (error) {
        console.error('Error updating alert:', error);
        return res.status(500).json({ error: 'Ошибка при обновлении уведомления' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 