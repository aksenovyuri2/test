import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Navigation = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-black text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" passHref>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer ${isActive('/') ? 'text-blue-400' : 'hover:text-blue-300'}`}
            >
              Главная
            </motion.span>
          </Link>
          {session && (
            <>
              <Link href="/tests" passHref>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer ${isActive('/tests') ? 'text-blue-400' : 'hover:text-blue-300'}`}
                >
                  Тесты
                </motion.span>
              </Link>
              <Link href="/profile" passHref>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer ${isActive('/profile') ? 'text-blue-400' : 'hover:text-blue-300'}`}
                >
                  Профиль
                </motion.span>
              </Link>
            </>
          )}
        </div>
        <div>
          {session ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </motion.button>
          ) : (
            <Link href="/auth/signin" passHref>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Войти
              </motion.span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 