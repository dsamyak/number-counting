import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

const NUMBER_WORDS = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
const EMOJI_SETS = [
  ["🍎","🍊","🍋","🍇","🍓","🫐","🍑","🥝","🍌","🥭"],
  ["🐶","🐱","🐰","🐻","🦊","🐸","🐵","🐔","🐧","🦁"],
  ["⭐","🌟","💫","✨","🌙","☀️","🌈","💎","🔮","🎯"],
  ["🌸","🌺","🌻","🌹","🌷","💐","🌼","🪷","🌵","🍀"],
  ["🚗","🚀","✈️","🚁","🛸","🚂","⛵","🏎️","🚲","🛴"],
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateSpellingRounds() {
  const nums = shuffle([1,2,3,4,5,6,7,8,9,10]);
  return nums.slice(0, 5);
}

function generateVisualRounds() {
  const emojiSet = pickRandom(EMOJI_SETS);
  const rounds = [];
  const used = new Set();
  for (let i = 0; i < 5; i++) {
    let count;
    do { count = randInt(2, 10); } while (used.has(count));
    used.add(count);
    rounds.push({ emoji: emojiSet[i], count });
  }
  return rounds;
}

function generateCountingObjects() {
  const set = pickRandom(EMOJI_SETS);
  const count = randInt(6, 10);
  return { emojis: set.slice(0, count), total: count };
}

function generateMatchRounds() {
  const nums = shuffle([1,2,3,4,5,6,7,8,9,10]).slice(0, 4);
  return nums.map(n => {
    const opts = shuffle([NUMBER_WORDS[n-1], ...shuffle(NUMBER_WORDS.filter(w => w !== NUMBER_WORDS[n-1])).slice(0, 3)]);
    return { number: n, correctWord: NUMBER_WORDS[n-1], options: opts };
  });
}

function generateOptions(correct, min, max, count = 4) {
  const opts = new Set([correct]);
  while (opts.size < count) {
    const r = randInt(min, max);
    if (r !== correct) opts.add(r);
  }
  return shuffle([...opts]);
}

export default function Module1({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [step, setStep] = useState(0);
  const [activeNumber, setActiveNumber] = useState(1);

  // Randomized data generated once per mount
  const countingObj = useMemo(() => generateCountingObjects(), []);
  const [countClicked, setCountClicked] = useState([]);

  const spellingNums = useMemo(() => generateSpellingRounds(), []);
  const [spellingRound, setSpellingRound] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState(null);

  const visualQs = useMemo(() => generateVisualRounds(), []);
  const [visualRound, setVisualRound] = useState(0);
  const [visualAnswer, setVisualAnswer] = useState(null);
  const [visualFeedback, setVisualFeedback] = useState(null);
  const visualOptions = useMemo(() => visualQs.map(q => generateOptions(q.count, 1, 10)), [visualQs]);

  const matchRounds = useMemo(() => generateMatchRounds(), []);
  const [matchRound, setMatchRound] = useState(0);
  const [matchFeedback, setMatchFeedback] = useState(null);

  // Explain phase: auto-advance
  useEffect(() => {
    if (phase === 'explain' && step === 1) {
      const timer = setInterval(() => {
        setActiveNumber(n => {
          if (n >= 10) { clearInterval(timer); setTimeout(() => setStep(2), 1500); return 10; }
          return n + 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [phase, step]);

  const handleCountObject = (idx) => {
    if (countClicked.includes(idx)) return;
    if (countClicked.length !== idx) return; // must count in order
    const next = [...countClicked, idx];
    setCountClicked(next);
    if (next.length >= countingObj.total) setTimeout(() => setPhase('matching'), 1500);
  };

  const handleMatch = (word) => {
    if (matchFeedback) return;
    const correct = matchRounds[matchRound].correctWord;
    const isCorrect = word === correct;
    setMatchFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      if (isCorrect) {
        if (matchRound + 1 >= matchRounds.length) setPhase('spelling');
        else setMatchRound(r => r + 1);
      }
      setMatchFeedback(null);
    }, 1000);
  };

  const checkSpelling = () => {
    const correct = NUMBER_WORDS[spellingNums[spellingRound] - 1].toLowerCase();
    if (spellingInput.trim().toLowerCase() === correct) {
      setSpellingFeedback('correct');
      setTimeout(() => {
        if (spellingRound + 1 >= spellingNums.length) setPhase('visual');
        else { setSpellingRound(r => r + 1); setSpellingInput(''); }
        setSpellingFeedback(null);
      }, 1000);
    } else {
      setSpellingFeedback('wrong');
      setTimeout(() => setSpellingFeedback(null), 1000);
    }
  };

  const checkVisual = (ans) => {
    if (visualFeedback) return;
    const correct = visualQs[visualRound].count;
    setVisualAnswer(ans);
    setVisualFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (visualRound + 1 >= visualQs.length) setPhase('complete');
        else setVisualRound(r => r + 1);
      }
      setVisualAnswer(null);
      setVisualFeedback(null);
    }, 1000);
  };

  const PHASES = ['explain', 'counting', 'matching', 'spelling', 'visual', 'complete'];

  return (
    <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-indigo-500/30 overflow-hidden relative min-h-[620px] text-white">
      <HomeButton />
      <div className="flex gap-2 mb-5 z-10">
        {PHASES.map((p, i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all duration-500 ${
            p === phase ? 'bg-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,0.7)]'
            : PHASES.indexOf(phase) > i ? 'bg-green-400' : 'bg-white/20'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== EXPLAIN ===== */}
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1 justify-center">
            {step === 0 && (
              <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} className="flex flex-col items-center text-center max-w-lg">
                <div className="text-7xl mb-6">🔢</div>
                <h2 className="text-3xl md:text-4xl font-heading text-yellow-300 mb-4">What is Counting?</h2>
                <p className="text-lg text-blue-200 mb-3 leading-relaxed">
                  Counting means saying numbers <strong className="text-yellow-300">in order</strong> to find <strong className="text-yellow-300">how many</strong> things there are.
                </p>
                <p className="text-blue-200 mb-6">We start from <strong className="text-white text-2xl">1</strong> and go up. Each number is <strong className="text-yellow-300">one more</strong> than the one before!</p>
                <div className="flex gap-2 mb-8">
                  {[1,2,3,4,5].map(n => (
                    <motion.div key={n} initial={{scale:0}} animate={{scale:1}} transition={{delay:n*0.12,type:'spring'}}
                      className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center font-black text-xl text-indigo-900 shadow-lg">{n}</motion.div>
                  ))}
                  <span className="self-center text-yellow-400 text-2xl">...</span>
                </div>
                <button onClick={() => setStep(1)} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 font-black text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-b-4 border-orange-500 active:border-b-0">
                  Watch Me Count! 👀
                </button>
              </motion.div>
            )}
            {step === 1 && (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-heading text-yellow-300 mb-6">Counting 1 to 10</h2>
                <div className="relative w-44 h-44 flex items-center justify-center mb-4">
                  <motion.div key={activeNumber} initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}} transition={{type:'spring',bounce:0.5}}
                    className="absolute flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-44 h-44 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]">
                    <span className="text-6xl font-black font-heading">{activeNumber}</span>
                    <span className="text-lg font-bold text-yellow-300 mt-1">{NUMBER_WORDS[activeNumber-1]}</span>
                  </motion.div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap justify-center max-w-xs">
                  {Array.from({length:activeNumber}).map((_,i) => (
                    <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.04}} className="w-5 h-5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="mt-6 text-white/40 hover:text-white underline text-sm">Skip →</button>
              </div>
            )}
            {step === 2 && (
              <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-heading text-yellow-300 mb-3">Numbers 1–10 & Their Names</h2>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {NUMBER_WORDS.map((w,i) => (
                    <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.06}}
                      className="flex flex-col items-center bg-white/10 p-2.5 rounded-xl border border-white/15">
                      <span className="text-2xl font-black text-yellow-400">{i+1}</span>
                      <span className="text-[10px] text-blue-200 font-bold mt-1">{w}</span>
                    </motion.div>
                  ))}
                </div>
                <button onClick={() => setPhase('counting')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                  Let's Practice! ✋
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===== COUNTING SIMULATION ===== */}
        {phase === 'counting' && (
          <motion.div key="counting" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">Count the Objects!</h2>
            <p className="text-blue-200 mb-4 text-sm">Tap them <strong className="text-yellow-300">in order</strong> — first one, then two, then three...</p>
            <div className="relative w-full max-w-lg min-h-[300px] bg-indigo-950/60 rounded-3xl border border-indigo-400/30 p-6 flex flex-wrap gap-3 justify-center content-center">
              {countingObj.emojis.map((emoji, i) => {
                const isClicked = countClicked.includes(i);
                const isNext = countClicked.length === i;
                return (
                  <motion.button key={i} whileTap={{scale:0.85}} onClick={() => handleCountObject(i)}
                    className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center text-3xl transition-all relative
                      ${isClicked ? 'bg-green-500/30 border-2 border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                      : isNext ? 'bg-yellow-400/20 border-2 border-yellow-400 animate-pulse cursor-pointer'
                      : 'bg-white/5 border-2 border-white/10 opacity-50 cursor-not-allowed'}`}>
                    {emoji}
                    {isClicked && (
                      <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow">{i+1}</motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-4 glass-dark px-6 py-2 rounded-full flex items-center gap-3">
              <span className="text-blue-300 font-bold text-sm">Counted:</span>
              <span className="text-2xl font-black text-yellow-400">{countClicked.length}</span>
              <span className="text-blue-300 font-bold text-sm">/ {countingObj.total}</span>
            </div>
          </motion.div>
        )}

        {/* ===== NUMBER-WORD MATCHING ===== */}
        {phase === 'matching' && (
          <motion.div key="matching" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">Match Number to Word!</h2>
            <p className="text-blue-200 mb-6 text-sm">Which word matches the number?</p>
            <div className="bg-white/8 backdrop-blur rounded-3xl p-8 w-full max-w-md border border-white/10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <span className="text-5xl font-black text-indigo-900">{matchRounds[matchRound].number}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {matchRounds[matchRound].options.map((word, i) => (
                  <motion.button key={i} whileTap={{scale:0.95}} onClick={() => handleMatch(word)}
                    className={`py-4 text-lg font-bold rounded-2xl border-b-4 transition-all
                      ${matchFeedback && word === matchRounds[matchRound].correctWord ? 'bg-green-500 border-green-700 text-white'
                      : matchFeedback === 'wrong' && word !== matchRounds[matchRound].correctWord ? 'bg-white/5 border-white/5 text-white/30'
                      : 'bg-white/10 border-white/5 hover:bg-white/15 text-white'}`}>{word}</motion.button>
                ))}
              </div>
              <div className="flex gap-2 mt-5">{matchRounds.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<matchRound?'bg-green-400':i===matchRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {/* ===== SPELLING ===== */}
        {phase === 'spelling' && (
          <motion.div key="spelling" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">Spell the Number! ✏️</h2>
            <p className="text-blue-200 mb-6 text-sm">Type the word for each number shown.</p>
            <div className="bg-white/8 backdrop-blur rounded-3xl p-8 w-full max-w-md border border-white/10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <span className="text-5xl font-black text-indigo-900">{spellingNums[spellingRound]}</span>
              </div>
              <p className="text-blue-200 mb-1 text-xs">Starts with: <strong className="text-yellow-300 text-lg">{NUMBER_WORDS[spellingNums[spellingRound]-1][0].toUpperCase()}</strong></p>
              <input type="text" value={spellingInput} onChange={e => setSpellingInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&checkSpelling()}
                placeholder="Type the word..." autoFocus
                className={`w-full px-5 py-4 rounded-2xl bg-white/10 border-2 text-white placeholder-white/30 font-bold text-xl text-center focus:outline-none transition-all my-3
                  ${spellingFeedback==='correct'?'border-green-400 bg-green-500/20':spellingFeedback==='wrong'?'border-red-400 bg-red-500/20 animate-shake':'border-white/20 focus:border-yellow-400'}`} />
              <button onClick={checkSpelling} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Check ✓</button>
              <div className="flex gap-2 mt-4">{spellingNums.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<spellingRound?'bg-green-400':i===spellingRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {/* ===== VISUAL COUNTING ===== */}
        {phase === 'visual' && (
          <motion.div key="visual" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-yellow-300 mb-1">How Many Do You See? 👁️</h2>
            <p className="text-blue-200 mb-4 text-sm">Count the objects and pick the right number.</p>
            <div className="bg-indigo-950/50 rounded-3xl p-6 w-full max-w-lg border border-indigo-400/30 min-h-[160px] flex flex-wrap gap-3 justify-center content-center mb-5">
              {Array.from({length: visualQs[visualRound].count}).map((_,i) => (
                <motion.span key={i} initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} transition={{delay:i*0.08,type:'spring'}}
                  className="text-4xl">{visualQs[visualRound].emoji}</motion.span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {visualOptions[visualRound].map(opt => (
                <motion.button key={opt} whileTap={{scale:0.9}} onClick={() => checkVisual(opt)}
                  className={`py-4 text-2xl font-black rounded-2xl border-b-4 transition-all
                    ${visualAnswer===opt&&visualFeedback==='correct'?'bg-green-500 border-green-700 text-white'
                    :visualAnswer===opt&&visualFeedback==='wrong'?'bg-red-500 border-red-700 text-white animate-shake'
                    :'bg-white/10 border-white/5 hover:bg-white/20 text-white'}`}>{opt}</motion.button>
              ))}
            </div>
            <div className="flex gap-2 mt-5">{visualQs.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<visualRound?'bg-green-400':i===visualRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {/* ===== COMPLETE ===== */}
        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <motion.div animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:"linear"}}
              className="absolute w-[500px] h-[500px] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(250,204,21,0.15)_360deg)] rounded-full blur-2xl" />
            <div className="text-8xl mb-6 z-10">🎉</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-3 z-10">Fantastic!</h2>
            <p className="text-lg text-blue-200 mb-8 z-10 max-w-md">You counted, matched, spelled, and identified numbers 1 to 10!</p>
            <button onClick={onComplete} className="z-10 px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95 transition-all">
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
