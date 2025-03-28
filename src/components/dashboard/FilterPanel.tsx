import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FilterPanelProps {
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
}

const availableMetrics = [
  { id: 'dau', name: 'DAU' },
  { id: 'ltv', name: 'LTV' },
  { id: 'cac', name: 'CAC' },
  { id: 'roi', name: 'ROI' },
  { id: 'churn', name: 'Churn Rate' },
];

export default function FilterPanel({
  selectedMetrics,
  setSelectedMetrics,
  dateRange,
  setDateRange
}: FilterPanelProps) {
  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Метрики</h3>
          <div className="space-y-2">
            {availableMetrics.map(metric => (
              <label key={metric.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => handleMetricToggle(metric.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{metric.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Период</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-700">От</label>
              <input
                type="date"
                value={dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange({
                  ...dateRange,
                  start: e.target.value ? new Date(e.target.value) : null
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">До</label>
              <input
                type="date"
                value={dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange({
                  ...dateRange,
                  end: e.target.value ? new Date(e.target.value) : null
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => {
            setSelectedMetrics([]);
            setDateRange({ start: null, end: null });
          }}
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
} 