import React from 'react';
import { TripData, ItineraryItem, Expense } from '../types';
import { Icons } from './ui/Icons';

interface HomeViewProps {
  tripData: TripData;
  itinerary: ItineraryItem[];
  expenses: Expense[];
  onNavigate: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ tripData, itinerary, expenses, onNavigate }) => {
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  
  // Find next activity
  const now = new Date();
  // Simplified logic: just showing the first item of Day 1 or next available for demo
  const nextActivity = itinerary.length > 0 ? itinerary[0] : null;

  return (
    <div className="pb-24 pt-8 px-5 max-w-md mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-sumi mb-1">{tripData.name}</h1>
        <div className="flex items-center gap-2 text-stone-500 text-sm">
          <Icons.User size={14} />
          <span>{tripData.members.join(', ')}</span>
        </div>
      </header>

      {/* Quick Summary Card */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition group"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="bg-rose-50 p-2 rounded-full text-rose-500"><Icons.Wallet size={20} /></div>
            <Icons.ChevronRight size={16} className="text-stone-300 group-hover:text-stone-500" />
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Total Spent</p>
          <p className="text-xl font-bold text-sumi">¥{totalSpent.toLocaleString()}</p>
        </div>

        <div 
          onClick={() => onNavigate('itinerary')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition group"
        >
           <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-50 p-2 rounded-full text-blue-500"><Icons.Map size={20} /></div>
            <Icons.ChevronRight size={16} className="text-stone-300 group-hover:text-stone-500" />
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Next Up</p>
          <p className="text-sm font-bold text-sumi truncate">{nextActivity ? nextActivity.activity : "No plans"}</p>
        </div>
      </div>

      {/* Decorative Image / Mood */}
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm">
        <img 
          src="https://picsum.photos/800/400?grayscale" 
          alt="Japan Vibe" 
          className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
           <p className="text-white font-serif italic">"Travel is the only thing you buy that makes you richer."</p>
        </div>
      </div>

      {/* AI Prompt Starter */}
      <div 
        onClick={() => onNavigate('ai')}
        className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 shadow-lg text-white cursor-pointer relative overflow-hidden"
      >
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <Icons.AI size={18} className="text-yellow-300" />
                <span className="font-bold text-sm">AI Assistant</span>
            </div>
            <p className="text-sm text-emerald-100">Need a quick translation or restaurant recommendation?</p>
        </div>
        <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};