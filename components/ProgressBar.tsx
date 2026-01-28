import React from 'react';
import { CoinIcon } from './Icons';

interface ProgressBarProps {
  current: number;
  total: number;
  progress: boolean[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, progress }) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-4 w-full max-w-lg">
      <div className="flex justify-between w-full px-2">
         {Array.from({ length: total }).map((_, idx) => {
            const isCompleted = idx < current;
            const isCurrent = idx === current;
            // For future questions, use default.
            // For past questions, use progress[idx] to check if it was actually correct (though logic enforces correct to proceed, except gameover)
            // But visually we just want 10 slots.
            
            // Actually, in this game:
            // - If we are at Q3, then Q0, Q1, Q2 MUST have been correct.
            // - So we can just show gold for < current.
            // - Current is active.
            
            return (
              <div key={idx} className={`transition-all duration-500 ${isCurrent ? 'scale-125 animate-bounce' : 'scale-100'}`}>
                <CoinIcon active={isCompleted} size={isCurrent ? 28 : 20} />
              </div>
            );
         })}
      </div>
      <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden border-2 border-white/30 backdrop-blur-sm">
        <div 
          className="h-full bg-yellow-400 transition-all duration-500 ease-out" 
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
};