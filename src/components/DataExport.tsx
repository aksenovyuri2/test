import React, { useState } from 'react';

interface Metric {
  id: number;
  name: string;
}

interface DataExportProps {
  availableMetrics: Metric[];
}

export const DataExport: React.FC<DataExportProps> = ({ availableMetrics }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<number[]>([]);
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const handleMetricToggle = (metricId: number) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleExport = async () => {
    if (selectedMetrics.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну метрику');
      return;
    }

    if (!dateRange.start || !dateRange.end) {
      alert('Пожалуйста, выберите диапазон дат');
      return;
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: selectedMetrics,
          format,
          dateRange: {
            start: new Date(dateRange.start),
            end: new Date(dateRange.end),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при экспорте данных');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metrics-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Произошла ошибка при экспорте данных');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Экспорт данных</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Выберите метрики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {availableMetrics.map((metric) => (
              <label
                key={metric.id}
                className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => handleMetricToggle(metric.id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{metric.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Выберите формат</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={format === 'csv'}
                onChange={() => setFormat('csv')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>CSV</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={format === 'excel'}
                onChange={() => setFormat('excel')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Excel</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={format === 'json'}
                onChange={() => setFormat('json')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>JSON</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Выберите диапазон дат</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Начальная дата
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Конечная дата
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Экспортировать
        </button>
      </div>
    </div>
  );
}; 