import React, { useState } from 'react';
import { Expense, TripData } from '../types';
import { Icons } from './ui/Icons';
import { Doughnut } from 'react-chartjs-2'; // Wait, prompt said use Recharts or d3. Let's use simple CSS bars or Recharts if needed. 
// Actually, for simplicity and aesthetics without heavy libs in single file output, I'll build custom CSS charts or simple Recharts.
// The prompt requires Recharts.
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  tripData: TripData;
}

const CATEGORIES = [
  { id: 'food', label: 'Food', color: '#f87171' }, // Red
  { id: 'transport', label: 'Travel', color: '#60a5fa' }, // Blue
  { id: 'stay', label: 'Stay', color: '#a78bfa' }, // Purple
  { id: 'shopping', label: 'Shop', color: '#fbbf24' }, // Amber
  { id: 'other', label: 'Other', color: '#9ca3af' }, // Gray
];

export const ExpenseView: React.FC<ExpenseViewProps> = ({ expenses, setExpenses, tripData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    currency: 'JPY',
    category: 'food',
    payer: tripData.members[0] || 'Me'
  } as any);

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Calculate debts (Simple Even Split logic)
  // Total / Count = Fair Share.
  // Balance = Paid - Fair Share.
  const memberBalances = tripData.members.map(member => {
    const paid = expenses.filter(e => e.payer === member).reduce((s, e) => s + e.amount, 0);
    const fairShare = totalSpent / (tripData.members.length || 1);
    return { member, balance: paid - fairShare, paid };
  });

  const chartData = CATEGORIES.map(cat => ({
    name: cat.label,
    value: expenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0),
    color: cat.color
  })).filter(d => d.value > 0);

  const handleAdd = () => {
    if (!newExpense.title || !newExpense.amount) return;
    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: Number(newExpense.amount),
      payer: newExpense.payer || tripData.members[0],
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category as any
    };
    setExpenses([expense, ...expenses]);
    setIsAdding(false);
    setNewExpense({
      currency: 'JPY',
      category: 'food',
      payer: tripData.members[0]
    } as any);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-sumi">Expenses</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-700 text-white p-2 rounded-full shadow-lg hover:bg-emerald-800 transition"
        >
          <Icons.Plus size={20} />
        </button>
      </div>

      <div className="bg-sumi text-washi rounded-2xl p-6 shadow-lg mb-6 text-center">
        <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Total Trip Cost</p>
        <p className="text-4xl font-serif font-bold">¥{totalSpent.toLocaleString()}</p>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 mb-6 animate-fade-in">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="What for?"
              className="w-full p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
              value={newExpense.title || ''}
              onChange={e => setNewExpense({...newExpense, title: e.target.value})}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount (¥)"
                className="w-2/3 p-2 bg-stone-50 border-b border-stone-200 focus:outline-none focus:border-emerald-500"
                value={newExpense.amount || ''}
                onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
              />
              <select
                className="w-1/3 p-2 bg-stone-50 border-b border-stone-200 text-sm"
                value={newExpense.payer}
                onChange={e => setNewExpense({...newExpense, payer: e.target.value})}
              >
                {tripData.members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewExpense({...newExpense, category: cat.id as any})}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${
                    newExpense.category === cat.id 
                    ? 'bg-stone-800 text-white border-stone-800' 
                    : 'bg-white text-stone-500 border-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button onClick={handleAdd} className="w-full bg-emerald-700 text-white py-2 rounded-lg font-medium shadow-md">
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Balance Summary */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 mb-6">
        <h3 className="text-sm font-bold text-stone-600 mb-3 border-b border-stone-100 pb-2">Who Owes Who?</h3>
        <div className="space-y-2">
          {memberBalances.map(m => (
            <div key={m.member} className="flex justify-between items-center text-sm">
              <span className="text-sumi font-medium">{m.member}</span>
              <span className={m.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                {m.balance >= 0 ? '+' : ''}¥{Math.round(m.balance).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent List */}
      <div className="space-y-3">
        {expenses.map(expense => {
          const cat = CATEGORIES.find(c => c.id === expense.category);
          return (
            <div key={expense.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cat?.color }}>
                  <Icons.Wallet size={16} />
                </div>
                <div>
                  <p className="font-bold text-sumi text-sm">{expense.title}</p>
                  <p className="text-xs text-stone-400">{expense.payer} • {expense.date}</p>
                </div>
              </div>
              <p className="font-bold text-stone-700">¥{expense.amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};