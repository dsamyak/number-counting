import React from 'react';
import { useLesson } from '../../context/LessonContext';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ResultsScreen() {
  const { state, dispatch } = useLesson();
  const { score, stars, maxStreak } = state.practice;
  
  React.useEffect(() => {
    if (stars >= 3) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, []);

  const correctCount = state.practice.answers.filter(a => a.isCorrect).length;
  const totalCount = state.practice.answers.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
        className="bg-white/8 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center relative overflow-hidden border border-white/10">
        
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-t-3xl z-0" />
        
        <div className="z-10 bg-white/10 backdrop-blur p-4 rounded-full shadow-lg mt-6 mb-4 border border-white/20">
          <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
        </div>
        
        <h1 className="z-10 text-4xl font-heading font-black text-white mb-2">
          {stars >= 4 ? 'Amazing!' : stars >= 2 ? 'Great Job!' : 'Keep Trying!'}
        </h1>
        <p className="z-10 text-indigo-300 font-medium mb-6">Practice session complete</p>
        
        {/* Stars */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 20, rotate: -30 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.12, type: 'spring' }}>
              <Star className={`w-10 h-10 ${i <= stars ? 'fill-yellow-400 text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'fill-white/10 text-white/20'}`} />
            </motion.div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { label: 'Score', value: score, color: 'text-blue-400' },
            { label: 'Correct', value: `${correctCount}/${totalCount}`, color: 'text-green-400' },
            { label: 'Max Streak', value: maxStreak, color: 'text-orange-400' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/5 p-4 rounded-2xl flex flex-col items-center border border-white/5">
              <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</span>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button onClick={() => dispatch({ type: 'GO_HOME' })}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl transition border border-white/10">
            <Home className="w-5 h-5" /> Home
          </button>
          <button onClick={() => { dispatch({ type: 'RESET_PRACTICE' }); dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } }); }}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-md transition">
            <RotateCcw className="w-5 h-5" /> Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
