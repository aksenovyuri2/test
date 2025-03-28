const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const hashedPassword = await hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      profile: {
        create: {
          totalPoints: 0,
          completedTasks: 0,
          totalTasks: 0,
          successRate: 0,
          level: 1,
        },
      },
    },
  });

  // Создаем категорию знаний
  const category = await prisma.knowledgeCategory.create({
    data: {
      name: 'Программирование',
      description: 'Основы программирования и разработки',
      order: 1,
    },
  });

  // Создаем тему
  const topic = await prisma.topic.create({
    data: {
      name: 'JavaScript',
      description: 'Основы JavaScript',
      content: 'JavaScript - это язык программирования, который позволяет создавать интерактивные веб-страницы...',
      order: 1,
      categoryId: category.id,
    },
  });

  // Создаем тесты
  const tests = [
    {
      name: 'Основы JavaScript',
      description: 'Тест на знание базовых концепций JavaScript',
      difficulty: 'easy',
      timeLimit: 30,
      passingScore: 70,
      topicId: topic.id,
      questions: [
        {
          text: 'Что такое JavaScript?',
          type: 'single_choice',
          options: JSON.stringify([
            'Язык программирования',
            'База данных',
            'Фреймворк',
            'Операционная система',
          ]),
          correctAnswer: '0',
          explanation: 'JavaScript - это язык программирования, который используется для создания интерактивных веб-страниц',
          points: 10,
        },
        {
          text: 'Как объявить переменную в JavaScript?',
          type: 'single_choice',
          options: JSON.stringify([
            'var x = 10',
            'let x = 10',
            'const x = 10',
            'Все вышеперечисленное',
          ]),
          correctAnswer: '3',
          explanation: 'В JavaScript есть три способа объявления переменных: var, let и const',
          points: 10,
        },
      ],
    },
    {
      name: 'Продвинутый JavaScript',
      description: 'Тест на знание продвинутых концепций JavaScript',
      difficulty: 'medium',
      timeLimit: 45,
      passingScore: 80,
      topicId: topic.id,
      questions: [
        {
          text: 'Что такое замыкание (closure) в JavaScript?',
          type: 'single_choice',
          options: JSON.stringify([
            'Функция внутри функции',
            'Объект с методами',
            'Массив функций',
            'Ничего из перечисленного',
          ]),
          correctAnswer: '0',
          explanation: 'Замыкание - это функция, которая имеет доступ к переменным из внешней области видимости',
          points: 15,
        },
        {
          text: 'Как работает Promise в JavaScript?',
          type: 'single_choice',
          options: JSON.stringify([
            'Синхронно',
            'Асинхронно',
            'И то, и другое',
            'Никак',
          ]),
          correctAnswer: '1',
          explanation: 'Promise - это объект, представляющий асинхронную операцию',
          points: 15,
        },
      ],
    },
  ];

  for (const test of tests) {
    const { questions, ...testData } = test;
    const createdTest = await prisma.test.create({
      data: testData,
    });

    for (const question of questions) {
      await prisma.question.create({
        data: {
          ...question,
          testId: createdTest.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 