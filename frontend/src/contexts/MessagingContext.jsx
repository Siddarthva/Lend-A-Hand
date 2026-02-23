import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_CHATS } from '../data/mockData';
import { storage } from '../utils/storage';

const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
    const [chats, setChats] = useState(() => storage.get('chats', MOCK_CHATS));
    const [activeChatId, setActiveChatId] = useState(null);
    const [typingMap, setTypingMap] = useState({});   // { chatId: bool }

    const persist = useCallback((updated) => {
        setChats(updated);
        storage.set('chats', updated);
    }, []);

    const sendMessage = useCallback((chatId, text, attachment = null) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msg = {
            id: 'm_' + Date.now(),
            sender: 'me',
            text,
            attachment,   // base64 image string or null
            time: now,
            read: false,
            type: attachment ? 'image' : 'text',
        };
        const updated = chats.map(c => {
            if (c.id !== chatId) return c;
            return {
                ...c,
                lastMessage: text || '📷 Image',
                timestamp: 'Just now',
                messages: [...c.messages, msg],
            };
        });
        persist(updated);

        // Simulate provider typing + reply after 1.5–3s
        setTypingMap(prev => ({ ...prev, [chatId]: true }));
        const delay = 1500 + Math.random() * 1500;
        setTimeout(() => {
            setTypingMap(prev => ({ ...prev, [chatId]: false }));
            const replies = [
                'Got it! I\'ll be there on time.',
                'Sure, no problem!',
                'Thank you for reaching out.',
                'I\'ll get back to you shortly.',
                'Noted! See you then.',
            ];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const reply = { id: 'm_' + Date.now(), sender: 'them', text: replyText, time: replyTime, read: false, type: 'text' };
            setChats(prev => {
                const u = prev.map(c => {
                    if (c.id !== chatId) return c;
                    return { ...c, lastMessage: replyText, timestamp: 'Just now', messages: [...c.messages, reply] };
                });
                storage.set('chats', u);
                return u;
            });
        }, delay);
    }, [chats, persist]);

    const sendSystemMessage = useCallback((chatId, text) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msg = { id: 'm_' + Date.now(), sender: 'system', text, time: now, read: true, type: 'system' };
        const updated = chats.map(c =>
            c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c
        );
        persist(updated);
    }, [chats, persist]);

    const markMessagesRead = useCallback((chatId) => {
        const updated = chats.map(c => {
            if (c.id !== chatId) return c;
            return {
                ...c,
                unread: 0,
                messages: c.messages.map(m => ({ ...m, read: true })),
            };
        });
        persist(updated);
    }, [chats, persist]);

    const getOrCreateChat = useCallback((providerId, providerName, providerAvatar, customerId) => {
        const existing = chats.find(c => c.providerId === providerId && c.customerId === customerId);
        if (existing) return existing.id;

        const newChat = {
            id: 'c_' + Date.now(),
            customerId,
            providerId,
            providerName,
            providerAvatar,
            lastMessage: '',
            timestamp: 'Just now',
            unread: 0,
            messages: [],
        };
        const updated = [newChat, ...chats];
        persist(updated);
        return newChat.id;
    }, [chats, persist]);

    const totalUnread = chats.reduce((sum, c) => sum + (c.unread || 0), 0);

    return (
        <MessagingContext.Provider value={{
            chats,
            activeChatId, setActiveChatId,
            typingMap,
            sendMessage, sendSystemMessage,
            markMessagesRead, getOrCreateChat,
            totalUnread,
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessaging = () => {
    const ctx = useContext(MessagingContext);
    if (!ctx) throw new Error('useMessaging must be used inside MessagingProvider');
    return ctx;
};
