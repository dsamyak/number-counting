import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Module3({ onComplete }) {
  const [revealed, setRevealed] = useState(40);
  const [skipMode, setSkipMode] = useState(false);

  const handleCellClick = (num) => {
    if (num === revealed + 1) {
      setRevealed(num);
    }
  };

  const handleRevealAll = () => {
    setRevealed(100);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-4xl border-4 border-blue-100">
      <h2 className="text-3xl md:text-4xl font-heading text-primary mb-2 text-center">Numbers 41 to 100</h2>
      <p className="text-gray-600 mb-4 text-center text-lg">Tap the next number or reveal them all!</p>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleRevealAll}
          disabled={revealed === 100}
          className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow hover:bg-blue-600 disabled:opacity-50 transition"
        >
          Reveal All
        </button>
        <button 
          onClick={() => setSkipMode(!skipMode)}
          className={`px-6 py-2 rounded-full font-bold shadow transition ${skipMode ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-700'}`}
        >
          Highlight 10s
        </button>
      </div>

      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-8 w-full max-w-2xl">
        {Array.from({ length: 100 }).map((_, i) => {
          const num = i + 1;
          const isRevealed = num <= revealed;
          const isNext = num === revealed + 1;
          const isSkip = skipMode && num % 10 === 0 && isRevealed;

          return (
            <motion.div 
              key={num}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCellClick(num)}
              className={`
                aspect-square flex items-center justify-center rounded-md font-bold text-sm md:text-xl cursor-pointer select-none transition-colors
                ${isRevealed ? (isSkip ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-500' : 'bg-blue-100 text-blue-800 border border-blue-200') : 'bg-gray-50 text-gray-300 border border-gray-100'}
                ${isNext ? 'ring-4 ring-green-400 animate-pulse bg-green-50' : ''}
              `}
            >
              {num}
            </motion.div>
          );
        })}
      </div>

      {revealed === 100 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <p className="text-2xl text-green-500 font-bold mb-4">You revealed the Hundred Chart!</p>
          <button 
            onClick={onComplete}
            className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg text-xl transition hover:scale-105"
          >
            Finish Module
          </button>
        </motion.div>
      )}
    </div>
  );
}
