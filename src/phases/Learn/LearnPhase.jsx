import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';
import Module1 from './Module1';
import Module2 from './Module2';
import Module3 from './Module3';
import Module4 from './Module4';
import Module5 from './Module5';
import MiniQuiz from './MiniQuiz';

const MODULE_ICONS = ['🔢', '📦', '📊', '🏭', '🐸', '📝'];
const MODULE_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-indigo-600',
  'from-gray-600 to-slate-700',
  'from-slate-600 to-gray-700',
  'from-teal-500 to-cyan-600',
  'from-yellow-500 to-orange-500',
];

export default function LearnPhase() {
  const { state, dispatch } = useLesson();
  const [activeModule, setActiveModule] = useState(null);
  
  const prog = state.learnProgress;
  
  const modules = [
    { id: 1, title: 'Counting 1–10', subtitle: 'Count, spell & identify', complete: prog.module1Complete, locked: false },
    { id: 2, title: 'Numbers 11–40', subtitle: 'Grouping & spelling', complete: prog.module2Complete, locked: !prog.module1Complete },
    { id: 3, title: 'Hundred Chart', subtitle: 'Explore 41–100', complete: prog.module3Complete, locked: !prog.module2Complete },
    { id: 4, title: 'Place Value', subtitle: 'Build & decompose', complete: prog.module4Complete, locked: !prog.module3Complete },
    { id: 5, title: 'Number Patterns', subtitle: 'Skip counting', complete: prog.module5Complete, locked: !prog.module4Complete },
    { id: 'quiz', title: 'Mini-Quiz', subtitle: 'Test your knowledge', complete: prog.miniQuizPassed, locked: !prog.module5Complete },
  ];

  const handleComplete = (moduleId, score = null) => {
    if (moduleId === 'quiz') {
      dispatch({ type: 'SET_MINI_QUIZ_RESULT', payload: { score: score || 5 } });
    } else {
      dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId } });
    }
    setActiveModule(null);
  };

  const moduleComponents = { 1: Module1, 2: Module2, 3: Module3, 4: Module4, 5: Module5, quiz: MiniQuiz };

  if (activeModule !== null) {
    const Comp = moduleComponents[activeModule];
    const onComp = activeModule === 'quiz' ? (s) => handleComplete('quiz', s) : () => handleComplete(activeModule);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-4">
        <Comp onComplete={onComp} />
      </div>
    );
  }

  const completedCount = modules.filter(m => m.complete).length;
  const progressPercent = (completedCount / modules.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-4 pt-8 pb-24 relative">
      <HomeButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 mt-8">
        <h1 className="text-4xl md:text-5xl font-heading text-white font-black mb-2">Learn Phase</h1>
        <p className="text-indigo-300 text-lg max-w-lg mx-auto">Complete all modules to unlock the practice zone!</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} className="w-full max-w-2xl mb-10">
        <div className="flex justify-between text-sm text-indigo-400 font-bold mb-2">
          <span>Progress</span>
          <span>{completedCount}/{modules.length}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
        </div>
      </motion.div>

      {/* Module cards */}
      <div className="w-full max-w-2xl flex flex-col gap-3">
        {modules.map((m, idx) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => !m.locked && setActiveModule(m.id)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer group
              ${m.locked ? 'bg-white/5 opacity-50 cursor-not-allowed border border-white/5' 
              : m.complete ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 hover:scale-[1.01]' 
              : 'bg-white/8 border border-white/10 hover:bg-white/12 hover:scale-[1.01] hover:border-indigo-400/30'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow-lg bg-gradient-to-br ${MODULE_COLORS[idx]}
                ${m.locked ? 'opacity-40' : ''}`}>
                {m.complete ? <CheckCircle size={22} className="text-white" /> : <span className="text-xl">{MODULE_ICONS[idx]}</span>}
              </div>
              <div>
                <span className={`text-lg font-bold block ${m.locked ? 'text-gray-500' : 'text-white'}`}>{m.title}</span>
                <span className={`text-sm ${m.locked ? 'text-gray-600' : 'text-indigo-400'}`}>{m.subtitle}</span>
              </div>
            </div>
            
            <div>
              {m.locked ? (
                <Lock className="text-gray-600" size={20} />
              ) : m.complete ? (
                <span className="text-green-400 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">Done ✓</span>
              ) : (
                <button className="flex items-center gap-2 text-white font-bold bg-indigo-500/30 px-4 py-2 rounded-full hover:bg-indigo-500/50 transition text-sm group-hover:bg-indigo-500/50">
                  <Play size={14} /> Start
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Practice CTA */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-col items-center">
        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } })}
          disabled={!prog.miniQuizPassed}
          className={`px-10 py-4 text-xl font-black rounded-2xl shadow-lg transition-all transform
            ${prog.miniQuizPassed 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105 active:scale-95 shadow-green-500/30' 
              : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/10'}`}
        >
          {prog.miniQuizPassed ? 'Go to Practice! 🎮' : 'Practice Locked 🔒'}
        </button>
        {!prog.miniQuizPassed && (
          <p className="mt-3 text-indigo-400 font-medium text-sm">Pass the mini-quiz to unlock</p>
        )}
      </motion.div>
    </div>
  );
}
