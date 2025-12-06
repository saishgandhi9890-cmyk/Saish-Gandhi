import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import StoryRail from './components/StoryRail';
import { USERS, INITIAL_MESSAGES, ME_USER_ID } from './constants';
import { User, Message, AppView } from './types';
import { Search, Plus } from 'lucide-react';
import { sendMessageToGemini } from './services/gemini';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHATS);
  const [activeContactId, setActiveContactId] = useState<string>(USERS[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for Story Viewer Mockup
  const [viewingStory, setViewingStory] = useState<User | null>(null);

  const activeContact = USERS.find(u => u.id === activeContactId) || USERS[0];

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: ME_USER_ID,
      text,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    // AI Logic
    if (activeContactId === 'ai-itsup') {
      setIsAiTyping(true);
      
      const aiMessageId = (Date.now() + 1).toString();
      
      // Initial empty AI message holder
      const aiResponsePlaceholder: Message = {
        id: aiMessageId,
        senderId: 'ai-itsup',
        text: '',
        timestamp: new Date(),
        isAi: true,
        status: 'read'
      };

      // Add placeholder immediately so we can stream into it, 
      // OR wait for full response. For 'futuristic' feel, streaming updates would be cool,
      // but simplistic React state update on stream might flicker if not careful.
      // We will accumulate text and update state on chunks.
      
      setMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), aiResponsePlaceholder]
      }));

      // Call Gemini Service
      await sendMessageToGemini(text, (updatedText) => {
        setMessages(prev => {
          const chatMsgs = prev[activeContactId] || [];
          const updatedMsgs = chatMsgs.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: updatedText } : msg
          );
          return { ...prev, [activeContactId]: updatedMsgs };
        });
      });
      
      setIsAiTyping(false);
    } 
    // Mock user response logic for others
    else if (activeContactId.startsWith('user-')) {
       // Simulate a delay and read receipt, but no actual response for mock users
       setTimeout(() => {
         setMessages(prev => {
             const chat = [...(prev[activeContactId] || [])];
             const lastMsg = chat[chat.length - 1];
             if(lastMsg.senderId === ME_USER_ID) {
                 return {
                     ...prev,
                     [activeContactId]: chat.map(m => m.id === lastMsg.id ? {...m, status: 'read'} : m)
                 }
             }
             return prev;
         })
       }, 2000);
    }
  };

  const filteredUsers = USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#050510] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Mobile/Desktop Sidebar */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        
        {/* Left Panel: Chat List / Stories / Etc */}
        <div className={`${activeContactId ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r border-white/10 bg-black/20 backdrop-blur-lg`}>
          
          {/* Top Bar for List Panel */}
          <div className="h-20 p-6 flex items-center justify-between border-b border-white/5">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              ITSUP
            </h1>
            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <Plus size={20} className="text-cyan-400"/>
            </button>
          </div>

          {/* Stories Rail */}
          <div className="shrink-0">
            <StoryRail users={USERS} onSelectStory={(user) => setViewingStory(user)} />
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search encrypted channels..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
            {filteredUsers.map(user => {
              const lastMsg = messages[user.id]?.[messages[user.id]?.length - 1];
              const isActive = activeContactId === user.id;

              return (
                <div 
                  key={user.id}
                  onClick={() => setActiveContactId(user.id)}
                  className={`p-4 flex items-center gap-4 cursor-pointer border-b border-white/5 transition-all duration-200 hover:bg-white/5 ${
                    isActive ? 'bg-white/5 border-l-2 border-l-cyan-400' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    {user.id === 'ai-itsup' && (
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {user.name}
                      </h3>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {lastMsg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate flex items-center gap-1">
                      {lastMsg ? (
                        <>
                           {lastMsg.senderId === ME_USER_ID && <span className="text-cyan-400">You: </span>}
                           <span className={user.id === 'ai-itsup' && lastMsg.senderId !== ME_USER_ID ? 'text-cyan-300/80' : ''}>
                             {lastMsg.text}
                           </span>
                        </>
                      ) : (
                        <span className="italic opacity-50">Start a new transmission</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Window */}
        <div className={`flex-1 ${!activeContactId ? 'hidden md:flex' : 'flex'} flex-col relative`}>
          <ChatWindow 
            contact={activeContact} 
            messages={messages[activeContactId] || []}
            onSendMessage={handleSendMessage}
            isTyping={isAiTyping}
          />
        </div>

        {/* Story Viewer Overlay (Mockup) */}
        {viewingStory && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="absolute top-4 right-4 z-50">
                <button onClick={() => setViewingStory(null)} className="text-white hover:text-cyan-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             
             <div className="w-full max-w-md h-[80vh] bg-slate-800 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                {/* Progress Bar */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 h-1 z-10">
                    <div className="flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white animate-[progress_5s_linear_forwards]" />
                    </div>
                </div>
                
                {/* Header */}
                <div className="absolute top-6 left-4 flex items-center gap-2 z-10">
                    <img src={viewingStory.avatar} className="w-8 h-8 rounded-full border border-white" alt=""/>
                    <span className="text-white font-semibold text-sm drop-shadow-md">{viewingStory.name}</span>
                    <span className="text-white/60 text-xs drop-shadow-md">3h ago</span>
                </div>

                {/* Content */}
                <img 
                    src={`https://picsum.photos/seed/${viewingStory.id}-story/800/1200`} 
                    className="w-full h-full object-cover"
                    alt="Story"
                />

                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-center text-white/80 text-sm font-mono animate-pulse">
                        Tap to reply...
                    </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;