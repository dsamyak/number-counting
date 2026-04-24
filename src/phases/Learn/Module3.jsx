import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Check, Eye } from 'lucide-react';
import HomeButton from '../../components/ui/HomeButton';

export default function Module3({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [task, setTask] = useState(0);
  const [paintedCells, setPaintedCells] = useState([]);
  const [exploredNumber, setExploredNumber] = useState(null);
  const [visualRound, setVisualRound] = useState(0);
  const [visualAnswer, setVisualAnswer] = useState(null);
  const [visualFeedback, setVisualFeedback] = useState(null);

  const tasks = [
    { title: "Paint the Tens!", instruction: "Find all numbers ending in 0", check: n => n%10===0, color: "bg-blue-400 text-blue-900 border-blue-500", targetCount: 10 },
    { title: "Paint the Fives!", instruction: "Find all numbers ending in 5", check: n => n%10===5, color: "bg-green-400 text-green-900 border-green-500", targetCount: 20 },
  ];

  const visualQuestions = [
    { emoji: '🌳', count: 45, display: '4 groups of 10 trees and 5 single trees' },
    { emoji: '🏠', count: 63, display: '6 groups of 10 houses and 3 single houses' },
    { emoji: '📚', count: 78, display: '7 groups of 10 books and 8 single books' },
  ];

  const handleCellClick = (num) => {
    if (phase !== 'paint' || task >= tasks.length) return;
    const curr = tasks[task];
    if (curr.check(num) && !paintedCells.includes(num)) {
      const next = [...paintedCells, num];
      setPaintedCells(next);
      if (next.length === curr.targetCount) {
        setTimeout(() => setTask(t => t + 1), 1200);
      }
    }
  };

  const handleExplore = (num) => {
    if (phase !== 'explore') return;
    setExploredNumber(num);
  };

  const checkVisual = (ans) => {
    const correct = visualQuestions[visualRound].count;
    setVisualAnswer(ans);
    setVisualFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (visualRound + 1 >= visualQuestions.length) setPhase('complete');
        else { setVisualRound(r => r+1); setVisualAnswer(null); setVisualFeedback(null); }
      } else { setVisualAnswer(null); setVisualFeedback(null); }
    }, 1200);
  };

  const renderGrid = (interactive, onCellClick) => (
    <div className="grid grid-cols-10 gap-1 w-full max-w-2xl bg-gray-800/80 p-2 md:p-3 rounded-2xl border border-gray-700 shadow-inner">
      {Array.from({length:100}).map((_,i) => {
        const num = i+1;
        const isPainted = paintedCells.includes(num);
        const isExplored = exploredNumber === num;
        let cls = "bg-gray-700/80 text-gray-400 border-gray-600 hover:bg-gray-600";
        if (isPainted) {
          cls = num%10===0 ? tasks[0].color : tasks[1].color;
        }
        if (isExplored) cls = "bg-yellow-400 text-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]";
        return (
          <motion.button key={num} whileTap={{scale:0.85}}
            onClick={() => onCellClick?.(num)}
            className={`number-cell aspect-square flex items-center justify-center rounded-md md:rounded-lg font-bold text-[10px] md:text-sm border transition-colors ${cls}`}>
            {num}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 md:p-6 flex flex-col items-center bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-700/50 overflow-hidden relative text-white min-h-[600px]">
      <HomeButton />
      <div className="flex gap-2 mb-4 z-10">
        {['explain','explore','paint','visual','complete'].map((p,i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':'bg-white/20'}`}/>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-4">The Hundred Chart</h2>
            <p className="text-lg text-gray-300 mb-4">A hundred chart shows <strong className="text-yellow-300">all numbers from 1 to 100</strong> in a grid with 10 columns.</p>
            <p className="text-lg text-gray-300 mb-4">Numbers in the <strong className="text-blue-300">same column</strong> end with the same digit. Numbers in the <strong className="text-green-300">same row</strong> share the same tens digit!</p>
            <div className="grid grid-cols-5 gap-1 my-4 bg-gray-800 p-2 rounded-xl">
              {[1,2,3,4,5,11,12,13,14,15,21,22,23,24,25].map(n => (
                <div key={n} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${n%10===5?'bg-green-500/30 text-green-300':'bg-gray-700 text-gray-400'}`}>{n}</div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mb-6">See? 5, 15, 25 are all in the same column!</p>
            <button onClick={() => setPhase('explore')} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
              Explore the Chart! 🔍
            </button>
          </motion.div>
        )}

        {phase === 'explore' && (
          <motion.div key="explore" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">Explore! Tap Any Number</h2>
            <p className="text-gray-400 mb-4 text-sm">Tap numbers to learn about them</p>
            {exploredNumber && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-4 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-6 py-3 flex items-center gap-4">
                <span className="text-4xl font-black text-yellow-400">{exploredNumber}</span>
                <div className="text-left">
                  <p className="text-yellow-200 font-bold">{Math.floor(exploredNumber/10)} tens and {exploredNumber%10} ones</p>
                  <p className="text-gray-400 text-sm">Row {Math.ceil(exploredNumber/10)}, Column {exploredNumber%10||10}</p>
                </div>
              </motion.div>
            )}
            {renderGrid(true, handleExplore)}
            <button onClick={() => setPhase('paint')} className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg">
              Start Painting Challenge! 🎨
            </button>
          </motion.div>
        )}

        {phase === 'paint' && (
          <motion.div key="paint" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            {task < tasks.length ? (
              <motion.div key={task} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="bg-gray-800 p-3 rounded-xl border border-gray-600 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-yellow-400"><Paintbrush size={20}/></div>
                <div className="text-left">
                  <p className="text-lg font-bold">{tasks[task].title}</p>
                  <p className="text-gray-400 text-sm">{tasks[task].instruction}</p>
                </div>
                <span className="text-2xl font-bold text-gray-500 ml-3">{paintedCells.length}/{tasks[task].targetCount}</span>
              </motion.div>
            ) : (
              <motion.div initial={{scale:0.8}} animate={{scale:1}} className="bg-green-900/40 p-3 rounded-xl border border-green-500 mb-4">
                <p className="text-xl font-bold text-green-400">🎨 Chart Master!</p>
              </motion.div>
            )}
            {renderGrid(true, handleCellClick)}
            {task >= tasks.length && (
              <button onClick={() => setPhase('visual')} className="mt-6 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
                Visual Counting Challenge! 👁️
              </button>
            )}
          </motion.div>
        )}

        {phase === 'visual' && (
          <motion.div key="visual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Count the Groups! 👁️</h2>
            <p className="text-gray-300 mb-6">{visualQuestions[visualRound].display}</p>
            <div className="bg-gray-800/50 rounded-3xl p-6 w-full max-w-lg border border-gray-600 min-h-[180px] flex flex-col items-center justify-center gap-3 mb-6">
              {Array.from({length: Math.floor(visualQuestions[visualRound].count/10)}).map((_,g) => (
                <div key={g} className="flex gap-1">
                  {Array.from({length:10}).map((_,j) => (
                    <motion.span key={j} initial={{scale:0}} animate={{scale:1}} transition={{delay:(g*10+j)*0.02}} className="text-lg">{visualQuestions[visualRound].emoji}</motion.span>
                  ))}
                </div>
              ))}
              <div className="flex gap-1">
                {Array.from({length: visualQuestions[visualRound].count%10}).map((_,j) => (
                  <motion.span key={j} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5}} className="text-lg">{visualQuestions[visualRound].emoji}</motion.span>
                ))}
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-bold">How many {visualQuestions[visualRound].emoji} are there?</p>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {(() => {
                const c = visualQuestions[visualRound].count;
                const opts = [c]; 
                while(opts.length<4){const r=c+Math.floor(Math.random()*20)-10; if(r>0&&r<=100&&!opts.includes(r))opts.push(r);}
                return opts.sort((a,b)=>a-b).map(o => (
                  <motion.button key={o} whileTap={{scale:0.9}} onClick={() => !visualFeedback && checkVisual(o)}
                    className={`py-4 text-xl font-black rounded-2xl border-b-4 transition-all
                      ${visualAnswer===o&&visualFeedback==='correct'?'bg-green-500 border-green-700 text-white'
                      :visualAnswer===o&&visualFeedback==='wrong'?'bg-red-500 border-red-700 text-white animate-shake'
                      :'bg-white/10 border-white/5 hover:bg-white/20'}`}>{o}</motion.button>
                ));
              })()}
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-4">Chart Explorer!</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-md">You explored, painted, and counted on the Hundred Chart!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-2xl font-black text-2xl shadow-lg hover:scale-105 transition-all">
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
