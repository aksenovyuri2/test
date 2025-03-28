import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TestCardProps {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  questionsCount: number;
  passingScore: number;
}

export default function TestCard({
  id,
  name,
  description,
  difficulty,
  timeLimit,
  questionsCount,
  passingScore,
}: TestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/tests/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gray-900 rounded-lg shadow-xl p-6 cursor-pointer hover:bg-gray-800 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <span
            className={`${getDifficultyColor(
              difficulty
            )} px-3 py-1 rounded-full text-sm font-medium text-white`}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Время</div>
            <div className="text-white font-medium">{timeLimit} мин</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Вопросов</div>
            <div className="text-white font-medium">{questionsCount}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Проходной балл</div>
            <div className="text-white font-medium">{passingScore}%</div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 