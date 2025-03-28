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
    const tests = await prisma.test.findMany({
      include: {
        questions: true,
      },
    });

    // Форматируем тесты для клиента
    const formattedTests = tests.map((test) => ({
      ...test,
      questions: test.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options as string),
      })),
    }));

    return res.status(200).json(formattedTests);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 