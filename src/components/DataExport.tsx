import React, { useState } from 'react';

interface MetricOption {
  id: string;
  name: string;
  category?: string;
}

interface DataExportProps {
  availableMetrics: MetricOption[];
  onExport?: (
    selectedMetrics: string[], 
    format: 'csv' | 'excel' | 'json', 
    dateRange: { from: string, to: string }
  ) => void;
}

export const DataExport: React.FC<DataExportProps> = ({ availableMetrics, onExport }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [isLoading, setIsLoading] = useState(false);

  const handleMetricChange = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMetrics.length === availableMetrics.length) {
      setSelectedMetrics([]);
    } else {
      setSelectedMetrics(availableMetrics.map(metric => metric.id));
    }
  };

  const handleExport = async () => {
    if (!onExport || selectedMetrics.length === 0) return;
    
    setIsLoading(true);
    try {
      await onExport(
        selectedMetrics, 
        format, 
        { from: dateFrom, to: dateTo }
      );
    } catch (error) {
      console.error('Error exporting data', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group metrics by category
  const metricsByCategory = availableMetrics.reduce((acc, metric) => {
    const category = metric.category || 'Общее';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, MetricOption[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Выберите формат экспорта
        </label>
        <div className="flex space-x-4">
          {(['csv', 'excel', 'json'] as const).map((f) => (
            <label key={f} className="inline-flex items-center">
              <input
                type="radio"
                value={f}
                checked={format === f}
                onChange={() => setFormat(f)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{f.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Период
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">От</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">До</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Выберите метрики
          </label>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {selectedMetrics.length === availableMetrics.length 
              ? 'Отменить выбор всех' 
              : 'Выбрать все'}
          </button>
        </div>
        
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md divide-y">
          {Object.entries(metricsByCategory).map(([category, metrics]) => (
            <div key={category} className="p-3">
              <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
              <div className="space-y-2">
                {metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`metric-${metric.id}`}
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={() => handleMetricChange(metric.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor={`metric-${metric.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {metric.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={selectedMetrics.length === 0 || isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${selectedMetrics.length === 0 || isLoading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Экспорт...' : 'Экспортировать данные'}
      </button>
    </div>
  );
}; 