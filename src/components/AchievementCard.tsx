import React from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  isUnlocked: boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="text-4xl mr-4">{achievement.icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{achievement.title}</h3>
          <p className="text-gray-600">{achievement.description}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            achievement.isUnlocked ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${achievement.progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Прогресс: {achievement.progress}%
      </div>
    </div>
  );
}; 