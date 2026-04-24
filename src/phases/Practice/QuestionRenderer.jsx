import React from 'react';
import { QUESTION_TYPES } from '../../engine/questionTypes';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionRenderer({ question, onAnswer, feedback }) {

  const renderVisual = () => {
    if (!question.visual) return null;
    const { type, value } = question.visual;
    const tens = Math.floor(value / 10);
    const ones = value % 10;

    if (type === 'blocks') {
      return (
        <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 flex items-end justify-center gap-3 min-h-[120px]">
          <div className="flex gap-1 items-end">
            {Array.from({ length: tens }).map((_, i) => (
              <motion.div key={`t${i}`} initial={{ height: 0 }} animate={{ height: 64 }} transition={{ delay: i * 0.1 }}
                className="w-4 bg-blue-400 rounded-sm shadow border border-blue-300/30" />
            ))}
          </div>
          {tens > 0 && ones > 0 && <span className="text-white/30 text-lg font-bold pb-2">+</span>}
          <div className="flex gap-1 items-end">
            {Array.from({ length: ones }).map((_, i) => (
              <motion.div key={`o${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                className="w-4 h-4 bg-orange-400 rounded-sm shadow border border-orange-300/30" />
            ))}
          </div>
        </div>
      );
    }

    if (type === 'ten_frame') {
      const totalFrames = Math.ceil(value / 10) || 1;
      return (
        <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 flex flex-col gap-2 items-center">
          {Array.from({ length: totalFrames }).map((_, fi) => {
            const dots = fi < tens ? 10 : ones;
            return (
              <div key={fi} className="grid grid-cols-5 gap-1">
                {Array.from({ length: 10 }).map((_, ci) => (
                  <div key={ci} className="w-7 h-7 rounded-md border border-indigo-400/30 bg-indigo-900/30 flex items-center justify-center">
                    {ci < dots && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" />}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    if (type === 'hundred_chart') {
      return (
        <div className="w-full bg-white/5 rounded-2xl p-3 mb-6 border border-white/10">
          <div className="grid grid-cols-10 gap-0.5 max-w-xs mx-auto">
            {Array.from({ length: Math.min(value + 10, 100) }).map((_, i) => {
              const num = i + 1;
              return (
                <div key={num} className={`aspect-square flex items-center justify-center text-[9px] font-bold rounded
                  ${num === value ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_8px_rgba(250,204,21,0.5)]' : num <= value ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/5 text-white/20'}`}>
                  {num === value ? '?' : num}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={question.id}
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-2xl bg-white/8 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col items-center relative overflow-hidden border border-white/10">

        {/* Difficulty badge */}
        <div className="w-full flex justify-end mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 
              'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
            {question.difficulty}
          </div>
        </div>

        {/* Visual */}
        {renderVisual()}

        {/* Prompt */}
        <h2 className="text-xl md:text-2xl font-heading text-center text-white mb-8 leading-relaxed">{question.prompt}</h2>

        {/* Options */}
        <div className={`grid ${question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-3 w-full`}>
          {question.options.map((opt, i) => (
            <motion.button key={i} whileTap={{ scale: 0.95 }}
              onClick={() => onAnswer(opt)}
              disabled={feedback !== null}
              className={`w-full py-4 text-xl font-bold rounded-2xl border-b-4 transition-all
                ${feedback && String(opt) === String(question.correctAnswer) ? 'bg-green-500 border-green-700 text-white scale-105' 
                : feedback === 'wrong' && String(opt) !== String(question.correctAnswer) ? 'bg-white/5 border-white/5 text-white/40'
                : 'bg-white/10 border-white/5 hover:bg-white/15 active:border-b-0 active:translate-y-1 text-white'}`}>
              {opt}
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        {question.hint && !feedback && (
          <p className="mt-4 text-indigo-400 text-sm text-center italic">💡 {question.hint}</p>
        )}

        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className={`text-7xl drop-shadow-2xl ${feedback === 'correct' ? 'animate-count-in' : 'animate-shake'}`}>
                {feedback === 'correct' ? '✅' : '❌'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
