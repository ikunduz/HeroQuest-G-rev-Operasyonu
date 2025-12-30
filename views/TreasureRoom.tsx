
import React from 'react';
import { ShoppingBag, Lock, Gift, Coins } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { Reward } from '../types';

interface TreasureRoomProps {
  xp: number;
  rewards: Reward[];
  onRedeem: (rewardId: string) => void;
}

export const TreasureRoom: React.FC<TreasureRoomProps> = ({ xp, rewards, onRedeem }) => {
  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <header className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-3xl border-2 border-amber-500/50 text-center relative overflow-hidden animate-pop">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
        
        <ShoppingBag className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-float" />
        <h1 className="font-game text-3xl text-white mb-2">HAZİNE ODASI</h1>
        <div className="inline-flex items-center gap-2 bg-slate-950/60 px-6 py-2 rounded-full border border-amber-500/30">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="font-game text-xl text-amber-400">{xp}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward, index) => {
          const canAfford = xp >= reward.cost;
          return (
            <div 
              key={reward.id}
              className={`
                bg-slate-800/80 p-5 rounded-3xl border-2 transition-all relative overflow-hidden quest-card-hover animate-pop
                ${canAfford ? 'border-slate-700' : 'border-slate-800 opacity-60 grayscale cursor-not-allowed'}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-4xl ${canAfford ? 'animate-float' : ''}`} style={{ animationDelay: `${index * 0.2}s` }}>
                  {reward.icon}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${reward.type === 'real' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {reward.type === 'real' ? 'FİZİKSEL' : 'DİJİTAL'}
                </span>
              </div>
              
              <h3 className="font-game text-lg text-white mb-1 group-hover:text-amber-400 transition-colors">{reward.name}</h3>
              <p className="text-xs text-slate-500 mb-6">Sadece krallığın en sadık muhafızları için.</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-amber-500 font-game">
                  <Coins size={14} className={canAfford ? 'animate-pulse' : ''} />
                  <span>{reward.cost}</span>
                </div>
                
                <GameButton 
                  disabled={!canAfford}
                  variant={canAfford ? 'primary' : 'ghost'}
                  className="text-[10px] px-4 py-2"
                  onClick={() => onRedeem(reward.id)}
                >
                  {canAfford ? 'SATIN AL' : <><Lock size={12} className="inline mr-1" /> KİLİTLİ</>}
                </GameButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
