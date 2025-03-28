import React from 'react';

export interface UserStats {
  totalPoints: number;
  level: number;
  completedTasks: number;
  totalTasks: number;
  successRate: number;
  strengths: string[];
  areasToImprove: string[];
  nextLevelPoints: number;
}

interface UserProgressProps {
  stats: UserStats;
}

export const UserProgress: React.FC<UserProgressProps> = ({ stats }) => {
  const levelProgress = (stats.totalPoints / stats.nextLevelPoints) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center relative z-10">
            <span className="text-2xl font-bold text-blue-600">{stats.level}</span>
          </div>
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="8"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="8" 
              strokeDasharray="289.02"
              strokeDashoffset={289.02 - (289.02 * levelProgress) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Уровень {stats.level}</h2>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2 flex-grow max-w-xs">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">
              {stats.totalPoints} / {stats.nextLevelPoints} очков
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Выполнено заданий</div>
          <div className="text-xl font-semibold">{stats.completedTasks} / {stats.totalTasks}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Успешность</div>
          <div className="text-xl font-semibold">{stats.successRate}%</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Сильные стороны</h3>
        <ul className="space-y-1">
          {stats.strengths.map((strength, index) => (
            <li key={index} className="flex items-center text-sm">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {strength}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Области для улучшения</h3>
        <ul className="space-y-1">
          {stats.areasToImprove.map((area, index) => (
            <li key={index} className="flex items-center text-sm">
              <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {area}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 