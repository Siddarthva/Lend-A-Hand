import React, { useState } from 'react';
import { Moon, Sun, Monitor, Palette, Bell, Lock, Trash2, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Toggle } from '../components/ui/Input';

const ACCENT_COLORS = [
    { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
    { id: 'purple', label: 'Purple', hex: '#a855f7' },
    { id: 'rose', label: 'Rose', hex: '#f43f5e' },
    { id: 'amber', label: 'Amber', hex: '#f59e0b' },
    { id: 'green', label: 'Green', hex: '#22c55e' },
    { id: 'sky', label: 'Sky', hex: '#0ea5e9' },
];

const SettingsPage = () => {
    const { themeMode, setThemeMode, accentColor, setAccentColor, addToast } = useApp();
    const { user, updateProfile, logout } = useAuth();

    const [notifSettings, setNotifSettings] = useState({
        bookingUpdates: true,
        messages: true,
        promotions: false,
        systemAlerts: true,
    });
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [savingNotif, setSavingNotif] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const saveNotifications = async () => {
        setSavingNotif(true);
        await new Promise(r => setTimeout(r, 600));
        setSavingNotif(false);
        addToast('Notification preferences saved!', 'success');
    };

    const changePassword = async () => {
        if (newPw.length < 6) { addToast('New password must be at least 6 characters.', 'warning'); return; }
        setSavingPw(true);
        await new Promise(r => setTimeout(r, 800));
        setSavingPw(false);
        setOldPw(''); setNewPw('');
        addToast('Password updated successfully!', 'success');
    };

    const deleteAccount = () => {
        if (window.confirm('Are you sure? This action cannot be undone and all your data will be removed.')) {
            logout();
            addToast('Account deleted. Goodbye!', 'info');
        }
    };

    const THEME_OPTIONS = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

                {/* Appearance */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Palette size={18} /> Appearance
                    </h2>

                    <div className="mb-5">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</p>
                        <div className="flex gap-2">
                            {THEME_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setThemeMode(opt.id)}
                                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-sm font-medium ${themeMode === opt.id
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <opt.icon size={18} />
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</p>
                        <div className="flex gap-3 flex-wrap">
                            {ACCENT_COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setAccentColor(c.id)}
                                    title={c.label}
                                    className={`w-9 h-9 rounded-full transition-all ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ${accentColor === c.id ? 'ring-2 ring-gray-400 scale-110' : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c.hex }}
                                    aria-label={`Set ${c.label} accent color`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell size={18} /> Notifications
                    </h2>
                    <div className="space-y-4">
                        {[
                            { key: 'bookingUpdates', label: 'Booking updates', desc: 'Status changes for your bookings' },
                            { key: 'messages', label: 'New messages', desc: 'When someone sends you a message' },
                            { key: 'promotions', label: 'Promotions', desc: 'Deals, coupons, and special offers' },
                            { key: 'systemAlerts', label: 'System alerts', desc: 'Important platform announcements' },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </div>
                                <Toggle
                                    checked={notifSettings[item.key]}
                                    onChange={v => setNotifSettings(s => ({ ...s, [item.key]: v }))}
                                    label={notifSettings[item.key] ? 'On' : 'Off'}
                                />
                            </div>
                        ))}
                    </div>
                    <Button size="sm" loading={savingNotif} className="mt-4" onClick={saveNotifications}>
                        <Save size={14} /> Save Preferences
                    </Button>
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lock size={18} /> Security
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Current Password</label>
                            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="••••••••"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">New Password</label>
                            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                        </div>
                        <Button size="sm" loading={savingPw} disabled={!oldPw || !newPw} onClick={changePassword}>
                            Change Password
                        </Button>
                    </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-100 dark:border-red-900/30 p-6">
                    <h2 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <Trash2 size={18} /> Danger Zone
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                    <Button variant="danger" size="sm" onClick={deleteAccount}>
                        Delete My Account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
