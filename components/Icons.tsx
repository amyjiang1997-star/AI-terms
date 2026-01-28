import React from 'react';

export const CoinIcon: React.FC<{ active?: boolean; broken?: boolean; size?: number }> = ({ active, broken, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={broken ? "text-red-500" : active ? "text-yellow-400 drop-shadow-[0_2px_4px_rgba(234,179,8,0.5)]" : "text-gray-300"}>
    {broken ? (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 10z" fill="transparent" />
        <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="12" cy="12" r="7" stroke="#B45309" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
        <text x="12" y="15" fontSize="10" textAnchor="middle" fill="#B45309" fillOpacity="0.5" fontWeight="bold">$</text>
      </>
    )}
  </svg>
);

export const TrophyIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl filter">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FDE047" stroke="#B45309" strokeWidth="1" strokeLinejoin="round" />
    <path d="M6 20H18" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 17V20" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SpeakerIcon: React.FC<{ muted: boolean }> = ({ muted }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </>
    )}
  </svg>
);

export const PlayAudioIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);