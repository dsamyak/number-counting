import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { CheckCircle, Lock, Play } from 'lucide-react';
import Module1 from './Module1';
import Module2 from './Module2';
import Module3 from './Module3';
import Module4 from './Module4';
import Module5 from './Module5';
import MiniQuiz from './MiniQuiz';

export default function LearnPhase() {
  const { state, dispatch } = useLesson();
  const [activeModule, setActiveModule] = useState(null);
  
  const prog = state.learnProgress;
  
  const modules = [
    { id: 1, title: 'Counting to 10', complete: prog.module1Complete, locked: false },
    { id: 2, title: 'Numbers 11–40', complete: prog.module2Complete, locked: !prog.module1Complete },
    { id: 3, title: 'Numbers 41–100', complete: prog.module3Complete, locked: !prog.module2Complete },
    { id: 4, title: 'Place Value', complete: prog.module4Complete, locked: !prog.module3Complete },
    { id: 5, title: 'Number Patterns', complete: prog.module5Complete, locked: !prog.module4Complete },
    { id: 'quiz', title: 'Mini-Quiz', complete: prog.miniQuizPassed, locked: !prog.module5Complete },
  ];

  const handleComplete = (moduleId, score = null) => {
    if (moduleId === 'quiz') {
      dispatch({ type: 'SET_MINI_QUIZ_RESULT', payload: { score: score || 5 } });
    } else {
      dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId } });
    }
    setActiveModule(null);
  };

  if (activeModule === 1) return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><Module1 onComplete={() => handleComplete(1)} /></div>;
  if (activeModule === 2) return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><Module2 onComplete={() => handleComplete(2)} /></div>;
  if (activeModule === 3) return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><Module3 onComplete={() => handleComplete(3)} /></div>;
  if (activeModule === 4) return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><Module4 onComplete={() => handleComplete(4)} /></div>;
  if (activeModule === 5) return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><Module5 onComplete={() => handleComplete(5)} /></div>;
  if (activeModule === 'quiz') return <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4"><MiniQuiz onComplete={(s) => handleComplete('quiz', s)} /></div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4 pt-12 pb-24">
      <h1 className="text-4xl md:text-5xl font-heading text-primary font-bold mb-2">Learn Phase</h1>
      <p className="text-gray-600 mb-10 text-lg max-w-lg text-center">
        Complete all modules to unlock the practice zone!
      </p>
      
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {modules.map((m) => (
          <div 
            key={m.id}
            onClick={() => !m.locked && setActiveModule(m.id)}
            className={`w-full flex items-center justify-between p-6 rounded-2xl shadow-sm transition-all
              ${m.locked ? 'bg-gray-100 opacity-70 cursor-not-allowed border border-gray-200' : 'bg-white cursor-pointer hover:shadow-md hover:scale-[1.01] border-2 border-transparent hover:border-blue-200'}
              ${m.complete && !m.locked ? 'border-green-200 bg-green-50' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg
                ${m.locked ? 'bg-gray-200 text-gray-500' : m.complete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {m.complete ? <CheckCircle size={24} /> : m.id === 'quiz' ? 'Q' : m.id}
              </div>
              <span className={`text-xl font-bold ${m.locked ? 'text-gray-500' : 'text-gray-800'}`}>
                {m.title}
              </span>
            </div>
            
            <div>
              {m.locked ? (
                <Lock className="text-gray-400" />
              ) : m.complete ? (
                <span className="text-green-600 font-bold">Done!</span>
              ) : (
                <button className="flex items-center gap-2 text-primary font-bold bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition">
                  <Play size={16} /> Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center">
        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: { phase: 'practice' } })}
          disabled={!prog.miniQuizPassed}
          className={`px-10 py-4 text-2xl font-bold rounded-full shadow-lg transition-all transform
            ${prog.miniQuizPassed 
              ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 active:scale-95' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {prog.miniQuizPassed ? 'Go to Practice! 🎮' : 'Practice Locked 🔒'}
        </button>
        {!prog.miniQuizPassed && (
          <p className="mt-4 text-gray-500 font-medium">Pass the mini-quiz to unlock</p>
        )}
      </div>
    </div>
  );
}
