import React, { Suspense } from 'react';
import { useLesson } from './context/LessonContext';

// Lazy load the phases
const WelcomeScreen = React.lazy(() => import('./phases/Welcome/WelcomeScreen'));
const LearnPhase = React.lazy(() => import('./phases/Learn/LearnPhase'));
const PracticeEngine = React.lazy(() => import('./phases/Practice/PracticeEngine'));
const ResultsScreen = React.lazy(() => import('./phases/Practice/ResultsScreen'));

function AppContent() {
  const { state } = useLesson();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white font-sans">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-400"></div>
            <span className="text-indigo-400 font-bold">Loading...</span>
          </div>
        </div>
      }>
        {state.phase === 'welcome' && <WelcomeScreen />}
        {state.phase === 'learn' && <LearnPhase />}
        {state.phase === 'practice' && <PracticeEngine />}
        {state.phase === 'results' && <ResultsScreen />}
      </Suspense>
    </div>
  );
}

export default AppContent;
