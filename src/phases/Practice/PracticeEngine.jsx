import React from 'react';
import { useLesson } from '../../context/LessonContext';

export default function PracticeEngine() {
  const { dispatch } = useLesson();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <h1 className="text-4xl text-green-700 font-bold mb-8">Practice Phase</h1>
      <p className="mb-8">This is where the 100 questions will be presented.</p>
      
      <button 
        onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'results' } })}
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow"
      >
        Finish Practice (Dev)
      </button>
    </div>
  );
}
