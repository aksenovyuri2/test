import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Product Metrics
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Дашборды
            </Link>
            <Link href="/metrics" className="text-gray-600 hover:text-blue-600">
              Метрики
            </Link>
            <Link href="/tests" className="text-gray-600 hover:text-blue-600">
              Тесты
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 