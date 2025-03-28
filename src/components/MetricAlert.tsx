import React from 'react';

interface Alert {
  id: string;
  metric: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: Date | string;
  isRead: boolean;
}

interface MetricAlertProps {
  alerts: Alert[];
  onMarkAsRead?: (alertId: string) => void;
}

export const MetricAlert: React.FC<MetricAlertProps> = ({ alerts, onMarkAsRead }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '⚠️';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
          Нет активных уведомлений.
        </p>
      ) : (
        alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`border-l-4 rounded-md p-4 shadow-sm relative ${
              getSeverityStyles(alert.severity)
            } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
          >
            <div className="flex items-start">
              <span className="text-xl mr-3">{getSeverityIcon(alert.severity)}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{alert.metric}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(alert.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
              </div>
            </div>
            
            {!alert.isRead && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(alert.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Отметить как прочитанное
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}; 