import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NUMBER_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default function Module1({ onComplete }) {
  const [phase, setPhase] = useState('learn'); // 'learn', 'practice', 'complete'
  const [activeNumber, setActiveNumber] = useState(1);
  const [poppedBubbles, setPoppedBubbles] = useState([]);

  // Auto-advance the learning phase
  useEffect(() => {
    if (phase === 'learn') {
      const timer = setInterval(() => {
        if (activeNumber < 10) {
          setActiveNumber(n => n + 1);
        } else {
          setTimeout(() => setPhase('practice'), 2000);
          clearInterval(timer);
        }
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [phase, activeNumber]);

  const handlePop = (id) => {
    if (!poppedBubbles.includes(id)) {
      setPoppedBubbles([...poppedBubbles, id]);
      if (poppedBubbles.length + 1 === 10) {
        setTimeout(() => setPhase('complete'), 1500);
      }
    }
  };

  return (
    <div className="p-8 flex flex-col items-center bg-gradient-to-b from-blue-900 to-indigo-900 rounded-3xl shadow-2xl w-full max-w-4xl border-4 border-blue-400 overflow-hidden relative min-h-[600px] text-white">
      
      {/* --- Phase 1: Learn --- */}
      <AnimatePresence>
        {phase === 'learn' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full absolute inset-0 z-10"
          >
            <h2 className="text-3xl md:text-5xl font-heading text-yellow-300 mb-12 drop-shadow-lg text-center">
              Let's Learn to Count!
            </h2>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                key={activeNumber}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
                className="absolute flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-64 h-64 border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)]"
              >
                <span className="text-8xl font-black text-white drop-shadow-lg font-heading">
                  {activeNumber}
                </span>
                <span className="text-2xl font-bold text-yellow-300 mt-2 tracking-widest uppercase">
                  {NUMBER_WORDS[activeNumber - 1]}
                </span>
              </motion.div>
            </div>

            {/* Visual Dots representation */}
            <div className="flex gap-3 mt-16 h-12">
              <AnimatePresence>
                {Array.from({ length: activeNumber }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-6 h-6 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                  />
                ))}
              </AnimatePresence>
            </div>
            
            <button onClick={() => setPhase('practice')} className="absolute bottom-8 right-8 text-white/50 hover:text-white underline">Skip Intro</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Phase 2: Practice --- */}
      <AnimatePresence>
        {phase === 'practice' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full h-full relative z-20"
          >
            <h2 className="text-3xl md:text-5xl font-heading text-yellow-300 mb-4 drop-shadow-lg text-center">
              Pop 10 Magic Bubbles!
            </h2>
            <p className="text-xl text-blue-200 mb-8 font-medium">Count aloud as you pop them.</p>
            
            <div className="relative w-full h-[400px] bg-blue-950/50 rounded-3xl border border-blue-500/30 overflow-hidden shadow-inner">
              {/* Generate 10 random bubbles */}
              {Array.from({ length: 10 }).map((_, i) => {
                const isPopped = poppedBubbles.includes(i);
                // Pseudo-random static positions for stability
                const left = `${10 + (i * 37) % 80}%`;
                const top = `${15 + (i * 23) % 70}%`;
                
                return (
                  <AnimatePresence key={i}>
                    {!isPopped && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [1, 1.05, 1], 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          scale: { duration: 2, repeat: Infinity },
                          y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                        }}
                        exit={{ scale: 2, opacity: 0 }}
                        onClick={() => handlePop(i)}
                        className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-cyan-400/40 to-blue-300/80 border-2 border-white/50 backdrop-blur-sm cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center transition group"
                        style={{ left, top }}
                      >
                        <div className="w-3 h-3 bg-white/80 rounded-full absolute top-3 left-3 blur-[1px]"></div>
                        <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-xl drop-shadow-md">Pop!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}

              {/* Popped Counter Indicator */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-8 py-3 rounded-full flex gap-3 items-center border border-white/10">
                  <span className="text-2xl font-bold text-blue-300">Popped:</span>
                  <span className="text-4xl font-black text-yellow-400 font-heading tabular-nums">{poppedBubbles.length}</span>
                  <span className="text-2xl font-bold text-blue-300">/ 10</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Phase 3: Complete --- */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center justify-center absolute inset-0 z-30 bg-indigo-900/90 backdrop-blur-sm"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(250,204,21,0.3)_360deg)] rounded-full blur-2xl"
            />
            
            <h2 className="text-5xl md:text-7xl font-heading text-yellow-300 mb-6 drop-shadow-2xl z-10 text-center">
              Fantastic!
            </h2>
            <p className="text-2xl text-white mb-12 z-10 text-center">You mastered counting to 10.</p>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mb-12 z-10">
              {NUMBER_WORDS.map((word, i) => (
                <div key={i} className="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20">
                  <span className="text-3xl font-bold text-yellow-400">{i + 1}</span>
                  <span className="text-xs text-blue-200 uppercase tracking-wider">{word}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onComplete}
              className="z-10 px-12 py-5 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full font-black shadow-[0_0_40px_rgba(74,222,128,0.5)] text-2xl transition hover:scale-110 active:scale-95"
            >
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
