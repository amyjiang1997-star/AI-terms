import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className, ...props }) => {
  const baseClasses = "relative px-6 py-3 font-bold text-lg sm:text-xl uppercase tracking-wider rounded-2xl transition-all active:scale-95 active:translate-y-1 focus:outline-none";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_6px_0_rgb(29,78,216)] active:shadow-[0_2px_0_rgb(29,78,216)]",
    secondary: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900 shadow-[0_6px_0_rgb(180,83,9)] active:shadow-[0_2px_0_rgb(180,83,9)]",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-[0_6px_0_rgb(153,27,27)] active:shadow-[0_2px_0_rgb(153,27,27)]",
    success: "bg-green-500 hover:bg-green-400 text-white shadow-[0_6px_0_rgb(21,128,61)] active:shadow-[0_2px_0_rgb(21,128,61)]"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};