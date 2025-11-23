export type Tab = 'home' | 'itinerary' | 'hotels' | 'expenses' | 'ai';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string;
  checkIn: string;
  checkOut: string;
  notes: string;
  image?: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  payer: string;
  date: string;
  category: 'food' | 'transport' | 'stay' | 'shopping' | 'other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface TripData {
  name: string;
  members: string[];
}