import React, { useState, useEffect } from 'react';
import { useLesson } from '../../context/LessonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Gamepad2, Star, Trophy, Sparkles } from 'lucide-react';

const FLOATING_NUMBERS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  num: Math.floor(Math.random() * 100) + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 14 + Math.random() * 24,
  delay: Math.random() * 5,
  duration: 8 + Math.random() * 12,
}));

export default function WelcomeScreen() {
  const { state, dispatch } = useLesson();
  const [mascotBounce, setMascotBounce] = useState(false);
  const prog = state.learnProgress;
  
  const completedModules = [prog.module1Complete, prog.module2Complete, prog.module3Complete, prog.module4Complete, prog.module5Complete].filter(Boolean).length;
  const hasProgress = completedModules > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setMascotBounce(true);
      setTimeout(() => setMascotBounce(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient" />
      
      {/* Floating numbers background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_NUMBERS.map((n) => (
          <motion.div
            key={n.id}
            className="absolute font-heading font-bold text-white/8 select-none"
            style={{ 
              left: `${n.x}%`, 
              top: `${n.y}%`,
              fontSize: `${n.size}px`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 20, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: n.duration,
              delay: n.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {n.num}
          </motion.div>
        ))}
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-6 max-w-2xl mx-auto"
      >
        {/* Sparkle badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          className="mb-6 flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm font-bold"
        >
          <Sparkles size={16} className="text-yellow-300" />
          Singapore MOE Curriculum · Grade 1
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-heading font-black text-white mb-4 text-center drop-shadow-2xl leading-tight"
        >
          Counting to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
            100
          </span>
        </motion.h1>

        {/* Mascot */}
        <motion.div
          className="relative my-6"
          animate={mascotBounce ? { y: [0, -20, 0], rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 border-4 border-yellow-200/50">
            <span className="text-6xl drop-shadow-md">🐻</span>
          </div>
          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute -right-40 top-2 bg-white rounded-2xl rounded-bl-sm px-4 py-2 shadow-lg text-sm font-bold text-indigo-700 max-w-[160px]"
          >
            Let's learn numbers together! 🎉
            <div className="absolute -left-2 bottom-4 w-3 h-3 bg-white transform rotate-45" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-white/80 mb-10 text-center max-w-md leading-relaxed"
        >
          Learn to count, spell numbers, and explore with fun simulations and interactive activities!
        </motion.p>

        {/* Progress indicator */}
        {hasProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15"
          >
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                  i <= completedModules ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-white/20'
                }`} />
              ))}
            </div>
            <span className="text-white/70 text-sm font-bold">{completedModules}/5 Modules Done</span>
          </motion.div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'learn' } })}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-indigo-700 text-xl font-black rounded-2xl shadow-2xl shadow-black/20 hover:shadow-indigo-500/30 transition-all duration-300 border-b-4 border-indigo-200 active:border-b-0 active:translate-y-1"
          >
            <BookOpen size={24} />
            {hasProgress ? 'Continue Learning' : 'Start Learning'}
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } })}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-black rounded-2xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 border-b-4 border-green-600 active:border-b-0 active:translate-y-1"
          >
            <Gamepad2 size={24} />
            Practice
          </motion.button>
        </div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-3 mt-10 w-full max-w-md"
        >
          {[
            { icon: '🔢', label: 'Count & Spell' },
            { icon: '🎮', label: 'Simulations' },
            { icon: '🏆', label: '100 Questions' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <span className="text-3xl">{f.icon}</span>
              <span className="text-white/70 text-xs font-bold text-center">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
