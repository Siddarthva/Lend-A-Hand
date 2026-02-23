import React, { useState } from 'react';
import {
    Calendar, Clock, CheckCircle, XCircle, RotateCcw, Star,
    MessageSquare, RefreshCw, ChevronRight, Wallet, TrendingUp,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const STATUS_ACTIONS = {
    Requested: { label: 'Awaiting confirmation', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
    Confirmed: { label: 'Confirmed · Prepare address', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
    'In Progress': { label: 'Service in progress', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
    Completed: { label: 'Completed · Leave a review', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
    Cancelled: { label: 'Cancelled', color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
};

const BookingCard = ({ booking, onCancel, onReschedule, onReview, onChat }) => {
    const { accentColor, themeClasses } = useApp();
    const meta = STATUS_ACTIONS[booking.status] || {};

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            {/* Status bar */}
            <div className={`px-4 py-2 text-xs font-semibold ${meta.color}`}>{meta.label}</div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{booking.service?.title || booking.serviceName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.providerName || booking.provider}</p>
                    </div>
                    <Badge status={booking.status} />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">₹{booking.total}</span>
                </div>
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onChat(booking)} className="gap-1.5">
                        <MessageSquare size={13} /> Chat
                    </Button>
                    {booking.status === 'Requested' || booking.status === 'Confirmed' ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => onReschedule(booking)} className="gap-1.5">
                                <RefreshCw size={13} /> Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onCancel(booking)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5">
                                <XCircle size={13} /> Cancel
                            </Button>
                        </>
                    ) : null}
                    {booking.status === 'Completed' && !booking.reviewed && (
                        <Button size="sm" onClick={() => onReview(booking)} className="gap-1.5">
                            <Star size={13} /> Leave Review
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { navigateTo, accentColor, themeClasses } = useApp();
    const { user } = useAuth();
    const { bookings, cancelBooking, rescheduleBooking } = useBooking();

    const [activeTab, setActiveTab] = useState('bookings');
    const [cancelModal, setCancelModal] = useState(null);
    const [rescheduleModal, setRescheduleModal] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);

    const userBookings = bookings.filter(b => b.customerId === (user?.id));
    const tabs = [
        { id: 'bookings', label: 'My Bookings', count: userBookings.length },
        { id: 'coming', label: 'Upcoming', count: userBookings.filter(b => ['Requested', 'Confirmed', 'In Progress'].includes(b.status)).length },
        { id: 'history', label: 'History', count: userBookings.filter(b => ['Completed', 'Cancelled'].includes(b.status)).length },
    ];

    const getFilteredBookings = () => {
        if (activeTab === 'coming') return userBookings.filter(b => ['Requested', 'Confirmed', 'In Progress'].includes(b.status));
        if (activeTab === 'history') return userBookings.filter(b => ['Completed', 'Cancelled'].includes(b.status));
        return userBookings;
    };

    const handleCancel = async () => {
        setIsCancelling(true);
        await cancelBooking(cancelModal.id, cancelReason);
        setIsCancelling(false);
        setCancelModal(null);
        setCancelReason('');
    };

    const handleReschedule = async () => {
        setIsRescheduling(true);
        await rescheduleBooking(rescheduleModal.id, newDate, newTime);
        setIsRescheduling(false);
        setRescheduleModal(null);
    };

    const walletBalance = user?.walletBalance || 0;
    const totalSpent = userBookings.filter(b => b.status === 'Completed').reduce((s, b) => s + (b.total || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Welcome header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Hello, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your bookings and account here</p>
                    </div>
                    <Button size="sm" onClick={() => navigateTo('services')}>
                        Book a Service
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Bookings', value: userBookings.length, icon: Calendar, color: 'text-indigo-600' },
                        { label: 'Total Spent', value: `₹${totalSpent}`, icon: TrendingUp, color: 'text-green-600' },
                        { label: 'Wallet Balance', value: `₹${walletBalance}`, icon: Wallet, color: 'text-amber-600' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${themeClasses.lightBg[accentColor]} flex items-center justify-center`}>
                                <stat.icon size={22} className={themeClasses.text[accentColor]} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking tabs */}
                <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id
                                ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white shadow-sm`
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Booking list */}
                {getFilteredBookings().length === 0 ? (
                    <EmptyState variant="no-bookings">
                        <Button onClick={() => navigateTo('services')}>Browse Services</Button>
                    </EmptyState>
                ) : (
                    <div className="space-y-4">
                        {getFilteredBookings().map(b => (
                            <BookingCard
                                key={b.id}
                                booking={b}
                                onCancel={setCancelModal}
                                onReschedule={setRescheduleModal}
                                onReview={booking => navigateTo('review', { booking })}
                                onChat={booking => navigateTo('chat', { chatId: booking.chatId })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Booking" size="sm">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cancel your booking for <strong>{cancelModal?.service?.title || cancelModal?.serviceName}</strong>? A full refund will be issued if within 24h.
                </p>
                <Input
                    label="Reason (optional)"
                    placeholder="Why are you cancelling?"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                />
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setCancelModal(null)}>Keep Booking</Button>
                    <Button variant="danger" className="flex-1" loading={isCancelling} onClick={handleCancel}>Confirm Cancel</Button>
                </div>
            </Modal>

            {/* Reschedule modal */}
            <Modal isOpen={!!rescheduleModal} onClose={() => setRescheduleModal(null)} title="Reschedule Booking" size="sm">
                <div className="space-y-3 mb-4">
                    <Input type="date" label="New Date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <Input type="time" label="New Time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => setRescheduleModal(null)}>Cancel</Button>
                    <Button className="flex-1" loading={isRescheduling} disabled={!newDate || !newTime} onClick={handleReschedule}>Reschedule</Button>
                </div>
            </Modal>
        </div>
    );
};

export default DashboardPage;
