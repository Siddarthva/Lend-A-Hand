import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ACCENT_COLORS } from '../data/mockData';
import { storage } from '../utils/storage';

const AppContext = createContext();

export const themeClasses = {
    bg: {
        indigo: 'bg-indigo-600 hover:bg-indigo-700',
        rose: 'bg-rose-600 hover:bg-rose-700',
        teal: 'bg-teal-600 hover:bg-teal-700',
        orange: 'bg-orange-600 hover:bg-orange-700',
        violet: 'bg-violet-600 hover:bg-violet-700',
    },
    text: {
        indigo: 'text-indigo-600', rose: 'text-rose-600', teal: 'text-teal-600',
        orange: 'text-orange-600', violet: 'text-violet-600',
    },
    ring: {
        indigo: 'focus:ring-indigo-500', rose: 'focus:ring-rose-500', teal: 'focus:ring-teal-500',
        orange: 'focus:ring-orange-500', violet: 'focus:ring-violet-500',
    },
    lightBg: {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
        rose: 'bg-rose-50 dark:bg-rose-900/20',
        teal: 'bg-teal-50 dark:bg-teal-900/20',
        orange: 'bg-orange-50 dark:bg-orange-900/20',
        violet: 'bg-violet-50 dark:bg-violet-900/20',
    },
    border: {
        indigo: 'border-indigo-300 dark:border-indigo-700',
        rose: 'border-rose-300 dark:border-rose-700',
        teal: 'border-teal-300 dark:border-teal-700',
        orange: 'border-orange-300 dark:border-orange-700',
        violet: 'border-violet-300 dark:border-violet-700',
    },
    gradient: {
        indigo: 'from-indigo-600 to-indigo-800',
        rose: 'from-rose-500 to-rose-700',
        teal: 'from-teal-500 to-teal-700',
        orange: 'from-orange-500 to-orange-700',
        violet: 'from-violet-600 to-violet-800',
    },
};

const ACCENT_HEX = {
    indigo: '#4f46e5', rose: '#e11d48', teal: '#0d9488', orange: '#ea580c', violet: '#7c3aed'
};

export const AppProvider = ({ children }) => {
    const [view, setView] = useState('landing');
    const [viewParams, setViewParams] = useState({});
    const [themeMode, setThemeMode] = useState(() => storage.get('theme', 'system'));
    const [accentColor, setAccentColor] = useState(() => storage.get('accent', 'indigo'));
    const [toasts, setToasts] = useState([]);

    // Theme
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        if (themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        }
        storage.set('theme', themeMode);
    }, [themeMode]);

    // Accent
    useEffect(() => {
        storage.set('accent', accentColor);
        document.documentElement.style.setProperty('--primary-color', ACCENT_HEX[accentColor] || '#4f46e5');
    }, [accentColor]);

    const navigateTo = useCallback((newView, params = {}) => {
        setView(newView);
        setViewParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <AppContext.Provider value={{
            view, navigateTo, viewParams,
            themeMode, setThemeMode,
            accentColor, setAccentColor,
            themeClasses,
            toasts, addToast, removeToast,
            ACCENT_COLORS,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
};
