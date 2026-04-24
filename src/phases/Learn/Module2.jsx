import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Module2({ onComplete }) {
  const [step, setStep] = useState(0); // 0: intro, 1: group 24, 2: practice 37, 3: complete
  const [grouped, setGrouped] = useState(false);

  const renderScatteredStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        layoutId={`star-${i}`}
        className="w-8 h-8 md:w-10 md:h-10 text-3xl md:text-4xl absolute"
        style={{
          left: `${10 + (Math.random() * 80)}%`,
          top: `${10 + (Math.random() * 80)}%`,
          transform: `rotate(${Math.random() * 360}deg)`
        }}
      >
        ⭐
      </motion.div>
    ));
  };

  const renderTenFrames = (count) => {
    const tens = Math.floor(count / 10);
    const ones = count % 10;
    const totalFrames = Math.ceil(count / 10) || 1;

    return (
      <div className="flex flex-col gap-4 mt-8 w-full max-w-2xl">
        {Array.from({ length: totalFrames }).map((_, frameIdx) => {
          const isLastFrame = frameIdx === totalFrames - 1;
          const starsInThisFrame = isLastFrame && ones !== 0 ? ones : 10;
          
          return (
            <div key={frameIdx} className="grid grid-cols-5 gap-2 bg-white/10 p-3 rounded-2xl border-4 border-indigo-300/30">
              {Array.from({ length: 10 }).map((_, cellIdx) => (
                <div key={cellIdx} className="aspect-square rounded-xl border-2 border-indigo-400/50 flex items-center justify-center bg-indigo-900/30">
                  {cellIdx < starsInThisFrame && (
                    <motion.div layoutId={`star-${frameIdx * 10 + cellIdx}`} className="text-3xl md:text-5xl">
                      ⭐
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 flex flex-col items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl shadow-2xl w-full max-w-4xl border-4 border-purple-400 overflow-hidden relative min-h-[700px] text-white">
      
      {/* Header */}
      <div className="text-center z-10 mb-8">
        <h2 className="text-4xl md:text-5xl font-heading text-purple-300 drop-shadow-lg mb-2">
          Grouping by Tens
        </h2>
        <p className="text-xl text-indigo-200">
          {step === 0 && "Counting scattered things is hard..."}
          {step === 1 && "It's much easier when we group them into Tens!"}
          {step === 2 && "Let's group 37 stars."}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div key="step0" className="absolute inset-0 bg-indigo-950/50 rounded-3xl border border-indigo-500/30">
              {renderScatteredStars(24)}
              <div className="absolute bottom-6 w-full flex justify-center">
                <button 
                  onClick={() => { setGrouped(true); setTimeout(() => setStep(1), 2000); }}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] transition"
                >
                  Group into Tens!
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" className="flex flex-col items-center w-full">
              {renderTenFrames(24)}
              <div className="mt-8 text-center">
                <p className="text-3xl font-bold text-yellow-300 mb-2">2 Tens and 4 Ones = 24</p>
                <button 
                  onClick={() => { setGrouped(false); setStep(2); }}
                  className="mt-6 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-xl shadow-lg transition"
                >
                  Let's try another!
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && !grouped && (
            <motion.div key="step2-scattered" className="absolute inset-0 bg-indigo-950/50 rounded-3xl border border-indigo-500/30">
              {renderScatteredStars(37)}
              <div className="absolute bottom-6 w-full flex justify-center z-20">
                <button 
                  onClick={() => setGrouped(true)}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] transition"
                >
                  Group 37 Stars!
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && grouped && (
            <motion.div key="step2-grouped" className="flex flex-col items-center w-full z-10 relative">
              {renderTenFrames(37)}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="mt-8 text-center bg-indigo-900/80 p-6 rounded-2xl border border-indigo-400"
              >
                <p className="text-3xl font-bold text-yellow-300 mb-4">3 Tens and 7 Ones = 37</p>
                <button 
                  onClick={() => setStep(3)}
                  className="px-10 py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-full text-2xl shadow-[0_0_30px_rgba(74,222,128,0.5)] transition hover:scale-105"
                >
                  Awesome!
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-5xl font-heading text-yellow-300 mb-6 drop-shadow-lg">
                You're a Grouping Master!
              </h2>
              <p className="text-2xl text-indigo-200 mb-10 max-w-lg">
                Counting by tens is the fastest way to count big numbers up to 40 and beyond.
              </p>
              <button 
                onClick={onComplete}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full font-black shadow-[0_0_40px_rgba(168,85,247,0.6)] text-2xl transition hover:scale-110"
              >
                Next Module 🚀
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
