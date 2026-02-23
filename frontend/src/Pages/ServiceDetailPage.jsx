import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Star, MapPin, Clock, Shield, Heart, MessageSquare,
    ChevronRight, Calendar, Users, Check,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { MOCK_SERVICES, MOCK_REVIEWS, MOCK_PROVIDERS } from '../data/mockData';
import { storage } from '../utils/storage';
import Button from '../components/ui/Button';
import StarRating, { CategoryRatings } from '../components/ui/StarRating';
import { Skeleton } from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';

const ReviewCard = ({ review }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-3">
            <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.userName}</p>
                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <StarRating value={review.overallRating} readonly size={14} />
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
        {review.providerResponse && (
            <div className="mt-3 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-0.5">Provider response</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{review.providerResponse}</p>
            </div>
        )}
    </div>
);

const ServiceDetailPage = ({ serviceId }) => {
    const { navigateTo, accentColor, themeClasses, addToast } = useApp();
    const { user } = useAuth();
    const { startWizard } = useBooking();

    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [provider, setProvider] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');

    useEffect(() => {
        const timer = setTimeout(() => {
            const svc = MOCK_SERVICES.find(s => s.id === serviceId || s.id === Number(serviceId));
            setService(svc || null);
            setReviews(MOCK_REVIEWS.filter(r => r.serviceId === (svc?.id)));
            setProvider(MOCK_PROVIDERS.find(p => p.id === svc?.providerId));
            const favs = storage.get('favorites', []);
            setIsFav(favs.includes(svc?.id));
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [serviceId]);

    const toggleFav = () => {
        const favs = storage.get('favorites', []);
        const next = isFav ? favs.filter(f => f !== service.id) : [...favs, service.id];
        storage.set('favorites', next);
        setIsFav(!isFav);
        addToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', 'info');
    };

    const handleBook = () => {
        if (!user) {
            addToast('Please log in to book a service', 'warning');
            navigateTo('login');
            return;
        }
        startWizard(service);
        navigateTo('booking-wizard');
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Skeleton className="h-72 w-full mb-6" />
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );

    if (!service) return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <EmptyState variant="no-services" title="Service not found" description="This service may no longer be available." />
        </div>
    );

    const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / (reviews.length || 1);
    const categoryAvg = (key) => {
        const total = reviews.reduce((s, r) => s + (r.categoryRatings?.[key] || 0), 0);
        return (total / (reviews.length || 1)).toFixed(1);
    };

    const TABS = ['overview', 'reviews', 'provider'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero image */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <button
                    onClick={() => navigateTo('services')}
                    className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button
                    onClick={toggleFav}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                </button>
                {/* Floating title on hero */}
                <div className="absolute bottom-6 left-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">{service.category}</span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 drop-shadow-lg">{service.title}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ---- MAIN CONTENT ---- */}
                    <div className="flex-1 min-w-0">
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mb-5">
                            <div className="flex items-center gap-1">
                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-gray-900 dark:text-white">{service.rating}</span>
                                <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin size={14} /> {service.distanceKm} km away
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Users size={14} /> {service.totalBooked}+ booked
                            </div>
                            {service.verified && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                    <Shield size={11} fill="currentColor" /> Verified Provider
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {service.tags?.map(tag => (
                                <span key={tag} className={`${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]} text-xs px-3 py-1 rounded-full font-medium`}>{tag}</span>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${selectedTab === tab
                                            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {tab} {tab === 'reviews' && `(${reviews.length})`}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        {selectedTab === 'overview' && (
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">About this service</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{service.longDescription}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">What's included</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {(service.tags || []).map(t => (
                                            <div key={t} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <div className={`w-5 h-5 rounded-full ${themeClasses.lightBg[accentColor]} flex items-center justify-center`}>
                                                    <Check size={11} className={themeClasses.text[accentColor]} />
                                                </div>
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'reviews' && (
                            <div className="space-y-4">
                                {/* Rating summary */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-6 mb-5">
                                        <div className="text-center">
                                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</div>
                                            <StarRating value={Math.round(avgRating)} readonly size={16} className="justify-center mt-1" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{reviews.length} reviews</p>
                                        </div>
                                        <div className="flex-1">
                                            <CategoryRatings
                                                readonly
                                                ratings={{
                                                    quality: Number(categoryAvg('quality')),
                                                    punctuality: Number(categoryAvg('punctuality')),
                                                    professionalism: Number(categoryAvg('professionalism')),
                                                    value: Number(categoryAvg('value')),
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {reviews.length === 0
                                    ? <EmptyState variant="no-reviews" />
                                    : reviews.map(r => <ReviewCard key={r.id} review={r} />)
                                }
                            </div>
                        )}

                        {selectedTab === 'provider' && provider && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-4 mb-4">
                                    <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{provider.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{provider.business}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <StarRating value={provider.rating} readonly size={14} showValue />
                                            {provider.verificationStatus === 'verified' && (
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Shield size={10} fill="currentColor" /> Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{provider.bio}</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{provider.totalJobs}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Jobs Done</p>
                                    </div>
                                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{provider.rating}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                                    </div>
                                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{provider.responseTime}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Response</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ---- BOOKING CARD (sticky sidebar) ---- */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6 sticky top-24">
                            <div className="mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-3xl font-extrabold ${themeClasses.text[accentColor]}`}>₹{service.price}</span>
                                    <span className="text-sm text-gray-400">/{service.priceUnit}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Platform fee: ₹{service.platformFee} • Tax: 10%</p>
                            </div>

                            {/* Available slots preview */}
                            <div className="mb-5">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Available slots today</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {service.availability.map(slot => {
                                        const busy = service.busySlots.includes(slot);
                                        return (
                                            <div
                                                key={slot}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${busy
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through'
                                                        : `${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`
                                                    }`}
                                            >
                                                {slot}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Button className="w-full !py-3" size="lg" onClick={handleBook}>
                                <Calendar size={16} />
                                Book Now
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-3">Free cancellation up to 24h before</p>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Shield size={14} className="text-green-500" />
                                    <span>Verified professional. Insured & background-checked.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
