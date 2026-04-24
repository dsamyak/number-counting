import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

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
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-2xl border-4 border-blue-100">
        <h2 className={`text-4xl font-heading mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
          {passed ? 'Quiz Passed!' : 'Keep Trying!'}
        </h2>
        <p className="text-xl mb-6">You scored {score} out of 5.</p>
        <button 
          onClick={() => onComplete(score)}
          className={`px-10 py-4 text-white rounded-full font-bold shadow-lg text-xl transition hover:scale-105 ${passed ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {passed ? 'Unlock Practice' : 'Back to Menu'}
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];

  const handleAnswer = (opt) => {
    if (feedback !== null) return;
    
    const isCorrect = opt === q.answer;
    if (isCorrect) setScore(s => s + 1);
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(c => c + 1);
    }, 1200);
  };

  return (
    <div className="p-8 flex flex-col items-center bg-white rounded-3xl shadow-xl w-full max-w-3xl border-4 border-yellow-400 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-yellow-600 mb-6 uppercase tracking-wider">Mini-Quiz Checkpoint ({currentQuestion + 1}/5)</h2>
      
      <h3 className="text-3xl md:text-4xl font-heading text-gray-800 mb-10 text-center">{q.prompt}</h3>
      
      <div className="grid grid-cols-2 gap-4 w-full">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="w-full py-6 text-2xl font-bold rounded-2xl border-b-4 bg-gray-50 border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 text-gray-700 transition"
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={`text-8xl drop-shadow-2xl ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
