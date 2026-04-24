import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const TEEN_WORDS = {11:"Eleven",12:"Twelve",13:"Thirteen",14:"Fourteen",15:"Fifteen",16:"Sixteen",17:"Seventeen",18:"Eighteen",19:"Nineteen"};
const TENS_WORDS = {10:"Ten",20:"Twenty",30:"Thirty",40:"Forty"};
const ONES_WORDS = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];

function getNumberWord(n) {
  if (n <= 10) return ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"][n];
  if (TEEN_WORDS[n]) return TEEN_WORDS[n];
  const t = Math.floor(n/10)*10, o = n%10;
  return (TENS_WORDS[t]||"") + (o > 0 ? "-" + ONES_WORDS[o] : "");
}

function generateBuildTargets() {
  const targets = new Set();
  while (targets.size < 4) targets.add(randInt(11, 40));
  return [...targets];
}

function generateGroupingNumber() { return randInt(15, 38); }

function generateSpellingNums() {
  const pool = shuffle([11,12,13,14,15,16,17,18,19,20,25,30,35,40]);
  return pool.slice(0, 5);
}

function generateCompareRounds() {
  const rounds = [];
  for (let i = 0; i < 4; i++) {
    const a = randInt(11, 40); let b; do { b = randInt(11, 40); } while (b === a);
    const askBigger = Math.random() > 0.5;
    rounds.push({ a, b, askBigger, correct: askBigger ? Math.max(a,b) : Math.min(a,b) });
  }
  return rounds;
}

function generateOptions(correct, min, max, count = 4) {
  const opts = new Set([correct]);
  while (opts.size < count) { const r = randInt(min, max); if (r !== correct) opts.add(r); }
  return shuffle([...opts]);
}

export default function Module2({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [step, setStep] = useState(0);

  const groupNum = useMemo(() => generateGroupingNumber(), []);
  const [grouped, setGrouped] = useState(false);

  const buildTargets = useMemo(() => generateBuildTargets(), []);
  const [buildRound, setBuildRound] = useState(0);
  const [buildTens, setBuildTens] = useState(0);
  const [buildOnes, setBuildOnes] = useState(0);
  const [buildSuccess, setBuildSuccess] = useState(false);

  const spellingNums = useMemo(() => generateSpellingNums(), []);
  const [spellingRound, setSpellingRound] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState(null);

  const compareRounds = useMemo(() => generateCompareRounds(), []);
  const [compareRound, setCompareRound] = useState(0);
  const [compareFeedback, setCompareFeedback] = useState(null);

  const renderTenFrames = (count) => {
    const totalFrames = Math.ceil(count / 10) || 1;
    return (
      <div className="flex flex-col gap-2 w-full max-w-lg">
        {Array.from({length: totalFrames}).map((_,fi) => {
          const here = fi < Math.floor(count/10) ? 10 : count%10;
          return (
            <motion.div key={fi} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:fi*0.15}}
              className="grid grid-cols-5 gap-1.5 bg-white/8 p-2.5 rounded-xl border border-purple-300/20">
              {Array.from({length:10}).map((_,ci) => (
                <div key={ci} className="aspect-square rounded-lg border border-purple-400/30 flex items-center justify-center bg-purple-900/30">
                  {ci < here && <motion.span initial={{scale:0}} animate={{scale:1}} transition={{delay:(fi*10+ci)*0.02}} className="text-lg">⭐</motion.span>}
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const checkBuild = () => {
    if (buildTens*10+buildOnes === buildTargets[buildRound]) {
      setBuildSuccess(true);
      setTimeout(() => {
        if (buildRound+1 >= buildTargets.length) setPhase('compare');
        else { setBuildRound(r=>r+1); setBuildTens(0); setBuildOnes(0); }
        setBuildSuccess(false);
      }, 1200);
    }
  };

  const handleCompare = (ans) => {
    if (compareFeedback) return;
    const correct = compareRounds[compareRound].correct;
    setCompareFeedback(ans === correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (ans === correct) {
        if (compareRound+1 >= compareRounds.length) setPhase('spelling');
        else setCompareRound(r=>r+1);
      }
      setCompareFeedback(null);
    }, 1000);
  };

  const checkSpelling = () => {
    const correct = getNumberWord(spellingNums[spellingRound]).toLowerCase().replace(/-/g,'');
    const input = spellingInput.trim().toLowerCase().replace(/-/g,'').replace(/\s+/g,'');
    if (input === correct) {
      setSpellingFeedback('correct');
      setTimeout(() => {
        if (spellingRound+1 >= spellingNums.length) setPhase('complete');
        else { setSpellingRound(r=>r+1); setSpellingInput(''); }
        setSpellingFeedback(null);
      }, 1000);
    } else {
      setSpellingFeedback('wrong');
      setTimeout(() => setSpellingFeedback(null), 1000);
    }
  };

  const PHASES = ['explain','grouping','build','compare','spelling','complete'];

  return (
    <div className="p-5 md:p-8 flex flex-col items-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-purple-500/30 overflow-hidden relative min-h-[620px] text-white">
      <HomeButton />
      <div className="flex gap-2 mb-4 z-10">
        {PHASES.map((p,i) => <div key={p} className={`w-3 h-3 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125':PHASES.indexOf(phase)>i?'bg-green-400':'bg-white/20'}`}/>)}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-5">📦</div>
            <h2 className="text-3xl font-heading text-purple-300 mb-3">Numbers 11 to 40</h2>
            {step === 0 && (<>
              <p className="text-lg text-indigo-200 mb-3">After 10, numbers have <strong className="text-yellow-300">tens</strong> and <strong className="text-yellow-300">ones</strong>.</p>
              <p className="text-indigo-200 mb-3"><strong className="text-white">24</strong> = <strong className="text-blue-300">2 tens</strong> + <strong className="text-orange-300">4 ones</strong></p>
              <div className="flex gap-3 my-4 items-end">
                <div className="flex gap-1">{[1,2].map(i => <div key={i} className="w-5 h-20 bg-blue-400 rounded-sm border border-blue-300/50 shadow-lg"/>)}</div>
                <span className="text-2xl text-white/40 font-black">+</span>
                <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className="w-5 h-5 bg-orange-400 rounded-sm border border-orange-300/50 shadow-lg"/>)}</div>
                <span className="text-2xl text-white/40 font-black">=</span>
                <span className="text-4xl font-black text-yellow-400">24</span>
              </div>
              <p className="text-indigo-300 mb-5 text-sm">Teen numbers (11-19) have special names!</p>
              <button onClick={() => setPhase('grouping')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
                See Grouping! 🎬
              </button>
            </>)}
          </motion.div>
        )}

        {phase === 'grouping' && (
          <motion.div key="grouping" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-purple-300 mb-1">Group {groupNum} Stars Into Tens!</h2>
            <p className="text-indigo-200 mb-4 text-sm">{!grouped ? "Stars are scattered. Let's organize!" : `${Math.floor(groupNum/10)} Tens and ${groupNum%10} Ones = ${groupNum}`}</p>
            {!grouped ? (
              <div className="relative w-full max-w-lg h-[280px] bg-indigo-950/50 rounded-3xl border border-indigo-400/20 overflow-hidden mb-4">
                {Array.from({length:groupNum}).map((_,i) => (
                  <motion.span key={i} className="absolute text-lg" style={{left:`${8+(i*41)%84}%`,top:`${8+(i*31)%84}%`}}
                    animate={{y:[0,-4,0]}} transition={{duration:2+i*0.2,repeat:Infinity}}>⭐</motion.span>
                ))}
              </div>
            ) : (
              <div className="w-full max-w-lg mb-4">{renderTenFrames(groupNum)}</div>
            )}
            {!grouped ? (
              <button onClick={() => setGrouped(true)} className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-xl rounded-2xl shadow-lg transition-all">Group into Tens! ✨</button>
            ) : (
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="text-center">
                <p className="text-2xl font-bold text-yellow-300 mb-4">{Math.floor(groupNum/10)} Tens + {groupNum%10} Ones = <span className="text-3xl">{groupNum}</span></p>
                <button onClick={() => setPhase('build')} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">Build Numbers! 🔨</button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div key="build" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-purple-300 mb-3">Build: <span className="text-green-400 text-3xl">{buildTargets[buildRound]}</span></h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-indigo-300 text-sm font-bold">Your build:</span>
              <span className={`text-4xl font-black ${buildTens*10+buildOnes===buildTargets[buildRound]?'text-green-400':'text-yellow-400'}`}>{buildTens*10+buildOnes}</span>
            </div>
            <div className="flex w-full gap-3 max-w-lg mb-3">
              <div className="flex-1 bg-blue-900/40 rounded-2xl border border-blue-400/30 p-3 flex flex-col items-center">
                <span className="text-blue-300 font-bold text-xs mb-2">TENS ({buildTens})</span>
                <div className="flex gap-1 flex-wrap justify-center min-h-[60px] items-end">
                  {Array.from({length:buildTens}).map((_,i) => <motion.div key={i} initial={{y:-15,opacity:0}} animate={{y:0,opacity:1}} className="w-4 h-14 bg-blue-400 rounded-sm shadow"/>)}
                </div>
                <div className="flex gap-2 mt-2 w-full">
                  <button onClick={() => setBuildTens(t=>Math.max(0,t-1))} className="flex-1 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg font-bold transition active:scale-95">−</button>
                  <button onClick={() => setBuildTens(t=>Math.min(t+1,9))} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition active:scale-95">+</button>
                </div>
              </div>
              <div className="flex-1 bg-orange-900/40 rounded-2xl border border-orange-400/30 p-3 flex flex-col items-center">
                <span className="text-orange-300 font-bold text-xs mb-2">ONES ({buildOnes})</span>
                <div className="flex gap-1 flex-wrap justify-center min-h-[60px] items-end">
                  {Array.from({length:buildOnes}).map((_,i) => <motion.div key={i} initial={{y:-15,opacity:0}} animate={{y:0,opacity:1}} className="w-4 h-4 bg-orange-400 rounded-sm shadow"/>)}
                </div>
                <div className="flex gap-2 mt-2 w-full">
                  <button onClick={() => setBuildOnes(o=>Math.max(0,o-1))} className="flex-1 py-2 bg-orange-800 hover:bg-orange-700 rounded-lg font-bold transition active:scale-95">−</button>
                  <button onClick={() => setBuildOnes(o=>Math.min(o+1,9))} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold transition active:scale-95">+</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-lg">
              <button onClick={() => {setBuildTens(0);setBuildOnes(0);}} className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition">Clear</button>
              <button onClick={checkBuild} disabled={buildTens*10+buildOnes!==buildTargets[buildRound]}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${buildTens*10+buildOnes===buildTargets[buildRound]?'bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(74,222,128,0.4)]':'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>Submit ✓</button>
            </div>
            {buildSuccess && <motion.div initial={{scale:0}} animate={{scale:1}} className="mt-3 text-2xl font-black text-green-400">✅ Perfect!</motion.div>}
            <div className="flex gap-2 mt-3">{buildTargets.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<buildRound?'bg-green-400':i===buildRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'compare' && (
          <motion.div key="compare" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-purple-300 mb-1">Which is {compareRounds[compareRound].askBigger ? 'Bigger' : 'Smaller'}? 🤔</h2>
            <p className="text-indigo-200 mb-6 text-sm">Compare the two numbers</p>
            <div className="flex gap-6 mb-6">
              {[compareRounds[compareRound].a, compareRounds[compareRound].b].map(num => (
                <motion.button key={num} whileTap={{scale:0.9}} onClick={() => handleCompare(num)}
                  className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center font-black text-4xl transition-all shadow-xl border-b-4
                    ${compareFeedback && num===compareRounds[compareRound].correct ? 'bg-green-500 border-green-700 text-white scale-110'
                    : compareFeedback === 'wrong' ? 'bg-white/5 border-white/5 text-white/40'
                    : 'bg-white/10 border-white/5 hover:bg-white/15 hover:scale-105 text-white'}`}>
                  {num}
                  <span className="text-xs font-bold text-white/50 mt-1">{Math.floor(num/10)}T {num%10}O</span>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">{compareRounds.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<compareRound?'bg-green-400':i===compareRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'spelling' && (
          <motion.div key="spelling" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-purple-300 mb-1">Spell These Numbers! ✏️</h2>
            <div className="bg-white/8 backdrop-blur rounded-3xl p-8 w-full max-w-md border border-white/10 flex flex-col items-center mt-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <span className="text-4xl font-black text-white">{spellingNums[spellingRound]}</span>
              </div>
              <p className="text-indigo-200 mb-1 text-xs">Hint: {getNumberWord(spellingNums[spellingRound]).slice(0,2)}...</p>
              <input type="text" value={spellingInput} onChange={e => setSpellingInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&checkSpelling()}
                placeholder="Type the word..." autoFocus
                className={`w-full px-5 py-4 rounded-2xl bg-white/10 border-2 text-white placeholder-white/30 font-bold text-xl text-center focus:outline-none transition-all my-3
                  ${spellingFeedback==='correct'?'border-green-400 bg-green-500/20':spellingFeedback==='wrong'?'border-red-400 bg-red-500/20 animate-shake':'border-white/20 focus:border-purple-400'}`} />
              <button onClick={checkSpelling} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-lg rounded-2xl transition-all shadow-lg">Check ✓</button>
              <div className="flex gap-2 mt-4">{spellingNums.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<spellingRound?'bg-green-400':i===spellingRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-3">Grouping Master!</h2>
            <p className="text-lg text-indigo-200 mb-8 max-w-md">You grouped, built, compared, and spelled numbers 11–40!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 transition-all">Next Module 🚀</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
