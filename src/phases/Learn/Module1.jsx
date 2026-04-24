import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Module1({ onComplete }) {
  const [count, setCount] = useState(0);
  const total = 10;

  const handleTap = () => {
    if (count < total) {
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-2xl border-4 border-blue-100 relative overflow-hidden">
      <h2 className="text-4xl font-heading text-primary mb-2 text-center">Counting to 10!</h2>
      <p className="text-gray-600 mb-8 text-center text-lg">Tap the screen to count the apples.</p>
      
      <div 
        className="w-full h-64 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 cursor-pointer flex flex-wrap content-start justify-center p-4 gap-4"
        onClick={handleTap}
      >
        <AnimatePresence>
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="text-5xl"
            >
              🍎
            </motion.div>
          ))}
        </AnimatePresence>

        {count === 0 && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Tap here!
          </div>
        )}
      </div>

      <div className="my-8 text-8xl font-black text-blue-500 font-heading tabular-nums">
        {count}
      </div>

      <AnimatePresence>
        {count === total && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <p className="text-2xl text-green-500 font-bold mb-4">Great job! You counted to 10.</p>
            <button 
              onClick={onComplete}
              className="px-10 py-4 bg-green-500 text-white rounded-full font-bold shadow-lg text-xl hover:bg-green-600 hover:scale-105 active:scale-95 transition"
            >
              Finish Module
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
