import React from 'react';
import { useLesson } from '../../context/LessonContext';
import { Trophy, Star, RotateCcw, Home, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ResultsScreen() {
  const { state, dispatch } = useLesson();
  
  const { score, stars, maxStreak, badges } = state.practice;
  
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl z-0" />
        
        <div className="z-10 bg-white p-4 rounded-full shadow-lg mt-8 mb-4 border-4 border-purple-200">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        
        <h1 className="z-10 text-4xl font-heading font-bold text-gray-800 mb-2">
          Awesome Job!
        </h1>
        
        <p className="z-10 text-gray-500 font-medium mb-8">
          You completed the practice session.
        </p>
        
        {/* Stars */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Star 
                className={`w-12 h-12 ${i <= stars ? 'fill-yellow-400 text-yellow-500 drop-shadow-md' : 'fill-gray-100 text-gray-200'}`} 
              />
            </motion.div>
          ))}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Score</span>
            <span className="text-3xl font-black text-blue-600">{score}</span>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Max Streak</span>
            <span className="text-3xl font-black text-orange-600">{maxStreak}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_PHASE', payload: { phase: 'welcome' } });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition"
          >
            <Home className="w-5 h-5" /> Home
          </button>
          
          <button 
            onClick={() => {
              dispatch({ type: 'RESET_PRACTICE' });
              dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl shadow-md transition"
          >
            <RotateCcw className="w-5 h-5" /> Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
