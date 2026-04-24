import React from 'react';
import { useLesson } from '../../context/LessonContext';

export default function ResultsScreen() {
  const { state, dispatch } = useLesson();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 p-4">
      <h1 className="text-4xl text-purple-700 font-bold mb-4">Results & Rewards</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Score: {state.practice.score}</h2>
        <h2 className="text-2xl font-bold text-yellow-500">Stars: {state.practice.stars} 🌟</h2>
        <h2 className="text-xl font-medium text-gray-600">Max Streak: {state.practice.maxStreak} 🔥</h2>
        
        <button 
          onClick={() => {
            dispatch({ type: 'RESET_PRACTICE' });
            dispatch({ type: 'SET_PHASE', payload: { phase: 'welcome' } });
          }}
          className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg shadow font-bold"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
