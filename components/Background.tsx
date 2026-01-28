import React from 'react';

export const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 font-sans text-slate-800">
      {/* Clouds Pattern Overlay */}
      <div className="absolute inset-0 bg-clouds pointer-events-none"></div>

      {/* Distant Mountains */}
      <div className="absolute bottom-20 left-0 w-full h-64 opacity-60">
        <svg viewBox="0 0 1440 320" className="w-full h-full text-indigo-200 fill-current" preserveAspectRatio="none">
          <path d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-4">
        {children}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 sm:h-20 bg-[#5d9634] border-t-8 border-[#7cbd42]">
        <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #3e6e1e 10px, #3e6e1e 20px)' }}></div>
      </div>
    </div>
  );
};