import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';

const TEEN_WORDS = {11:"Eleven",12:"Twelve",13:"Thirteen",14:"Fourteen",15:"Fifteen",16:"Sixteen",17:"Seventeen",18:"Eighteen",19:"Nineteen",20:"Twenty"};
const TENS_WORDS = {10:"Ten",20:"Twenty",30:"Thirty",40:"Forty"};

export default function Module2({ onComplete }) {
  const [phase, setPhase] = useState('explain');
  const [step, setStep] = useState(0);
  const [grouped, setGrouped] = useState(false);
  const [spellingRound, setSpellingRound] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState(null);
  const [buildTarget, setBuildTarget] = useState(24);
  const [buildTens, setBuildTens] = useState(0);
  const [buildOnes, setBuildOnes] = useState(0);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [buildRound, setBuildRound] = useState(0);

  const buildTargets = [24, 37, 15];
  const spellingNums = [11, 15, 20, 30, 14];

  const getSpellingWord = (n) => {
    if (TEEN_WORDS[n]) return TEEN_WORDS[n];
    if (TENS_WORDS[n]) return TENS_WORDS[n];
    const t = Math.floor(n/10)*10;
    const o = n%10;
    const oWords = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
    return (TENS_WORDS[t]||"") + (o > 0 ? "-" + oWords[o] : "");
  };

  const renderTenFrames = (count) => {
    const totalFrames = Math.ceil(count / 10) || 1;
    return (
      <div className="flex flex-col gap-3 w-full max-w-lg">
        {Array.from({length: totalFrames}).map((_, fi) => {
          const starsHere = fi < Math.floor(count/10) ? 10 : count % 10;
          return (
            <motion.div key={fi} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:fi*0.2}}
              className="grid grid-cols-5 gap-1.5 bg-white/8 p-3 rounded-2xl border border-purple-300/20">
              {Array.from({length:10}).map((_,ci) => (
                <div key={ci} className="aspect-square rounded-lg border border-purple-400/30 flex items-center justify-center bg-purple-900/30">
                  {ci < starsHere && (
                    <motion.span initial={{scale:0}} animate={{scale:1}} transition={{delay:(fi*10+ci)*0.03}} className="text-xl md:text-2xl">⭐</motion.span>
                  )}
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const checkBuild = () => {
    if (buildTens * 10 + buildOnes === buildTargets[buildRound]) {
      setBuildSuccess(true);
      setTimeout(() => {
        if (buildRound + 1 >= buildTargets.length) {
          setPhase('spelling');
        } else {
          setBuildRound(r => r + 1);
          setBuildTens(0); setBuildOnes(0); setBuildSuccess(false);
        }
      }, 1500);
    }
  };

  const checkSpelling = () => {
    const correct = getSpellingWord(spellingNums[spellingRound]).toLowerCase();
    if (spellingInput.trim().toLowerCase().replace('-','') === correct.replace('-','')) {
      setSpellingFeedback('correct');
      setTimeout(() => {
        if (spellingRound + 1 >= spellingNums.length) setPhase('complete');
        else { setSpellingRound(r => r + 1); setSpellingInput(''); setSpellingFeedback(null); }
      }, 1200);
    } else {
      setSpellingFeedback('wrong');
      setTimeout(() => setSpellingFeedback(null), 1200);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 rounded-3xl shadow-2xl w-full max-w-4xl border border-purple-500/30 overflow-hidden relative min-h-[600px] text-white">
      <HomeButton />
      <div className="flex gap-2 mb-4 z-10">
        {['explain','grouping','build','spelling','complete'].map((p,i) => (
          <div key={p} className={`w-3 h-3 rounded-full transition-all ${p===phase?'bg-yellow-400 scale-125 shadow-[0_0_8px_rgba(250,204,21,0.6)]':['explain','grouping','build','spelling','complete'].indexOf(phase)>i?'bg-green-400':'bg-white/20'}`}/>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'explain' && (
          <motion.div key="explain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-center flex-1 justify-center max-w-lg">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-heading text-purple-300 mb-4">Numbers 11 to 40</h2>
            <p className="text-lg text-indigo-200 mb-4">After 10, numbers are made of <strong className="text-yellow-300">tens</strong> and <strong className="text-yellow-300">ones</strong>.</p>
            <p className="text-lg text-indigo-200 mb-4">For example: <strong className="text-white">24</strong> = <strong className="text-blue-300">2 tens</strong> + <strong className="text-orange-300">4 ones</strong></p>
            <div className="flex gap-3 my-6 items-end">
              <div className="flex gap-1">
                {[1,2].map(i => <div key={i} className="w-5 h-20 bg-blue-400 rounded-sm border border-blue-300/50 shadow-lg" />)}
              </div>
              <span className="text-2xl text-white/50 font-black">+</span>
              <div className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className="w-5 h-5 bg-orange-400 rounded-sm border border-orange-300/50 shadow-lg" />)}
              </div>
              <span className="text-2xl text-white/50 font-black">=</span>
              <span className="text-4xl font-black text-yellow-400">24</span>
            </div>
            <p className="text-indigo-300 mb-6 text-sm">Teen numbers (11-19) are special: "eleven", "twelve", then "-teen" words!</p>
            <button onClick={() => setPhase('grouping')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-b-4 border-purple-700 active:border-b-0">
              See Grouping in Action! 🎬
            </button>
          </motion.div>
        )}

        {phase === 'grouping' && (
          <motion.div key="grouping" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-purple-300 mb-2">Group Into Tens!</h2>
            <p className="text-indigo-200 mb-4">{!grouped ? "These stars are scattered. Let's organize them!" : "See? Much easier to count!"}</p>
            {!grouped ? (
              <div className="relative w-full max-w-lg h-[300px] bg-indigo-950/50 rounded-3xl border border-indigo-400/20 overflow-hidden mb-4">
                {Array.from({length:24}).map((_,i) => (
                  <motion.span key={i} className="absolute text-xl" style={{left:`${8+(i*41)%84}%`,top:`${8+(i*31)%84}%`}}
                    animate={{y:[0,-5,0]}} transition={{duration:2+i*0.3,repeat:Infinity}}>⭐</motion.span>
                ))}
              </div>
            ) : (
              <div className="w-full max-w-lg mb-4">{renderTenFrames(24)}</div>
            )}
            {!grouped ? (
              <button onClick={() => setGrouped(true)} className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-xl rounded-2xl shadow-lg transition-all">
                Group into Tens! ✨
              </button>
            ) : (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center">
                <p className="text-2xl font-bold text-yellow-300 mb-4">2 Tens + 4 Ones = <span className="text-3xl">24</span></p>
                <button onClick={() => {setGrouped(false); setPhase('build');}} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-all">
                  Now Build Numbers! 🔨
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div key="build" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full flex-1">
            <h2 className="text-2xl font-heading text-purple-300 mb-2">Build the Number! 🏗️</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-indigo-300 font-bold">Target:</span>
              <span className="text-5xl font-black text-green-400">{buildTargets[buildRound]}</span>
              <span className="text-indigo-300 font-bold mx-2">Your build:</span>
              <span className={`text-5xl font-black ${buildTens*10+buildOnes===buildTargets[buildRound]?'text-green-400':'text-yellow-400'}`}>{buildTens*10+buildOnes}</span>
            </div>
            <div className="flex w-full gap-4 max-w-lg mb-4">
              <div className="flex-1 bg-blue-900/40 rounded-2xl border border-blue-400/30 p-4 flex flex-col items-center">
                <span className="text-blue-300 font-bold text-sm mb-2 uppercase tracking-wider">Tens ({buildTens})</span>
                <div className="flex gap-1 flex-wrap justify-center min-h-[80px] items-end">
                  {Array.from({length:buildTens}).map((_,i) => (
                    <motion.div key={i} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="w-4 h-16 bg-blue-400 rounded-sm shadow" />
                  ))}
                </div>
                <button onClick={() => setBuildTens(t => Math.min(t+1,9))} className="mt-3 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all active:scale-95">+ Ten</button>
              </div>
              <div className="flex-1 bg-orange-900/40 rounded-2xl border border-orange-400/30 p-4 flex flex-col items-center">
                <span className="text-orange-300 font-bold text-sm mb-2 uppercase tracking-wider">Ones ({buildOnes})</span>
                <div className="flex gap-1 flex-wrap justify-center min-h-[80px] items-end">
                  {Array.from({length:buildOnes}).map((_,i) => (
                    <motion.div key={i} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="w-4 h-4 bg-orange-400 rounded-sm shadow" />
                  ))}
                </div>
                <button onClick={() => setBuildOnes(o => Math.min(o+1,9))} className="mt-3 w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-lg transition-all active:scale-95">+ One</button>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-lg">
              <button onClick={() => {setBuildTens(0);setBuildOnes(0);}} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all">Clear</button>
              <button onClick={checkBuild} disabled={buildTens*10+buildOnes !== buildTargets[buildRound]}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${buildTens*10+buildOnes===buildTargets[buildRound]?'bg-green-500 hover:bg-green-400 text-white shadow-[0_0_20px_rgba(74,222,128,0.4)]':'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                Submit ✓
              </button>
            </div>
            {buildSuccess && (
              <motion.div initial={{scale:0}} animate={{scale:1}} className="mt-4 text-3xl font-black text-green-400">✅ Perfect Match!</motion.div>
            )}
            <div className="flex gap-2 mt-4">{buildTargets.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<buildRound?'bg-green-400':i===buildRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
          </motion.div>
        )}

        {phase === 'spelling' && (
          <motion.div key="spelling" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-heading text-purple-300 mb-2">Spell These Numbers! ✏️</h2>
            <p className="text-indigo-200 mb-6">Type the word for each number.</p>
            <div className="bg-white/8 backdrop-blur rounded-3xl p-8 w-full max-w-md border border-white/10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <span className="text-5xl font-black text-white">{spellingNums[spellingRound]}</span>
              </div>
              <p className="text-indigo-200 mb-1 text-sm">Hint: {getSpellingWord(spellingNums[spellingRound])[0]}...</p>
              <input type="text" value={spellingInput} onChange={e => setSpellingInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&checkSpelling()}
                placeholder="Type the word..." autoFocus
                className={`w-full px-5 py-4 rounded-2xl bg-white/10 border-2 text-white placeholder-white/30 font-bold text-xl text-center focus:outline-none transition-all mb-4
                  ${spellingFeedback==='correct'?'border-green-400 bg-green-500/20':spellingFeedback==='wrong'?'border-red-400 bg-red-500/20 animate-shake':'border-white/20 focus:border-purple-400'}`} />
              <button onClick={checkSpelling} className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Check ✓</button>
              <div className="flex gap-2 mt-4">{spellingNums.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i<spellingRound?'bg-green-400':i===spellingRound?'bg-yellow-400':'bg-white/20'}`}/>)}</div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-heading text-yellow-300 mb-4">Grouping Master!</h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-md">You can group, build, and spell numbers from 11 to 40!</p>
            <button onClick={onComplete} className="px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all">
              Next Module 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
