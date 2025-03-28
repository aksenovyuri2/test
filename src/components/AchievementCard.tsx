import React from 'react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  unlockedAt?: Date;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  progress,
  unlockedAt
}) => {
  const isUnlocked = progress === 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-blue-500'}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-sm text-gray-600">
          {isUnlocked 
            ? `Разблокировано: ${unlockedAt ? new Date(unlockedAt).toLocaleDateString() : 'Недавно'}` 
            : `Прогресс: ${progress}%`}
        </span>
      </div>
    </div>
  );
}; 