import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[];
  points: number;
}

interface TestProps {
  testId: string;
  name: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  onComplete: (result: any) => void;
}

export default function Test({ testId, name, description, timeLimit, questions, onComplete }: TestProps) {
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsCompleted(true);
    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId,
          answers,
          timeSpent: timeLimit * 60 - timeLeft,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке результатов');
      }

      const result = await response.json();
      onComplete(result);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
            <p className="text-gray-400">{description}</p>
          </div>
          <div className="text-xl font-mono text-white">
            {formatTime(timeLeft)}
          </div>
        </div>

        {!isCompleted ? (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">
                  Вопрос {currentQuestion + 1} из {questions.length}
                </span>
                <span className="text-gray-400">
                  {questions[currentQuestion].points} баллов
                </span>
              </div>
              <h3 className="text-xl text-white mb-4">
                {questions[currentQuestion].text}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestion].id}`}
                      value={index.toString()}
                      checked={
                        answers[questions[currentQuestion].id] === index.toString()
                      }
                      onChange={(e) =>
                        handleAnswer(questions[currentQuestion].id, e.target.value)
                      }
                      className="form-radio text-indigo-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Назад
              </button>
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Завершить тест
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Далее
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Тест завершен!
            </h3>
            <p className="text-gray-400">
              Результаты будут доступны после проверки.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 