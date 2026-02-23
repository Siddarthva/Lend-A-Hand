import React, { useState } from 'react';
import {
    ArrowLeft, ArrowRight, Calendar, MapPin, CreditCard, Check,
    Smartphone, Banknote, Wallet, Repeat, Tag, Info,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useNotifications } from '../contexts/NotificationContext';
import { MOCK_PROVIDERS } from '../data/mockData';
import StepProgress from '../components/ui/StepProgress';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const STEPS = ['Service', 'Provider', 'Date & Time', 'Address', 'Pricing', 'Confirm'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const today = new Date();

const BookingWizard = () => {
    const { navigateTo, accentColor, themeClasses, addToast } = useApp();
    const { user } = useAuth();
    const { wizard, advanceWizard, goToStep, submitBooking, isSubmitting } = useBooking();
    const { addNotification } = useNotifications();

    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedDate, setSelectedDate] = useState({ year: today.getFullYear(), month: today.getMonth(), day: null });
    const [selectedTime, setSelectedTime] = useState(null);
    const [address, setAddress] = useState(user?.savedAddresses?.[0]?.address || '');
    const [newAddress, setNewAddress] = useState('');
    const [recurring, setRecurring] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Card');

    const service = wizard.service;
    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No service selected.</p>
                    <Button onClick={() => navigateTo('services')}>Browse Services</Button>
                </div>
            </div>
        );
    }

    const providers = MOCK_PROVIDERS.filter(p => p.category === service.category);

    // Price calc
    const base = service.price;
    const fee = service.platformFee || 10;
    const tax = parseFloat(((base + fee) * 0.1).toFixed(2));
    const total = base + fee + tax;

    // Step 1 — service summary
    const Step1 = () => (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500">{service.category}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-0.5">{service.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.provider}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className={`text-xl font-bold ${themeClasses.text[accentColor]}`}>₹{service.price}</span>
                        <span className="text-xs text-gray-400">/ {service.priceUnit}</span>
                    </div>
                </div>
            </div>
            <Button className="w-full !py-3" size="lg" onClick={() => advanceWizard({ step: 2 })}>
                Continue to Provider Selection <ArrowRight size={16} />
            </Button>
        </div>
    );

    // Step 2 — provider selection
    const Step2 = () => (
        <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {providers.length} provider{providers.length !== 1 ? 's' : ''} available for {service.category}
            </p>
            {providers.map(p => (
                <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedProvider?.id === p.id
                            ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]}`
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white text-sm">{p.name}</span>
                                {p.verificationStatus === 'verified' && (
                                    <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{p.business}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>⭐ {p.rating} ({p.reviewCount})</span>
                                <span>📍 {p.distanceKm} km</span>
                                <span>⚡ {p.responseTime}</span>
                            </div>
                        </div>
                        {selectedProvider?.id === p.id && (
                            <div className={`w-6 h-6 rounded-full ${themeClasses.bg[accentColor].split(' ')[0]} flex items-center justify-center`}>
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                </button>
            ))}
            <Button
                className="w-full !py-3"
                size="lg"
                disabled={!selectedProvider}
                onClick={() => advanceWizard({ provider: selectedProvider, step: 3 })}
            >
                Continue <ArrowRight size={16} />
            </Button>
        </div>
    );

    // Step 3 — date & time
    const Step3 = () => {
        const { year, month, day } = selectedDate;
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfWeek = new Date(year, month, 1).getDay();

        return (
            <div className="space-y-4">
                {/* Month navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => {
                                const d = new Date(year, month - 1);
                                setSelectedDate(s => ({ ...s, year: d.getFullYear(), month: d.getMonth(), day: null }));
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white">{MONTHS[month]} {year}</span>
                        <button
                            onClick={() => {
                                const d = new Date(year, month + 1);
                                setSelectedDate(s => ({ ...s, year: d.getFullYear(), month: d.getMonth(), day: null }));
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <ArrowRight size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <span key={d} className="text-xs text-gray-400 dark:text-gray-500 font-medium py-1">{d}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                        {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={'e' + i} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                            const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            return (
                                <button
                                    key={d}
                                    disabled={isPast}
                                    onClick={() => setSelectedDate(s => ({ ...s, day: d }))}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${day === d
                                            ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white`
                                            : isPast
                                                ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time slots */}
                {selectedDate.day && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available time slots</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {service.availability.map(slot => {
                                const busy = service.busySlots.includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        disabled={busy}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-2 rounded-xl text-sm font-medium transition-all ${selectedTime === slot
                                                ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white`
                                                : busy
                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed line-through'
                                                    : `${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]} hover:opacity-80`
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <Button
                    className="w-full !py-3"
                    disabled={!selectedDate.day || !selectedTime}
                    onClick={() => advanceWizard({
                        date: `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`,
                        time: selectedTime,
                        step: 4
                    })}
                >
                    Continue <ArrowRight size={16} />
                </Button>
            </div>
        );
    };

    // Step 4 — address
    const Step4 = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved addresses</p>
                {user?.savedAddresses?.map(a => (
                    <button
                        key={a.id}
                        onClick={() => setAddress(a.address)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${address === a.address
                                ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]}`
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className={themeClasses.text[accentColor]} />
                            <div>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{a.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{a.address}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            <div>
                <Input
                    label="Or enter a new address"
                    placeholder="Street, City, Pin code"
                    value={newAddress}
                    onChange={e => { setNewAddress(e.target.value); setAddress(e.target.value); }}
                />
            </div>
            <Button className="w-full !py-3" disabled={!address} onClick={() => advanceWizard({ address, step: 5 })}>
                Continue <ArrowRight size={16} />
            </Button>
        </div>
    );

    // Step 5 — pricing
    const Step5 = () => (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white">Price Breakdown</h3>
                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                        <span className="text-gray-900 dark:text-white font-medium">₹{base}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Platform fee</span>
                        <span className="text-gray-900 dark:text-white font-medium">₹{fee}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">GST (10%)</span>
                        <span className="text-gray-900 dark:text-white font-medium">₹{tax}</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700" />
                    <div className="flex justify-between font-bold text-base">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className={themeClasses.text[accentColor]}>₹{total}</span>
                    </div>
                </div>
            </div>

            {/* Recurring */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Repeat size={16} className={themeClasses.text[accentColor]} />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">Make it recurring?</span>
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Save up to 15%</span>
                </div>
                <div className="flex gap-2">
                    {[null, 'weekly', 'monthly'].map(r => (
                        <button
                            key={String(r)}
                            onClick={() => setRecurring(r)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${recurring === r
                                    ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white`
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {r === null ? 'One-time' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Payment method</p>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: 'Card', icon: CreditCard, label: 'Card' },
                        { id: 'UPI', icon: Smartphone, label: 'UPI' },
                        { id: 'Cash', icon: Banknote, label: 'Cash on Service' },
                        { id: 'Wallet', icon: Wallet, label: `Wallet (₹${user?.walletBalance || 0})` },
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm ${paymentMethod === m.id
                                    ? `${themeClasses.border[accentColor]} ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <m.icon size={14} />
                            <span className="text-xs">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Button className="w-full !py-3" onClick={() => advanceWizard({ recurring, paymentMethod, step: 6 })}>
                Review & Confirm <ArrowRight size={16} />
            </Button>
        </div>
    );

    // Step 6 — confirmation
    const Step6 = () => {
        const dateStr = wizard.date
            ? new Date(wizard.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
            : 'Not set';

        const handleConfirm = async () => {
            try {
                const booking = await submitBooking(user?.id, null);
                addNotification({
                    type: 'booking_update',
                    title: 'Booking Requested!',
                    body: `Your booking for "${service.title}" on ${dateStr} has been sent to the provider.`,
                    bookingId: booking.id,
                });
                addToast('🎉 Booking confirmed! Redirecting to payment...', 'success');
                navigateTo('payment', { booking });
            } catch (err) {
                addToast('Failed to place booking. Please try again.', 'error');
            }
        };

        return (
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">Booking Summary</h3>
                    {[
                        { label: 'Service', value: service.title },
                        { label: 'Provider', value: wizard.provider?.name || service.provider },
                        { label: 'Date', value: dateStr },
                        { label: 'Time', value: wizard.time || '—' },
                        { label: 'Address', value: wizard.address || '—' },
                        { label: 'Recurring', value: wizard.recurring ? wizard.recurring.charAt(0).toUpperCase() + wizard.recurring.slice(1) : 'One-time' },
                        { label: 'Payment', value: wizard.paymentMethod || 'Card' },
                        { label: 'Total', value: `₹${total}` },
                    ].map(row => (
                        <div key={row.label} className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                            <span className="text-gray-900 dark:text-white font-medium text-right max-w-[200px] break-words">{row.value}</span>
                        </div>
                    ))}
                </div>

                <div className={`${themeClasses.lightBg[accentColor]} ${themeClasses.border[accentColor]} border rounded-xl p-3 flex gap-2 text-sm`}>
                    <Info size={16} className={`${themeClasses.text[accentColor]} mt-0.5 shrink-0`} />
                    <span className="text-gray-600 dark:text-gray-400">Free cancellation up to 24h before. Review and chat with provider after booking.</span>
                </div>

                <Button className="w-full !py-3" size="lg" loading={isSubmitting} onClick={handleConfirm}>
                    <Check size={16} /> Confirm & Proceed to Payment
                </Button>
            </div>
        );
    };

    const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6];
    const CurrentStep = STEP_COMPONENTS[wizard.step - 1];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-lg mx-auto px-4">
                {/* Back + header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => wizard.step === 1 ? navigateTo('services') : goToStep(wizard.step - 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white">Book a Service</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Step {wizard.step} of {STEPS.length}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <StepProgress steps={STEPS} currentStep={wizard.step} />
                </div>

                {/* Step content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {CurrentStep && <CurrentStep />}
                </div>
            </div>
        </div>
    );
};

export default BookingWizard;
