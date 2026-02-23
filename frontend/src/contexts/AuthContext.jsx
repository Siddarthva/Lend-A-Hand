import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { storage } from '../utils/storage';

const AuthContext = createContext();

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => storage.get('user', null));
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const sessionTimer = useRef(null);
    const onSessionExpire = useRef(null);

    // Register session expiry callback from parent
    const registerExpireCallback = useCallback((fn) => {
        onSessionExpire.current = fn;
    }, []);

    const resetSessionTimer = useCallback(() => {
        if (sessionTimer.current) clearTimeout(sessionTimer.current);
        sessionTimer.current = setTimeout(() => {
            setUser(null);
            storage.remove('user');
            if (onSessionExpire.current) onSessionExpire.current();
        }, SESSION_TIMEOUT_MS);
    }, []);

    useEffect(() => {
        if (user) {
            const events = ['mousemove', 'keydown', 'click', 'scroll'];
            events.forEach(e => window.addEventListener(e, resetSessionTimer));
            resetSessionTimer();
            return () => {
                events.forEach(e => window.removeEventListener(e, resetSessionTimer));
                if (sessionTimer.current) clearTimeout(sessionTimer.current);
            };
        }
    }, [user, resetSessionTimer]);

    useEffect(() => {
        if (user) storage.set('user', user);
        else storage.remove('user');
    }, [user]);

    const login = useCallback((email, password, role = null) => {
        setIsLoading(true);
        setAuthError(null);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const found = MOCK_USERS.find(
                    u => u.email === email && u.password === password && (!role || u.role === role)
                );
                if (found) {
                    const { password: _p, ...safeUser } = found;
                    setUser(safeUser);
                    setIsLoading(false);
                    resolve(safeUser);
                } else {
                    setAuthError('Invalid email or password.');
                    setIsLoading(false);
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    }, []);

    const register = useCallback((data) => {
        setIsLoading(true);
        setAuthError(null);
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: 'u_' + Date.now(),
                    name: data.name,
                    email: data.email,
                    role: data.role || 'customer',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=4f46e5&color=fff`,
                    walletBalance: 0,
                    savedAddresses: [],
                    joinedDate: new Date().toISOString().split('T')[0],
                    totalBookings: 0,
                };
                setUser(newUser);
                setIsLoading(false);
                resolve(newUser);
            }, 1000);
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        storage.remove('user');
        if (sessionTimer.current) clearTimeout(sessionTimer.current);
    }, []);

    const updateProfile = useCallback((updates) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setUser(prev => {
                    const updated = { ...prev, ...updates };
                    storage.set('user', updated);
                    return updated;
                });
                resolve();
            }, 600);
        });
    }, []);

    const resetPassword = useCallback((email) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ sent: true, email }), 1000);
        });
    }, []);

    const topUpWallet = useCallback((amount) => {
        setUser(prev => {
            const updated = { ...prev, walletBalance: (prev.walletBalance || 0) + amount };
            storage.set('user', updated);
            return updated;
        });
    }, []);

    const deductWallet = useCallback((amount) => {
        setUser(prev => {
            const updated = { ...prev, walletBalance: Math.max(0, (prev.walletBalance || 0) - amount) };
            storage.set('user', updated);
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isLoading, authError,
            login, register, logout, updateProfile, resetPassword,
            topUpWallet, deductWallet,
            setAuthError,
            registerExpireCallback,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
