import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const testId = req.query.id as string;

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
      },
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Проверяем, не проходил ли пользователь этот тест ранее
    const existingResult = await prisma.testResult.findFirst({
      where: {
        userId: session.user.id,
        testId: testId,
      },
    });

    if (existingResult) {
      return res.status(400).json({ message: 'Test already completed' });
    }

    // Форматируем вопросы для клиента
    const formattedTest = {
      ...test,
      questions: test.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options as string),
      })),
    };

    return res.status(200).json(formattedTest);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 