import React, { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  complexity: 'easy' | 'medium' | 'hard';
  points: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dueDate?: Date;
  completedAt?: Date;
  steps?: TaskStep[];
}

interface TaskStep {
  id: string;
  description: string;
  isCompleted: boolean;
}

interface UserTasksProps {
  tasks: Task[];
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onCompleteStep: (taskId: string, stepId: string) => void;
}

export const UserTasks: React.FC<UserTasksProps> = ({
  tasks,
  onStartTask,
  onCompleteTask,
  onCompleteStep
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };
  
  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Ожидает</span>;
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">В процессе</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Выполнено</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Не выполнено</span>;
      default:
        return null;
    }
  };
  
  const getComplexityBadge = (complexity: Task['complexity']) => {
    switch (complexity) {
      case 'easy':
        return <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Простое</span>;
      case 'medium':
        return <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Среднее</span>;
      case 'hard':
        return <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Сложное</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
          Нет доступных заданий на данный момент.
        </p>
      ) : (
        tasks.map((task) => (
          <div 
            key={task.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            {/* Заголовок задания */}
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleExpand(task.id)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  {getStatusBadge(task.status)}
                </div>
                <div className="flex space-x-3 text-sm text-gray-500">
                  <div>{getComplexityBadge(task.complexity)}</div>
                  <div>{task.points} баллов</div>
                  {task.dueDate && (
                    <div>
                      Срок: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-400">
                {expandedTaskId === task.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Детали задания */}
            {expandedTaskId === task.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700 mb-4">{task.description}</p>
                
                {task.steps && task.steps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Этапы задания:</h4>
                    <ul className="space-y-2">
                      {task.steps.map((step) => (
                        <li key={step.id} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={step.isCompleted}
                            onChange={() => task.status === 'in_progress' && onCompleteStep(task.id, step.id)}
                            disabled={task.status !== 'in_progress'}
                            className="mt-1 h-4 w-4 text-blue-600 rounded"
                          />
                          <span className={`ml-2 ${step.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {step.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => onStartTask(task.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Начать задание
                    </button>
                  )}
                  
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className={`bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${
                        task.steps && !task.steps.every(step => step.isCompleted) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={task.steps && !task.steps.every(step => step.isCompleted)}
                    >
                      Завершить задание
                    </button>
                  )}
                  
                  {task.status === 'completed' && task.completedAt && (
                    <div className="text-sm text-gray-500">
                      Выполнено: {new Date(task.completedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}; 