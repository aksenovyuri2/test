import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface MetricAlert {
  id: string;
  metric: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface MetricAlertProps {
  alerts: MetricAlert[];
}

export default function MetricAlert({ alerts }: MetricAlertProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <BellIcon className="h-6 w-6 text-gray-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Уведомления по метрикам</h2>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{alert.metric}</h3>
                <p className="text-sm">{alert.message}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 