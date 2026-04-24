import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Module2({ onComplete }) {
  const [filled, setFilled] = useState(0);
  const target = 40;

  const handleFill = () => {
    if (filled < target) {
      setFilled(prev => Math.min(prev + 10, target));
    }
  };

  const renderTenFrame = (startIndex) => (
    <div className="grid grid-cols-5 gap-2 bg-white p-4 rounded-xl border-4 border-gray-200">
      {Array.from({ length: 10 }).map((_, i) => {
        const isFilled = startIndex + i < filled;
        return (
          <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
            {isFilled && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full bg-blue-500 rounded-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-3xl border-4 border-blue-100">
      <h2 className="text-4xl font-heading text-primary mb-2 text-center">Numbers 11 to 40</h2>
      <p className="text-gray-600 mb-6 text-center text-lg">Let's fill the ten-frames by groups of ten!</p>
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4">
          {renderTenFrame(0)}
          {renderTenFrame(10)}
        </div>
        <div className="flex gap-4">
          {renderTenFrame(20)}
          {renderTenFrame(30)}
        </div>
      </div>

      <div className="text-6xl font-black text-blue-500 font-heading mb-8">
        {filled}
      </div>

      {filled < target ? (
        <button 
          onClick={handleFill}
          className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full font-bold shadow-md text-xl transition"
        >
          Add 10 More!
        </button>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <p className="text-2xl text-green-500 font-bold mb-4">You reached 40!</p>
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
