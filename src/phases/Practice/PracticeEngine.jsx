import React, { useEffect, useState, useRef } from 'react';
import { useLesson } from '../../context/LessonContext';
import { buildSession } from '../../engine/sessionBuilder';
import QuestionRenderer from './QuestionRenderer';
import HomeButton from '../../components/ui/HomeButton';
import { Flame, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PracticeEngine() {
  const { state, dispatch } = useLesson();
  const [feedback, setFeedback] = useState(null);
  const questionStartTime = useRef(Date.now());
  
  useEffect(() => {
    if (state.practice.questions.length === 0) {
      const qs = buildSession();
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: qs } });
    }
  }, [state.practice.questions.length, dispatch]);

  const currentIndex = state.practice.currentIndex;
  const questions = state.practice.questions;

  useEffect(() => {
    if (state.practice.lives <= 0 || (questions.length > 0 && currentIndex >= questions.length)) {
      if (questions.length > 0 && currentIndex >= questions.length) {
        const maxScore = questions.reduce((acc, q) => acc + q.points, 0) * 3;
        dispatch({ type: 'CALCULATE_STARS', payload: { maxPossibleScore: maxScore } });
      }
      dispatch({ type: 'SET_PHASE', payload: { phase: 'results' } });
    }
  }, [state.practice.lives, currentIndex, questions.length, dispatch]);

  if (questions.length === 0 || currentIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-400"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    if (feedback !== null) return;
    const timeMs = Date.now() - questionStartTime.current;
    const isCorrect = String(answer) === String(currentQuestion.correctAnswer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      dispatch({ 
        type: 'ANSWER_QUESTION', 
        payload: { questionId: currentQuestion.id, answer, isCorrect, points: currentQuestion.points, timeMs } 
      });
      setFeedback(null);
      questionStartTime.current = Date.now();
    }, 1200);
  };

  const progressPercent = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 pt-4 px-4 pb-12">
      <HomeButton />

      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 mt-8">
        <div className="flex items-center gap-2 text-lg font-bold text-white bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-yellow-400">⭐</span> {state.practice.score}
        </div>

        {/* Lives */}
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <Heart key={i} className={`w-7 h-7 transition-all ${i <= state.practice.lives ? 'fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'fill-gray-700 text-gray-700'}`} />
          ))}
        </div>
        
        <AnimatePresence>
          {state.practice.streak > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/15 px-4 py-2 rounded-2xl border border-orange-500/20">
              <Flame className="w-5 h-5 fill-orange-400" />
              <span>{state.practice.streak}x</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-xs text-indigo-400 font-bold mb-1">
          <span>Question {currentIndex + 1}/{questions.length}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur">
          <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
        </div>
      </div>

      {/* Question */}
      <div className="relative w-full flex justify-center">
        <QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />
      </div>
    </div>
  );
}
