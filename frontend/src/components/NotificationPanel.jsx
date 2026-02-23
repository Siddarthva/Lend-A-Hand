import React from 'react';
import { X, Bell, CheckCheck, Trash2, Calendar, MessageSquare, Tag, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useApp } from '../contexts/AppContext';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';

const TYPE_ICONS = {
    booking_update: <Calendar size={16} className="text-indigo-500" />,
    message: <MessageSquare size={16} className="text-green-500" />,
    promo: <Tag size={16} className="text-amber-500" />,
    system: <AlertCircle size={16} className="text-gray-400" />,
};

const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const NotificationPanel = ({ isOpen, onClose }) => {
    const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
    const { navigateTo } = useApp();

    if (!isOpen) return null;

    const handleClick = (n) => {
        markRead(n.id);
        if (n.bookingId) navigateTo('dashboard');
        else if (n.chatId) navigateTo('chat');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Panel */}
            <div className="fixed top-16 right-4 z-50 w-[360px] max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-gray-700 dark:text-gray-300" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400" title="Mark all read">
                                <CheckCheck size={16} />
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button onClick={clearAll} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400" title="Clear all">
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                        <EmptyState variant="no-notifications" className="py-12" />
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {notifications.map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={`w-full text-left px-4 py-3.5 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                        }`}
                                >
                                    <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        {TYPE_ICONS[n.type] || TYPE_ICONS.system}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-semibold ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{n.body}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.timestamp)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
