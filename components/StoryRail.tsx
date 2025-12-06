import React from 'react';
import { User } from '../types';

interface StoryRailProps {
  users: User[];
  onSelectStory: (user: User) => void;
}

const StoryRail: React.FC<StoryRailProps> = ({ users, onSelectStory }) => {
  const usersWithStories = users.filter(u => u.hasStory);

  return (
    <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide border-b border-white/10 bg-black/20 backdrop-blur-md">
      {/* My Story Add Button */}
      <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[70px]">
        <div className="relative w-16 h-16 rounded-full p-[2px] bg-white/10 border-2 border-dashed border-cyan-500/50 flex items-center justify-center hover:border-cyan-400 transition-colors">
            <span className="text-2xl text-cyan-400">+</span>
        </div>
        <span className="text-xs text-cyan-100/70 font-medium truncate w-16 text-center">My Status</span>
      </div>

      {usersWithStories.map((user) => (
        <div 
          key={user.id} 
          className="flex flex-col items-center gap-1 cursor-pointer min-w-[70px] group"
          onClick={() => onSelectStory(user)}
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 animate-spin-slow-static hover:animate-pulse">
            <div className="w-full h-full rounded-full p-[2px] bg-black">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-xs text-white/90 font-medium truncate w-16 text-center font-mono">
            {user.name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryRail;
