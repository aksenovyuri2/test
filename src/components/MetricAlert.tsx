import React from 'react';

interface Alert {
  id: number;
  metric: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface MetricAlertProps {
  alert: Alert;
}

export const MetricAlert: React.FC<MetricAlertProps> = ({ alert }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Высокий приоритет';
      case 'medium':
        return 'Средний приоритет';
      case 'low':
        return 'Низкий приоритет';
      default:
        return 'Неизвестный приоритет';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-2">{alert.metric}</h3>
          <span className="text-sm font-medium">
            {getSeverityText(alert.severity)}
          </span>
        </div>
        <span className="text-sm text-gray-600">
          {new Date(alert.timestamp).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700">{alert.message}</p>
    </div>
  );
}; 