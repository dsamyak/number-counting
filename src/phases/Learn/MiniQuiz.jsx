import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

export default function MiniQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    { prompt: 'What comes after 39?', options: [38, 40, 41, 50], answer: 40 },
    { prompt: '2 tens and 4 ones = ___', options: [42, 24, 6, 204], answer: 24 },
    { prompt: 'Which is bigger: 73 or 37?', options: [73, 37], answer: 73 },
    { prompt: '5, 10, ___, 20, 25', options: [12, 11, 15, 30], answer: 15 },
    { prompt: 'What comes before 100?', options: [90, 99, 101, 89], answer: 99 },
  ];

  if (currentQuestion >= questions.length) {
    const passed = score >= 3;
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
        className="p-8 flex flex-col items-center bg-gradient-to-b from-indigo-900 to-purple-950 rounded-3xl shadow-2xl w-full max-w-2xl border border-indigo-500/30 text-white">
        <HomeButton />
        <div className={`text-8xl mb-6 ${passed ? '' : 'grayscale'}`}>{passed ? '🎉' : '🤔'}</div>
        <h2 className={`text-4xl font-heading mb-4 ${passed ? 'text-green-400' : 'text-orange-400'}`}>
          {passed ? 'Quiz Passed!' : 'Keep Trying!'}
        </h2>
        <p className="text-xl mb-2 text-indigo-200">You scored <strong className="text-yellow-400">{score}</strong> out of 5</p>
        <div className="flex gap-1 mb-8">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full ${i <= score ? 'bg-green-400' : 'bg-white/20'}`} />
          ))}
        </div>
        <button onClick={() => onComplete(score)}
          className={`px-10 py-4 text-white rounded-2xl font-black text-xl transition hover:scale-105 shadow-lg
            ${passed ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}>
          {passed ? 'Unlock Practice! 🎮' : 'Back to Modules'}
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];

  const handleAnswer = (opt) => {
    if (feedback !== null) return;
    setSelectedAnswer(opt);
    const isCorrect = opt === q.answer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      setCurrentQuestion(c => c + 1);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-b from-indigo-900 to-purple-950 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500/30 relative overflow-hidden text-white">
      <HomeButton />
      
      {/* Progress */}
      <div className="w-full flex items-center gap-3 mb-6 mt-2">
        <span className="text-yellow-400 font-bold text-sm">Q{currentQuestion + 1}/5</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${((currentQuestion) / 5) * 100}%` }} className="h-full bg-yellow-400 rounded-full" />
        </div>
      </div>

      <h2 className="text-sm font-bold text-yellow-500 mb-2 uppercase tracking-wider">Mini-Quiz Checkpoint</h2>
      
      <motion.h3 key={currentQuestion} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-heading text-center text-white mb-8 mt-4">{q.prompt}</motion.h3>
      
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {q.options.map((opt, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(opt)}
            className={`w-full py-5 text-xl font-bold rounded-2xl border-b-4 transition-all
              ${selectedAnswer === opt && feedback === 'correct' ? 'bg-green-500 border-green-700 text-white scale-105' 
              : selectedAnswer === opt && feedback === 'wrong' ? 'bg-red-500 border-red-700 text-white animate-shake'
              : 'bg-white/10 border-white/5 hover:bg-white/15 text-white'}`}>
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className={`text-8xl drop-shadow-2xl ${feedback === 'correct' ? '' : ''}`}>
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
