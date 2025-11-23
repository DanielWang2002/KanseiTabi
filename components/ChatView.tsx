import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Icons } from './ui/Icons';
import ReactMarkdown from 'react-markdown';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: 'こんにちは (Konnichiwa)! I am your AI travel companion. Ask me for translations, restaurant ideas, or etiquette tips!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(history, userMsg.text);
      
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      // Error handled in service, but basic fallback here
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pb-safe bg-stone-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-700 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-stone-200 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-white border-t border-stone-200 sticky bottom-0">
        <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 border border-stone-200">
          <input
            type="text"
            className="flex-1 bg-transparent focus:outline-none text-sm text-sumi"
            placeholder="Ask AI..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-1.5 rounded-full transition ${input.trim() ? 'bg-emerald-700 text-white shadow-md' : 'bg-stone-200 text-stone-400'}`}
          >
            <Icons.Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};