
import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-slate-900 border-amber-700 shadow-[0_4px_0_rgb(180,83,9)]',
    secondary: 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 shadow-[0_4px_0_rgb(55,48,163)]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white border-rose-800 shadow-[0_4px_0_rgb(159,18,57)]',
    ghost: 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-900 shadow-[0_4px_0_rgb(15,23,42)]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        btn-game px-6 py-3 rounded-2xl font-game font-bold text-sm tracking-wider uppercase
        border-b-4 flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
};
