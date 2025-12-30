
import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Heart, 
  Sword, 
  Shield, 
  Gamepad2, 
  Utensils, 
  Star
} from 'lucide-react';
import { QuestCategory } from './types';

export const CATEGORY_METADATA: Record<QuestCategory, { icon: React.ReactNode, color: string, label: string }> = {
  care: { 
    icon: <Heart className="w-6 h-6" />, 
    color: 'bg-rose-500', 
    label: 'Kişisel Bakım' 
  },
  study: { 
    icon: <BookOpen className="w-6 h-6" />, 
    color: 'bg-blue-500', 
    label: 'Bilgelik Yolu' 
  },
  clean: { 
    icon: <Trash2 className="w-6 h-6" />, 
    color: 'bg-emerald-500', 
    label: 'Krallık Temizliği' 
  },
  magic: { 
    icon: <Sparkles className="w-6 h-6" />, 
    color: 'bg-amber-500', 
    label: 'Özel Görev' 
  },
};

export const INITIAL_REWARDS = [
  { id: '1', name: 'Efsanevi Pizza Gecesi', cost: 500, type: 'real', icon: '🍕', isUnlocked: false },
  { id: '2', name: '30 Dakika Ekran Zamanı', cost: 150, type: 'digital', icon: '🎮', isUnlocked: false },
  { id: '3', name: 'Geç Uyuma Hakkı (1 Saat)', cost: 300, type: 'real', icon: '🌙', isUnlocked: false },
  { id: '4', name: 'Yeni Kahraman Kıyafeti', cost: 100, type: 'digital', icon: '🛡️', isUnlocked: false },
  { id: '5', name: 'Park Macerası Seçimi', cost: 400, type: 'real', icon: '🌳', isUnlocked: false },
];

export const INITIAL_QUESTS = [
  { 
    id: 'q1', 
    titleKey: 'Diş Fırçalama Ritüeli', 
    description: 'Dişlerini fırçalayarak inci beyazı kalkanını güçlendir!', 
    xpReward: 20, 
    status: 'active', 
    category: 'care',
    createdAt: Date.now()
  },
  { 
    id: 'q2', 
    titleKey: 'Oda Toplama Büyüsü', 
    description: 'Oyuncak canavarları ait oldukları kutulara hapset.', 
    xpReward: 50, 
    status: 'active', 
    category: 'clean',
    createdAt: Date.now()
  },
];
