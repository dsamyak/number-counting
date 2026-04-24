import React from 'react';
import { useLesson } from '../../context/LessonContext';

export default function WelcomeScreen() {
  const { dispatch } = useLesson();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-4xl md:text-6xl text-primary font-bold mb-8 text-center drop-shadow-md">
        Counting to 100
      </h1>
      
      {/* Mascot Placeholder */}
      <div className="w-48 h-48 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-xl animate-bounce">
        <span className="text-6xl">🐻</span>
      </div>
      
      <p className="text-xl md:text-2xl text-gray-700 mb-8 text-center max-w-md">
        Hi! I'm Benny the Bear. Let's learn how to count to 100 together!
      </p>

      <button 
        onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'learn' } })}
        className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-full shadow-lg transform transition hover:scale-105 active:scale-95"
      >
        START LEARNING!
      </button>
    </div>
  );
}
