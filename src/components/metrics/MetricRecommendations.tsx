import React from 'react';

interface MetricRecommendation {
  metric: string;
  description: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

interface MetricRecommendationsProps {
  recommendations: MetricRecommendation[];
}

export default function MetricRecommendations({ recommendations }: MetricRecommendationsProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Рекомендации по метрикам</h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">{rec.metric}</h3>
              <span className={`text-sm font-medium ${getImpactColor(rec.impact)}`}>
                {rec.impact === 'high' ? 'Высокий приоритет' :
                 rec.impact === 'medium' ? 'Средний приоритет' :
                 'Низкий приоритет'}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{rec.description}</p>
            <p className="text-sm text-gray-500">Причина: {rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 