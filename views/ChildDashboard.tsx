
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Sparkles, Camera, CheckCircle2, ChevronRight, Trophy, Sword, 
  UserCircle, Wand2, Target, Heart, Zap
} from 'lucide-react';
import { XPBar } from '../components/XPBar';
import { GameButton } from '../components/GameButton';
import { CATEGORY_METADATA } from '../constants';
import { Quest, UserState } from '../types';
import { getWisdomMessage } from '../services/geminiService';

interface ChildDashboardProps {
  user: UserState;
  quests: Quest[];
  onComplete: (id: string) => void;
  onUpdateUser: (updates: Partial<UserState>) => void;
}

const HERO_CLASSES = [
  { id: 'knight', icon: <Shield size={32} />, label: 'Şövalye', color: 'bg-blue-600' },
  { id: 'mage', icon: <Wand2 size={32} />, label: 'Büyücü', color: 'bg-purple-600' },
  { id: 'ranger', icon: <Target size={32} />, label: 'Okçu', color: 'bg-emerald-600' }
];

export const ChildDashboard: React.FC<ChildDashboardProps> = ({ user, quests, onComplete, onUpdateUser }) => {
  const [wisdom, setWisdom] = useState<string>("Yükleniyor...");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isBlessingActive, setIsBlessingActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getWisdomMessage(user.name, user.level).then(setWisdom);
  }, [user.name, user.level]);

  // Blessing Effect
  useEffect(() => {
    if (user.lastBlessingFrom) {
      setIsBlessingActive(true);
      const timer = setTimeout(() => setIsBlessingActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [user.lastBlessingFrom]);

  const activeQuests = quests.filter(q => q.status === 'active');
  const pendingQuests = quests.filter(q => q.status === 'pending_approval');
  const completedQuests = quests.filter(q => q.status === 'completed').slice(0, 3);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/png');
        onUpdateUser({ avatar: data });
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  if (showProfile) {
    return (
      <div className="p-6 flex flex-col gap-6 animate-pop">
        <header className="flex justify-between items-center">
          <h2 className="font-game text-2xl text-amber-400">KAHRAMAN PORTRESİ</h2>
          <GameButton variant="ghost" onClick={() => setShowProfile(false)}><ChevronRight className="rotate-180" /></GameButton>
        </header>

        <div className="bg-slate-800/80 p-6 rounded-[2.5rem] border-2 border-slate-700 text-center">
          <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl bg-slate-900 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {!user.avatar ? (
            <div className="space-y-4">
              <GameButton onClick={startCamera} className="w-full">AYNAYI AÇ</GameButton>
              <GameButton onClick={takePhoto} variant="secondary" className="w-full">FOTOĞRAF ÇEK</GameButton>
            </div>
          ) : (
            <GameButton onClick={() => onUpdateUser({ avatar: undefined })} variant="danger" className="w-full">YENİDEN ÇEK</GameButton>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {HERO_CLASSES.map(hc => (
            <button 
              key={hc.id}
              onClick={() => onUpdateUser({ heroClass: hc.id as any })}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${user.heroClass === hc.id ? 'border-amber-500 bg-amber-500/20' : 'border-slate-700 bg-slate-800/40 opacity-50'}`}
            >
              {hc.icon}
              <span className="text-[10px] font-black uppercase tracking-tighter">{hc.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedQuest) {
    return (
      <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto min-h-screen animate-pop">
        <header className="flex items-center gap-4">
          <GameButton variant="ghost" onClick={() => setSelectedQuest(null)} className="px-3 py-2">
            <ChevronRight className="rotate-180" /> Geri
          </GameButton>
          <h2 className="font-game text-xl text-amber-400 uppercase tracking-tighter">GÖREV AYRINTILARI</h2>
        </header>

        <div className="rounded-[2.5rem] p-8 border-2 text-center invisibility-cloak quest-card-hover">
          <div className={`w-24 h-24 mx-auto rounded-[2rem] mb-6 flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform relative z-10 ${CATEGORY_METADATA[selectedQuest.category].color}`}>
            {React.cloneElement(CATEGORY_METADATA[selectedQuest.category].icon as React.ReactElement, { size: 40 })}
          </div>
          <h3 className="font-game text-3xl mb-3 text-white relative z-10">{selectedQuest.titleKey}</h3>
          <p className="text-slate-300 mb-8 italic text-lg leading-relaxed relative z-10">"{selectedQuest.description}"</p>
          
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-amber-500/30 mb-8 shadow-inner relative z-10">
            <span className="block text-[10px] text-amber-500/70 uppercase font-black tracking-[0.2em] mb-1">KAZANIM</span>
            <span className="text-3xl font-game text-amber-400 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" /> {selectedQuest.xpReward} XP
            </span>
          </div>

          <div className="space-y-4 relative z-10">
            <GameButton className="w-full py-5 text-xl" onClick={() => { onComplete(selectedQuest.id); setSelectedQuest(null); }}>
              GÖREVİ BİLDİR
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24 relative">
      {isBlessingActive && (
        <div className="blessing-glow flex items-center justify-center">
          <div className="text-center animate-pop">
            <Zap className="w-20 h-20 text-amber-400 mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
            <p className="font-game text-3xl text-white mt-4">{user.lastBlessingFrom === 'mom' ? 'ANNELİK' : 'BABALIK'} LÜTFU!</p>
            <p className="text-amber-400 font-bold">+5 XP KAZANILDI</p>
          </div>
        </div>
      )}

      {/* Hero Stats */}
      <section className="bg-slate-800/50 p-6 rounded-b-[3.5rem] border-b-4 border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-5 mb-6">
          <div 
            onClick={() => setShowProfile(true)}
            className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-lg transform -rotate-3 cursor-pointer active:scale-95 transition-all"
          >
            <div className="bg-slate-900 w-full h-full rounded-[1.2rem] flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="text-amber-400 w-10 h-10" />
              )}
            </div>
          </div>
          <div className="grow">
            <h1 className="font-game text-3xl text-white tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                 {user.heroClass === 'mage' ? 'Büyücü' : user.heroClass === 'ranger' ? 'Okçu' : 'Işık Muhafızı'}
               </span>
               <div className="flex items-center text-slate-400 text-xs gap-1">
                 <Sparkles className="w-3 h-3 text-amber-400" /> Seviye {user.level}
               </div>
            </div>
          </div>
        </div>
        <XPBar xp={user.xp} level={user.level} />
      </section>

      {/* AI Wisdom */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-indigo-900/60 to-slate-900/40 border-l-4 border-indigo-400 p-5 rounded-r-3xl italic text-slate-100 text-sm animate-pop shadow-lg quest-card-hover">
          <span className="font-game text-[10px] text-indigo-300 block mb-2 tracking-[0.2em] font-black uppercase">Bilgenin Öğüdü</span>
          "{wisdom}"
        </div>
      </section>

      {/* Quest List */}
      <section className="px-4 space-y-5">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-game text-xl tracking-tight text-white flex items-center gap-2">
            <Sword className="w-5 h-5 text-amber-500" /> AKTİF GÖREVLER
          </h2>
        </div>

        {activeQuests.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-800 animate-pop">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <p className="font-game text-xl text-slate-200 uppercase">ZAFER!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {activeQuests.map((quest, index) => (
              <div 
                key={quest.id}
                onClick={() => setSelectedQuest(quest)}
                className="bg-slate-800/80 border-2 border-slate-700 p-5 rounded-[2rem] group cursor-pointer quest-card-hover animate-pop shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_METADATA[quest.category].color}`}>
                    {CATEGORY_METADATA[quest.category].icon}
                  </div>
                  <div className="grow">
                    <h3 className="font-game text-xl text-white">{quest.titleKey}</h3>
                    <span className="text-xs font-black text-amber-500">+{quest.xpReward} XP</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recently Completed */}
      {completedQuests.length > 0 && (
        <section className="px-4 space-y-4">
          <h2 className="font-game text-lg tracking-tight text-slate-400 flex items-center gap-2 px-1">
            <Trophy size={18} className="text-emerald-500" /> TAMAMLANANLAR
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {completedQuests.map((quest, index) => (
              <div 
                key={quest.id} 
                className="p-4 rounded-3xl border-2 completed-card animate-pop shadow-lg quest-card-hover"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
                    {CATEGORY_METADATA[quest.category].icon}
                  </div>
                  <div>
                    <h4 className="font-game text-md text-slate-300 line-through truncate">{quest.titleKey}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
