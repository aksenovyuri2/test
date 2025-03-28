import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { testId, answers, timeSpent } = req.body;

    // Получаем тест и его вопросы
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
      },
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Проверяем ответы и подсчитываем баллы
    let score = 0;
    const maxScore = test.questions.reduce((sum, q) => sum + q.points, 0);

    for (const question of test.questions) {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    }

    // Определяем, прошел ли пользователь тест
    const passed = score >= (maxScore * test.passingScore) / 100;

    // Сохраняем результат
    const result = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testId: testId,
        score: score,
        maxScore: maxScore,
        answers: answers,
        timeSpent: timeSpent,
        passed: passed,
      },
    });

    // Обновляем прогресс пользователя
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        totalPoints: {
          increment: score,
        },
        completedTasks: {
          increment: passed ? 1 : 0,
        },
        totalTasks: {
          increment: 1,
        },
        successRate: {
          set: ((await prisma.testResult.count({
            where: {
              userId: session.user.id,
              passed: true,
            },
          })) /
            (await prisma.testResult.count({
              where: {
                userId: session.user.id,
              },
            }))) *
            100,
        },
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 