import React from 'react';
import { useLesson } from '../../context/LessonContext';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeButton({ className = '', light = false }) {
  const { dispatch } = useLesson();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch({ type: 'GO_HOME' })}
      className={`
        fixed top-4 left-4 z-50 
        flex items-center gap-2 px-4 py-2.5 
        rounded-2xl font-bold text-sm
        shadow-lg transition-all duration-300
        ${light 
          ? 'bg-white/90 backdrop-blur-md text-indigo-700 hover:bg-white border border-indigo-100 hover:shadow-indigo-200/50' 
          : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20 hover:shadow-white/20'}
        ${className}
      `}
      title="Go Home"
    >
      <Home size={18} />
      <span className="hidden sm:inline">Home</span>
    </motion.button>
  );
}
