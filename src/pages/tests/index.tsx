import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Test {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  category: string;
}

const availableTests: Test[] = [
  {
    id: '1',
    title: 'Основные метрики продукта',
    description: 'Тест на знание базовых метрик продукта: DAU, MAU, LTV, CAC',
    questionsCount: 10,
    category: 'Базовые метрики'
  },
  {
    id: '2',
    title: 'Метрики удержания',
    description: 'Тест на понимание метрик удержания пользователей',
    questionsCount: 8,
    category: 'Удержание'
  },
  {
    id: '3',
    title: 'Метрики монетизации',
    description: 'Тест на знание метрик, связанных с монетизацией продукта',
    questionsCount: 12,
    category: 'Монетизация'
  }
];

export default function Tests() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Тесты по метрикам</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map(test => (
            <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h2>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {test.questionsCount} вопросов
                </span>
                <span className="text-sm text-blue-600">{test.category}</span>
              </div>
              <Link
                href={`/tests/${test.id}`}
                className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Начать тест
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 