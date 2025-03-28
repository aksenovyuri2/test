import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  trend?: number;
  period?: string;
}

export default function MetricCard({
  title,
  value,
  description,
  trend,
  period = 'год'
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold text-blue-600">{value}</span>
        {trend !== undefined && (
          <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}% за {period}
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
} 