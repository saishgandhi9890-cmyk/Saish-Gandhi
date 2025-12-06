import React from 'react';
import { MessageSquare, Aperture, Map, Settings, Hexagon } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.CHATS, icon: MessageSquare, label: 'Chats' },
    { id: AppView.STORIES, icon: Aperture, label: 'Stories' },
    { id: AppView.MAP, icon: Map, label: 'NetMap' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Config' },
  ];

  return (
    <div className="w-16 md:w-20 flex flex-col items-center py-6 bg-black/40 border-r border-white/10 backdrop-blur-xl z-20">
      <div className="mb-8 text-cyan-400 animate-pulse">
        <Hexagon size={32} />
      </div>
      
      <div className="flex flex-col gap-8 flex-1 w-full items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'text-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip-ish label for desktop */}
              <span className="absolute left-full ml-4 px-2 py-1 bg-black/80 border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full blur-[2px]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <img 
          src="https://picsum.photos/id/64/100/100" 
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-slate-700 hover:border-cyan-400 cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
};

export default Sidebar;
