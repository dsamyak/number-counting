import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

const NUMBER_WORDS = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
const NUMBER_EMOJIS = ["🍎","🌟","🐟","🦋","🎈","🌸","🐝","🍀","🎵","💎"];

export default function Module1({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [step, setStep] = useState(0);
  const [activeNumber, setActiveNumber] = useState(1);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState(null);
  const [spellingRound, setSpellingRound] = useState(0);
  const [countClicked, setCountClicked] = useState([]);
  const [visualRound, setVisualRound] = useState(0);
  const [visualAnswer, setVisualAnswer] = useState(null);
  const [visualFeedback, setVisualFeedback] = useState(null);

  const spellingNumbers = [3, 5, 7, 1, 10];
  const visualQuestions = [
    { emoji: '🍎', count: 4 },
    { emoji: '⭐', count: 7 },
    { emoji: '🐠', count: 3 },
    { emoji: '🌺', count: 8 },
    { emoji: '🦊', count: 6 },
  ];

  // Phase: explain - auto advance numbers
  useEffect(() => {
    if (phase === 'explain' && step === 1) {
      const timer = setInterval(() => {
        setActiveNumber(n => {
          if (n >= 10) { clearInterval(timer); setTimeout(() => setStep(2), 1500); return 10; }
          return n + 1;
        });
      }, 2200);
      return () => clearInterval(timer);
    }
  }, [phase, step]);

  const handleCountObject = (idx) => {
    if (countClicked.includes(idx)) return;
    const next = [...countClicked, idx];
    setCountClicked(next);
    if (next.length >= 10) setTimeout(() => setPhase('spelling'), 1500);
  };

  const checkSpelling = () => {
    const correct = NUMBER_WORDS[spellingNumbers[spellingRound] - 1].toLowerCase();
    if (spellingInput.trim().toLowerCase() === correct) {
      setSpellingFeedback('correct');
      setTimeout(() => {
        if (spellingRound + 1 >= spellingNumbers.length) {
          setPhase('visual');
        } else {
          setSpellingRound(r => r + 1);
          setSpellingInput('');
          setSpellingFeedback(null);
        }
      }, 1200);
    } else {
      setSpellingFeedback('wrong');
      setTimeout(() => setSpellingFeedback(null), 1200);
    }
  };

  const checkVisual = (ans) => {
    const correct = visualQuestions[visualRound].count;
    setVisualAnswer(ans);
    setVisualFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct && visualRound + 1 >= visualQuestions.length) {
        setPhase('complete');
      } else if (ans === correct) {
        setVisualRound(r => r + 1);
        setVisualAnswer(null);
        setVisualFeedback(null);
      } else {
        setVisualAnswer(null);
        setVisualFeedback(null);
      }
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-indigo-500/30 overflow-hidden relative min-h-[600px] text-white">
      <HomeButton />

      {/* Progress dots */}
      <div className="flex gap-2 mb-6 z-10">
        {['explain','counting','spelling','visual','complete'].map((p, i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all duration-500 ${
            p === phase ? 'bg-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,0.7)]' 
            : ['explain','counting','spelling','visual','complete'].indexOf(phase) > i 
              ? 'bg-green-400' : 'bg-white/20'
          }`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== PHASE 1: EXPLAIN ===== */}
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1 justify-center">
            {step === 0 && (
              <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} className="flex flex-col items-center text-center max-w-lg">
                <div className="text-7xl mb-6">🔢</div>
                <h2 className="text-3xl md:text-4xl font-heading text-yellow-300 mb-4">What is Counting?</h2>
                <p className="text-lg text-blue-200 mb-4 leading-relaxed">
                  Counting means saying numbers <strong className="text-yellow-300">in order</strong> to find out <strong className="text-yellow-300">how many</strong> things there are.
                </p>
                <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                  We start from <strong className="text-white text-2xl">1</strong> and go up: 1, 2, 3, 4, 5... Each number is <strong className="text-yellow-300">one more</strong> than the number before it!
                </p>
                <div className="flex gap-2 mb-8">
                  {[1,2,3,4,5].map(n => (
                    <motion.div key={n} initial={{scale:0}} animate={{scale:1}} transition={{delay:n*0.15, type:'spring'}}
                      className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center font-black text-xl text-indigo-900 shadow-lg">
                      {n}
                    </motion.div>
                  ))}
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.9}} className="w-12 h-12 flex items-center justify-center text-2xl text-yellow-400">...</motion.div>
                </div>
                <button onClick={() => setStep(1)} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 font-black text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-b-4 border-orange-500 active:border-b-0">
                  Watch Me Count! 👀
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-heading text-yellow-300 mb-8">Watch: Counting 1 to 10</h2>
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  <motion.div key={activeNumber} initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}} transition={{type:'spring',bounce:0.5}}
                    className="absolute flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-48 h-48 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]">
                    <span className="text-7xl font-black font-heading">{activeNumber}</span>
                    <span className="text-xl font-bold text-yellow-300 mt-1">{NUMBER_WORDS[activeNumber-1]}</span>
                  </motion.div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap justify-center max-w-xs">
                  {Array.from({length: activeNumber}).map((_,i) => (
                    <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.05}}
                      className="text-2xl">{NUMBER_EMOJIS[i]}</motion.div>
                  ))}
                </div>
                <button onClick={() => {setStep(2);}} className="mt-8 text-white/50 hover:text-white underline text-sm">Skip →</button>
              </div>
            )}

            {step === 2 && (
              <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-heading text-yellow-300 mb-4">Great! You know 1–10!</h2>
                <p className="text-lg text-blue-200 mb-6">Each number has a <strong className="text-yellow-300">name</strong> (like "Three") and a <strong className="text-yellow-300">symbol</strong> (like "3").</p>
                <div className="grid grid-cols-5 gap-3 mb-8">
                  {NUMBER_WORDS.map((w,i) => (
                    <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.08}}
                      className="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/15">
                      <span className="text-2xl font-black text-yellow-400">{i+1}</span>
                      <span className="text-xs text-blue-200 font-bold mt-1">{w}</span>
                    </motion.div>
                  ))}
                </div>
                <button onClick={() => setPhase('counting')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-b-4 border-green-600 active:border-b-0">
                  Now Let's Practice! ✋
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===== PHASE 2: TAP-TO-COUNT SIMULATION ===== */}
        {phase === 'counting' && (
          <motion.div key="counting" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl md:text-3xl font-heading text-yellow-300 mb-2">Tap Each Object to Count!</h2>
            <p className="text-blue-200 mb-6">Touch them <strong className="text-yellow-300">one by one</strong> in order.</p>
            <div className="relative w-full max-w-lg h-[350px] bg-indigo-950/60 rounded-3xl border border-indigo-400/30 overflow-hidden p-6">
              <div className="flex flex-wrap gap-4 justify-center content-center h-full">
                {Array.from({length:10}).map((_,i) => {
                  const isClicked = countClicked.includes(i);
                  const isNext = countClicked.length === i;
                  return (
                    <motion.button key={i} whileTap={{scale:0.8}}
                      onClick={() => isNext && handleCountObject(i)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 relative
                        ${isClicked ? 'bg-green-500/30 border-2 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]' 
                        : isNext ? 'bg-yellow-400/20 border-2 border-yellow-400 animate-pulse-glow cursor-pointer' 
                        : 'bg-white/5 border-2 border-white/10 cursor-not-allowed opacity-60'}`}>
                      {NUMBER_EMOJIS[i]}
                      {isClicked && (
                        <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow">
                          {i+1}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <div className="glass-dark px-6 py-2 rounded-full flex items-center gap-3">
                  <span className="text-blue-300 font-bold">Counted:</span>
                  <span className="text-3xl font-black text-yellow-400">{countClicked.length}</span>
                  <span className="text-blue-300 font-bold">/ 10</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 3: SPELLING ===== */}
        {phase === 'spelling' && (
          <motion.div key="spelling" initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl md:text-3xl font-heading text-yellow-300 mb-2">Spell the Number! ✏️</h2>
            <p className="text-blue-200 mb-8">Type the word for each number shown.</p>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 w-full max-w-md border border-white/15 flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <span className="text-6xl font-black text-indigo-900">{spellingNumbers[spellingRound]}</span>
              </div>
              <p className="text-blue-200 mb-4 text-lg">How do you spell <strong className="text-yellow-300">{spellingNumbers[spellingRound]}</strong>?</p>
              <div className="flex gap-2 w-full mb-4">
                <input
                  type="text"
                  value={spellingInput}
                  onChange={e => setSpellingInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkSpelling()}
                  placeholder="Type the word..."
                  className={`flex-1 px-5 py-4 rounded-2xl bg-white/10 border-2 text-white placeholder-white/30 font-bold text-xl text-center focus:outline-none transition-all
                    ${spellingFeedback === 'correct' ? 'border-green-400 bg-green-500/20' : spellingFeedback === 'wrong' ? 'border-red-400 bg-red-500/20 animate-shake' : 'border-white/20 focus:border-yellow-400'}`}
                  autoFocus
                />
              </div>
              <button onClick={checkSpelling} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                Check ✓
              </button>
              {spellingFeedback === 'wrong' && (
                <motion.p initial={{opacity:0}} animate={{opacity:1}} className="mt-3 text-red-300 font-bold">
                  Hint: it starts with "{NUMBER_WORDS[spellingNumbers[spellingRound]-1][0]}"
                </motion.p>
              )}
              <div className="flex gap-2 mt-4">
                {spellingNumbers.map((_,i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < spellingRound ? 'bg-green-400' : i === spellingRound ? 'bg-yellow-400' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 4: VISUAL COUNTING ===== */}
        {phase === 'visual' && (
          <motion.div key="visual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl md:text-3xl font-heading text-yellow-300 mb-2">Count from Pictures! 👁️</h2>
            <p className="text-blue-200 mb-6">How many {visualQuestions[visualRound].emoji} do you see?</p>
            <div className="bg-indigo-950/50 rounded-3xl p-8 w-full max-w-lg border border-indigo-400/30 min-h-[200px] flex flex-wrap gap-4 justify-center content-center mb-6">
              {Array.from({length: visualQuestions[visualRound].count}).map((_,i) => (
                <motion.span key={i} initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} transition={{delay:i*0.1,type:'spring'}}
                  className="text-4xl md:text-5xl">{visualQuestions[visualRound].emoji}</motion.span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {(() => {
                const correct = visualQuestions[visualRound].count;
                const opts = [correct];
                while(opts.length < 4) {
                  const r = Math.max(1, correct + Math.floor(Math.random()*5) - 2);
                  if (!opts.includes(r)) opts.push(r);
                }
                return opts.sort((a,b)=>a-b).map(opt => (
                  <motion.button key={opt} whileTap={{scale:0.9}}
                    onClick={() => !visualFeedback && checkVisual(opt)}
                    className={`py-5 text-2xl font-black rounded-2xl transition-all border-b-4
                      ${visualAnswer === opt && visualFeedback === 'correct' ? 'bg-green-500 border-green-700 text-white' 
                      : visualAnswer === opt && visualFeedback === 'wrong' ? 'bg-red-500 border-red-700 text-white animate-shake' 
                      : 'bg-white/10 border-white/5 hover:bg-white/20 text-white'}`}>
                    {opt}
                  </motion.button>
                ));
              })()}
            </div>
            <div className="flex gap-2 mt-6">
              {visualQuestions.map((_,i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < visualRound ? 'bg-green-400' : i === visualRound ? 'bg-yellow-400' : 'bg-white/20'}`} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 5: COMPLETE ===== */}
        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <motion.div animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:"linear"}}
              className="absolute w-[600px] h-[600px] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(250,204,21,0.2)_360deg)] rounded-full blur-2xl" />
            <div className="text-8xl mb-6 z-10">🎉</div>
            <h2 className="text-4xl md:text-5xl font-heading text-yellow-300 mb-4 z-10">Fantastic!</h2>
            <p className="text-xl text-blue-200 mb-8 z-10 max-w-md">You learned to count, spell, and identify numbers 1 to 10!</p>
            <button onClick={onComplete} className="z-10 px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95 transition-all">
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
