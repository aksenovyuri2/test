import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text';
  options: string[];
  points: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
}

interface Topic {
  id: string;
  name: string;
  description: string;
  content: string;
  tests: Test[];
}

interface TopicPageProps {
  topic: Topic;
}

export default function TopicPage({ topic }: TopicPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const startTest = (testId: string) => {
    const test = topic.tests.find(t => t.id === testId);
    if (test) {
      setSelectedTest(testId);
      setShowTest(true);
      setTimeLeft(test.timeLimit * 60);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTestCompleted(false);
    }
  };

  const handleAnswer = (questionId: string, selectedAnswers: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const submitTest = async () => {
    if (!selectedTest || !session) return;

    const test = topic.tests.find(t => t.id === selectedTest);
    if (!test) return;

    const score = Object.entries(answers).reduce((total, [questionId, userAnswers]) => {
      const question = test.questions.find(q => q.id === questionId);
      if (!question) return total;

      const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correctAnswer.split(',').sort());
      return total + (isCorrect ? question.points : 0);
    }, 0);

    const maxScore = test.questions.reduce((total, q) => total + q.points, 0);
    const passed = (score / maxScore) * 100 >= test.passingScore;

    try {
      await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: selectedTest,
          answers,
          score,
          maxScore,
          timeSpent: test.timeLimit * 60 - (timeLeft || 0),
          passed
        }),
      });

      setTestCompleted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Необходимо войти в систему</h1>
          <p className="mt-2">Пожалуйста, войдите в систему для доступа к материалам</p>
        </div>
      </div>
    );
  }

  const currentTest = selectedTest ? topic.tests.find(t => t.id === selectedTest) : null;
  const currentQuestion = currentTest?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Link
              href="/knowledge"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Назад к базе знаний
            </Link>
            <h1 className="text-3xl font-bold">{topic.name}</h1>
            <p className="text-gray-600 mt-2">{topic.description}</p>
          </div>

          {!showTest ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Контент темы */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: topic.content }} />
                </div>
              </div>

              {/* Список тестов */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Доступные тесты</h2>
                  <div className="space-y-4">
                    {topic.tests.map((test) => (
                      <div
                        key={test.id}
                        className="border rounded-lg p-4"
                      >
                        <h3 className="font-medium mb-2">{test.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            {test.timeLimit} мин • {test.questions.length} вопросов
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.difficulty === 'easy' ? 'Легкий' :
                             test.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                          </span>
                        </div>
                        <button
                          onClick={() => startTest(test.id)}
                          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Начать тест
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {testCompleted ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <h2 className="text-2xl font-semibold mb-4">Тест завершен!</h2>
                  <p className="mb-6">Результаты теста будут доступны в вашем профиле</p>
                  <button
                    onClick={() => setShowTest(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Вернуться к материалам
                  </button>
                </div>
              ) : currentQuestion ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Вопрос {currentQuestionIndex + 1} из {currentTest?.questions.length}
                    </h2>
                    {timeLeft !== null && (
                      <div className="text-gray-600">
                        Осталось времени: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-lg mb-4">{currentQuestion.text}</p>
                    {currentQuestion.type !== 'text' && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type={currentQuestion.type === 'single_choice' ? 'radio' : 'checkbox'}
                              name={`question-${currentQuestion.id}`}
                              value={index.toString()}
                              checked={(answers[currentQuestion.id] || []).includes(index.toString())}
                              onChange={(e) => {
                                if (currentQuestion.type === 'single_choice') {
                                  handleAnswer(currentQuestion.id, [e.target.value]);
                                } else {
                                  const newAnswers = e.target.checked
                                    ? [...(answers[currentQuestion.id] || []), e.target.value]
                                    : (answers[currentQuestion.id] || []).filter(a => a !== e.target.value);
                                  handleAnswer(currentQuestion.id, newAnswers);
                                }
                              }}
                              className="mr-3"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>
                    {currentQuestionIndex === currentTest.questions.length - 1 ? (
                      <button
                        onClick={submitTest}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Завершить тест
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Далее
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const topicId = params?.id as string;

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      tests: {
        include: {
          questions: {
            select: {
              id: true,
              text: true,
              type: true,
              options: true,
              points: true
            }
          }
        }
      }
    }
  });

  if (!topic) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      topic: JSON.parse(JSON.stringify(topic))
    }
  };
}; 