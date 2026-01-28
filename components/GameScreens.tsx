import React, { useEffect } from 'react';
import { Button } from './Button';
import { TrophyIcon, CoinIcon, PlayAudioIcon } from './Icons';
import { Question } from '../types';

// Robust Text-to-Speech Helper
const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const playUtterance = () => {
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    let selectedVoice = 
      voices.find(v => v.name === 'Google US English') ||
      voices.find(v => v.name === 'Samantha') ||
      voices.find(v => v.name.includes('Microsoft Zira')) ||
      voices.find(v => v.lang === 'en-US' && v.localService) ||
      voices.find(v => v.lang === 'en-US');
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => playUtterance(), { once: true });
  } else {
    playUtterance();
  }
};

// START SCREEN
export const StartScreen: React.FC<{ 
  onStart: () => void;
}> = ({ onStart }) => (
  <div className="flex flex-col items-center text-center animate-pop max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-white">
    <div className="mb-6">
      <span className="text-6xl">🎮</span>
    </div>
    <h1 className="text-4xl md:text-5xl font-black text-blue-600 mb-2 drop-shadow-sm leading-tight">
      AI Terminology<br/><span className="text-yellow-500">Challenge</span>
    </h1>
    <p className="text-lg text-slate-600 font-semibold mb-8">
      Master 10 AI terms to win the Super Trophy!
    </p>
    
    <div className="bg-blue-50 p-4 rounded-xl mb-8 w-full border-2 border-blue-100">
      <h3 className="font-bold text-blue-800 mb-2 uppercase text-sm tracking-widest">Rules</h3>
      <ul className="text-left text-sm text-slate-700 space-y-2">
        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 10 Questions, Single Choice</li>
        <li className="flex items-center gap-2"><span className="text-red-500">✕</span> One mistake = Game Over</li>
        <li className="flex items-center gap-2"><span className="text-yellow-500">★</span> Win the Trophy!</li>
      </ul>
    </div>

    <div className="w-full flex flex-col items-center gap-4">
      <Button onClick={onStart} fullWidth variant="primary" className="text-xl py-4">
        START GAME
      </Button>
    </div>
  </div>
);

// GAME OVER SCREEN
export const GameOverScreen: React.FC<{ 
  question: Question; 
  onRestart: () => void;
}> = ({ question, onRestart }) => (
  <div className="flex flex-col items-center text-center animate-pop max-w-md w-full bg-red-50 p-6 rounded-3xl shadow-2xl border-4 border-red-200 m-4">
    <div className="mb-2 transform -rotate-12">
      <CoinIcon broken size={64} />
    </div>
    <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter">GAME OVER</h2>
    <p className="text-slate-600 mb-6 font-medium">Don't worry! Learn this and try again.</p>

    <div className="bg-white p-6 rounded-2xl shadow-inner w-full mb-6 border border-red-100 text-left">
      <div className="text-xs font-bold text-red-400 uppercase mb-1">Missed Term</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{question.term}</h3>
      <p className="text-slate-600 mb-3 leading-relaxed">{question.memory}</p>
      <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-red-400 flex flex-col gap-1 relative pr-10">
        <p className="text-sm text-slate-600 italic font-semibold">"{question.example}"</p>
        <p className="text-sm text-slate-500">{question.example_cn}</p>
        <button 
          onClick={() => speakText(question.example)} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-red-50 text-red-400 hover:text-red-500 p-2 rounded-full shadow-sm transition-colors"
          title="Listen"
        >
          <PlayAudioIcon size={24} />
        </button>
      </div>
    </div>

    <Button onClick={onRestart} fullWidth variant="danger">
      Try Again
    </Button>
  </div>
);

// FEEDBACK SCREEN (SUCCESS)
export const FeedbackScreen: React.FC<{ 
  question: Question; 
  onNext: () => void; 
  isLast: boolean;
}> = ({ question, onNext, isLast }) => (
  <div className="flex flex-col items-center text-center animate-pop max-w-md w-full bg-green-50 p-6 rounded-3xl shadow-2xl border-4 border-green-200 m-4">
    <div className="mb-2">
      <span className="text-6xl">✅</span>
    </div>
    <h2 className="text-3xl font-black text-green-600 mb-4">Correct!</h2>
    
    <div className="bg-white p-6 rounded-2xl shadow-inner w-full mb-6 border border-green-100 text-left">
      <div className="text-xs font-bold text-green-500 uppercase mb-1">Term Learned</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{question.term}</h3>
      <p className="text-slate-600 mb-3 leading-relaxed">{question.memory}</p>
      <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-green-500 flex flex-col gap-1 relative pr-10">
        <p className="text-sm text-slate-600 italic font-semibold">"{question.example}"</p>
        <p className="text-sm text-slate-500">{question.example_cn}</p>
        <button 
          onClick={() => speakText(question.example)} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-green-50 text-green-500 hover:text-green-600 p-2 rounded-full shadow-sm transition-colors"
          title="Listen"
        >
          <PlayAudioIcon size={24} />
        </button>
      </div>
    </div>

    <Button onClick={onNext} fullWidth variant="success">
      {isLast ? "Claim Trophy" : "Next Question"}
    </Button>
  </div>
);

// TROPHY SCREEN
export const TrophyScreen: React.FC<{ 
  timeTaken: number; 
  onRestart: () => void;
}> = ({ timeTaken, onRestart }) => {
  const confettiRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple Confetti effect
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    const container = confettiRef.current;
    if(container) {
      for(let i=0; i<50; i++) {
        const el = document.createElement('div');
        el.className = 'absolute w-3 h-3 rounded-full';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.top = -10 + '%';
        el.style.animation = `fall ${Math.random() * 2 + 2}s linear infinite`;
        el.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(el);
      }
    }
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="relative overflow-hidden flex flex-col items-center text-center animate-pop max-w-md w-full bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes fall {
            to { transform: translateY(100vh) rotate(720deg); }
          }
        `}</style>
      </div>

      <div className="mb-6 animate-bounce-short z-10">
        <TrophyIcon />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black text-yellow-600 mb-2 z-10 drop-shadow-sm">
        SUPER TROPHY<br/>UNLOCKED!
      </h1>
      
      <p className="text-lg text-slate-700 font-medium mb-4 z-10">
        You've mastered 10 high-frequency AI terms!
      </p>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-8 w-full border border-yellow-200 z-10">
        <div className="text-sm font-bold text-slate-500 uppercase">Total Time</div>
        <div className="text-3xl font-black text-slate-800">{formatTime(timeTaken)}</div>
      </div>

      <Button onClick={onRestart} fullWidth variant="secondary" className="z-10 text-xl py-4">
        Play Again
      </Button>
    </div>
  );
};