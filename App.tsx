import React, { useState, useEffect } from 'react';
import { Tab, Hotel, ItineraryItem, Expense, TripData } from './types';
import { BottomNav } from './components/BottomNav';
import { HotelsView } from './components/HotelsView';
import { ItineraryView } from './components/ItineraryView';
import { ExpenseView } from './components/ExpenseView';
import { ChatView } from './components/ChatView';
import { HomeView } from './components/HomeView';

const STORAGE_KEY = 'tabi_note_data_v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // State initialization with local storage persistence
  const [tripData, setTripData] = useState<TripData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trip`);
    return saved ? JSON.parse(saved) : { name: "Japan Trip 2025", members: ["Me", "Alex", "Sam"] };
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hotels`);
    return saved ? JSON.parse(saved) : [];
  });

  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
     const saved = localStorage.getItem(`${STORAGE_KEY}_itinerary`);
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
     const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem(`${STORAGE_KEY}_trip`, JSON.stringify(tripData)), [tripData]);
  useEffect(() => localStorage.setItem(`${STORAGE_KEY}_hotels`, JSON.stringify(hotels)), [hotels]);
  useEffect(() => localStorage.setItem(`${STORAGE_KEY}_itinerary`, JSON.stringify(itinerary)), [itinerary]);
  useEffect(() => localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses)), [expenses]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView tripData={tripData} itinerary={itinerary} expenses={expenses} onNavigate={setActiveTab} />;
      case 'hotels':
        return <HotelsView hotels={hotels} setHotels={setHotels} />;
      case 'itinerary':
        return <ItineraryView items={itinerary} setItems={setItinerary} />;
      case 'expenses':
        return <ExpenseView expenses={expenses} setExpenses={setExpenses} tripData={tripData} />;
      case 'ai':
        return <ChatView />;
      default:
        return <HomeView tripData={tripData} itinerary={itinerary} expenses={expenses} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-washi text-sumi font-sans selection:bg-emerald-100">
      <main className="min-h-screen">
        {renderContent()}
      </main>
      <BottomNav currentTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;