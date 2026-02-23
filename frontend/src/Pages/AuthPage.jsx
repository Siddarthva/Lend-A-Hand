import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Shield, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const DEMO_ACCOUNTS = [
    { email: 'customer@demo.com', password: 'password', role: 'customer', label: 'Customer Demo', icon: User },
    { email: 'provider@demo.com', password: 'password', role: 'provider', label: 'Provider Demo', icon: Briefcase },
    { email: 'admin@demo.com', password: 'password', role: 'admin', label: 'Admin Demo', icon: Shield },
];

const AuthPage = ({ initialMode = 'login' }) => {
    const { navigateTo, accentColor, themeClasses, addToast } = useApp();
    const { login, register, resetPassword, isLoading, authError, setAuthError } = useAuth();

    const [mode, setMode] = useState(initialMode);   // login | register | reset
    const [showPw, setShowPw] = useState(false);
    const [role, setRole] = useState('customer');
    const [form, setForm] = useState({ name: '', email: '', password: '', agree: false });
    const [errors, setErrors] = useState({});
    const [resetDone, setResetDone] = useState(false);

    const update = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        setErrors(e => ({ ...e, [field]: '' }));
        setAuthError(null);
    };

    const validate = () => {
        const e = {};
        if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
        if (mode !== 'reset' && form.password.length < 6) e.password = 'Min 6 characters';
        if (mode === 'register' && !form.agree) e.agree = 'Please agree to terms';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (mode === 'login') {
                const user = await login(form.email, form.password, null);
                addToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
                navigateTo(user.role === 'provider' ? 'provider-dashboard' : user.role === 'admin' ? 'admin' : 'dashboard');
            } else if (mode === 'register') {
                const user = await register({ name: form.name, email: form.email, password: form.password, role });
                addToast(`Welcome to Lend a Hand, ${user.name.split(' ')[0]}!`, 'success');
                navigateTo('dashboard');
            } else {
                await resetPassword(form.email);
                setResetDone(true);
            }
        } catch {
            // error shown via authError
        }
    };

    const fillDemo = (account) => {
        setForm(f => ({ ...f, email: account.email, password: account.password }));
        setRole(account.role);
        setErrors({});
        setAuthError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Header stripe */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${themeClasses.gradient[accentColor]}`} />

                    <div className="p-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${themeClasses.bg[accentColor].split(' ')[0]}`}>
                                <Shield size={20} fill="currentColor" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">Lend a Hand</span>
                        </div>

                        {/* --- PASSWORD RESET --- */}
                        {mode === 'reset' ? (
                            resetDone ? (
                                <div className="text-center py-4">
                                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        We've sent a reset link to <strong className="text-gray-700 dark:text-gray-200">{form.email}</strong>
                                    </p>
                                    <Button variant="ghost" onClick={() => { setMode('login'); setResetDone(false); }} className="w-full">
                                        Back to Login
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Reset password</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send a reset link.</p>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} placeholder="you@example.com" />
                                        {authError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{authError}</p>}
                                        <Button type="submit" loading={isLoading} className="w-full !py-3">Send Reset Link</Button>
                                        <Button variant="ghost" type="button" onClick={() => setMode('login')} className="w-full">Back to Login</Button>
                                    </form>
                                </>
                            )
                        ) : (
                            <>
                                {/* Mode tabs */}
                                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
                                    {['login', 'register'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => { setMode(m); setErrors({}); setAuthError(null); }}
                                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m
                                                    ? `bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white`
                                                    : `text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200`
                                                }`}
                                        >
                                            {m === 'login' ? 'Log In' : 'Sign Up'}
                                        </button>
                                    ))}
                                </div>

                                {/* Demo account quick-fill */}
                                <div className="mb-5">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 text-center">Quick demo access</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {DEMO_ACCOUNTS.map(acc => {
                                            const Icon = acc.icon;
                                            return (
                                                <button
                                                    key={acc.role}
                                                    onClick={() => fillDemo(acc)}
                                                    className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                                                >
                                                    <Icon size={16} className="text-gray-500 dark:text-gray-400" />
                                                    <span className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{acc.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                    {mode === 'register' && (
                                        <>
                                            <Input label="Full Name" type="text" value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} placeholder="Alex Johnson" />
                                            {/* Role selection */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">I want to</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'customer', icon: User, label: 'Book Services' },
                                                        { id: 'provider', icon: Briefcase, label: 'Offer Services' },
                                                    ].map(r => (
                                                        <button
                                                            key={r.id}
                                                            type="button"
                                                            onClick={() => setRole(r.id)}
                                                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${role === r.id
                                                                    ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`
                                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                                                }`}
                                                        >
                                                            <r.icon size={16} />
                                                            {r.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} placeholder="you@example.com" />

                                    <div className="relative">
                                        <Input
                                            label="Password"
                                            type={showPw ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={e => update('password', e.target.value)}
                                            error={errors.password}
                                            placeholder="••••••••"
                                            helper={mode === 'register' ? 'Min 6 characters' : undefined}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(p => !p)}
                                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            aria-label={showPw ? 'Hide password' : 'Show password'}
                                        >
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {mode === 'register' && (
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.agree}
                                                onChange={e => update('agree', e.target.checked)}
                                                className="mt-0.5 rounded"
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                I agree to the{' '}
                                                <button type="button" onClick={() => navigateTo('terms')} className={`${themeClasses.text[accentColor]} hover:underline`}>Terms of Service</button>
                                                {' '}and{' '}
                                                <button type="button" onClick={() => navigateTo('privacy')} className={`${themeClasses.text[accentColor]} hover:underline`}>Privacy Policy</button>
                                            </span>
                                            {errors.agree && <span className="text-xs text-red-500 block">{errors.agree}</span>}
                                        </label>
                                    )}

                                    {authError && (
                                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{authError}</p>
                                    )}

                                    <Button type="submit" loading={isLoading} className="w-full !py-3" size="lg">
                                        {mode === 'login' ? 'Log In' : 'Create Account'}
                                        <ArrowRight size={16} />
                                    </Button>

                                    {mode === 'login' && (
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => { setMode('reset'); setErrors({}); setAuthError(null); }}
                                                className={`text-xs ${themeClasses.text[accentColor]} hover:underline`}
                                            >
                                                Forgot your password?
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setAuthError(null); }}
                        className={`${themeClasses.text[accentColor]} font-semibold hover:underline`}
                    >
                        {mode === 'login' ? 'Sign up free' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
