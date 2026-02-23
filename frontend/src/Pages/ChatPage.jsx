import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, ArrowLeft, CheckCheck, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useMessaging } from '../contexts/MessagingContext';
import EmptyState from '../components/ui/EmptyState';

const timeLabel = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts); // already a string like "10:30 AM"
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const ChatPage = ({ chatId: initialChatId }) => {
  const { accentColor, themeClasses } = useApp();
  const { chats, sendMessage, markMessagesRead, typingMap } = useMessaging();

  const [selectedChatId, setSelectedChatId] = useState(initialChatId || null);
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileShowChat, setIsMobileShowChat] = useState(!!initialChatId);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Normalise chats so sidebar always has participantName/Avatar
  const normChats = chats.map(c => ({
    ...c,
    participantName: c.participantName || c.providerName || 'Unknown',
    participantAvatar: c.participantAvatar || c.providerAvatar || '',
    updatedAt: c.updatedAt || c.timestamp || 0,
  }));

  const selectedChat = normChats.find(c => c.id === selectedChatId);

  const filteredChats = normChats.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedChatId) markMessagesRead(selectedChatId);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, selectedChat?.messages?.length]);

  const handleSend = () => {
    if (!text.trim() || !selectedChatId) return;
    sendMessage(selectedChatId, text.trim());
    setText('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      sendMessage(selectedChatId, '[Image]', { type: 'image', data: ev.target.result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
    setIsMobileShowChat(true);
  };

  // Render a single message bubble
  const renderMsg = (msg) => {
    if (msg.type === 'system' || msg.sender === 'system') {
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {msg.text || msg.content}
          </span>
        </div>
      );
    }
    const isMe = msg.sender === 'me';
    const body = msg.text || msg.content || '';
    return (
      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${isMe
            ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white rounded-br-sm`
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-sm'
          }`}>
          {msg.attachment?.type === 'image' && msg.attachment.data && (
            <img src={msg.attachment.data} alt={msg.attachment.name} className="max-w-full rounded-lg mb-1" />
          )}
          {body !== '[Image]' && body && (
            <p className="text-sm leading-relaxed">{body}</p>
          )}
          <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
            <span className="text-[10px]">{timeLabel(msg.timestamp || msg.time)}</span>
            {isMe && (
              msg.read
                ? <CheckCheck size={11} className="text-blue-300" />
                : <Check size={11} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      {/* ── SIDEBAR ── */}
      <div className={`${isMobileShowChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none outline-none"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredChats.length === 0 ? (
            <EmptyState variant="no-messages" className="py-10" />
          ) : (
            filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-b border-gray-50 dark:border-gray-800/50 ${selectedChatId === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
                  }`}
              >
                <div className="relative shrink-0">
                  {chat.participantAvatar ? (
                    <img src={chat.participantAvatar} alt={chat.participantName} className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold">
                      {chat.participantName[0]}
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{chat.participantName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-1">{timeLabel(chat.updatedAt)}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {(chat.unread || 0) > 0 && (
                  <span className="bg-indigo-600 text-white text-xs min-w-[18px] px-1 rounded-full flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className={`${!isMobileShowChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState variant="select-chat" title="Select a conversation" description="Choose a chat from the left to start messaging." />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
              <button
                className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => setIsMobileShowChat(false)}
              >
                <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              {selectedChat.participantAvatar ? (
                <img src={selectedChat.participantAvatar} alt={selectedChat.participantName} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600">
                  {selectedChat.participantName[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedChat.participantName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {typingMap[selectedChatId]
                    ? <span className="text-indigo-500 animate-pulse">typing…</span>
                    : selectedChat.online ? <span className="text-green-500">Online</span> : 'Offline'
                  }
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {(selectedChat.messages || []).map(renderMsg)}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Attach image"
                >
                  <Paperclip size={18} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`p-2.5 rounded-full transition-all ${text.trim()
                      ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white shadow-md hover:opacity-90`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
