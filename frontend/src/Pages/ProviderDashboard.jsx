import React, { useState } from 'react';
import {
    Briefcase, CheckCircle, XCircle, Clock, TrendingUp, Star,
    Calendar, Plus, Edit3, Trash2, ChevronRight,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { MOCK_PROVIDER_JOBS, MOCK_PROVIDERS } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

const EarningsBar = ({ label, value, max }) => {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{label}</span><span>₹{value}</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const ProviderDashboard = () => {
    const { accentColor, themeClasses, addToast, navigateTo } = useApp();
    const { user } = useAuth();
    const { bookings, acceptBooking, rejectBooking } = useBooking();

    const [activeTab, setActiveTab] = useState('inbox');
    const [availability, setAvailability] = useState(
        DAYS.reduce((acc, d) => ({ ...acc, [d]: HOURS.slice(0, 6) }), {})
    );

    // Provider data (use logged-in provider or fallback to first mock)
    const provider = MOCK_PROVIDERS.find(p => p.name === user?.name) || MOCK_PROVIDERS[0];
    const inboxJobs = MOCK_PROVIDER_JOBS.filter(j => j.status === 'Pending');
    const activeJobs = MOCK_PROVIDER_JOBS.filter(j => j.status !== 'Pending' && j.status !== 'Rejected');

    const handleAccept = async (jobId) => {
        await acceptBooking(jobId);
        addToast('Job accepted!', 'success');
    };

    const handleReject = async (jobId) => {
        await rejectBooking(jobId);
        addToast('Job declined.', 'info');
    };

    const toggleSlot = (day, hour) => {
        setAvailability(prev => {
            const slots = prev[day];
            return {
                ...prev,
                [day]: slots.includes(hour) ? slots.filter(h => h !== hour) : [...slots, hour],
            };
        });
    };

    const earnings = {
        weekly: [1200, 2800, 1900, 3400, 2100, 2700, 1500],
        maxWeek: 3400,
    };
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const TABS = [
        { id: 'inbox', label: 'Job Requests', count: inboxJobs.length },
        { id: 'active', label: 'Active Jobs', count: activeJobs.length },
        { id: 'avail', label: 'Availability', count: null },
        { id: 'earnings', label: 'Earnings', count: null },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Provider Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name?.split(' ')[0]}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">Active</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Jobs', value: provider?.totalJobs || 0, icon: Briefcase },
                        { label: 'Rating', value: provider?.rating || '—', icon: Star },
                        { label: 'This Month', value: `₹${provider?.monthlyEarnings || 12400}`, icon: TrendingUp },
                        { label: 'Pending', value: inboxJobs.length, icon: Clock },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 ${themeClasses.lightBg[accentColor]} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={18} className={themeClasses.text[accentColor]} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700 mb-6 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white shadow-sm`
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab: Inbox */}
                {activeTab === 'inbox' && (
                    <div className="space-y-4">
                        {inboxJobs.length === 0 ? (
                            <EmptyState variant="no-bookings" title="No pending requests" description="New job requests will appear here." />
                        ) : (
                            inboxJobs.map(job => (
                                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{job.serviceName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.customerName}</p>
                                            <div className="flex gap-3 text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                <span>📅 {job.date}</span>
                                                <span>⏰ {job.time}</span>
                                                <span>📍 {job.address}</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{job.amount}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleAccept(job.id)}>
                                            <CheckCircle size={14} /> Accept
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleReject(job.id)}>
                                            <XCircle size={14} /> Decline
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => navigateTo('chat', { chatId: job.chatId })}>
                                            Chat
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Tab: Active Jobs */}
                {activeTab === 'active' && (
                    <div className="space-y-4">
                        {activeJobs.length === 0 ? (
                            <EmptyState variant="no-bookings" title="No active jobs" description="Accepted bookings will appear here." />
                        ) : (
                            activeJobs.map(job => (
                                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{job.serviceName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.customerName} · {job.date}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">₹{job.amount}</span>
                                        <Badge status={job.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Tab: Availability */}
                {activeTab === 'avail' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Availability</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Click to toggle available time slots. Green = available.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 pr-3 text-gray-500 dark:text-gray-400 font-medium">Day</th>
                                        {HOURS.map(h => (
                                            <th key={h} className="py-1 px-1 text-gray-400 dark:text-gray-500 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DAYS.map(day => (
                                        <tr key={day}>
                                            <td className="py-1 pr-3 font-medium text-gray-700 dark:text-gray-300">{day}</td>
                                            {HOURS.map(hour => {
                                                const avail = availability[day]?.includes(hour);
                                                return (
                                                    <td key={hour} className="py-1 px-1">
                                                        <button
                                                            onClick={() => toggleSlot(day, hour)}
                                                            className={`w-8 h-7 rounded-md text-xs font-medium transition-all ${avail
                                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                }`}
                                                        >
                                                            {avail ? '✓' : ''}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Button className="mt-4" size="sm" onClick={() => addToast('Availability saved!', 'success')}>
                            Save Availability
                        </Button>
                    </div>
                )}

                {/* Tab: Earnings */}
                {activeTab === 'earnings' && (
                    <div className="space-y-5">
                        {/* Weekly chart (CSS bars) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">This Week's Earnings</h3>
                            <div className="flex items-end gap-2 h-32">
                                {earnings.weekly.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">₹{val}</span>
                                        <div
                                            className={`w-full rounded-t-lg ${themeClasses.bg[accentColor].split(' ')[0]} opacity-80`}
                                            style={{ height: `${(val / earnings.maxWeek) * 100}%` }}
                                        />
                                        <span className="text-xs text-gray-400 dark:text-gray-500">{weekDays[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Monthly breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Monthly Breakdown</h3>
                            <EarningsBar label="Service Revenue" value={11200} max={15000} />
                            <EarningsBar label="Bonuses" value={1200} max={15000} />
                            <EarningsBar label="Platform Deductions" value={-800} max={15000} />
                            <div className="h-px bg-gray-100 dark:bg-gray-700" />
                            <div className="flex justify-between font-bold text-sm">
                                <span className="text-gray-900 dark:text-white">Net Payout</span>
                                <span className="text-green-600 dark:text-green-400">₹12,400</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
