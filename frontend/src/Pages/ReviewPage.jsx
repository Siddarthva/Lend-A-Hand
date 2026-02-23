import React, { useState } from 'react';
import { Star, Check, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import StarRating, { CategoryRatings } from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';

const CATEGORIES = ['quality', 'punctuality', 'professionalism', 'value'];

const ReviewPage = ({ booking }) => {
    const { navigateTo, addToast } = useApp();
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    const [overall, setOverall] = useState(0);
    const [catRatings, setCatRatings] = useState({ quality: 0, punctuality: 0, professionalism: 0, value: 0 });
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No booking to review.</p>
                    <Button onClick={() => navigateTo('dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async () => {
        if (overall === 0) { addToast('Please select an overall rating.', 'warning'); return; }
        if (comment.trim().length < 10) { addToast('Please write at least 10 characters.', 'warning'); return; }
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        addNotification({
            type: 'booking_update',
            title: 'Review Submitted',
            body: `Your review for "${booking.service?.title}" was submitted. Thank you!`,
        });
        setSubmitting(false);
        setSubmitted(true);
        addToast('Review submitted! Thank you for your feedback.', 'success');
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={36} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Your review helps others make better decisions.</p>
                    <Button className="w-full" onClick={() => navigateTo('dashboard')}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-lg mx-auto px-4">
                <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm mb-5">
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leave a Review</h1>

                {/* Service info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{booking.service?.title || booking.serviceName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">by {booking.provider} · {booking.date}</p>
                </div>

                {/* Overall rating */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Overall Rating</h3>
                    <div className="flex justify-center">
                        <StarRating value={overall} onChange={setOverall} size={36} />
                    </div>
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][overall]}
                    </p>
                </div>

                {/* Category breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Detailed Ratings</h3>
                    <div className="space-y-4">
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-32 capitalize">{cat === 'value' ? 'Value for Money' : cat}</span>
                                <StarRating value={catRatings[cat]} onChange={v => setCatRatings(r => ({ ...r, [cat]: v }))} size={20} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Review</h3>
                    <Textarea
                        placeholder="Share your experience in detail — what went well, what could be improved?"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        helper={`${comment.length}/500 characters`}
                    />
                </div>

                <Button className="w-full !py-3" size="lg" loading={submitting} onClick={handleSubmit}>
                    <Star size={16} /> Submit Review
                </Button>
            </div>
        </div>
    );
};

export default ReviewPage;
