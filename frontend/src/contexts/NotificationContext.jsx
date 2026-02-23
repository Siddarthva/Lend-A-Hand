import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { storage } from '../utils/storage';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(
        () => storage.get('notifications', MOCK_NOTIFICATIONS)
    );

    const persist = useCallback((list) => {
        setNotifications(list);
        storage.set('notifications', list);
    }, []);

    const addNotification = useCallback((notification) => {
        const n = {
            id: 'n_' + Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification,
        };
        const updated = [n, ...notifications];
        persist(updated);
        return n;
    }, [notifications, persist]);

    const markRead = useCallback((id) => {
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        persist(updated);
    }, [notifications, persist]);

    const markAllRead = useCallback(() => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        persist(updated);
    }, [notifications, persist]);

    const clearAll = useCallback(() => {
        persist([]);
    }, [persist]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markRead,
            markAllRead,
            clearAll,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
    return ctx;
};
