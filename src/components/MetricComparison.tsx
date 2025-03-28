import React from 'react';

interface ComparisonData {
  metric: string;
  currentValue: number;
  previousValue: number;
  unit?: string;
  changePercentage: number;
}

interface MetricComparisonProps {
  comparisonData: ComparisonData[];
}

export const MetricComparison: React.FC<MetricComparisonProps> = ({ comparisonData }) => {
  return (
    <div className="space-y-4">
      {comparisonData.length === 0 ? (
        <p className="text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
          Нет данных для сравнения.
        </p>
      ) : (
        comparisonData.map((data, index) => {
          const isImproved = data.changePercentage > 0;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium mb-2">{data.metric}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-500">Текущее значение</p>
                  <p className="text-xl font-semibold">
                    {data.currentValue}{data.unit && <span className="text-sm ml-1">{data.unit}</span>}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Предыдущее значение</p>
                  <p className="text-xl font-semibold">
                    {data.previousValue}{data.unit && <span className="text-sm ml-1">{data.unit}</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span 
                  className={`inline-flex items-center px-2 py-1 text-sm rounded-full 
                    ${isImproved ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
                >
                  {isImproved ? '▲' : '▼'} {Math.abs(data.changePercentage)}%
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {isImproved ? 'Улучшение' : 'Ухудшение'} по сравнению с предыдущим периодом
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}; 