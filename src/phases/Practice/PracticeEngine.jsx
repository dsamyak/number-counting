import React, { useEffect, useState, useRef } from 'react';
import { useLesson } from '../../context/LessonContext';
import { buildSession } from '../../engine/sessionBuilder';
import QuestionRenderer from './QuestionRenderer';
import { Flame } from 'lucide-react';

export default function PracticeEngine() {
  const { state, dispatch } = useLesson();
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const questionStartTime = useRef(Date.now());
  
  useEffect(() => {
    if (state.practice.questions.length === 0) {
      const qs = buildSession();
      dispatch({ type: 'LOAD_QUESTIONS', payload: { questions: qs } });
    }
  }, [state.practice.questions.length, dispatch]);

  const currentIndex = state.practice.currentIndex;
  const questions = state.practice.questions;

  // Handle game over or completion
  useEffect(() => {
    if (state.practice.lives <= 0 || (questions.length > 0 && currentIndex >= questions.length)) {
      if (questions.length > 0 && currentIndex >= questions.length) {
        // Calculate stars
        const maxScore = questions.reduce((acc, q) => acc + q.points, 0) * 3; // roughly max multiplier
        dispatch({ type: 'CALCULATE_STARS', payload: { maxPossibleScore: maxScore } });
      }
      dispatch({ type: 'SET_PHASE', payload: { phase: 'results' } });
    }
  }, [state.practice.lives, currentIndex, questions.length, dispatch]);

  if (questions.length === 0 || currentIndex >= questions.length) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50">Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    if (feedback !== null) return; // Prevent multiple taps

    const timeMs = Date.now() - questionStartTime.current;
    const isCorrect = String(answer) === String(currentQuestion.correctAnswer);

    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Visual feedback delay
    setTimeout(() => {
      dispatch({ 
        type: 'ANSWER_QUESTION', 
        payload: { 
          questionId: currentQuestion.id, 
          answer, 
          isCorrect, 
          points: currentQuestion.points, 
          timeMs 
        } 
      });
      setFeedback(null);
      questionStartTime.current = Date.now();
    }, 1500);
  };

  const progressPercent = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 pt-4 px-4 pb-12">
      {/* Header Info */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm">
          <span>⭐</span> {state.practice.score}
        </div>
        
        {state.practice.streak > 0 && (
          <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-100 px-4 py-2 rounded-full animate-bounce">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span>{state.practice.streak} Streak!</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl h-4 bg-gray-200 rounded-full mb-8 overflow-hidden shadow-inner">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="relative w-full flex justify-center">
        <QuestionRenderer 
          question={currentQuestion} 
          onAnswer={handleAnswer} 
          lives={state.practice.lives}
        />
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className={`text-6xl animate-bounce drop-shadow-2xl ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
