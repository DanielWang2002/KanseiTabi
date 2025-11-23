import React, { useState } from 'react';
import { ItineraryItem } from '../types';
import { Icons } from './ui/Icons';

interface ItineraryViewProps {
  items: ItineraryItem[];
  setItems: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ items, setItems }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({ day: activeDay });

  // Get unique days from items
  const days: number[] = Array.from(new Set(items.map(i => i.day))).sort((a: number, b: number) => a - b);
  if (!days.includes(1)) days.unshift(1);

  const handleAdd = () => {
    if (!newItem.activity || !newItem.time) return;
    const item: ItineraryItem = {
      id: Date.now().toString(),
      day: activeDay,
      time: newItem.time,
      activity: newItem.activity,
      location: newItem.location || '',
      notes: newItem.notes || '',
    };
    setItems([...items, item].sort((a, b) => a.time.localeCompare(b.time)));
    setNewItem({ day: activeDay });
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = items.filter(i => i.day === activeDay);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif text-sumi">Itinerary</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-700 text-white p-2 rounded-full shadow-lg hover:bg-emerald-800 transition"
        >
          <Icons.Plus size={20} />
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              activeDay === day 
                ? 'bg-sumi text-white border-sumi shadow-md' 
                : 'bg-white text-stone-400 border-stone-200'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wide">Day</span>
            <span className="text-xl font-bold font-serif">{day}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveDay(days.length > 0 ? Math.max(...days) + 1 : 1)}
          className="flex-shrink-0 w-12 h-16 rounded-2xl flex items-center justify-center border border-dashed border-stone-300 text-stone-300 hover:border-emerald-500 hover:text-emerald-500"
        >
          <Icons.Plus size={16} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-emerald-100 mb-6 z-10 animate-fade-in fixed inset-x-4 top-24 max-w-md mx-auto">
          <h3 className="text-sm font-bold text-emerald-800 mb-3 uppercase">Add to Day {activeDay}</h3>
          <div className="space-y-3">
             <div className="flex gap-2">
                <input
                  type="time"
                  className="w-1/3 p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
                  value={newItem.time || ''}
                  onChange={e => setNewItem({...newItem, time: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Activity"
                  className="w-2/3 p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
                  value={newItem.activity || ''}
                  onChange={e => setNewItem({...newItem, activity: e.target.value})}
                />
             </div>
            <input
              type="text"
              placeholder="Location (optional)"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
              value={newItem.location || ''}
              onChange={e => setNewItem({...newItem, location: e.target.value})}
            />
             <textarea
              placeholder="Notes"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500 h-16 resize-none"
              value={newItem.notes || ''}
              onChange={e => setNewItem({...newItem, notes: e.target.value})}
            />
            <div className="flex justify-end pt-2">
              <button onClick={() => setIsAdding(false)} className="text-stone-400 mr-4 text-sm">Cancel</button>
              <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}

      {isAdding && <div className="fixed inset-0 bg-black/20 z-0" onClick={() => setIsAdding(false)} />}

      {/* Timeline */}
      <div className="relative border-l-2 border-stone-200 ml-4 space-y-8 pb-4">
        {filteredItems.length === 0 && (
          <div className="ml-6 text-stone-400 italic text-sm py-4">Nothing planned for Day {activeDay} yet.</div>
        )}
        
        {filteredItems.map(item => (
          <div key={item.id} className="relative ml-6">
            <div className="absolute -left-[31px] top-1 bg-washi border-2 border-emerald-600 w-4 h-4 rounded-full"></div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
              <div className="flex justify-between items-start">
                 <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md mb-1 inline-block">{item.time}</span>
                 <button onClick={() => deleteItem(item.id)} className="text-stone-200 hover:text-red-400"><Icons.Trash size={14}/></button>
              </div>
              <h4 className="font-bold text-sumi text-lg">{item.activity}</h4>
              {item.location && (
                <div className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                  <Icons.Pin size={12} /> {item.location}
                </div>
              )}
              {item.notes && (
                <p className="text-xs text-stone-400 mt-2 bg-stone-50 p-2 rounded">{item.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};