import React, { useState } from 'react';
import { Tag, X, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { validateCoupon } from '../utils/mockApi';
import Button from './ui/Button';

const PromoBanner = () => {
    const { accentColor, themeClasses } = useApp();
    const [visible, setVisible] = useState(true);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [showInput, setShowInput] = useState(false);

    if (!visible) return null;

    const handleApply = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const coupon = await validateCoupon(couponInput.trim());
            setAppliedCoupon({ ...coupon, code: couponInput.toUpperCase() });
            setShowInput(false);
        } catch {
            setCouponError('Invalid or expired code.');
        } finally {
            setCouponLoading(false);
        }
    };

    return (
        <div className={`${themeClasses.lightBg[accentColor]} border ${themeClasses.border[accentColor]} rounded-xl px-4 py-3 flex items-center gap-3 relative`}>
            <Tag size={18} className={`${themeClasses.text[accentColor]} shrink-0`} />

            <div className="flex-1 min-w-0">
                {appliedCoupon ? (
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                        ✅ Coupon <span className="font-bold">{appliedCoupon.code}</span> applied — {appliedCoupon.description}!
                    </p>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-semibold ${themeClasses.text[accentColor]}`}>
                            🎉 New user? Use <strong>FIRST10</strong> for 10% off your first booking!
                        </span>
                        {!showInput ? (
                            <button
                                onClick={() => setShowInput(true)}
                                className={`text-xs underline underline-offset-2 ${themeClasses.text[accentColor]} hover:opacity-75`}
                            >
                                Apply coupon
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    value={couponInput}
                                    onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                                    placeholder="Enter code"
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none w-28"
                                    onKeyDown={e => e.key === 'Enter' && handleApply()}
                                />
                                <Button size="sm" loading={couponLoading} onClick={handleApply} className="!py-1 !text-xs">
                                    Apply
                                </Button>
                                {couponError && <span className="text-xs text-red-500">{couponError}</span>}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button onClick={() => setVisible(false)} className="p-1 hover:bg-black/10 rounded-full shrink-0" aria-label="Dismiss banner">
                <X size={14} className="text-gray-500" />
            </button>
        </div>
    );
};

export default PromoBanner;
