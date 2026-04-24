import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

export default function Module5({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [demoStep, setDemoStep] = useState(0);
  const [level, setLevel] = useState(0);
  const [frogPos, setFrogPos] = useState(0);
  const [error, setError] = useState(false);
  const [fillRound, setFillRound] = useState(0);
  const [fillAnswer, setFillAnswer] = useState(null);
  const [fillFeedback, setFillFeedback] = useState(null);

  const levels = [
    { step: 2, start: 2, seq: [2,4,6,8,10], label: "Count by 2s" },
    { step: 5, start: 5, seq: [5,10,15,20,25], label: "Count by 5s" },
    { step: 10, start: 10, seq: [10,20,30,40,50], label: "Count by 10s" },
  ];

  const fillQuestions = [
    { seq: [3,6,9,'___',15,18], answer: 12, step: 3 },
    { seq: [10,20,'___',40,50], answer: 30, step: 10 },
    { seq: [4,8,12,16,'___'], answer: 20, step: 4 },
    { seq: [15,20,25,'___',35], answer: 30, step: 5 },
  ];

  const demos = [
    { title: "Skip Counting by 2s", nums: [2,4,6,8,10], desc: "We jump over one number each time: 1, skip, 3, skip, 5..." },
    { title: "Skip Counting by 5s", nums: [5,10,15,20,25], desc: "We add 5 each time. Look at your hand — 5 fingers!" },
    { title: "Skip Counting by 10s", nums: [10,20,30,40,50], desc: "The easiest! Just count the tens digit: 1-ten, 2-tens, 3-tens..." },
  ];

  const isFinished = level < levels.length && frogPos >= levels[level].seq.length;

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        if (level + 1 >= levels.length) setPhase('fill');
        else { setLevel(l => l+1); setFrogPos(0); }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, level]);

  const currentOptions = useMemo(() => {
    if (level >= levels.length || isFinished) return [];
    const target = levels[level].seq[frogPos];
    const opts = [target];
    const distractors = [target-1, target+1, target+levels[level].step, target-levels[level].step].filter(n => n > 0 && n !== target);
    while (opts.length < 4 && distractors.length > 0) {
      const idx = Math.floor(Math.random() * distractors.length);
      if (!opts.includes(distractors[idx])) opts.push(distractors[idx]);
      distractors.splice(idx, 1);
    }
    while (opts.length < 4) { const r = Math.max(1, target + Math.floor(Math.random()*10)-5); if (!opts.includes(r)) opts.push(r); }
    return opts.sort((a,b) => a-b);
  }, [frogPos, level]);

  const handleLilypadClick = (num) => {
    if (isFinished || level >= levels.length) return;
    if (num === levels[level].seq[frogPos]) {
      setFrogPos(p => p+1);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  const checkFill = (ans) => {
    setFillAnswer(ans);
    const correct = fillQuestions[fillRound].answer;
    setFillFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (fillRound + 1 >= fillQuestions.length) setPhase('complete');
        else { setFillRound(r => r+1); setFillAnswer(null); setFillFeedback(null); }
      } else { setFillAnswer(null); setFillFeedback(null); }
    }, 1200);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center bg-gradient-to-b from-teal-900 via-cyan-900 to-teal-950 rounded-3xl shadow-2xl w-full max-w-5xl border border-teal-500/30 relative text-white min-h-[600px] overflow-hidden">
      <HomeButton />
      <div className="flex gap-2 mb-4 z-10">
        {['explain','jump','fill','complete'].map((p,i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':'bg-white/20'}`}/>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-6">🐸</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-4">Number Patterns & Skip Counting</h2>
            <p className="text-lg text-teal-200 mb-6">Instead of counting one by one, we can <strong className="text-yellow-300">skip</strong> numbers in a pattern!</p>
            
            {demoStep < demos.length ? (
              <motion.div key={demoStep} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full">
                <div className="bg-teal-800/60 rounded-2xl p-6 border border-teal-500/30 mb-4">
                  <h3 className="text-xl font-bold text-teal-200 mb-3">{demos[demoStep].title}</h3>
                  <div className="flex gap-2 justify-center mb-4">
                    {demos[demoStep].nums.map((n,i) => (
                      <motion.div key={n} initial={{scale:0,y:20}} animate={{scale:1,y:0}} transition={{delay:i*0.2,type:'spring'}}
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center font-black text-lg text-teal-900 shadow-lg">
                        {n}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-teal-300 text-sm">{demos[demoStep].desc}</p>
                </div>
                <button onClick={() => setDemoStep(s => s+1)} className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl transition-all">
                  {demoStep + 1 < demos.length ? 'Next Pattern →' : 'Let\'s Practice! →'}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <p className="text-teal-200 mb-6">Help the frog skip-jump across the pond!</p>
                <button onClick={() => setPhase('jump')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
                  Start Jumping! 🐸
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'jump' && level < levels.length && (
          <motion.div key="jump" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">{levels[level].label}</h2>
            <p className="text-teal-200 mb-4 text-sm bg-black/20 px-4 py-1 rounded-full">
              Skip count by <strong className="text-yellow-400 text-lg">{levels[level].step}s</strong>
            </p>

            {/* Pond */}
            <div className="relative w-full flex-1 min-h-[200px] bg-cyan-500/10 rounded-3xl border border-cyan-400/20 overflow-hidden flex items-center px-8 mb-6">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-24 h-12 border border-white rounded-[100%] animate-ping" style={{animationDuration:'3s'}}/>
              </div>
              <div className="w-12 h-full bg-green-800/60 absolute left-0 top-0 rounded-r-[100%]"/>
              <div className="w-12 h-full bg-green-800/60 absolute right-0 top-0 rounded-l-[100%]"/>
              
              <div className="w-full flex justify-between z-10 px-8">
                {levels[level].seq.map((num, i) => {
                  const isCurrent = i === frogPos;
                  const isPast = i < frogPos;
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <div className={`w-14 h-10 md:w-20 md:h-14 rounded-[100%] flex items-center justify-center transition-all
                        ${isPast ? 'bg-green-600 shadow-[0_4px_0_rgb(21,128,61)]' : 'bg-green-700/40 border border-green-500/40'}`}>
                        {isPast ? <span className="text-lg md:text-2xl font-black text-green-200">{num}</span> : <span className="text-white/30">?</span>}
                      </div>
                      {isCurrent && (
                        <motion.div layoutId="frog" animate={error ? {x:[-8,8,-8,8,0]} : {y:[0,-30,0]}}
                          transition={{type:error?'tween':'spring', duration:error?0.3:0.8, bounce:0.5}}
                          className="absolute -top-10 md:-top-14 text-4xl md:text-6xl z-20 select-none pointer-events-none">🐸</motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isFinished && (
                <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute inset-0 flex items-center justify-center bg-cyan-900/70 backdrop-blur-sm z-30">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏆</div>
                    <h3 className="text-2xl font-bold text-yellow-300">Great Skip Counting!</h3>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Options */}
            <h3 className="text-lg font-bold text-teal-200 mb-3 uppercase tracking-wider">Which comes next?</h3>
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
              {!isFinished && currentOptions.map(opt => (
                <motion.button key={opt} whileTap={{scale:0.9}} onClick={() => handleLilypadClick(opt)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-yellow-950 font-black text-2xl md:text-3xl shadow-[0_8px_16px_rgba(0,0,0,0.3)] border-4 border-yellow-200 transition-all flex items-center justify-center">
                  {opt}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">{levels.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<level?'bg-green-400':i===level?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'fill' && (
          <motion.div key="fill" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Fill the Pattern! ✏️</h2>
            <p className="text-teal-200 mb-6">Find the missing number in each pattern.</p>
            <div className="bg-teal-800/40 rounded-3xl p-8 w-full max-w-lg border border-teal-500/20 flex flex-col items-center">
              <p className="text-teal-300 mb-4 text-sm">Counting by {fillQuestions[fillRound].step}s</p>
              <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {fillQuestions[fillRound].seq.map((n, i) => (
                  <div key={i} className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl border-2 
                    ${n === '___' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 animate-pulse' : 'border-teal-400/30 bg-teal-900/50 text-white'}`}>
                    {n === '___' ? '?' : n}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3 w-full">
                {(() => {
                  const c = fillQuestions[fillRound].answer;
                  const opts = [c];
                  while(opts.length<4){const r=c+Math.floor(Math.random()*10)-5; if(r>0&&!opts.includes(r))opts.push(r);}
                  return opts.sort((a,b)=>a-b).map(o => (
                    <motion.button key={o} whileTap={{scale:0.9}} onClick={() => !fillFeedback && checkFill(o)}
                      className={`py-4 text-xl font-black rounded-2xl border-b-4 transition-all
                        ${fillAnswer===o&&fillFeedback==='correct'?'bg-green-500 border-green-700 text-white'
                        :fillAnswer===o&&fillFeedback==='wrong'?'bg-red-500 border-red-700 text-white animate-shake'
                        :'bg-white/10 border-white/5 hover:bg-white/20'}`}>{o}</motion.button>
                  ));
                })()}
              </div>
              <div className="flex gap-2 mt-6">{fillQuestions.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<fillRound?'bg-green-400':i===fillRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-8xl mb-6">🐸</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-4">Pattern Master!</h2>
            <p className="text-xl text-teal-200 mb-8 max-w-md">You mastered skip counting and number patterns!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:scale-105 transition-all">
              Finish Module 🏁
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
