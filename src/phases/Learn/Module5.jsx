import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Module5({ onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [error, setError] = useState(false);

  // 3 rounds: count by 2s, 5s, 10s
  const rounds = [
    { step: 2, seq: [2, 4, null, 8, 10], correct: 6, options: [3, 5, 6, 7] },
    { step: 5, seq: [5, 10, 15, null, 25], correct: 20, options: [16, 20, 22, 30] },
    { step: 10, seq: [10, 20, 30, 40, null], correct: 50, options: [45, 50, 60, 100] }
  ];

  if (currentRound >= rounds.length) {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-2xl border-4 border-blue-100">
        <p className="text-2xl text-green-500 font-bold mb-4">You completed all patterns!</p>
        <button 
          onClick={onComplete}
          className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg text-xl transition hover:scale-105"
        >
          Finish Module
        </button>
      </motion.div>
    );
  }

  const round = rounds[currentRound];

  const handleSelect = (opt) => {
    if (opt === round.correct) {
      setError(false);
      setTimeout(() => setCurrentRound(r => r + 1), 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-3xl border-4 border-blue-100">
      <h2 className="text-4xl font-heading text-primary mb-2 text-center">Number Patterns</h2>
      <p className="text-gray-600 mb-8 text-center text-lg">Skip counting by {round.step}s! Find the missing number.</p>
      
      {/* Sequence Display */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {round.seq.map((num, i) => (
          <div 
            key={i} 
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full text-2xl sm:text-3xl font-bold shadow-md
              ${num === null ? 'bg-gray-100 border-4 border-dashed border-gray-300' : 'bg-blue-100 text-blue-800'}`}
          >
            {num !== null ? num : '?'}
          </div>
        ))}
      </div>

      {/* Options */}
      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {round.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400 text-yellow-900 font-bold text-2xl sm:text-3xl shadow hover:bg-yellow-500 transition-colors"
          >
            {opt}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
