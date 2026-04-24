import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Box } from 'lucide-react';
import HomeButton from '../../components/ui/HomeButton';

export default function Module4({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [demoStep, setDemoStep] = useState(0);
  const [round, setRound] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [decomposeRound, setDecomposeRound] = useState(0);
  const [decomposeAnswer, setDecomposeAnswer] = useState(null);
  const [decomposeFeedback, setDecomposeFeedback] = useState(null);

  const targets = [34, 61, 47, 80, 55];
  const decomposeQuestions = [
    { num: 56, tens: 5, ones: 6 },
    { num: 83, tens: 8, ones: 3 },
    { num: 29, tens: 2, ones: 9 },
    { num: 70, tens: 7, ones: 0 },
  ];

  const demoNumbers = [
    { num: 45, explanation: "45 has 4 tens (40) and 5 ones (5). So 40 + 5 = 45!" },
    { num: 73, explanation: "73 has 7 tens (70) and 3 ones (3). So 70 + 3 = 73!" },
  ];

  const currentTarget = targets[round];
  const currentTotal = tens * 10 + ones;

  const handleCheck = () => {
    if (currentTotal === currentTarget) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (round + 1 >= targets.length) {
          setPhase('decompose');
        } else {
          setRound(r => r + 1);
          setTens(0); setOnes(0);
        }
      }, 1500);
    }
  };

  const checkDecompose = (tensAns, onesAns) => {
    const q = decomposeQuestions[decomposeRound];
    if (tensAns === q.tens && onesAns === q.ones) {
      setDecomposeFeedback('correct');
      setTimeout(() => {
        if (decomposeRound + 1 >= decomposeQuestions.length) setPhase('complete');
        else { setDecomposeRound(r => r+1); setDecomposeFeedback(null); setDecomposeAnswer(null); }
      }, 1200);
    } else {
      setDecomposeFeedback('wrong');
      setTimeout(() => { setDecomposeFeedback(null); setDecomposeAnswer(null); }, 1200);
    }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700/50 relative text-white min-h-[600px] overflow-hidden">
      <HomeButton />
      <div className="flex gap-2 mb-4 z-10">
        {['explain','build','decompose','complete'].map((p,i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':'bg-white/20'}`}/>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-6">🏭</div>
            <h2 className="text-3xl font-heading text-yellow-300 mb-4">Place Value Factory</h2>
            <p className="text-lg text-gray-300 mb-4">Every two-digit number is made of <strong className="text-blue-300">tens</strong> and <strong className="text-orange-300">ones</strong>.</p>
            
            {demoStep < demoNumbers.length ? (
              <motion.div key={demoStep} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full">
                <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600 mb-6">
                  <span className="text-5xl font-black text-green-400 block mb-4">{demoNumbers[demoStep].num}</span>
                  <div className="flex justify-center gap-6 mb-4 items-end">
                    <div className="flex flex-col items-center">
                      <span className="text-blue-300 font-bold text-sm mb-2">TENS</span>
                      <div className="flex gap-1">
                        {Array.from({length: Math.floor(demoNumbers[demoStep].num/10)}).map((_,i) => (
                          <motion.div key={i} initial={{height:0}} animate={{height:64}} transition={{delay:i*0.15}}
                            className="w-4 bg-blue-400 rounded-sm shadow" />
                        ))}
                      </div>
                    </div>
                    <span className="text-2xl text-gray-500 font-black pb-2">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-orange-300 font-bold text-sm mb-2">ONES</span>
                      <div className="flex gap-1">
                        {Array.from({length: demoNumbers[demoStep].num%10}).map((_,i) => (
                          <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.8+i*0.1}}
                            className="w-4 h-4 bg-orange-400 rounded-sm shadow" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{demoNumbers[demoStep].explanation}</p>
                </div>
                <button onClick={() => setDemoStep(s => s+1)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all">
                  {demoStep + 1 < demoNumbers.length ? 'Next Example →' : 'I Understand! →'}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <p className="text-gray-300 mb-6">Now YOU build numbers using tens and ones!</p>
                <button onClick={() => setPhase('build')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
                  Start Building! 🔨
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div key="build" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-4">Build: {currentTarget}</h2>
            <div className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-6 max-w-lg">
              <div><span className="text-gray-400 text-sm font-bold">TARGET</span><br/><span className="text-4xl font-black text-green-400">{currentTarget}</span></div>
              <div className="text-right"><span className="text-gray-400 text-sm font-bold">YOUR BUILD</span><br/><span className={`text-4xl font-black ${currentTotal===currentTarget?'text-green-400':'text-yellow-400'}`}>{currentTotal}</span></div>
            </div>
            <div className="flex w-full gap-4 max-w-lg flex-1">
              <div className="flex-1 bg-blue-900/30 rounded-2xl border border-blue-500/30 p-4 flex flex-col">
                <h3 className="text-center font-bold text-blue-300 text-sm mb-3 uppercase tracking-wider border-b border-blue-500/20 pb-2">Tens ({tens})</h3>
                <div className="flex-1 flex gap-1 justify-center content-start flex-wrap min-h-[120px]">
                  <AnimatePresence>{Array.from({length:tens}).map((_,i) => (
                    <motion.div key={i} initial={{y:-30,opacity:0}} animate={{y:0,opacity:1}} exit={{scale:0}}
                      className="w-5 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow border border-blue-300/30 relative overflow-hidden">
                      {Array.from({length:9}).map((_,l) => <div key={l} className="w-full h-px bg-blue-700/40 absolute" style={{top:`${(l+1)*10}%`}}/>)}
                    </motion.div>
                  ))}</AnimatePresence>
                </div>
                <button onClick={() => setTens(t => Math.min(t+1,9))} className="w-full py-3 mt-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Layers size={18}/> +Ten
                </button>
              </div>
              <div className="flex-1 bg-orange-900/30 rounded-2xl border border-orange-500/30 p-4 flex flex-col">
                <h3 className="text-center font-bold text-orange-300 text-sm mb-3 uppercase tracking-wider border-b border-orange-500/20 pb-2">Ones ({ones})</h3>
                <div className="flex-1 flex gap-1 justify-center content-start flex-wrap min-h-[120px]">
                  <AnimatePresence>{Array.from({length:ones}).map((_,i) => (
                    <motion.div key={i} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{scale:0}}
                      className="w-5 h-5 bg-gradient-to-br from-orange-300 to-orange-500 rounded-sm shadow border border-orange-200/30" />
                  ))}</AnimatePresence>
                </div>
                <button onClick={() => setOnes(o => Math.min(o+1,9))} className="w-full py-3 mt-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Box size={18}/> +One
                </button>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-lg mt-4">
              <button onClick={() => {setTens(0);setOnes(0);}} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all">Clear</button>
              <button onClick={handleCheck} disabled={currentTotal!==currentTarget}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all border-b-4 ${currentTotal===currentTarget?'bg-green-500 hover:bg-green-400 border-green-700 shadow-[0_0_20px_rgba(74,222,128,0.3)]':'bg-gray-800 border-gray-900 text-gray-600 cursor-not-allowed'}`}>
                Submit ✓
              </button>
            </div>
            <div className="flex gap-2 mt-4">{targets.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<round?'bg-green-400':i===round?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            {showSuccess && (
              <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:2,opacity:0}} className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                <div className="bg-green-500 text-white p-10 rounded-full shadow-[0_0_80px_rgba(34,197,94,0.8)] text-5xl font-black">✓ Match!</div>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'decompose' && (
          <motion.div key="decompose" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-yellow-300 mb-2">Break It Down! 🔍</h2>
            <p className="text-gray-300 mb-6">How many tens and ones in each number?</p>
            <div className="bg-gray-800/80 rounded-3xl p-8 w-full max-w-md border border-gray-600 flex flex-col items-center">
              <span className="text-6xl font-black text-green-400 mb-6">{decomposeQuestions[decomposeRound].num}</span>
              <p className="text-gray-300 mb-4">This number has ___ tens and ___ ones</p>
              <div className="grid grid-cols-2 gap-6 w-full mb-6">
                {[
                  { label: 'Tens', options: Array.from({length:10},(_,i)=>i), correct: decomposeQuestions[decomposeRound].tens, color: 'blue' },
                  { label: 'Ones', options: Array.from({length:10},(_,i)=>i), correct: decomposeQuestions[decomposeRound].ones, color: 'orange' },
                ].map((col, ci) => (
                  <div key={ci} className="flex flex-col items-center">
                    <span className={`text-${col.color}-300 font-bold text-sm mb-2`}>{col.label}</span>
                    <div className="grid grid-cols-5 gap-1">
                      {col.options.map(n => {
                        const selected = decomposeAnswer?.[ci] === n;
                        return (
                          <button key={n} onClick={() => {
                            const newAns = [...(decomposeAnswer || [null,null])];
                            newAns[ci] = n;
                            setDecomposeAnswer(newAns);
                            if (newAns[0] !== null && newAns[1] !== null) checkDecompose(newAns[0], newAns[1]);
                          }}
                          className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${selected ? `bg-${col.color}-500 text-white` : 'bg-white/10 hover:bg-white/20'}`}>
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {decomposeFeedback === 'correct' && <motion.p initial={{scale:0}} animate={{scale:1}} className="text-2xl text-green-400 font-black">✅ Correct!</motion.p>}
              {decomposeFeedback === 'wrong' && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-400 font-bold animate-shake">Try again!</motion.p>}
              <div className="flex gap-2 mt-4">{decomposeQuestions.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<decomposeRound?'bg-green-400':i===decomposeRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-8xl mb-6">🏭</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-4">Factory Master!</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-md">You can build AND break down numbers using place value!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 transition-all">
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
