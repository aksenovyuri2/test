import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Получаем метрики за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const metrics = await prisma.metricData.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        metric: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Анализируем тренды и генерируем рекомендации
    const recommendations = await analyzeMetrics(metrics);

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: 'Ошибка при генерации рекомендаций' });
  }
}

async function analyzeMetrics(metrics: any[]) {
  const recommendations = [];
  const metricGroups = groupMetricsByType(metrics);

  for (const [metricType, data] of Object.entries(metricGroups)) {
    const trend = calculateTrend(data);
    const recommendation = generateRecommendation(metricType, trend);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  }

  return recommendations;
}

function groupMetricsByType(metrics: any[]) {
  return metrics.reduce((acc, metric) => {
    const type = metric.metric.category;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(metric);
    return acc;
  }, {});
}

function calculateTrend(data: any[]) {
  if (data.length < 2) return 0;

  const firstValue = data[data.length - 1].value;
  const lastValue = data[0].value;
  return ((lastValue - firstValue) / firstValue) * 100;
}

function generateRecommendation(metricType: string, trend: number) {
  let impact: 'high' | 'medium' | 'low';
  let description: string;
  let reason: string;

  if (trend < -10) {
    impact = 'high';
    description = `Критическое снижение ${metricType}`;
    reason = `Снижение на ${Math.abs(trend).toFixed(1)}% за последний период`;
  } else if (trend < -5) {
    impact = 'medium';
    description = `Снижение ${metricType}`;
    reason = `Снижение на ${Math.abs(trend).toFixed(1)}% за последний период`;
  } else if (trend > 10) {
    impact = 'low';
    description = `Значительный рост ${metricType}`;
    reason = `Рост на ${trend.toFixed(1)}% за последний период`;
  } else {
    return null;
  }

  return {
    metric: metricType,
    description,
    reason,
    impact,
  };
} 