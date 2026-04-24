import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Module5({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [frogPos, setFrogPos] = useState(0); // Index in the sequence
  const [error, setError] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const levels = [
    { step: 2, start: 2, seq: [2, 4, 6, 8, 10], distractors: [3, 5, 7, 9] },
    { step: 5, start: 5, seq: [5, 10, 15, 20, 25], distractors: [12, 16, 22, 24] },
    { step: 10, start: 10, seq: [10, 20, 30, 40, 50], distractors: [15, 25, 35, 45] }
  ];

  if (level >= levels.length) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-teal-900 rounded-3xl shadow-2xl w-full max-w-4xl min-h-[600px] border-4 border-teal-500 text-white">
        <h2 className="text-5xl font-heading text-yellow-300 mb-6 drop-shadow-lg text-center">Pond Crossed!</h2>
        <p className="text-xl text-teal-200 mb-10 text-center max-w-lg">
          You are a skip-counting master!
        </p>
        <button 
          onClick={onComplete}
          className="px-12 py-5 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full font-black text-2xl shadow-[0_0_30px_rgba(74,222,128,0.5)] transition hover:scale-105 active:scale-95"
        >
          Finish Module 🏁
        </button>
      </div>
    );
  }

  const currentLevel = levels[level];
  const targetNumber = currentLevel.seq[frogPos];
  const isFinished = frogPos >= currentLevel.seq.length;

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        setLevel(l => l + 1);
        setFrogPos(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  const handleLilypadClick = (num) => {
    if (isFinished) return;
    
    if (num === targetNumber) {
      setFrogPos(p => p + 1);
      setError(false);
    } else {
      setError(true);
      setShowSplash(true);
      setTimeout(() => {
        setError(false);
        setShowSplash(false);
      }, 800);
    }
  };

  // Generate options to display (current target + some distractors)
  const getOptions = () => {
    if (isFinished) return [];
    let opts = [targetNumber];
    // Add 3 random distractors from the pool or adjacent numbers
    let available = [...currentLevel.distractors, targetNumber - 1, targetNumber + 1].filter(n => n !== targetNumber && n > 0);
    while(opts.length < 4 && available.length > 0) {
      const rIdx = Math.floor(Math.random() * available.length);
      opts.push(available[rIdx]);
      available.splice(rIdx, 1);
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  const [currentOptions, setCurrentOptions] = useState([]);
  
  useEffect(() => {
    setCurrentOptions(getOptions());
  }, [frogPos, level]);

  return (
    <div className="p-4 md:p-8 flex flex-col items-center bg-gradient-to-b from-teal-800 to-cyan-900 rounded-3xl shadow-2xl w-full max-w-5xl border-4 border-teal-500 relative text-white min-h-[700px] overflow-hidden">
      
      {/* Header */}
      <div className="text-center z-10 mb-12">
        <h2 className="text-4xl md:text-5xl font-heading text-yellow-300 drop-shadow-lg mb-2">
          Froggy Skip Jump
        </h2>
        <p className="text-xl text-teal-200 bg-black/20 px-6 py-2 rounded-full inline-block backdrop-blur-sm border border-white/10">
          Skip count by <strong className="text-yellow-400 text-2xl">{currentLevel.step}s</strong> to help the frog cross!
        </p>
      </div>

      {/* Pond Area */}
      <div className="relative w-full flex-1 min-h-[250px] bg-cyan-500/20 rounded-3xl border border-cyan-400/30 overflow-hidden shadow-inner flex items-center justify-between px-4 md:px-12">
        
        {/* Water ripples background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-16 border border-white rounded-[100%] animate-ping" style={{animationDuration: '3s'}} />
          <div className="absolute top-2/3 right-1/3 w-48 h-24 border border-white rounded-[100%] animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}} />
        </div>

        {/* Start Bank */}
        <div className="w-16 h-full bg-green-800/80 absolute left-0 top-0 rounded-r-[100%]" />
        
        {/* End Bank */}
        <div className="w-16 h-full bg-green-800/80 absolute right-0 top-0 rounded-l-[100%]" />

        {/* Lilypads */}
        <div className="w-full flex justify-between z-10 pl-12 pr-12 relative">
          {currentLevel.seq.map((num, i) => {
            const isCurrent = i === frogPos;
            const isPast = i < frogPos;
            
            return (
              <div key={i} className="relative flex flex-col items-center">
                <div className={`w-16 h-12 md:w-24 md:h-16 rounded-[100%] flex items-center justify-center transition-all duration-500
                  ${isPast ? 'bg-green-600 shadow-[0_5px_0_rgb(21,128,61)]' : 'bg-green-700/50 border border-green-500/50'}`}
                >
                  {isPast ? (
                    <span className="text-xl md:text-3xl font-black text-green-900/50 -rotate-12">{num}</span>
                  ) : (
                    <span className="text-white/30 text-xl">?</span>
                  )}
                </div>

                {/* The Frog */}
                <AnimatePresence>
                  {isCurrent && (
                    <motion.div
                      layoutId="frog"
                      initial={false}
                      animate={error ? { x: [-10, 10, -10, 10, 0] } : { y: [0, -40, 0] }}
                      transition={{ 
                        type: error ? "tween" : "spring", 
                        bounce: 0.5, 
                        duration: error ? 0.4 : 0.8 
                      }}
                      className="absolute -top-12 md:-top-16 text-5xl md:text-7xl drop-shadow-xl z-20 select-none pointer-events-none"
                    >
                      🐸
                      {showSplash && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl"
                        >
                          💦
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Success Overlay for Level */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-900/80 backdrop-blur-sm z-30"
            >
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">Great Skip Counting!</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Answer Selector */}
      <div className="w-full mt-8 flex flex-col items-center z-10">
        <h3 className="text-2xl font-bold text-teal-100 mb-6 uppercase tracking-widest text-center">Which lilypad comes next?</h3>
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
          <AnimatePresence mode="popLayout">
            {!isFinished && currentOptions.map((opt) => (
              <motion.button
                key={opt}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLilypadClick(opt)}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-yellow-950 font-black text-3xl md:text-4xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-4 border-yellow-200 transition-colors flex items-center justify-center"
              >
                {opt}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
