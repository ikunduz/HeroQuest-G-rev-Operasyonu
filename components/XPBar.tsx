
import React from 'react';

interface XPBarProps {
  xp: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, level }) => {
  const maxXP = level * 100;
  const percentage = Math.min((xp / maxXP) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-amber-400 font-game text-lg">SEVİYE {level}</span>
        <span className="text-slate-400 text-xs">{xp} / {maxXP} XP</span>
      </div>
      <div className="h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 relative">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(251,191,36,0.6)]"
          style={{ width: `${percentage}%` }}
        />
        {percentage === 100 && (
          <div className="absolute inset-0 animate-pulse bg-white/20" />
        )}
      </div>
    </div>
  );
};
