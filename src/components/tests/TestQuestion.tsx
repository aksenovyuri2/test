import React from 'react';

interface TestQuestionProps {
  question: string;
  options: string[];
  onAnswer: (answerIndex: number) => void;
  currentAnswer?: number;
}

export default function TestQuestion({
  question,
  options,
  onAnswer,
  currentAnswer
}: TestQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={`w-full text-left p-4 rounded-md transition-colors ${
              currentAnswer === index
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
} 