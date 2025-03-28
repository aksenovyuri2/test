import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import TestQuestion from '@/components/tests/TestQuestion';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Пример данных теста
const testData = {
  id: '1',
  title: 'Основные метрики продукта',
  questions: [
    {
      id: '1',
      question: 'Что означает метрика DAU?',
      options: [
        'Daily Active Users',
        'Daily Average Users',
        'Daily Active Usage',
        'Daily Average Usage'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      question: 'Как рассчитывается LTV?',
      options: [
        'Сумма всех доходов от пользователя',
        'Средний доход на пользователя за период',
        'Общий доход компании',
        'Доход от одного пользователя за день'
      ],
      correctAnswer: 1
    }
  ]
};

export default function TestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === testData.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Пожалуйста, войдите для прохождения теста
          </h1>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / testData.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Результаты теста</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {percentage}%
            </div>
            <p className="text-gray-600 mb-6">
              Вы правильно ответили на {score} из {testData.questions.length} вопросов
            </p>
            <button
              onClick={() => router.push('/tests')}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Вернуться к списку тестов
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{testData.title}</h1>
            <span className="text-gray-600">
              Вопрос {currentQuestion + 1} из {testData.questions.length}
            </span>
          </div>

          <TestQuestion
            question={testData.questions[currentQuestion].question}
            options={testData.questions[currentQuestion].options}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion]}
          />
        </div>
      </div>
    </div>
  );
} 