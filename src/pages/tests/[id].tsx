import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Test from '@/components/Test';
import TestResult from '@/components/TestResult';

export default function TestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const [test, setTest] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (id) {
      fetchTest();
    }
  }, [id, session]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${id}`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке теста');
      }
      const data = await response.json();
      setTest(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = (testResult: any) => {
    setResult(testResult);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Тест не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      {result ? (
        <TestResult
          testId={test.id}
          testName={test.name}
          score={result.score}
          maxScore={result.maxScore}
          timeSpent={result.timeSpent}
          passed={result.passed}
          answers={result.answers}
          correctAnswers={test.questions.reduce(
            (acc: any, q: any) => ({ ...acc, [q.id]: q.correctAnswer }),
            {}
          )}
          questions={test.questions}
        />
      ) : (
        <Test
          testId={test.id}
          name={test.name}
          description={test.description}
          timeLimit={test.timeLimit}
          questions={test.questions}
          onComplete={handleTestComplete}
        />
      )}
    </div>
  );
} 