import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const hashedPassword = await hash('test123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Создаем тестовые метрики
  const metrics = await Promise.all([
    prisma.metric.create({
      data: {
        name: 'DAU',
        description: 'Daily Active Users - количество активных пользователей за день',
        formula: 'Количество уникальных пользователей за день',
        category: 'Активность',
      },
    }),
    prisma.metric.create({
      data: {
        name: 'LTV',
        description: 'Life Time Value - средний доход от пользователя за все время',
        formula: 'Общий доход / Количество пользователей',
        category: 'Монетизация',
      },
    }),
    prisma.metric.create({
      data: {
        name: 'CAC',
        description: 'Customer Acquisition Cost - стоимость привлечения одного пользователя',
        formula: 'Затраты на маркетинг / Количество новых пользователей',
        category: 'Маркетинг',
      },
    }),
  ]);

  // Создаем тестовые данные для метрик
  const now = new Date();
  for (const metric of metrics) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      await prisma.metricData.create({
        data: {
          metricId: metric.id,
          value: Math.random() * 1000,
          date: date,
          metadata: {
            source: 'test',
            confidence: 0.95,
          },
        },
      });
    }
  }

  // Создаем тестовый тест
  const test = await prisma.test.create({
    data: {
      title: 'Основные метрики продукта',
      description: 'Тест на знание базовых метрик продукта',
      questions: {
        create: [
          {
            metricId: metrics[0].id,
            question: 'Что означает метрика DAU?',
            options: [
              'Daily Active Users',
              'Daily Average Users',
              'Daily Active Usage',
              'Daily Average Usage'
            ],
            correctAnswer: 0,
          },
          {
            metricId: metrics[1].id,
            question: 'Как рассчитывается LTV?',
            options: [
              'Сумма всех доходов от пользователя',
              'Средний доход на пользователя за период',
              'Общий доход компании',
              'Доход от одного пользователя за день'
            ],
            correctAnswer: 1,
          },
        ],
      },
    },
  });

  console.log('Тестовые данные успешно созданы');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 