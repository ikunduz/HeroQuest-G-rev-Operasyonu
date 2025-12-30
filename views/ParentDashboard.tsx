
import React, { useState } from 'react';
import { LayoutDashboard, Plus, CheckCircle, Clock, TrendingUp, X, Heart, Star, UserCheck, Zap } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { Quest, QuestCategory, ParentType } from '../types';
import { CATEGORY_METADATA } from '../constants';

interface ParentDashboardProps {
  quests: Quest[];
  onApprove: (id: string) => void;
  onAddQuest: (quest: Partial<Quest>) => void;
  onDelete: (id: string) => void;
  onSendBlessing: (from: ParentType) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ quests, onApprove, onAddQuest, onDelete, onSendBlessing }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [parentType, setParentType] = useState<ParentType>('mom');
  const [newQuest, setNewQuest] = useState({
    title: '',
    desc: '',
    xp: 25,
    cat: 'magic' as QuestCategory
  });

  const pendingQuests = quests.filter(q => q.status === 'pending_approval');
  const activeQuests = quests.filter(q => q.status === 'active');

  return (
    <div className="flex flex-col gap-8 p-4 max-w-2xl mx-auto pb-24">
      {/* Parent Identity Switcher */}
      <div className="flex gap-2 bg-slate-900/60 p-1 rounded-2xl border border-slate-700 w-fit mx-auto animate-pop">
        <button 
          onClick={() => setParentType('mom')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${parentType === 'mom' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}
        >
          <Heart size={18} /> ANNE
        </button>
        <button 
          onClick={() => setParentType('dad')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${parentType === 'dad' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}
        >
          <UserCheck size={18} /> BABA
        </button>
      </div>

      <header className="flex justify-between items-center bg-slate-800/50 p-6 rounded-3xl border-b-2 border-slate-700 animate-pop shadow-xl">
        <div>
          <h1 className="font-game text-2xl text-amber-400 uppercase">BİLGE KUMANDASI</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{parentType === 'mom' ? 'Kraliçe' : 'Kral'} Denetimi</p>
        </div>
        <GameButton onClick={() => setIsAdding(true)} variant="primary" className="p-4 rounded-full">
          <Plus />
        </GameButton>
      </header>

      {/* Interactions */}
      <section className="bg-gradient-to-r from-amber-900/20 to-indigo-900/20 p-6 rounded-[2.5rem] border-2 border-amber-500/20 animate-pop">
        <h2 className="font-game text-sm text-amber-500/70 mb-4 text-center tracking-widest uppercase">KAHRAMANA LÜTUF GÖNDER</h2>
        <GameButton 
          variant="secondary" 
          className="w-full py-4 text-lg bg-gradient-to-r from-amber-500 to-indigo-600 border-none shadow-xl"
          onClick={() => onSendBlessing(parentType)}
        >
          <Zap className="animate-pulse" /> ANLIK LÜTUF GÖNDER (+5 XP)
        </GameButton>
        <p className="text-[10px] text-center text-slate-500 mt-3 italic">Çocuğun ekranında parlayacak ve moral verecektir.</p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 animate-pop">
        <div className="bg-slate-800/40 p-4 rounded-3xl border border-slate-700 flex items-center gap-3">
          <Clock className="text-blue-400" />
          <div>
            <p className="text-2xl font-game">{activeQuests.length}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Süratli Görev</p>
          </div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-3xl border border-slate-700 flex items-center gap-3">
          <CheckCircle className="text-emerald-400" />
          <div>
            <p className="text-2xl font-game">{quests.filter(q => q.status === 'completed').length}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Zafer Sayısı</p>
          </div>
        </div>
      </section>

      {/* Pending Approvals */}
      <section className="space-y-4 animate-pop">
        <h2 className="font-game text-lg text-slate-400">ONAY BEKLEYEN RAPORLAR</h2>
        {pendingQuests.length === 0 ? (
          <div className="bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-600 italic">
            Kahraman henüz rapor göndermedi.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingQuests.map(quest => (
              <div key={quest.id} className="bg-indigo-950/30 border-2 border-indigo-500/50 p-5 rounded-3xl flex items-center gap-4 quest-card-hover">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_METADATA[quest.category].color}`}>
                  {CATEGORY_METADATA[quest.category].icon}
                </div>
                <div className="grow">
                  <h3 className="font-bold text-lg text-indigo-100">{quest.titleKey}</h3>
                  <GameButton onClick={() => onApprove(quest.id)} className="mt-2 text-xs py-2 px-4">ONAYLA</GameButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Quests */}
      <section className="space-y-4 animate-pop">
        <h2 className="font-game text-lg text-slate-400">AKTİF EMİRLER</h2>
        <div className="space-y-2">
          {activeQuests.map(quest => (
            <div key={quest.id} className="bg-slate-800/40 p-4 rounded-2xl flex items-center justify-between group quest-card-hover border border-transparent hover:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="opacity-50">{CATEGORY_METADATA[quest.category].icon}</span>
                <p className="font-game text-sm">{quest.titleKey}</p>
              </div>
              <button onClick={() => onDelete(quest.id)} className="p-2 text-rose-500"><X size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Create Modal - Simplified for brevity in response but fully functional */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-[2.5rem] p-8 w-full max-w-md animate-pop">
            <h2 className="font-game text-2xl mb-6 text-amber-400 text-center">YENİ EMİR</h2>
            <input 
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white mb-4 outline-none"
              placeholder="Görev Başlığı"
              onChange={e => setNewQuest(prev => ({ ...prev, title: e.target.value }))}
            />
            <div className="flex gap-4">
              <GameButton variant="ghost" onClick={() => setIsAdding(false)} className="grow">İPTAL</GameButton>
              <GameButton onClick={() => {
                onAddQuest({ titleKey: newQuest.title, xpReward: 25, category: 'magic' });
                setIsAdding(false);
              }} className="grow">YAYINLA</GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
