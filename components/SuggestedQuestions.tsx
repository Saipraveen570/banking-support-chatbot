import React from 'react';

interface SuggestedQuestionsProps {
  suggestions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ suggestions, onQuestionClick }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2 font-medium">You might also ask:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(q)}
            className="px-3 py-1.5 text-sm bg-gray-100 text-blue-700 border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
