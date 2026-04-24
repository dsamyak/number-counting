import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Box } from 'lucide-react';

export default function Module4({ onComplete }) {
  const targets = [34, 61, 80];
  const [round, setRound] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTarget = targets[round];
  const currentTotal = tens * 10 + ones;

  const handleAddTen = () => {
    if (tens < 9) setTens(t => t + 1);
  };

  const handleAddOne = () => {
    if (ones < 19) setOnes(o => o + 1); // Allow some overflow for learning
  };

  const handleClear = () => {
    setTens(0);
    setOnes(0);
  };

  // Convert 10 ones to 1 ten
  const handleRegroup = () => {
    if (ones >= 10) {
      setOnes(o => o - 10);
      setTens(t => t + 1);
    }
  };

  const handleCheck = () => {
    if (currentTotal === currentTarget) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (round < targets.length - 1) {
          setRound(r => r + 1);
          handleClear();
        } else {
          setRound(999); // Complete state
        }
      }, 2500);
    }
  };

  if (round === 999) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl min-h-[600px] border-4 border-gray-700 text-white">
        <h2 className="text-5xl font-heading text-yellow-300 mb-6 drop-shadow-lg">Factory Master!</h2>
        <p className="text-xl text-gray-300 mb-10 text-center max-w-lg">
          You know exactly how to build big numbers using Tens and Ones!
        </p>
        <button 
          onClick={onComplete}
          className="px-12 py-5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full font-black text-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition hover:scale-105"
        >
          Next Module 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col items-center bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl border-4 border-gray-700 relative text-white min-h-[700px] overflow-hidden">
      
      {/* Target Screen */}
      <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-8 shadow-inner">
        <div className="flex flex-col">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Target Number</span>
          <span className="text-5xl font-black text-green-400 font-heading">{currentTarget}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Current Total</span>
          <span className={`text-5xl font-black font-heading ${currentTotal === currentTarget ? 'text-green-400' : 'text-yellow-400'}`}>
            {currentTotal}
          </span>
        </div>
      </div>

      <div className="flex w-full gap-4 md:gap-8 flex-1">
        
        {/* Workspace: Tens */}
        <div className="flex-1 bg-blue-900/30 rounded-3xl border-2 border-blue-500/50 p-4 flex flex-col">
          <h3 className="text-center font-bold text-blue-300 mb-4 uppercase tracking-widest border-b border-blue-500/30 pb-2">Tens</h3>
          
          <div className="flex-1 flex gap-2 justify-center content-start flex-wrap p-2 min-h-[200px]">
            <AnimatePresence>
              {Array.from({ length: tens }).map((_, i) => (
                <motion.div 
                  key={`ten-${i}`}
                  initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  className="w-6 h-32 md:w-8 md:h-48 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-300 relative overflow-hidden"
                >
                  {/* Grid lines inside the ten rod to show 10 blocks */}
                  {Array.from({ length: 9 }).map((_, lineIdx) => (
                    <div key={lineIdx} className="w-full h-px bg-blue-700/50 absolute" style={{ top: `${(lineIdx + 1) * 10}%` }} />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleAddTen}
            className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Layers /> +1 Ten
          </button>
        </div>

        {/* Workspace: Ones */}
        <div className="flex-1 bg-orange-900/30 rounded-3xl border-2 border-orange-500/50 p-4 flex flex-col">
          <h3 className="text-center font-bold text-orange-300 mb-4 uppercase tracking-widest border-b border-orange-500/30 pb-2">Ones</h3>
          
          <div className="flex-1 flex gap-2 justify-center content-start flex-wrap p-2 min-h-[200px]">
            <AnimatePresence>
              {Array.from({ length: ones }).map((_, i) => (
                <motion.div 
                  key={`one-${i}`}
                  initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-orange-300 to-orange-500 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)] border border-orange-200"
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleRegroup}
              disabled={ones < 10}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:border-gray-800 disabled:text-gray-500 rounded-2xl font-bold text-sm md:text-lg shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              Regroup 10
            </button>
            <button 
              onClick={handleAddOne}
              className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold text-xl shadow-lg border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Box size={20} /> +1 One
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4 mt-8">
        <button 
          onClick={handleClear}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-2xl font-bold text-lg transition"
        >
          Clear
        </button>
        <button 
          onClick={handleCheck}
          disabled={currentTotal !== currentTarget}
          className={`flex-1 py-4 rounded-2xl font-bold text-2xl transition shadow-lg border-b-4 
            ${currentTotal === currentTarget 
              ? 'bg-green-500 hover:bg-green-400 border-green-700 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] active:border-b-0 active:translate-y-1' 
              : 'bg-gray-800 border-gray-900 text-gray-600 cursor-not-allowed'}`}
        >
          Submit Output
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
          >
            <div className="bg-green-500 text-white p-12 rounded-full shadow-[0_0_100px_rgba(34,197,94,1)] text-6xl font-black">
              ✓ Match!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
