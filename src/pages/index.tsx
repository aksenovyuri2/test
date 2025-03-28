import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Изучайте продукт-маркетинговые метрики
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Интерактивная платформа для изучения и практики метрик продукт-маркетинга
          </p>
          {!session ? (
            <Link
              href="/auth/signin"
              className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-600"
            >
              Начать обучение
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-600"
            >
              Перейти к дашбордам
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Интерактивные дашборды</h2>
            <p className="text-gray-600">
              Изучайте метрики на реальных данных с помощью интерактивных дашбордов
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Практические тесты</h2>
            <p className="text-gray-600">
              Проверяйте свои знания с помощью интерактивных тестов
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Фильтрация данных</h2>
            <p className="text-gray-600">
              Настраивайте сложные фильтры для глубокого анализа метрик
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 