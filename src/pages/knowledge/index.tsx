import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface KnowledgeBaseProps {
  categories: KnowledgeCategory[];
}

export default function KnowledgeBase({ categories }: KnowledgeBaseProps) {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Необходимо войти в систему</h1>
          <p className="mt-2">Пожалуйста, войдите в систему для доступа к базе знаний</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8">База знаний по продуктовому маркетингу</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar с категориями */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Категории</h2>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Основной контент */}
            <div className="lg:col-span-3">
              <div className="grid gap-6">
                {categories
                  .filter(cat => !selectedCategory || cat.id === selectedCategory)
                  .map((category) => (
                    <motion.div
                      key={category.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden"
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                    >
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
                        <p className="text-gray-600 mb-6">{category.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.topics.map((topic) => (
                            <Link
                              key={topic.id}
                              href={`/knowledge/topics/${topic.id}`}
                              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                            >
                              <h3 className="font-medium mb-2">{topic.name}</h3>
                              <p className="text-sm text-gray-600">{topic.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await prisma.knowledgeCategory.findMany({
    include: {
      topics: {
        select: {
          id: true,
          name: true,
          description: true,
          order: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories))
    }
  };
}; 