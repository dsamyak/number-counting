import React from 'react';
import { QUESTION_TYPES } from '../../engine/questionTypes';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

export default function QuestionRenderer({ question, onAnswer, lives }) {
  const isOrderNumbers = question.type === QUESTION_TYPES.ORDER_NUMBERS;
  
  const handleOptionClick = (option) => {
    onAnswer(option);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center relative overflow-hidden"
      >
        {/* Lives & Difficulty */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <Heart 
                key={i} 
                className={`w-8 h-8 ${i <= lives ? 'fill-red-500 text-red-500' : 'fill-gray-200 text-gray-200'}`} 
              />
            ))}
          </div>
          <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider
            ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'}`}>
            {question.difficulty}
          </div>
        </div>

        {/* Visual Prompt (Placeholder for now) */}
        {question.visual && (
          <div className="w-full h-40 bg-blue-50 rounded-xl mb-6 flex items-center justify-center border-2 border-blue-100">
            <span className="text-gray-500 italic">Visual: {question.visual.type} showing {question.visual.value}</span>
          </div>
        )}

        <h2 className="text-2xl md:text-3xl font-heading text-center text-gray-800 mb-8">
          {question.prompt}
        </h2>

        {!isOrderNumbers ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="w-full py-4 text-2xl font-bold rounded-2xl border-b-4 bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200 active:border-b-0 active:translate-y-1 transition-all text-gray-700"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Simple fallback for sorting: just show as normal MCQ for now since TRD said sorting requires drag and drop but we'll do MCQ for simplicity or simple tap to select order */}
             <div className="grid grid-cols-2 gap-4 w-full">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full py-4 text-2xl font-bold rounded-2xl border-b-4 bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700"
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">Tap the smallest number (simplified sorting)</p>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
