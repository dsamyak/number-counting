import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Box } from 'lucide-react';
import HomeButton from '../../components/ui/HomeButton';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateBuildTargets() {
  const targets = new Set();
  while (targets.size < 4) targets.add(randInt(21, 99));
  return [...targets];
}

function generateDecomposeQuestions() {
  const qs = [];
  for (let i = 0; i < 4; i++) {
    const num = randInt(21, 99);
    qs.push({ num, tens: Math.floor(num/10), ones: num%10 });
  }
  return qs;
}

function generateCombineQuestions() {
  const qs = [];
  for (let i = 0; i < 4; i++) {
    const tens = randInt(2, 9);
    const ones = randInt(0, 9);
    const num = tens*10 + ones;
    const opts = new Set([num]);
    while(opts.size < 4) { const r = randInt(Math.max(20,num-15), Math.min(99,num+15)); if(r!==num) opts.add(r); }
    qs.push({ tens, ones, num, options: shuffle([...opts]) });
  }
  return qs;
}

export default function Module4({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [demoStep, setDemoStep] = useState(0);

  const targets = useMemo(() => generateBuildTargets(), []);
  const [round, setRound] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const decomposeQs = useMemo(() => generateDecomposeQuestions(), []);
  const [decomposeRound, setDecomposeRound] = useState(0);
  const [decomposeAnswer, setDecomposeAnswer] = useState([null, null]);
  const [decomposeFeedback, setDecomposeFeedback] = useState(null);

  const combineQs = useMemo(() => generateCombineQuestions(), []);
  const [combineRound, setCombineRound] = useState(0);
  const [combineAnswer, setCombineAnswer] = useState(null);
  const [combineFeedback, setCombineFeedback] = useState(null);

  const currentTarget = targets[round];
  const currentTotal = tens * 10 + ones;

  const handleCheck = () => {
    if (currentTotal === currentTarget) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (round + 1 >= targets.length) setPhase('decompose');
        else { setRound(r => r + 1); setTens(0); setOnes(0); }
      }, 1200);
    }
  };

  const checkDecompose = (tensAns, onesAns) => {
    const q = decomposeQs[decomposeRound];
    if (tensAns === q.tens && onesAns === q.ones) {
      setDecomposeFeedback('correct');
      setTimeout(() => {
        if (decomposeRound + 1 >= decomposeQs.length) setPhase('combine');
        else { setDecomposeRound(r => r+1); setDecomposeFeedback(null); setDecomposeAnswer([null,null]); }
      }, 1000);
    } else {
      setDecomposeFeedback('wrong');
      setTimeout(() => { setDecomposeFeedback(null); setDecomposeAnswer([null,null]); }, 1000);
    }
  };

  const handleCombine = (ans) => {
    if (combineFeedback) return;
    setCombineAnswer(ans);
    const correct = combineQs[combineRound].num;
    setCombineFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (combineRound+1 >= combineQs.length) setPhase('complete');
        else { setCombineRound(r=>r+1); }
      }
      setCombineAnswer(null); setCombineFeedback(null);
    }, 1000);
  };

  const PHASES = ['explain','build','decompose','combine','complete'];

  return (
    <div className="p-4 md:p-6 flex flex-col items-center bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700/50 relative text-white min-h-[620px] overflow-hidden">
      <HomeButton />
      <div className="flex gap-1.5 mb-4 z-10">
        {PHASES.map((p,i) => <div key={p} className={`w-2.5 h-2.5 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':PHASES.indexOf(phase)>i?'bg-green-400':'bg-white/20'}`}/>)}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-5">🏭</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-3">Place Value Factory</h2>
            <p className="text-gray-300 mb-4">Every two-digit number is made of <strong className="text-blue-300">tens</strong> and <strong className="text-orange-300">ones</strong>.</p>
            
            {demoStep === 0 ? (
              <motion.div key="d0" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full bg-gray-800/80 rounded-2xl p-6 border border-gray-600 mb-5">
                <span className="text-5xl font-black text-green-400 block mb-4">45</span>
                <div className="flex justify-center gap-6 mb-4 items-end">
                  <div className="flex flex-col items-center">
                    <span className="text-blue-300 font-bold text-xs mb-2">4 TENS (40)</span>
                    <div className="flex gap-1">{Array.from({length:4}).map((_,i) => <motion.div key={i} initial={{height:0}} animate={{height:60}} transition={{delay:i*0.1}} className="w-3 bg-blue-400 rounded-sm shadow" />)}</div>
                  </div>
                  <span className="text-2xl text-gray-500 font-black pb-2">+</span>
                  <div className="flex flex-col items-center">
                    <span className="text-orange-300 font-bold text-xs mb-2">5 ONES (5)</span>
                    <div className="flex gap-1">{Array.from({length:5}).map((_,i) => <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5+i*0.1}} className="w-3 h-3 bg-orange-400 rounded-sm shadow" />)}</div>
                  </div>
                </div>
                <button onClick={() => setDemoStep(1)} className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">Next Example →</button>
              </motion.div>
            ) : (
              <motion.div key="d1" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full">
                <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600 mb-5">
                  <span className="text-5xl font-black text-green-400 block mb-4">73</span>
                  <div className="flex justify-center gap-6 mb-4 items-end">
                    <div className="flex flex-col items-center">
                      <span className="text-blue-300 font-bold text-xs mb-2">7 TENS (70)</span>
                      <div className="flex gap-1 flex-wrap justify-center max-w-[80px]">{Array.from({length:7}).map((_,i) => <motion.div key={i} initial={{height:0}} animate={{height:40}} transition={{delay:i*0.1}} className="w-2.5 bg-blue-400 rounded-sm shadow" />)}</div>
                    </div>
                    <span className="text-2xl text-gray-500 font-black pb-2">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-orange-300 font-bold text-xs mb-2">3 ONES (3)</span>
                      <div className="flex gap-1">{Array.from({length:3}).map((_,i) => <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.8+i*0.1}} className="w-3 h-3 bg-orange-400 rounded-sm shadow" />)}</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setPhase('build')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">Start Building! 🔨</button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div key="build" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-3">Build: <span className="text-green-400 text-3xl">{currentTarget}</span></h2>
            <div className="flex items-center gap-4 mb-4 bg-gray-800 px-6 py-2 rounded-full border border-gray-700">
              <span className="text-gray-400 text-sm font-bold">Your build:</span>
              <span className={`text-3xl font-black ${currentTotal===currentTarget?'text-green-400':'text-yellow-400'}`}>{currentTotal}</span>
            </div>
            <div className="flex w-full gap-3 max-w-lg flex-1 min-h-[220px]">
              <div className="flex-1 bg-blue-900/30 rounded-2xl border border-blue-500/30 p-3 flex flex-col">
                <h3 className="text-center font-bold text-blue-300 text-xs mb-2 uppercase tracking-wider border-b border-blue-500/20 pb-2">Tens ({tens})</h3>
                <div className="flex-1 flex gap-1 justify-center content-start flex-wrap">
                  <AnimatePresence>{Array.from({length:tens}).map((_,i) => (
                    <motion.div key={i} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{scale:0}} className="w-4 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow border border-blue-300/30" />
                  ))}</AnimatePresence>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setTens(t=>Math.max(0,t-1))} className="flex-1 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg font-bold transition active:scale-95">−</button>
                  <button onClick={() => setTens(t=>Math.min(t+1,9))} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition active:scale-95">+</button>
                </div>
              </div>
              <div className="flex-1 bg-orange-900/30 rounded-2xl border border-orange-500/30 p-3 flex flex-col">
                <h3 className="text-center font-bold text-orange-300 text-xs mb-2 uppercase tracking-wider border-b border-orange-500/20 pb-2">Ones ({ones})</h3>
                <div className="flex-1 flex gap-1 justify-center content-start flex-wrap">
                  <AnimatePresence>{Array.from({length:ones}).map((_,i) => (
                    <motion.div key={i} initial={{y:-15,opacity:0}} animate={{y:0,opacity:1}} exit={{scale:0}} className="w-4 h-4 bg-gradient-to-br from-orange-300 to-orange-500 rounded-sm shadow border border-orange-200/30" />
                  ))}</AnimatePresence>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setOnes(o=>Math.max(0,o-1))} className="flex-1 py-2 bg-orange-800 hover:bg-orange-700 rounded-lg font-bold transition active:scale-95">−</button>
                  <button onClick={() => setOnes(o=>Math.min(o+1,9))} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold transition active:scale-95">+</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-lg mt-3">
              <button onClick={() => {setTens(0);setOnes(0);}} className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition">Clear</button>
              <button onClick={handleCheck} disabled={currentTotal!==currentTarget}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${currentTotal===currentTarget?'bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(74,222,128,0.3)]':'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Submit ✓</button>
            </div>
            <div className="flex gap-2 mt-3">{targets.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<round?'bg-green-400':i===round?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            {showSuccess && (
              <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:2,opacity:0}} className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                <div className="bg-green-500 text-white p-8 rounded-full shadow-[0_0_60px_rgba(34,197,94,0.8)] text-4xl font-black">✓ Match!</div>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'decompose' && (
          <motion.div key="decompose" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Break It Down! 🔍</h2>
            <div className="bg-gray-800/80 rounded-3xl p-6 w-full max-w-md border border-gray-600 flex flex-col items-center mt-2">
              <span className="text-6xl font-black text-green-400 mb-4">{decomposeQs[decomposeRound].num}</span>
              <p className="text-gray-300 mb-4 text-sm">How many tens and ones?</p>
              <div className="grid grid-cols-2 gap-4 w-full mb-4">
                {[
                  { label: 'Tens', options: Array.from({length:10},(_,i)=>i), correct: decomposeQs[decomposeRound].tens, color: 'blue' },
                  { label: 'Ones', options: Array.from({length:10},(_,i)=>i), correct: decomposeQs[decomposeRound].ones, color: 'orange' },
                ].map((col, ci) => (
                  <div key={ci} className="flex flex-col items-center">
                    <span className={`text-${col.color}-300 font-bold text-xs mb-2`}>{col.label}</span>
                    <div className="grid grid-cols-5 gap-1">
                      {col.options.map(n => {
                        const selected = decomposeAnswer[ci] === n;
                        return (
                          <button key={n} onClick={() => {
                            const newAns = [...decomposeAnswer]; newAns[ci] = n; setDecomposeAnswer(newAns);
                            if (newAns[0] !== null && newAns[1] !== null) checkDecompose(newAns[0], newAns[1]);
                          }}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-md font-bold text-sm transition-all ${selected ? `bg-${col.color}-500 text-white` : 'bg-white/10 hover:bg-white/20'}`}>{n}</button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {decomposeFeedback === 'correct' && <motion.p initial={{scale:0}} animate={{scale:1}} className="text-xl text-green-400 font-black">✅ Correct!</motion.p>}
              {decomposeFeedback === 'wrong' && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-400 font-bold animate-shake">Try again!</motion.p>}
              <div className="flex gap-2 mt-4">{decomposeQs.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<decomposeRound?'bg-green-400':i===decomposeRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'combine' && (
          <motion.div key="combine" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Put It Together! 🧩</h2>
            <div className="bg-gray-800/80 rounded-3xl p-6 w-full max-w-md border border-gray-600 flex flex-col items-center mt-2">
              <div className="flex gap-4 items-center mb-6">
                <div className="flex flex-col items-center bg-blue-900/40 p-3 rounded-xl border border-blue-500/30">
                  <span className="text-4xl font-black text-blue-400">{combineQs[combineRound].tens}</span>
                  <span className="text-blue-200 text-xs font-bold mt-1">TENS</span>
                </div>
                <span className="text-3xl text-gray-500 font-black">+</span>
                <div className="flex flex-col items-center bg-orange-900/40 p-3 rounded-xl border border-orange-500/30">
                  <span className="text-4xl font-black text-orange-400">{combineQs[combineRound].ones}</span>
                  <span className="text-orange-200 text-xs font-bold mt-1">ONES</span>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-sm">What number does this make?</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {combineQs[combineRound].options.map(opt => (
                  <motion.button key={opt} whileTap={{scale:0.95}} onClick={() => handleCombine(opt)}
                    className={`py-3 text-2xl font-black rounded-2xl border-b-4 transition-all
                      ${combineFeedback && opt === combineQs[combineRound].num ? 'bg-green-500 border-green-700 text-white scale-105'
                      : combineFeedback === 'wrong' && opt !== combineQs[combineRound].num ? 'bg-white/5 border-white/5 text-white/30'
                      : 'bg-white/10 border-white/5 hover:bg-white/15 active:border-b-0 active:translate-y-1'}`}>{opt}</motion.button>
                ))}
              </div>
              <div className="flex gap-2 mt-6">{combineQs.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<combineRound?'bg-green-400':i===combineRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-7xl mb-5">🏭</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-3">Factory Master!</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-md">You built, decomposed, and combined numbers perfectly!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-black text-2xl shadow-lg hover:scale-105 transition-all">Next Module 🚀</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
