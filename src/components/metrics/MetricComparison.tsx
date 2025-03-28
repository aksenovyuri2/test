import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricComparisonProps {
  metrics: {
    name: string;
    currentValue: number;
    previousValue: number;
    change: number;
  }[];
}

export default function MetricComparison({ metrics }: MetricComparisonProps) {
  const chartData = {
    labels: metrics.map(m => m.name),
    datasets: [
      {
        label: 'Текущий период',
        data: metrics.map(m => m.currentValue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Предыдущий период',
        data: metrics.map(m => m.previousValue),
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Сравнение метрик',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Сравнение метрик</h2>
      
      <div className="mb-6">
        <Bar options={chartOptions} data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{metric.name}</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{metric.currentValue}</p>
                <p className="text-sm text-gray-500">Текущее значение</p>
              </div>
              <div className={`text-sm font-medium ${
                metric.change > 0 ? 'text-green-600' :
                metric.change < 0 ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 