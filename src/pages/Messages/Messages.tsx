import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, MoreVertical, Paperclip, Send, Phone, Video, Info, User, CheckCircle2, Bot } from 'lucide-react';
import api from '../../api/axios';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [isBotActive, setIsBotActive] = useState(true);

  // Mock Data
  const chats = [
    { id: 1, name: "Sarah Jenkins", platform: "whatsapp", preview: "Are you open this Sunday?", time: "10:42 AM", unread: 2, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Emily Watson", platform: "instagram", preview: "Thanks for the hair tips!", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?u=emily" },
    { id: 3, name: "Jessica Alba", platform: "facebook", preview: "I'd like to book an appointment.", time: "Tuesday", unread: 0, avatar: "https://i.pravatar.cc/150?u=jessica" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    // TODO: Connect to backend API for sending Evolution API message
    console.log("Sending:", messageText);
    setMessageText('');
  };

  const toggleBot = async () => {
    try {
      const newStatus = isBotActive ? 'paused' : 'active';
      // In a real scenario, you'd pass the actual conversation ID from selectedChat
      await api.patch(\`/integrations/conversations/\${selectedChat}/bot-status\`, { botStatus: newStatus });
      setIsBotActive(!isBotActive);
    } catch (error) {
      console.error('Failed to toggle bot status', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <Helmet>
        <title>Omnichannel Inbox | BeautyStudio OS</title>
      </Helmet>

      {/* Left Pane - Chat List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors flex gap-3 ${
                selectedChat === chat.id 
                  ? 'bg-brand-50 dark:bg-brand-900/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                {chat.platform === 'whatsapp' && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.preview}</p>
              </div>
              {chat.unread > 0 && (
                <div className="shrink-0 flex flex-col justify-center">
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{chat.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Pane - Chat Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
        {selectedChat ? (
          <>
            <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={chats.find(c => c.id === selectedChat)?.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{chats.find(c => c.id === selectedChat)?.name}</h2>
                  <p className="text-xs text-gray-500">via WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <button 
                  onClick={toggleBot}
                  className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors \${isBotActive ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}\`}
                >
                  <Bot className="w-4 h-4" />
                  {isBotActive ? 'Autopilot ON' : 'Autopilot OFF'}
                </button>
                <button className="hover:text-brand-500 transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="hover:text-brand-500 transition-colors"><Video className="w-5 h-5" /></button>
                <button className="hover:text-brand-500 transition-colors"><Info className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Mock Messages */}
              <div className="flex justify-center">
                <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">Today</span>
              </div>
              <div className="flex items-end gap-2 max-w-[80%]">
                <img src={chats.find(c => c.id === selectedChat)?.avatar} className="w-8 h-8 rounded-full mb-1" alt="Avatar"/>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <p className="text-sm text-gray-800 dark:text-gray-200">Hi! Are you open this Sunday?</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">10:42 AM</span>
                </div>
              </div>
              
              <div className="flex items-end gap-2 justify-end">
                <div className="bg-brand-500 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] text-white">
                  <p className="text-sm">Hi Sarah! Yes, we are open this Sunday from 10 AM to 6 PM. Would you like to book an appointment?</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-brand-100">10:45 AM</span>
                    <CheckCircle2 className="w-3 h-3 text-brand-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-full px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
                />
                <button 
                  type="submit" 
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-300" />
            </div>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Right Pane - Client Profile (Hidden on small screens) */}
      <div className="hidden lg:flex w-72 border-l border-gray-200 dark:border-gray-800 flex-col bg-gray-50/50 dark:bg-gray-900/50">
        {selectedChat && (
          <div className="p-6 flex flex-col items-center border-b border-gray-200 dark:border-gray-800">
            <img src={chats.find(c => c.id === selectedChat)?.avatar} alt="Profile" className="w-24 h-24 rounded-full mb-4 shadow-sm" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{chats.find(c => c.id === selectedChat)?.name}</h3>
            <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            
            <div className="flex gap-2 mt-4 w-full">
              <button className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <User className="w-4 h-4" /> Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
