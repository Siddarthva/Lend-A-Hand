import React, { useState } from 'react';
import {
    Shield, Search, Bell, MessageSquare, Settings, LogOut,
    Menu, X, Calendar, ChevronDown, User, LayoutDashboard, Briefcase,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useMessaging } from '../../contexts/MessagingContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const Navbar = ({ onNotificationOpen }) => {
    const { view, navigateTo, accentColor, themeClasses } = useApp();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const { totalUnread } = useMessaging();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navTo = (v, params) => {
        navigateTo(v, params);
        setMobileOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navTo('landing');
    };

    const navLinks = [
        { label: 'Explore Services', view: 'services' },
        { label: 'How it Works', view: 'landing' },
    ];

    return (
        <nav
            className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <button
                        onClick={() => navTo('landing')}
                        className="flex items-center gap-2"
                        aria-label="Go to homepage"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${themeClasses.bg[accentColor].split(' ')[0]}`}>
                            <Shield size={18} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Lend a Hand</span>
                    </button>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <button
                                key={link.view}
                                onClick={() => navTo(link.view)}
                                className={`text-sm font-medium transition-colors ${view === link.view
                                        ? themeClasses.text[accentColor]
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                                {/* Notifications bell */}
                                <button
                                    onClick={onNotificationOpen}
                                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center px-0.5 ring-2 ring-white dark:ring-gray-900">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Chat icon */}
                                <button
                                    onClick={() => navTo('chat')}
                                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                    aria-label={`Messages${totalUnread > 0 ? `, ${totalUnread} unread` : ''}`}
                                >
                                    <MessageSquare size={20} />
                                    {totalUnread > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                    )}
                                </button>

                                {/* Profile dropdown */}
                                <div className="relative ml-1">
                                    <button
                                        onClick={() => setProfileOpen(p => !p)}
                                        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 pl-1.5 pr-2 py-1.5 rounded-full transition-colors"
                                        aria-expanded={profileOpen}
                                        aria-haspopup="true"
                                    >
                                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {profileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-40 animate-in slide-in-from-top-2">
                                                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 mb-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                    <Badge status={user.role} className="mt-1.5" />
                                                </div>

                                                <button onClick={() => navTo('dashboard')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                                    <Calendar size={15} /> Dashboard
                                                </button>
                                                <button onClick={() => navTo('profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                                    <User size={15} /> My Profile
                                                </button>
                                                {user.role === 'provider' && (
                                                    <button onClick={() => navTo('provider-dashboard')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                                        <Briefcase size={15} /> Provider Dashboard
                                                    </button>
                                                )}
                                                {user.role === 'admin' && (
                                                    <button onClick={() => navTo('admin')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                                        <LayoutDashboard size={15} /> Admin Panel
                                                    </button>
                                                )}
                                                <button onClick={() => navTo('settings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                                    <Settings size={15} /> Settings
                                                </button>
                                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                                    <LogOut size={15} /> Sign Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <Button variant="ghost" size="sm" onClick={() => navTo('login')}>Log In</Button>
                                <Button size="sm" onClick={() => navTo('register')}>Sign Up Free</Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl pb-4 px-4 animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-1 pt-2">
                        <button onClick={() => navTo('services')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Explore Services</button>
                        {user ? (
                            <>
                                <button onClick={() => navTo('dashboard')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Dashboard</button>
                                <button onClick={() => navTo('profile')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Profile</button>
                                <button onClick={() => navTo('chat')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm flex items-center justify-between">
                                    Messages {totalUnread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{totalUnread}</span>}
                                </button>
                                {user.role === 'provider' && <button onClick={() => navTo('provider-dashboard')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Provider Dashboard</button>}
                                {user.role === 'admin' && <button onClick={() => navTo('admin')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Admin Panel</button>}
                                <button onClick={() => navTo('settings')} className="w-full text-left py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm">Settings</button>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                                <button onClick={handleLogout} className="w-full text-left py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                                <div className="flex gap-2">
                                    <Button variant="secondary" className="flex-1" size="sm" onClick={() => navTo('login')}>Log In</Button>
                                    <Button className="flex-1" size="sm" onClick={() => navTo('register')}>Sign Up</Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
