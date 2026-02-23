import React, { useState } from 'react';
import {
    CreditCard, Smartphone, Banknote, Wallet, Check, X,
    ArrowLeft, Loader, Receipt,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { processMockPayment } from '../utils/mockApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const METHODS = [
    { id: 'Card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
    { id: 'UPI', icon: Smartphone, label: 'UPI', desc: 'Google Pay, PhonePe, etc.' },
    { id: 'Cash', icon: Banknote, label: 'Cash on Service', desc: 'Pay when the job is done' },
    { id: 'Wallet', icon: Wallet, label: 'Wallet', desc: 'Instant payment from balance' },
];

const PaymentPage = ({ booking }) => {
    const { navigateTo, accentColor, themeClasses, addToast } = useApp();
    const { user, deductWallet } = useAuth();
    const { addNotification } = useNotifications();

    const [method, setMethod] = useState(booking?.paymentMethod || 'Card');
    const [step, setStep] = useState('select');   // select | details | processing | success | error
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [txnId, setTxnId] = useState('');

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No booking found.</p>
                    <Button onClick={() => navigateTo('dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    const total = booking.total || 0;

    const handlePay = async () => {
        setStep('processing');
        try {
            if (method === 'Wallet' && (user?.walletBalance || 0) < total) {
                throw new Error(`Insufficient wallet balance. You have ₹${user.walletBalance}.`);
            }
            const result = await processMockPayment(method, total);
            setTxnId(result.transactionId);
            if (method === 'Wallet') deductWallet(total);
            addNotification({
                type: 'booking_update',
                title: 'Payment Successful',
                body: `₹${total} paid for "${booking.service?.title}". Transaction ID: ${result.transactionId}`,
            });
            setStep('success');
        } catch (err) {
            setErrMsg(err.message);
            setStep('error');
        }
    };

    // ---- PROCESSING ----
    if (step === 'processing') return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
                <div className={`w-20 h-20 rounded-full ${themeClasses.lightBg[accentColor]} flex items-center justify-center mx-auto mb-6`}>
                    <Loader size={36} className={`${themeClasses.text[accentColor]} animate-spin`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Please wait, do not close this page...</p>
            </div>
        </div>
    );

    // ---- SUCCESS ----
    if (step === 'success') return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={36} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    ₹{total} paid via {method}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Txn ID: {txnId}</p>
                <div className="space-y-3">
                    <Button className="w-full" onClick={() => navigateTo('invoice', { booking, txnId, method })}>
                        <Receipt size={16} /> View Invoice
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={() => navigateTo('dashboard')}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );

    // ---- ERROR ----
    if (step === 'error') return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={36} className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{errMsg}</p>
                <Button className="w-full" onClick={() => setStep('select')}>Try Again</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-md mx-auto px-4">
                <button
                    onClick={() => navigateTo('dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-6"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Payment</h1>

                {/* Order summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Service</span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.service?.title}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Date</span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.date} at {booking.time}</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-3" />
                    <div className="flex justify-between font-bold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className={themeClasses.text[accentColor]}>₹{total}</span>
                    </div>
                </div>

                {/* Method selection */}
                <div className="space-y-2 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Payment Method</h3>
                    {METHODS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${method === m.id
                                    ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]}`
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === m.id ? themeClasses.lightBg[accentColor] : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                <m.icon size={20} className={method === m.id ? themeClasses.text[accentColor] : 'text-gray-500'} />
                            </div>
                            <div className="flex-1">
                                <p className={`font-semibold text-sm ${method === m.id ? themeClasses.text[accentColor] : 'text-gray-900 dark:text-white'}`}>{m.label}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{m.desc}</p>
                            </div>
                            {method === m.id && (
                                <div className={`w-5 h-5 rounded-full ${themeClasses.bg[accentColor].split(' ')[0]} flex items-center justify-center`}>
                                    <Check size={11} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Method-specific details */}
                {method === 'Card' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6 space-y-3">
                        <Input
                            label="Name on card"
                            placeholder="Alex Johnson"
                            value={cardData.name}
                            onChange={e => setCardData(d => ({ ...d, name: e.target.value }))}
                        />
                        <Input
                            label="Card number"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.number}
                            maxLength={19}
                            onChange={e => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                                const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                                setCardData(d => ({ ...d, number: formatted }));
                            }}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Expiry"
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                maxLength={5}
                                onChange={e => {
                                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                                    setCardData(d => ({ ...d, expiry: v }));
                                }}
                            />
                            <Input
                                label="CVV"
                                placeholder="•••"
                                type="password"
                                maxLength={4}
                                value={cardData.cvv}
                                onChange={e => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            />
                        </div>
                    </div>
                )}

                {method === 'UPI' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
                        <Input
                            label="UPI ID"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                        />
                    </div>
                )}

                {method === 'Wallet' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Wallet Balance</span>
                            <span className={`font-bold ${(user?.walletBalance || 0) >= total ? 'text-green-600' : 'text-red-500'}`}>
                                ₹{user?.walletBalance || 0}
                            </span>
                        </div>
                        {(user?.walletBalance || 0) < total && (
                            <p className="text-xs text-red-500 mt-2">Insufficient balance. Please choose another method.</p>
                        )}
                    </div>
                )}

                <Button
                    className="w-full !py-4"
                    size="xl"
                    onClick={handlePay}
                    disabled={method === 'Wallet' && (user?.walletBalance || 0) < total}
                >
                    Pay ₹{total}
                </Button>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                    🔒 Secure payment · No data stored
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
