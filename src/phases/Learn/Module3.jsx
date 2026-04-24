import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Check } from 'lucide-react';
import HomeButton from '../../components/ui/HomeButton';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateNeighborQuestions() {
  const qs = [];
  for (let i = 0; i < 5; i++) {
    const num = randInt(42, 99);
    const isBefore = Math.random() > 0.5;
    const correct = isBefore ? num - 1 : num + 1;
    const opts = new Set([correct]);
    while (opts.size < 4) { const r = randInt(Math.max(1,correct-5), Math.min(100,correct+5)); if (r !== correct) opts.add(r); }
    qs.push({ num, isBefore, correct, options: shuffle([...opts]), prompt: `What comes ${isBefore ? 'before' : 'after'} ${num}?` });
  }
  return qs;
}

function generateRowColQuestions() {
  const qs = [];
  const types = shuffle(['row','col','row','col']);
  for (const type of types) {
    if (type === 'row') {
      const row = randInt(5, 10);
      const start = (row-1)*10+1;
      const nums = Array.from({length:10},(_,i)=>start+i);
      const hidden = shuffle([...nums]).slice(0, 3);
      qs.push({ type: 'row', row, nums, hidden, prompt: `Fill in row ${row} (${start}–${start+9})` });
    } else {
      const col = randInt(1, 10);
      const nums = Array.from({length:10},(_,i)=> i*10+col);
      const hidden = shuffle([...nums]).slice(0, 3);
      qs.push({ type: 'col', col, nums, hidden, prompt: `Fill in column ${col}` });
    }
  }
  return qs;
}

function generateVisualCounting() {
  const emojis = ['🌳','🏠','📚','🎈','🦋'];
  return Array.from({length: 4}, (_, i) => {
    const count = randInt(41, 85);
    return { emoji: emojis[i], count };
  });
}

export default function Module3({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [paintedCells, setPaintedCells] = useState([]);
  const [paintTask, setPaintTask] = useState(0);
  const [exploredNumber, setExploredNumber] = useState(null);

  const neighborQs = useMemo(() => generateNeighborQuestions(), []);
  const [neighborRound, setNeighborRound] = useState(0);
  const [neighborFeedback, setNeighborFeedback] = useState(null);
  const [neighborAnswer, setNeighborAnswer] = useState(null);

  const rowColQs = useMemo(() => generateRowColQuestions(), []);
  const [rcRound, setRcRound] = useState(0);
  const [rcRevealed, setRcRevealed] = useState([]);

  const visualQs = useMemo(() => generateVisualCounting(), []);
  const [visualRound, setVisualRound] = useState(0);
  const [visualAnswer, setVisualAnswer] = useState(null);
  const [visualFeedback, setVisualFeedback] = useState(null);

  const paintTasks = [
    { title: "Paint the Tens!", check: n => n%10===0, color: "bg-blue-400 text-blue-900", target: 10 },
    { title: "Paint the Fives!", check: n => n%10===5, color: "bg-green-400 text-green-900", target: 20 },
  ];

  const handlePaint = (num) => {
    if (paintTask >= paintTasks.length) return;
    if (paintTasks[paintTask].check(num) && !paintedCells.includes(num)) {
      const next = [...paintedCells, num];
      setPaintedCells(next);
      if (next.length === paintTasks[paintTask].target) setTimeout(() => setPaintTask(t => t + 1), 800);
    }
  };

  const handleNeighbor = (ans) => {
    if (neighborFeedback) return;
    setNeighborAnswer(ans);
    const correct = neighborQs[neighborRound].correct;
    setNeighborFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (neighborRound+1 >= neighborQs.length) setPhase('rowcol');
        else setNeighborRound(r => r+1);
      }
      setNeighborAnswer(null); setNeighborFeedback(null);
    }, 1000);
  };

  const handleRcCell = (num) => {
    const q = rowColQs[rcRound];
    if (!q.hidden.includes(num) || rcRevealed.includes(num)) return;
    const remaining = q.hidden.filter(n => !rcRevealed.includes(n));
    const nextCorrect = Math.min(...remaining);
    if (num === nextCorrect) {
      const next = [...rcRevealed, num];
      setRcRevealed(next);
      if (next.length === q.hidden.length) {
        setTimeout(() => {
          if (rcRound+1 >= rowColQs.length) setPhase('visual');
          else { setRcRound(r=>r+1); setRcRevealed([]); }
        }, 800);
      }
    }
  };

  const checkVisual = (ans) => {
    if (visualFeedback) return;
    setVisualAnswer(ans);
    const correct = visualQs[visualRound].count;
    setVisualFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (visualRound+1 >= visualQs.length) setPhase('complete');
        else setVisualRound(r=>r+1);
      }
      setVisualAnswer(null); setVisualFeedback(null);
    }, 1000);
  };

  const renderGrid = (onCellClick, interactive = true) => (
    <div className="grid grid-cols-10 gap-[3px] w-full max-w-2xl bg-gray-800/80 p-2 rounded-2xl border border-gray-700">
      {Array.from({length:100}).map((_,i) => {
        const num = i+1;
        const isPainted = paintedCells.includes(num);
        const isExplored = exploredNumber === num;
        let cls = "bg-gray-700/80 text-gray-400 hover:bg-gray-600";
        if (isPainted) cls = num%10===0 ? paintTasks[0].color : paintTasks[1].color;
        if (isExplored) cls = "bg-yellow-400 text-yellow-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]";
        return (
          <motion.button key={num} whileTap={{scale:0.85}} onClick={() => interactive && onCellClick?.(num)}
            className={`number-cell aspect-square flex items-center justify-center rounded-md font-bold text-[9px] md:text-xs border border-transparent transition-colors ${cls}`}>{num}</motion.button>
        );
      })}
    </div>
  );

  const PHASES = ['explain','explore','paint','neighbor','rowcol','visual','complete'];

  return (
    <div className="p-3 md:p-6 flex flex-col items-center bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-700/50 overflow-hidden relative text-white min-h-[620px]">
      <HomeButton />
      <div className="flex gap-1.5 mb-3 z-10">
        {PHASES.map((p,i) => <div key={p} className={`w-2.5 h-2.5 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':PHASES.indexOf(phase)>i?'bg-green-400':'bg-white/20'}`}/>)}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-3">The Hundred Chart</h2>
            <p className="text-gray-300 mb-3">All numbers <strong className="text-yellow-300">1 to 100</strong> in a 10×10 grid. Same <strong className="text-blue-300">column</strong> = same ones digit. Same <strong className="text-green-300">row</strong> = same tens digit!</p>
            <button onClick={() => setPhase('explore')} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all mt-4">
              Explore the Chart! 🔍
            </button>
          </motion.div>
        )}

        {phase === 'explore' && (
          <motion.div key="explore" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-xl font-heading text-yellow-300 mb-1">Tap Any Number to Explore</h2>
            {exploredNumber && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-5 py-2 flex items-center gap-3">
                <span className="text-3xl font-black text-yellow-400">{exploredNumber}</span>
                <div className="text-left text-sm">
                  <p className="text-yellow-200 font-bold">{Math.floor(exploredNumber/10)} tens, {exploredNumber%10} ones</p>
                  <p className="text-gray-400">Row {Math.ceil(exploredNumber/10)}, Col {exploredNumber%10||10}</p>
                </div>
              </motion.div>
            )}
            {renderGrid((num) => setExploredNumber(num))}
            <button onClick={() => setPhase('paint')} className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg">
              Painting Challenge! 🎨
            </button>
          </motion.div>
        )}

        {phase === 'paint' && (
          <motion.div key="paint" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            {paintTask < paintTasks.length ? (
              <div className="bg-gray-800 p-2.5 rounded-xl border border-gray-600 mb-3 flex items-center gap-3">
                <Paintbrush size={18} className="text-yellow-400"/>
                <span className="font-bold">{paintTasks[paintTask].title}</span>
                <span className="text-gray-500 font-bold">{paintedCells.length}/{paintTasks[paintTask].target}</span>
              </div>
            ) : (
              <div className="bg-green-900/40 p-2.5 rounded-xl border border-green-500 mb-3"><span className="text-green-400 font-bold">🎨 All painted!</span></div>
            )}
            {renderGrid(handlePaint)}
            {paintTask >= paintTasks.length && (
              <button onClick={() => setPhase('neighbor')} className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-lg rounded-2xl shadow-lg hover:scale-105 transition-all">
                Number Neighbors! 🏘️
              </button>
            )}
          </motion.div>
        )}

        {phase === 'neighbor' && (
          <motion.div key="neighbor" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Number Neighbors</h2>
            <p className="text-gray-300 mb-6 text-sm">{neighborQs[neighborRound].prompt}</p>
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <span className="text-4xl font-black">{neighborQs[neighborRound].num}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {neighborQs[neighborRound].options.map(opt => (
                <motion.button key={opt} whileTap={{scale:0.95}} onClick={() => handleNeighbor(opt)}
                  className={`py-4 text-xl font-black rounded-2xl border-b-4 transition-all
                    ${neighborAnswer===opt&&neighborFeedback==='correct'?'bg-green-500 border-green-700 text-white'
                    :neighborAnswer===opt&&neighborFeedback==='wrong'?'bg-red-500 border-red-700 text-white animate-shake'
                    :'bg-white/10 border-white/5 hover:bg-white/15'}`}>{opt}</motion.button>
              ))}
            </div>
            <div className="flex gap-2 mt-5">{neighborQs.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<neighborRound?'bg-green-400':i===neighborRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'rowcol' && (
          <motion.div key="rowcol" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-xl font-heading text-yellow-300 mb-1">Fill the Missing Numbers!</h2>
            <p className="text-gray-400 mb-3 text-sm">{rowColQs[rcRound].prompt} — tap the missing numbers in order (smallest first)</p>
            <div className="flex gap-2 flex-wrap justify-center max-w-lg mb-4">
              {rowColQs[rcRound].nums.map(num => {
                const isHidden = rowColQs[rcRound].hidden.includes(num);
                const isRevealed = rcRevealed.includes(num);
                return (
                  <motion.button key={num} whileTap={{scale:0.9}} onClick={() => handleRcCell(num)}
                    className={`w-12 h-12 rounded-xl font-black text-lg flex items-center justify-center transition-all border-2
                      ${!isHidden ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300'
                      : isRevealed ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-400/20'}`}>
                    {!isHidden || isRevealed ? num : '?'}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex gap-2">{rowColQs.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<rcRound?'bg-green-400':i===rcRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'visual' && (
          <motion.div key="visual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Count the Groups! 👁️</h2>
            <div className="bg-gray-800/50 rounded-3xl p-5 w-full max-w-lg border border-gray-600 min-h-[140px] flex flex-col items-center justify-center gap-1 mb-4">
              {Array.from({length: Math.floor(visualQs[visualRound].count/10)}).map((_,g) => (
                <div key={g} className="flex gap-0.5">{Array.from({length:10}).map((_,j) => <span key={j} className="text-sm">{visualQs[visualRound].emoji}</span>)}</div>
              ))}
              <div className="flex gap-0.5">{Array.from({length: visualQs[visualRound].count%10}).map((_,j) => <span key={j} className="text-sm">{visualQs[visualRound].emoji}</span>)}</div>
              <p className="text-gray-400 text-xs mt-2">{Math.floor(visualQs[visualRound].count/10)} groups of 10 + {visualQs[visualRound].count%10} extra</p>
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {(() => {
                const c = visualQs[visualRound].count;
                const opts = new Set([c]);
                while(opts.size<4){const r=c+randInt(-8,8); if(r>0&&r<=100) opts.add(r);}
                return shuffle([...opts]).map(o => (
                  <motion.button key={o} whileTap={{scale:0.9}} onClick={() => checkVisual(o)}
                    className={`py-3 text-lg font-black rounded-2xl border-b-4 transition-all
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
            <div className="text-8xl mb-5">🏆</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-3">Chart Explorer!</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-md">You explored, painted, found neighbors, filled rows & columns, and counted visually!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-2xl font-black text-2xl shadow-lg hover:scale-105 transition-all">Next Module 🚀</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
