import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import { Send, Phone, Video, MoreVertical, Mic, Paperclip, Smile } from 'lucide-react';

interface ChatWindowProps {
  contact: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            )}
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide text-lg">{contact.name}</h2>
            <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider">
              {contact.isOnline ? 'Online // Connected' : `Offline // Last seen ${contact.lastSeen}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <button className="hover:text-cyan-400 transition-colors"><Phone size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><Video size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[70%] relative group ${
                  isMe 
                    ? 'bg-cyan-900/30 border border-cyan-500/30 rounded-2xl rounded-tr-sm' 
                    : 'bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm'
                } p-4 backdrop-blur-md shadow-lg`}
              >
                <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-2 opacity-50 text-[10px] font-mono">
                  <span>{formatTime(msg.timestamp)}</span>
                  {isMe && (
                    <span className={msg.status === 'read' ? 'text-cyan-400' : 'text-slate-400'}>
                      {msg.status === 'read' ? 'VV' : 'V'}
                    </span>
                  )}
                </div>
                
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none ${
                    isMe ? 'shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                }`} />
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 backdrop-blur-md flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-0" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 backdrop-blur-xl border-t border-white/5 shrink-0 z-10">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button type="button" className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light"
            />
             <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400 transition-colors">
              <Smile size={18} />
            </button>
          </div>

          {inputValue.trim() ? (
            <button 
              type="submit" 
              className="p-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Send size={20} fill="currentColor" />
            </button>
          ) : (
            <button type="button" className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors">
               <Mic size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
