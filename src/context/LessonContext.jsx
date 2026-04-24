import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  phase: 'welcome',  // 'welcome' | 'learn' | 'practice' | 'results'
  learnProgress: {
    module1Complete: false,
    module2Complete: false,
    module3Complete: false,
    module4Complete: false,
    module5Complete: false,
    miniQuizPassed: false,
    miniQuizScore: 0,
  },
  practice: {
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
    stars: 0,
    lives: 3,
    streak: 0,
    maxStreak: 0,
    badges: [],
    bossUnlocked: false,
    bossComplete: false,
  },
  settings: {
    soundEnabled: true,
    musicEnabled: false,
  }
};

function lessonReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_MODULE':
      return {
        ...state,
        learnProgress: {
          ...state.learnProgress,
          [`module${action.payload.moduleId}Complete`]: true,
        }
      };
    case 'SET_MINI_QUIZ_RESULT':
      return {
        ...state,
        learnProgress: {
          ...state.learnProgress,
          miniQuizScore: action.payload.score,
          miniQuizPassed: action.payload.score >= 3,
        }
      };
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload.phase,
      };
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        practice: {
          ...state.practice,
          questions: action.payload.questions,
        }
      };
    case 'ANSWER_QUESTION': {
      const { questionId, answer, isCorrect, points, timeMs } = action.payload;
      const isBoss = action.payload.isBoss || false;
      const newStreak = isCorrect && !isBoss ? state.practice.streak + 1 : (isCorrect ? state.practice.streak : 0);
      const newMaxStreak = Math.max(state.practice.maxStreak, newStreak);
      
      let streakMultiplier = 1;
      if (newStreak >= 10) streakMultiplier = 3;
      else if (newStreak >= 5) streakMultiplier = 2;

      const pointsEarned = isCorrect ? points * streakMultiplier : 0;
      
      return {
        ...state,
        practice: {
          ...state.practice,
          answers: [...state.practice.answers, { questionId, answer, isCorrect, timeMs }],
          score: state.practice.score + pointsEarned,
          streak: newStreak,
          maxStreak: newMaxStreak,
          lives: !isCorrect && !isBoss ? Math.max(0, state.practice.lives - 1) : state.practice.lives,
          currentIndex: state.practice.currentIndex + 1,
        }
      };
    }
    case 'AWARD_BADGE':
      if (state.practice.badges.includes(action.payload.badgeId)) return state;
      return {
        ...state,
        practice: {
          ...state.practice,
          badges: [...state.practice.badges, action.payload.badgeId],
        }
      };
    case 'TOGGLE_SOUND':
      return {
        ...state,
        settings: {
          ...state.settings,
          soundEnabled: !state.settings.soundEnabled,
        }
      };
    case 'TOGGLE_MUSIC':
      return {
        ...state,
        settings: {
          ...state.settings,
          musicEnabled: !state.settings.musicEnabled,
        }
      };
    case 'RESET_PRACTICE':
      return {
        ...state,
        practice: {
          ...initialState.practice,
          bossUnlocked: state.practice.bossUnlocked, // keep boss unlocked state if resetting just to retry
        }
      };
    case 'UNLOCK_BOSS':
      return {
        ...state,
        practice: {
          ...state.practice,
          bossUnlocked: true,
        }
      };
    case 'COMPLETE_BOSS':
      return {
        ...state,
        practice: {
          ...state.practice,
          bossComplete: true,
        }
      };
    case 'CALCULATE_STARS': {
      const maxPossible = action.payload.maxPossibleScore;
      const currentScore = state.practice.score;
      const percentage = currentScore / maxPossible;
      let stars = 1;
      if (percentage >= 0.8) stars = 5;
      else if (percentage >= 0.6) stars = 4;
      else if (percentage >= 0.4) stars = 3;
      else if (percentage >= 0.2) stars = 2;
      else if (percentage > 0) stars = 1;
      else stars = 0;
      
      return {
        ...state,
        practice: {
          ...state.practice,
          stars,
        }
      };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const LessonContext = createContext(null);

export function LessonProvider({ children }) {
  const [state, dispatch] = useReducer(lessonReducer, initialState);

  // Persistence to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('countingTo100State');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('countingTo100State', JSON.stringify(state));
  }, [state]);

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
}
