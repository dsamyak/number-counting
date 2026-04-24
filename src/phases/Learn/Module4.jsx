import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Module4({ onComplete }) {
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const target = 63; // E.g., target 63
  
  const currentTotal = tens * 10 + ones;
  const isCorrect = currentTotal === target;

  return (
    <div className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-3xl border-4 border-blue-100">
      <h2 className="text-4xl font-heading text-primary mb-2 text-center">Place Value Builder</h2>
      <p className="text-gray-600 mb-6 text-center text-lg">Build the number <strong className="text-2xl text-blue-600">{target}</strong></p>
      
      <div className="flex w-full gap-8 mb-8">
        {/* Tens Zone */}
        <div className="flex-1 bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Tens</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4 min-h-[120px]">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="w-4 h-24 bg-blue-500 rounded-sm shadow-sm" />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTens(Math.max(0, tens - 1))} className="w-10 h-10 bg-white rounded-full font-bold shadow text-red-500">-</button>
            <span className="text-2xl font-bold w-8 text-center">{tens}</span>
            <button onClick={() => setTens(Math.min(9, tens + 1))} className="w-10 h-10 bg-white rounded-full font-bold shadow text-green-500">+</button>
          </div>
        </div>

        {/* Ones Zone */}
        <div className="flex-1 bg-yellow-50 p-6 rounded-2xl border-2 border-dashed border-yellow-200 flex flex-col items-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-4">Ones</h3>
          <div className="flex flex-wrap justify-center content-start gap-2 mb-4 min-h-[120px] max-w-[150px]">
            {Array.from({ length: ones }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-400 rounded-sm shadow-sm" />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setOnes(Math.max(0, ones - 1))} className="w-10 h-10 bg-white rounded-full font-bold shadow text-red-500">-</button>
            <span className="text-2xl font-bold w-8 text-center">{ones}</span>
            <button onClick={() => setOnes(Math.min(9, ones + 1))} className="w-10 h-10 bg-white rounded-full font-bold shadow text-green-500">+</button>
          </div>
        </div>
      </div>

      <div className="text-4xl font-black font-heading mb-8">
        Total: <span className={isCorrect ? "text-green-500" : "text-gray-800"}>{currentTotal}</span>
      </div>

      {isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <p className="text-2xl text-green-500 font-bold mb-4">Perfect! {tens} tens and {ones} ones makes {target}.</p>
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
