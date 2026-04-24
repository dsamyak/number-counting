import React, { Suspense } from 'react';
import { useLesson } from './context/LessonContext';

// Lazy load the phases as specified in TRD
const WelcomeScreen = React.lazy(() => import('./phases/Welcome/WelcomeScreen'));
const LearnPhase = React.lazy(() => import('./phases/Learn/LearnPhase'));
const PracticeEngine = React.lazy(() => import('./phases/Practice/PracticeEngine'));
const ResultsScreen = React.lazy(() => import('./phases/Practice/ResultsScreen'));

function AppContent() {
  const { state } = useLesson();

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
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
