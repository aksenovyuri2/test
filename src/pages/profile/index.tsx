import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AchievementCard } from '@/components/AchievementCard';
import { MetricRecommendations } from '@/components/MetricRecommendations';
import { MetricComparison } from '@/components/MetricComparison';
import { MetricAlert } from '@/components/MetricAlert';
import { DataExport } from '@/components/DataExport';

// Пример данных для тестирования
const sampleAchievements = [
  {
    id: 1,
    title: 'Первые шаги',
    description: 'Создайте свою первую метрику',
    icon: '🎯',
    progress: 100,
    isUnlocked: true,
  },
  {
    id: 2,
    title: 'Аналитик',
    description: 'Проследите 10 метрик',
    icon: '📊',
    progress: 60,
    isUnlocked: false,
  },
  // Добавьте больше достижений по необходимости
];

const sampleRecommendations = [
  {
    id: 1,
    metric: 'Конверсия',
    description: 'Рекомендуется увеличить конверсию на 5%',
    impact: 'high' as const,
  },
  {
    id: 2,
    metric: 'Время на сайте',
    description: 'Пользователи проводят меньше времени на сайте',
    impact: 'medium' as const,
  },
  // Добавьте больше рекомендаций по необходимости
];

const sampleComparison = [
  {
    id: 1,
    metric: 'Продажи',
    currentValue: 150,
    previousValue: 120,
    change: 25,
  },
  {
    id: 2,
    metric: 'Трафик',
    currentValue: 1000,
    previousValue: 800,
    change: 25,
  },
  // Добавьте больше метрик для сравнения по необходимости
];

const sampleAlerts = [
  {
    id: 1,
    metric: 'Отказы',
    message: 'Резкое увеличение отказов на 20%',
    severity: 'high' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    metric: 'Конверсия',
    message: 'Снижение конверсии на 5%',
    severity: 'medium' as const,
    timestamp: new Date().toISOString(),
  },
  // Добавьте больше уведомлений по необходимости
];

const availableMetrics = [
  { id: 1, name: 'Продажи' },
  { id: 2, name: 'Трафик' },
  { id: 3, name: 'Конверсия' },
  // Добавьте больше метрик по необходимости
];

export default function Profile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('achievements');

  if (!session) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Профиль пользователя</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded ${
            activeTab === 'achievements'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Достижения
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded ${
            activeTab === 'metrics'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Метрики
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded ${
            activeTab === 'alerts'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Уведомления
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded ${
            activeTab === 'export'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Экспорт данных
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <MetricRecommendations recommendations={sampleRecommendations} />
            <MetricComparison metrics={sampleComparison} />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {sampleAlerts.map((alert) => (
              <MetricAlert key={alert.id} alert={alert} />
            ))}
          </div>
        )}

        {activeTab === 'export' && (
          <DataExport availableMetrics={availableMetrics} />
        )}
      </div>
    </div>
  );
} 