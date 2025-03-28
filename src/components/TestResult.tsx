import React from 'react';
import { motion } from 'framer-motion';

interface TestResultProps {
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  passed: boolean;
  answers: Record<string, string>;
  correctAnswers: Record<string, string>;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    explanation: string;
  }>;
}

export default function TestResult({
  testName,
  score,
  maxScore,
  timeSpent,
  passed,
  answers,
  correctAnswers,
  questions,
}: TestResultProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-lg shadow-xl p-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{testName}</h2>
          <div className="flex justify-center items-center space-x-4">
            <div className="text-4xl font-bold text-white">
              {percentage}%
            </div>
            <div className="text-gray-400">
              {score} из {maxScore} баллов
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                passed
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {passed ? 'Тест пройден' : 'Тест не пройден'}
            </span>
          </div>
          <div className="mt-2 text-gray-400">
            Время выполнения: {formatTime(timeSpent)}
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctAnswer = correctAnswers[question.id];
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div
                key={question.id}
                className="bg-gray-800 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">
                    Вопрос {index + 1}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {isCorrect ? 'Правильно' : 'Неверно'}
                  </span>
                </div>
                <h3 className="text-xl text-white mb-4">{question.text}</h3>
                <div className="space-y-3 mb-4">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === optionIndex.toString();
                    const isCorrectAnswer = correctAnswer === optionIndex.toString();

                    return (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg ${
                          isUserAnswer
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Объяснение:</h4>
                  <p className="text-gray-300">{question.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
} 