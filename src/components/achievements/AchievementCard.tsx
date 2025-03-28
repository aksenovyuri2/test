import React from 'react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
}

export default function AchievementCard({
  title,
  description,
  icon,
  isUnlocked,
  progress
}: AchievementCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${!isUnlocked ? 'opacity-50' : ''}`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isUnlocked ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
} 