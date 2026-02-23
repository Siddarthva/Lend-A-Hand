import React from 'react';
import { Printer, Download, ArrowLeft, Shield, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Button from '../components/ui/Button';

const InvoicePage = ({ booking, txnId, method }) => {
    const { navigateTo, accentColor, themeClasses } = useApp();

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Button onClick={() => navigateTo('dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const total = booking.total || 0;
    const fee = booking.service?.platformFee || 10;
    const tax = parseFloat(((total) * 0.1 / 1.1).toFixed(2));
    const subtotal = (total - fee - tax).toFixed(2);
    const invoiceNumber = `LAH-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-lg mx-auto px-4">
                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => window.print()}>
                            <Printer size={14} /> Print
                        </Button>
                    </div>
                </div>

                {/* Invoice card */}
                <div id="invoice" className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${themeClasses.gradient[accentColor]} p-8 text-white`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Shield size={22} fill="white" />
                                <span className="font-bold text-xl">Lend a Hand</span>
                            </div>
                            <div className="text-right">
                                <p className="text-white/60 text-xs">Invoice No.</p>
                                <p className="font-bold">{invoiceNumber}</p>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <div>
                                <p className="text-white/60 text-xs mb-1">Billed to</p>
                                <p className="font-semibold">{booking.customerName || 'Customer'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/60 text-xs mb-1">Date</p>
                                <p className="font-semibold">{today}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Service details */}
                        <div className="mb-6">
                            <h3 className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Service Details</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Service', value: booking.service?.title || booking.serviceName },
                                    { label: 'Provider', value: booking.provider },
                                    { label: 'Date', value: booking.date },
                                    { label: 'Time', value: booking.time },
                                    { label: 'Address', value: booking.address || '—' },
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                                        <span className="text-gray-900 dark:text-white font-medium text-right max-w-[220px]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mb-6">
                            <h3 className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Price Breakdown</h3>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Service fee</span>
                                    <span className="text-gray-900 dark:text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Platform fee</span>
                                    <span className="text-gray-900 dark:text-white">₹{fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">GST (10%)</span>
                                    <span className="text-gray-900 dark:text-white">₹{tax}</span>
                                </div>
                                <div className="flex justify-between font-bold pt-2 border-t border-gray-100 dark:border-gray-800 text-base">
                                    <span className="text-gray-900 dark:text-white">Total Paid</span>
                                    <span className={themeClasses.text[accentColor]}>₹{total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Payment Method</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{method || 'Card'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Transaction ID</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-xs">{txnId || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Status</p>
                                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-xs">
                                        <Check size={11} /> Paid
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            Thank you for choosing Lend a Hand • Questions? hello@lendahand.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
