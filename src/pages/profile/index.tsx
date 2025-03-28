import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { AchievementCard } from '@/components/AchievementCard';
import { MetricRecommendations } from '@/components/MetricRecommendations';
import { MetricComparison } from '@/components/MetricComparison';
import { MetricAlert } from '@/components/MetricAlert';
import { DataExport } from '@/components/DataExport';
import { UserTasks, Task } from '@/components/UserTasks';
import { UserProgress, UserStats } from '@/components/UserProgress';

// Пример данных для демонстрации компонентов
const sampleAchievements = [
  {
    id: '1',
    title: 'Первые 10 метрик',
    description: 'Добавьте 10 метрик в систему',
    icon: '📊',
    progress: 100,
    unlockedAt: new Date('2023-10-15')
  },
  {
    id: '2',
    title: 'Аналитик',
    description: 'Просмотрите 30 отчетов',
    icon: '📈',
    progress: 65,
  },
  {
    id: '3',
    title: 'Эксперт',
    description: 'Используйте все функции платформы',
    icon: '🔍',
    progress: 35,
  },
];

const sampleUserStats: UserStats = {
  totalPoints: 450,
  level: 3,
  completedTasks: 8,
  totalTasks: 15,
  successRate: 85,
  strengths: [
    'Аналитика данных',
    'Работа с метриками',
    'Визуализация информации'
  ],
  areasToImprove: [
    'Прогнозирование трендов',
    'Интеграция с внешними источниками'
  ],
  nextLevelPoints: 800
};

const sampleTasks: Task[] = [
  {
    id: 't1',
    title: 'Настройка основных метрик',
    description: 'Создайте и настройте 5 основных метрик для мониторинга эффективности вашего проекта.',
    complexity: 'easy',
    points: 50,
    status: 'completed',
    completedAt: new Date('2023-10-10'),
    steps: [
      { id: 's1', description: 'Определить ключевые метрики', isCompleted: true },
      { id: 's2', description: 'Создать 5 метрик в системе', isCompleted: true },
      { id: 's3', description: 'Настроить пороговые значения', isCompleted: true }
    ]
  },
  {
    id: 't2',
    title: 'Анализ трендов',
    description: 'Проведите анализ трендов на основе собранных метрик за последний месяц и подготовьте отчет.',
    complexity: 'medium',
    points: 100,
    status: 'in_progress',
    dueDate: new Date('2023-12-15'),
    steps: [
      { id: 's1', description: 'Собрать данные за последний месяц', isCompleted: true },
      { id: 's2', description: 'Выявить ключевые тренды', isCompleted: true },
      { id: 's3', description: 'Подготовить визуализацию данных', isCompleted: false },
      { id: 's4', description: 'Составить отчет с рекомендациями', isCompleted: false }
    ]
  },
  {
    id: 't3',
    title: 'Создание интерактивной панели мониторинга',
    description: 'Разработайте интерактивную панель мониторинга для визуализации ключевых метрик в реальном времени.',
    complexity: 'hard',
    points: 200,
    status: 'pending',
    dueDate: new Date('2023-12-30'),
    steps: [
      { id: 's1', description: 'Спроектировать макет панели', isCompleted: false },
      { id: 's2', description: 'Реализовать визуализацию в реальном времени', isCompleted: false },
      { id: 's3', description: 'Добавить интерактивные элементы', isCompleted: false },
      { id: 's4', description: 'Провести тестирование', isCompleted: false },
      { id: 's5', description: 'Внедрить панель в основной интерфейс', isCompleted: false }
    ]
  }
];

const sampleRecommendations = [
  {
    metric: 'Конверсия',
    description: 'Рекомендуется оптимизировать посадочные страницы для повышения конверсии',
    reason: 'Показатель снизился на 5% за последний месяц',
    impact: 'high' as const,
  },
  {
    metric: 'Средний чек',
    description: 'Внедрите больше предложений по допродажам',
    reason: 'Потенциал роста среднего чека на 15%',
    impact: 'medium' as const,
  },
];

const sampleComparisonData = [
  {
    metric: 'Посещаемость сайта',
    currentValue: 15420,
    previousValue: 12340,
    changePercentage: 25,
    unit: 'посетителей'
  },
  {
    metric: 'Коэффициент отказов',
    currentValue: 35.2,
    previousValue: 42.7,
    changePercentage: -17.5,
    unit: '%'
  },
];

const sampleAlerts = [
  {
    id: '1',
    metric: 'Конверсия',
    message: 'Резкое падение конверсии на 15% за последние 24 часа',
    severity: 'critical' as const,
    timestamp: new Date('2023-11-05T14:30:00'),
    isRead: false
  },
  {
    id: '2',
    metric: 'Трафик',
    message: 'Необычное увеличение трафика на 40%',
    severity: 'warning' as const,
    timestamp: new Date('2023-11-04T09:15:00'),
    isRead: true
  },
  {
    id: '3',
    metric: 'API',
    message: 'Обновление API запланировано на следующую неделю',
    severity: 'info' as const,
    timestamp: new Date('2023-11-03T16:45:00'),
    isRead: false
  },
];

const sampleExportMetrics = [
  { id: '1', name: 'Посещаемость', category: 'Трафик' },
  { id: '2', name: 'Уникальные посетители', category: 'Трафик' },
  { id: '3', name: 'Коэффициент отказов', category: 'Вовлеченность' },
  { id: '4', name: 'Среднее время на сайте', category: 'Вовлеченность' },
  { id: '5', name: 'Конверсия', category: 'Продажи' },
  { id: '6', name: 'Средний чек', category: 'Продажи' },
];

interface Profile {
  totalPoints: number;
  level: number;
  completedTasks: number;
  successRate: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'achievements' | 'metrics' | 'alerts' | 'export'>('dashboard');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  // Функции для работы с заданиями
  const handleStartTask = (taskId: string) => {
    console.log(`Начало задания ${taskId}`);
    // В реальном приложении здесь был бы API-запрос для изменения статуса задания
  };

  const handleCompleteTask = (taskId: string) => {
    console.log(`Завершение задания ${taskId}`);
    // В реальном приложении здесь был бы API-запрос для отметки задания как выполненного
  };

  const handleCompleteStep = (taskId: string, stepId: string) => {
    console.log(`Выполнение шага ${stepId} задания ${taskId}`);
    // В реальном приложении здесь был бы API-запрос для отметки шага как выполненного
  };

  const handleMarkAlertAsRead = (alertId: string) => {
    console.log(`Marking alert ${alertId} as read`);
    // Здесь будет вызов API для обновления статуса уведомления
  };

  const handleExportData = (
    selectedMetrics: string[], 
    format: 'csv' | 'excel' | 'json', 
    dateRange: { from: string, to: string }
  ) => {
    console.log('Exporting data:', { selectedMetrics, format, dateRange });
    // Здесь будет вызов API для экспорта данных
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{session.user?.name || 'Пользователь'}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>

          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-lg p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Уровень</h3>
                <p className="text-3xl font-bold text-blue-600">{profile.level}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 rounded-lg p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Очки</h3>
                <p className="text-3xl font-bold text-green-600">{profile.totalPoints}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 rounded-lg p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Завершено тестов</h3>
                <p className="text-3xl font-bold text-yellow-600">{profile.completedTasks}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-purple-50 rounded-lg p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Успешность</h3>
                <p className="text-3xl font-bold text-purple-600">{profile.successRate}%</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
} 