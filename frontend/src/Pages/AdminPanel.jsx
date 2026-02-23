import React, { useState } from 'react';
import {
    Users, Shield, BarChart3, CheckCircle, XCircle, AlertTriangle,
    TrendingUp, Loader, Search, ChevronRight,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MOCK_USERS, MOCK_PROVIDERS, PLATFORM_ANALYTICS, PENDING_PROVIDERS } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const MetricCard = ({ label, value, icon: Icon, subtext, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            {subtext && <p className="text-xs text-green-500 mt-0.5">{subtext}</p>}
        </div>
    </div>
);

const AdminPanel = () => {
    const { accentColor, themeClasses, addToast } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [userSearch, setUserSearch] = useState('');
    const [pendingMap, setPendingMap] = useState({});

    const TABS = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Users' },
        { id: 'approvals', label: `Approvals (${PENDING_PROVIDERS.length})` },
        { id: 'reviews', label: 'Reviews' },
    ];

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const handleApproval = (id, action) => {
        setPendingMap(m => ({ ...m, [id]: action }));
        addToast(`Provider ${action === 'approved' ? 'approved' : 'rejected'}.`, action === 'approved' ? 'success' : 'info');
    };

    const analytics = PLATFORM_ANALYTICS;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Platform management and analytics</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700 mb-6 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white shadow-sm`
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard label="Total Users" value={analytics.totalUsers} icon={Users} color="bg-indigo-500" subtext={`+${analytics.newUsersThisMonth} this month`} />
                            <MetricCard label="Total Providers" value={analytics.totalProviders} icon={Shield} color="bg-purple-500" subtext={`${analytics.pendingApprovals} pending`} />
                            <MetricCard label="Revenue (Month)" value={`₹${analytics.monthlyRevenue?.toLocaleString()}`} icon={TrendingUp} color="bg-green-500" subtext="+12% vs last month" />
                            <MetricCard label="Total Bookings" value={analytics.totalBookings} icon={BarChart3} color="bg-amber-500" subtext={`${analytics.completedBookings} completed`} />
                        </div>

                        {/* CSS bar chart — bookings per week */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5">Weekly Bookings</h3>
                            <div className="flex items-end gap-3 h-28">
                                {analytics.weeklyRevenue?.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-gray-500">{val}</span>
                                        <div
                                            className={`w-full rounded-t-lg ${themeClasses.bg[accentColor].split(' ')[0]} opacity-80`}
                                            style={{ height: `${(val / Math.max(...analytics.weeklyRevenue)) * 100}%` }}
                                        />
                                        <span className="text-xs text-gray-400">W{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bookings by Category</h3>
                            <div className="space-y-3">
                                {analytics.categoryBreakdown?.map(cat => {
                                    const pct = ((cat.count / analytics.totalBookings) * 100).toFixed(0);
                                    return (
                                        <div key={cat.category}>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                <span>{cat.name}</span>
                                                <span>{cat.count} ({pct}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className={`h-full ${themeClasses.bg[accentColor].split(' ')[0]} rounded-full`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Users */}
                {activeTab === 'users' && (
                    <div>
                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none"
                            />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Role</th>
                                        <th className="px-4 py-3 hidden md:table-cell">Joined</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                    {filteredUsers.slice(0, 20).map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell"><Badge status={u.role} /></td>
                                            <td className="px-4 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400 text-xs">{u.joinedDate}</td>
                                            <td className="px-4 py-3">
                                                {u.role !== 'admin' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                                                        onClick={() => addToast(`${u.name}'s account updated.`, 'info')}
                                                    >
                                                        Suspend
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Provider Approvals */}
                {activeTab === 'approvals' && (
                    <div className="space-y-4">
                        {PENDING_PROVIDERS.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No pending approvals.</div>
                        ) : (
                            PENDING_PROVIDERS.map(p => {
                                const status = pendingMap[p.id];
                                return (
                                    <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                                        <div className="flex items-start gap-4 mb-4">
                                            <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{p.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{p.business} · {p.category}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{p.email}</p>
                                            </div>
                                            {status && (
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {status === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>
                                            )}
                                        </div>
                                        {!status && (
                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleApproval(p.id, 'approved')}>
                                                    <CheckCircle size={14} /> Approve
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleApproval(p.id, 'rejected')}>
                                                    <XCircle size={14} /> Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Tab: Reviews */}
                {activeTab === 'reviews' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center">
                        <AlertTriangle size={32} className="text-amber-400 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Review Moderation</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">All published reviews are compliant. No flagged content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
