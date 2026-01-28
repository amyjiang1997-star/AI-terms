
import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { ProgressBar } from './components/ProgressBar';
import { SpeakerIcon } from './components/Icons';
import { StartScreen, GameOverScreen, FeedbackScreen, TrophyScreen } from './components/GameScreens';
import { EmailModal } from './components/EmailModal';
import { QUESTIONS } from './data';
import { playSound } from './audio';
import { GameState } from './types';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [isChecking, setIsChecking] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    currentQuestionIndex: 0,
    score: 0,
    progress: new Array(QUESTIONS.length).fill(false),
    startTime: 0,
    endTime: null,
    isMuted: false,
  });

  const currentQuestion = QUESTIONS[gameState.currentQuestionIndex];

  // Email Submit Handler
  const handleEmailSubmit = async (email: string) => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/check?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.completed) {
        alert('你已完成本次挑战，无法再次答题！');
        setIsChecking(false);
        return;
      }

      setUserEmail(email);
      setIsVerified(true);
      setSessionStartTime(Date.now());
    } catch (e) {
      alert('验证失败，请重试');
    } finally {
      setIsChecking(false);
    }
  };

  // Submit Results when Trophy is reached
  useEffect(() => {
    if (gameState.status === 'TROPHY' && userEmail && gameState.endTime) {
      const duration = gameState.endTime - gameState.startTime;
      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          duration_ms: duration
        })
      }).catch(err => console.error('Submit failed', err));
    }
  }, [gameState.status, gameState.endTime, gameState.startTime, userEmail]);

  // Handlers
  const toggleMute = () => {
    setGameState(prev => {
        const newMuted = !prev.isMuted;
        if (!newMuted) playSound('click', false);
        return { ...prev, isMuted: newMuted };
    });
  };

  const handleStart = () => {
    playSound('click', gameState.isMuted);
    setGameState(prev => ({
      ...prev,
      status: 'QUIZ',
      currentQuestionIndex: 0,
      score: 0,
      progress: new Array(QUESTIONS.length).fill(false),
      startTime: firstRun ? sessionStartTime : Date.now(),
      endTime: null,
    }));
    setFirstRun(false);
  };

  const handleAnswer = (key: string) => {
    if (key === currentQuestion.correct_key) {
      playSound('correct', gameState.isMuted);
      setGameState(prev => {
        const newProgress = [...prev.progress];
        newProgress[prev.currentQuestionIndex] = true;
        return {
          ...prev,
          score: prev.score + 1,
          progress: newProgress,
          status: 'FEEDBACK'
        };
      });
    } else {
      playSound('wrong', gameState.isMuted);
      setGameState(prev => ({
        ...prev,
        status: 'GAMEOVER'
      }));
    }
  };

  const handleNext = () => {
    playSound('click', gameState.isMuted);
    
    // Check if this was the last question
    if (gameState.currentQuestionIndex >= QUESTIONS.length - 1) {
      playSound('win', gameState.isMuted);
      setGameState(prev => ({
        ...prev,
        status: 'TROPHY',
        endTime: Date.now(),
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      status: 'QUIZ'
    }));
  };

  const handleRestart = () => {
    playSound('click', gameState.isMuted);
    handleStart(); 
  };

  // Render Quiz Screen content inline here to keep passing props simple
  const renderQuiz = () => (
    <div className="flex flex-col items-center w-full max-w-xl animate-pop">
      <div className="w-full flex justify-between items-center mb-2 px-4 text-white font-bold drop-shadow-md">
        <span>Level {gameState.currentQuestionIndex + 1}</span>
        <span className="bg-black/20 px-3 py-1 rounded-full text-sm">
          {gameState.currentQuestionIndex + 1} / {QUESTIONS.length}
        </span>
      </div>
      
      <ProgressBar 
        current={gameState.currentQuestionIndex} 
        total={QUESTIONS.length} 
        progress={gameState.progress} 
      />

      <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-b-8 border-slate-200 mb-6 relative">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
          {currentQuestion.question_cn}
        </h2>
        {/* Decorative corner */}
        <div className="absolute -top-3 -right-3 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-yellow-800 shadow-md transform rotate-12">
            ?
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleAnswer(opt.key)}
            className="group relative w-full bg-blue-50 hover:bg-white text-left p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            <span className="inline-block w-8 h-8 text-center leading-8 bg-blue-100 text-blue-600 font-bold rounded-lg mr-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              {opt.key}
            </span>
            <span className="font-semibold text-slate-700">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Background>
      {!isVerified && (
        <EmailModal onSubmit={handleEmailSubmit} isLoading={isChecking} />
      )}

      {/* Mute Button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={toggleMute} 
          className="p-3 bg-white/50 hover:bg-white/80 backdrop-blur rounded-full text-slate-700 shadow-sm transition-all"
          title="Toggle Sound"
        >
          <SpeakerIcon muted={gameState.isMuted} />
        </button>
      </div>

      {gameState.status === 'START' && <StartScreen onStart={handleStart} />}
      
      {gameState.status === 'QUIZ' && renderQuiz()}
      
      {gameState.status === 'FEEDBACK' && (
        <FeedbackScreen 
          question={currentQuestion} 
          onNext={handleNext} 
          isLast={gameState.currentQuestionIndex === QUESTIONS.length - 1} 
        />
      )}
      
      {gameState.status === 'GAMEOVER' && (
        <GameOverScreen 
          question={currentQuestion} 
          onRestart={handleRestart} 
        />
      )}
      
      {gameState.status === 'TROPHY' && (
        <TrophyScreen 
          timeTaken={(gameState.endTime || Date.now()) - gameState.startTime} 
          onRestart={handleRestart} 
        />
      )}
    </Background>
  );
};

export default App;
