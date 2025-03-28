import React from 'react';

interface Metric {
  id: number;
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
}

interface MetricComparisonProps {
  metrics: Metric[];
}

export const MetricComparison: React.FC<MetricComparisonProps> = ({ metrics }) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Сравнение метрик</h2>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{metric.metric}</h3>
              <span className={`font-semibold ${getChangeColor(metric.change)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Текущее значение</p>
                <p className="text-lg font-medium">{metric.currentValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Предыдущее значение</p>
                <p className="text-lg font-medium">{metric.previousValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 