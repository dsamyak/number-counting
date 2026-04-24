import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateJumpLevels() {
  const levels = [];
  const steps = [2, 5, 10];
  for (const step of steps) {
    const maxStart = step === 2 ? 8 : step === 5 ? 20 : 50;
    const start = randInt(1, Math.floor(maxStart/step)) * step;
    const seq = Array.from({length: 5}, (_, i) => start + i * step);
    levels.push({ step, start, seq, label: `Count by ${step}s` });
  }
  return levels;
}

function generateFillQuestions() {
  const qs = [];
  const configs = [{step:2, len:5}, {step:5, len:5}, {step:10, len:5}, {step:randInt(2,4), len:5}];
  
  for (const conf of configs) {
    const maxStart = 100 - (conf.step * conf.len);
    const start = randInt(1, maxStart);
    const seq = Array.from({length: conf.len}, (_, i) => start + i * conf.step);
    
    const missingIdx = randInt(1, conf.len - 2); // Don't hide first or last
    const answer = seq[missingIdx];
    const displaySeq = [...seq];
    displaySeq[missingIdx] = '___';
    
    const opts = new Set([answer]);
    while (opts.size < 4) {
      const r = answer + randInt(-3, 3) * conf.step;
      if (r > 0 && r !== answer) opts.add(r);
    }
    
    qs.push({ seq: displaySeq, answer, step: conf.step, options: shuffle([...opts]) });
  }
  return shuffle(qs);
}

export default function Module5({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [demoStep, setDemoStep] = useState(0);

  const levels = useMemo(() => generateJumpLevels(), []);
  const [level, setLevel] = useState(0);
  const [frogPos, setFrogPos] = useState(0);
  const [jumpError, setJumpError] = useState(false);

  const fillQs = useMemo(() => generateFillQuestions(), []);
  const [fillRound, setFillRound] = useState(0);
  const [fillAnswer, setFillAnswer] = useState(null);
  const [fillFeedback, setFillFeedback] = useState(null);

  const demos = [
    { title: "Skip by 2s", nums: [2,4,6,8,10], desc: "Jump over one number each time!" },
    { title: "Skip by 5s", nums: [5,10,15,20,25], desc: "Like counting hands (5 fingers)!" },
    { title: "Skip by 10s", nums: [10,20,30,40,50], desc: "Just count the tens digit up!" },
  ];

  const isFinished = level < levels.length && frogPos >= levels[level].seq.length;

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        if (level + 1 >= levels.length) setPhase('fill');
        else { setLevel(l => l+1); setFrogPos(0); }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFinished, level]);

  const currentOptions = useMemo(() => {
    if (level >= levels.length || isFinished) return [];
    const target = levels[level].seq[frogPos];
    const step = levels[level].step;
    const opts = new Set([target]);
    opts.add(target + step);
    if (target - step > 0) opts.add(target - step);
    while (opts.size < 4) { const r = target + randInt(-2, 3) * step; if (r > 0) opts.add(r); }
    return shuffle([...opts]);
  }, [frogPos, level, isFinished, levels]);

  const handleLilypadClick = (num) => {
    if (isFinished || level >= levels.length) return;
    if (num === levels[level].seq[frogPos]) {
      setFrogPos(p => p+1); setJumpError(false);
    } else {
      setJumpError(true); setTimeout(() => setJumpError(false), 500);
    }
  };

  const checkFill = (ans) => {
    if (fillFeedback) return;
    setFillAnswer(ans);
    const correct = fillQs[fillRound].answer;
    setFillFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (fillRound+1 >= fillQs.length) setPhase('complete');
        else setFillRound(r=>r+1);
      }
      setFillAnswer(null); setFillFeedback(null);
    }, 1000);
  };

  const PHASES = ['explain','jump','fill','complete'];

  return (
    <div className="p-4 md:p-6 flex flex-col items-center bg-gradient-to-b from-teal-900 via-cyan-900 to-teal-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-teal-500/30 relative text-white min-h-[620px] overflow-hidden">
      <HomeButton />
      <div className="flex gap-1.5 mb-4 z-10">
        {PHASES.map((p,i) => <div key={p} className={`w-2.5 h-2.5 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':PHASES.indexOf(phase)>i?'bg-green-400':'bg-white/20'}`}/>)}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-4">🐸</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-2">Skip Counting</h2>
            <p className="text-teal-200 mb-6">Instead of one by one, we can <strong className="text-yellow-300">skip</strong> numbers in a pattern!</p>
            
            {demoStep < demos.length ? (
              <motion.div key={demoStep} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full">
                <div className="bg-teal-800/60 rounded-2xl p-5 border border-teal-500/30 mb-5">
                  <h3 className="text-xl font-bold text-teal-200 mb-4">{demos[demoStep].title}</h3>
                  <div className="flex gap-2 justify-center mb-5">
                    {demos[demoStep].nums.map((n,i) => (
                      <motion.div key={n} initial={{scale:0,y:20}} animate={{scale:1,y:0}} transition={{delay:i*0.15,type:'spring'}}
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center font-black text-xl text-teal-900 shadow-lg">{n}</motion.div>
                    ))}
                  </div>
                  <p className="text-teal-300 text-sm font-bold bg-black/20 py-2 rounded-lg">{demos[demoStep].desc}</p>
                </div>
                <button onClick={() => setDemoStep(s => s+1)} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all">
                  {demoStep + 1 < demos.length ? 'Next Pattern →' : "Let's Jump! 🐸"}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <p className="text-teal-200 mb-5">Help the frog skip-jump across the pond!</p>
                <button onClick={() => setPhase('jump')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">Start Jumping! 🌊</button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'jump' && level < levels.length && (
          <motion.div key="jump" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">{levels[level].label}</h2>
            <p className="text-teal-200 mb-4 text-xs bg-black/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">Skip by {levels[level].step}s</p>

            <div className="relative w-full flex-1 min-h-[160px] bg-cyan-500/10 rounded-3xl border border-cyan-400/20 flex items-center px-6 mb-6">
              <div className="w-10 h-full bg-green-800/60 absolute left-0 top-0 rounded-r-full"/>
              <div className="w-10 h-full bg-green-800/60 absolute right-0 top-0 rounded-l-full"/>
              
              <div className="w-full flex justify-between z-10 px-6">
                {levels[level].seq.map((num, i) => {
                  const isCurrent = i === frogPos;
                  const isPast = i < frogPos;
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <div className={`w-12 h-8 md:w-16 md:h-12 rounded-[100%] flex items-center justify-center transition-all border-2
                        ${isPast ? 'bg-green-600 border-green-500 shadow-[0_4px_0_rgb(21,128,61)]' : 'bg-green-700/40 border-green-500/30'}`}>
                        {isPast ? <span className="text-sm md:text-lg font-black text-green-100">{num}</span> : <span className="text-white/20">?</span>}
                      </div>
                      {isCurrent && (
                        <motion.div layoutId="frog" animate={jumpError ? {x:[-8,8,-8,8,0]} : {y:[0,-20,0]}} transition={{type:jumpError?'tween':'spring', duration:jumpError?0.3:0.6}}
                          className="absolute -top-10 text-4xl z-20 pointer-events-none drop-shadow-lg">🐸</motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isFinished && (
                <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute inset-0 flex items-center justify-center bg-cyan-900/80 backdrop-blur-sm z-30 rounded-3xl">
                  <div className="text-center"><div className="text-5xl mb-2">🏆</div><h3 className="text-xl font-bold text-yellow-300">Perfect Jumps!</h3></div>
                </motion.div>
              )}
            </div>

            <h3 className="text-sm font-bold text-teal-300 mb-3 uppercase tracking-wider">Which number is next?</h3>
            <div className="flex gap-3 justify-center w-full flex-wrap max-w-sm">
              {!isFinished && currentOptions.map(opt => (
                <motion.button key={opt} whileTap={{scale:0.9}} onClick={() => handleLilypadClick(opt)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-b from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-teal-900 font-black text-2xl shadow-lg border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all">
                  {opt}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2 mt-5">{levels.map((_,i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i<level?'bg-green-400':i===level?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'fill' && (
          <motion.div key="fill" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">Fill the Pattern! ✏️</h2>
            <div className="bg-teal-800/40 rounded-3xl p-6 w-full max-w-md border border-teal-500/20 flex flex-col items-center mt-3">
              <p className="text-teal-300 mb-6 text-sm font-bold bg-black/20 px-4 py-1 rounded-lg">Skip by {fillQs[fillRound].step}s</p>
              <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {fillQs[fillRound].seq.map((n, i) => (
                  <div key={i} className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-lg border-2 
                    ${n === '___' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 animate-pulse' : 'border-teal-400/30 bg-teal-900/50 text-white shadow-inner'}`}>
                    {n === '___' ? '?' : n}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {fillQs[fillRound].options.map(o => (
                  <motion.button key={o} whileTap={{scale:0.95}} onClick={() => checkFill(o)}
                    className={`py-4 text-xl font-black rounded-2xl border-b-4 transition-all
                      ${fillAnswer===o&&fillFeedback==='correct'?'bg-green-500 border-green-700 text-white scale-105'
                      :fillAnswer===o&&fillFeedback==='wrong'?'bg-red-500 border-red-700 text-white animate-shake'
                      :'bg-white/10 border-white/5 hover:bg-white/20 active:border-b-0 active:translate-y-1'}`}>{o}</motion.button>
                ))}
              </div>
              <div className="flex gap-2 mt-5">{fillQs.map((_,i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i<fillRound?'bg-green-400':i===fillRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-7xl mb-5">🐸</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-3">Pattern Master!</h2>
            <p className="text-lg text-teal-200 mb-8 max-w-md">You mastered skip counting by 2s, 5s, 10s, and custom patterns!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-2xl shadow-lg hover:scale-105 transition-all">Finish Module 🏁</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
