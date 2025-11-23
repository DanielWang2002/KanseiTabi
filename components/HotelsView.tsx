import React, { useState } from 'react';
import { Hotel } from '../types';
import { Icons } from './ui/Icons';

interface HotelsViewProps {
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ hotels, setHotels }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({});

  const handleAdd = () => {
    if (!newHotel.name || !newHotel.address) return;
    const hotel: Hotel = {
      id: Date.now().toString(),
      name: newHotel.name,
      address: newHotel.address,
      googleMapsUrl: newHotel.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newHotel.address + ' ' + newHotel.name)}`,
      checkIn: newHotel.checkIn || '15:00',
      checkOut: newHotel.checkOut || '11:00',
      notes: newHotel.notes || '',
    };
    setHotels([...hotels, hotel]);
    setNewHotel({});
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setHotels(hotels.filter(h => h.id !== id));
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-sumi">Accommodation</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-700 text-white p-2 rounded-full shadow-lg hover:bg-emerald-800 transition"
        >
          <Icons.Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 mb-6 animate-fade-in">
          <h3 className="text-sm font-bold text-stone-500 mb-3 uppercase tracking-wider">New Hotel</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Hotel Name"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
              value={newHotel.name || ''}
              onChange={e => setNewHotel({...newHotel, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
              value={newHotel.address || ''}
              onChange={e => setNewHotel({...newHotel, address: e.target.value})}
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Check-in (15:00)"
                className="w-1/2 p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
                value={newHotel.checkIn || ''}
                onChange={e => setNewHotel({...newHotel, checkIn: e.target.value})}
              />
              <input
                type="text"
                placeholder="Check-out (11:00)"
                className="w-1/2 p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
                value={newHotel.checkOut || ''}
                onChange={e => setNewHotel({...newHotel, checkOut: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Notes (e.g. Booking ID)"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500 resize-none h-20"
              value={newHotel.notes || ''}
              onChange={e => setNewHotel({...newHotel, notes: e.target.value})}
            />
            <div className="flex justify-end pt-2">
              <button onClick={() => setIsAdding(false)} className="text-stone-400 mr-4 text-sm">Cancel</button>
              <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {hotels.length === 0 && !isAdding && (
          <div className="text-center py-12 text-stone-400">
            <p>No hotels added yet.</p>
          </div>
        )}
        
        {hotels.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600/20"></div>
            <div className="flex justify-between items-start mb-2 pl-2">
              <h3 className="font-bold text-lg text-sumi">{hotel.name}</h3>
              <button onClick={() => handleDelete(hotel.id)} className="text-stone-300 hover:text-red-400">
                <Icons.Trash size={16} />
              </button>
            </div>
            
            <div className="pl-2 space-y-2 text-sm text-stone-600">
              <div className="flex items-start gap-2">
                <Icons.Pin size={16} className="mt-0.5 text-emerald-600 shrink-0" />
                <a 
                  href={hotel.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-emerald-700 break-words"
                >
                  {hotel.address}
                  <Icons.ExternalLink size={12} className="inline ml-1 mb-1" />
                </a>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-stone-500 bg-stone-50 p-2 rounded-lg inline-flex">
                <div className="flex items-center gap-1">
                  <span>In:</span>
                  <span className="text-sumi">{hotel.checkIn}</span>
                </div>
                <div className="w-px h-3 bg-stone-300"></div>
                <div className="flex items-center gap-1">
                  <span>Out:</span>
                  <span className="text-sumi">{hotel.checkOut}</span>
                </div>
              </div>

              {hotel.notes && (
                <div className="mt-2 pt-2 border-t border-stone-100 text-stone-500 italic text-xs">
                  {hotel.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};