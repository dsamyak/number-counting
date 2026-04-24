import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Check } from 'lucide-react';

export default function Module3({ onComplete }) {
  const [task, setTask] = useState(0); // 0: find 10s, 1: find numbers ending in 5, 2: complete
  const [paintedCells, setPaintedCells] = useState([]);

  const tasks = [
    {
      title: "Paint the Tens!",
      instruction: "Find and paint all numbers that end in 0 (10, 20, 30...)",
      check: (num) => num % 10 === 0,
      color: "bg-blue-400 text-blue-900 border-blue-500",
      targetCount: 10
    },
    {
      title: "Paint the Fives!",
      instruction: "Now find and paint all numbers that end in 5 (5, 15, 25...)",
      check: (num) => num % 10 === 5,
      color: "bg-green-400 text-green-900 border-green-500",
      targetCount: 20 // includes previous 10
    }
  ];

  const handleCellClick = (num) => {
    if (task >= tasks.length) return;
    
    const currentTask = tasks[task];
    
    // Allow painting if it's correct for current task, or keep previously painted
    if (currentTask.check(num) && !paintedCells.includes(num)) {
      const newPainted = [...paintedCells, num];
      setPaintedCells(newPainted);
      
      if (newPainted.length === currentTask.targetCount) {
        setTimeout(() => setTask(t => t + 1), 1500);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl border-4 border-gray-700 overflow-hidden relative text-white">
      
      {/* Header Info */}
      <div className="w-full flex flex-col items-center text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-heading text-yellow-300 drop-shadow-lg mb-2">
          The Magic Hundred Chart
        </h2>
        
        <AnimatePresence mode="wait">
          {task < tasks.length ? (
            <motion.div 
              key={task}
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-gray-800 p-4 rounded-xl border border-gray-600 mt-2 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-yellow-400">
                <Paintbrush size={24} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-100">{tasks[task].title}</p>
                <p className="text-gray-400">{tasks[task].instruction}</p>
              </div>
              <div className="text-3xl font-bold text-gray-500 ml-4">
                {paintedCells.length} / {tasks[task].targetCount}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="complete"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-green-900/50 p-4 rounded-xl border border-green-500 mt-2"
            >
              <p className="text-2xl font-bold text-green-400">Chart Master!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-10 gap-1 md:gap-2 mb-8 w-full max-w-3xl bg-gray-800 p-2 md:p-4 rounded-2xl border border-gray-700 shadow-inner">
        {Array.from({ length: 100 }).map((_, i) => {
          const num = i + 1;
          const isPainted = paintedCells.includes(num);
          
          // Determine color based on what painted it
          let cellClass = "bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-600";
          if (isPainted) {
            if (num % 10 === 0) cellClass = tasks[0].color;
            if (num % 10 === 5) cellClass = tasks[1].color;
          }

          return (
            <motion.button 
              key={num}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleCellClick(num)}
              disabled={task >= tasks.length}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-md md:rounded-xl font-bold text-xs md:text-xl md:border-b-4 transition-colors relative overflow-hidden group
                ${cellClass}
              `}
            >
              <span className="z-10">{num}</span>
              {isPainted && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  className="absolute inset-0 bg-white/20"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {task >= tasks.length && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center bg-gray-800/90 backdrop-blur p-8 rounded-3xl border border-gray-600 shadow-[0_0_50px_rgba(0,0,0,0.5)] absolute bottom-8 z-20"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.6)] text-white">
              <Check size={48} strokeWidth={4} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Beautiful Patterns!</h3>
            <p className="text-gray-300 mb-8 max-w-md text-center">
              Notice how all the numbers ending in 0 and 5 make straight lines straight down the chart? That's the secret of the Hundred Chart!
            </p>
            <button 
              onClick={onComplete}
              className="px-12 py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 rounded-full font-black text-xl shadow-lg transition hover:scale-105"
            >
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
