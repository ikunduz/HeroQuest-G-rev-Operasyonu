
import React, { useState, useEffect } from 'react';
import { User, Users, Sword, ShoppingBag, LayoutDashboard, Settings } from 'lucide-react';
import { Role, Quest, UserState, Reward, ParentType } from './types';
import { INITIAL_QUESTS, INITIAL_REWARDS } from './constants';
import { ChildDashboard } from './views/ChildDashboard';
import { ParentDashboard } from './views/ParentDashboard';
import { TreasureRoom } from './views/TreasureRoom';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('child');
  const [activeTab, setActiveTab] = useState<'map' | 'shop'>('map');
  const [user, setUser] = useState<UserState>({
    role: 'child',
    xp: 85,
    level: 2,
    name: 'Kuzey',
    streak: 3,
    heroClass: 'knight'
  });

  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [rewards] = useState<Reward[]>(INITIAL_REWARDS);

  useEffect(() => {
    const saved = localStorage.getItem('heroquest_data_v2');
    if (saved) {
      const { user: u, quests: q } = JSON.parse(saved);
      setUser(u);
      setQuests(q);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('heroquest_data_v2', JSON.stringify({ user, quests }));
  }, [user, quests]);

  const handleQuestCompletion = (id: string) => {
    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, status: 'pending_approval' } : q
    ));
  };

  const handleUpdateUser = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleApprove = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, status: 'completed' } : q
    ));

    setUser(prev => {
      let newXP = prev.xp + quest.xpReward;
      let newLevel = prev.level;
      if (newXP >= prev.level * 100) {
        newXP -= prev.level * 100;
        newLevel += 1;
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const handleSendBlessing = (from: ParentType) => {
    setUser(prev => {
      let newXP = prev.xp + 5;
      let newLevel = prev.level;
      if (newXP >= prev.level * 100) {
        newXP -= prev.level * 100;
        newLevel += 1;
      }
      return { ...prev, xp: newXP, level: newLevel, lastBlessingFrom: from };
    });
    // Clear blessing marker after a moment to allow re-triggering
    setTimeout(() => {
      setUser(prev => ({ ...prev, lastBlessingFrom: undefined }));
    }, 2100);
  };

  const handleAddQuest = (q: Partial<Quest>) => {
    const newQ: Quest = {
      id: Math.random().toString(36).substr(2, 9),
      titleKey: q.titleKey || 'Yeni Görev',
      description: q.description || 'Krallık emri!',
      xpReward: q.xpReward || 25,
      category: q.category || 'magic',
      status: 'active',
      createdAt: Date.now()
    };
    setQuests(prev => [newQ, ...prev]);
  };

  const handleDeleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  const handleRedeemReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || user.xp < reward.cost) return;
    setUser(prev => ({ ...prev, xp: prev.xp - reward.cost }));
    alert(`${reward.name} talebin Bilge Konseyi'ne iletildi!`);
  };

  return (
    <div className="game-bg font-game min-h-screen">
      {/* Role Switcher */}
      <div className="fixed top-2 right-2 z-[100] flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
        <button onClick={() => setRole('child')} className={`p-2 rounded-lg ${role === 'child' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}><User size={18} /></button>
        <button onClick={() => setRole('parent')} className={`p-2 rounded-lg ${role === 'parent' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}><Users size={18} /></button>
      </div>

      <main className="max-w-xl mx-auto pb-24">
        {role === 'child' ? (
          activeTab === 'map' ? (
            <ChildDashboard user={user} quests={quests} onComplete={handleQuestCompletion} onUpdateUser={handleUpdateUser} />
          ) : (
            <TreasureRoom xp={user.xp} rewards={rewards} onRedeem={handleRedeemReward} />
          )
        ) : (
          <ParentDashboard 
            quests={quests} 
            onApprove={handleApprove} 
            onAddQuest={handleAddQuest} 
            onDelete={handleDeleteQuest}
            onSendBlessing={handleSendBlessing}
          />
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 h-20 bg-slate-900 border-t-4 border-amber-900/30 flex justify-around items-center px-4 z-40 max-w-xl mx-auto rounded-t-3xl">
        {role === 'child' ? (
          <>
            <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center grow ${activeTab === 'map' ? 'text-amber-400 -translate-y-2' : 'text-slate-600'}`}>
              <Sword /> <span className="text-[10px] uppercase font-bold">Macera</span>
            </button>
            <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center grow ${activeTab === 'shop' ? 'text-amber-400 -translate-y-2' : 'text-slate-600'}`}>
              <ShoppingBag /> <span className="text-[10px] uppercase font-bold">Hazine</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-indigo-400 grow"><LayoutDashboard /> <span className="text-[10px] uppercase font-bold">Yönetim</span></div>
        )}
        <button className="flex flex-col items-center text-slate-600 opacity-30 grow"><Settings /> <span className="text-[10px] uppercase font-bold">Ayarlar</span></button>
      </nav>
    </div>
  );
};

export default App;
