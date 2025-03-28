import React from 'react';

interface Recommendation {
  metric: string;
  description: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

interface MetricRecommendationsProps {
  recommendations: Recommendation[];
}

export const MetricRecommendations: React.FC<MetricRecommendationsProps> = ({ recommendations }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {recommendations.length === 0 ? (
        <p className="text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
          Нет активных рекомендаций на данный момент.
        </p>
      ) : (
        recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{rec.metric}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(rec.impact)} bg-opacity-10`}>
                {rec.impact === 'high' ? 'Высокий приоритет' : 
                 rec.impact === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Причина: </span>{rec.reason}
            </div>
          </div>
        ))
      )}
    </div>
  );
}; 