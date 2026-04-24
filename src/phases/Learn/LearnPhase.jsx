import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';

export default function LearnPhase() {
  const { dispatch } = useLesson();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-4xl text-primary font-bold mb-8">Learn Phase</h1>
      <p className="mb-8">This is where the 5 simulation modules will be.</p>
      
      <button 
        onClick={() => {
          dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId: 1 } });
          dispatch({ type: 'SET_MINI_QUIZ_RESULT', payload: { score: 5 } });
          dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } });
        }}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow"
      >
        Skip to Practice (Dev)
      </button>
    </div>
  );
}
