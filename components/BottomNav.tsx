import React from 'react';
import { Tab } from '../types';
import { Icons } from './ui/Icons';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', Icon: Icons.Home },
    { id: 'itinerary', label: 'Plan', Icon: Icons.Map },
    { id: 'hotels', label: 'Stay', Icon: Icons.Hotel },
    { id: 'expenses', label: 'Wallet', Icon: Icons.Wallet },
    { id: 'ai', label: 'Guide', Icon: Icons.AI },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-washi/90 backdrop-blur-md border-t border-stone-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <item.Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};