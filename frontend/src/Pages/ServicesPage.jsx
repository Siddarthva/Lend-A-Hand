import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Star, Shield, MapPin, SlidersHorizontal,
    ChevronRight, X, Check, Heart,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_SERVICES, CATEGORIES } from '../data/mockData';
import { storage } from '../utils/storage';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'most_booked', label: 'Most Booked' },
];

const ServiceCard = ({ service, onBook, isFav, onToggleFav }) => {
    const { navigateTo, accentColor, themeClasses } = useApp();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.verified && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield size={10} fill="currentColor" /> Verified
                    </div>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFav(service.id); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center transition-colors hover:bg-white"
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {service.category}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">{service.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{service.provider}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <strong className="text-gray-800 dark:text-gray-200">{service.rating}</strong>
                        <span>({service.reviews})</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {service.distanceKm} km
                    </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-4 flex-1">{service.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {service.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                    <div>
                        <span className={`text-lg font-bold ${themeClasses.text[accentColor]}`}>₹{service.price}</span>
                        <span className="text-xs text-gray-400">/{service.priceUnit}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigateTo('service-detail', { serviceId: service.id })}>
                            Details
                        </Button>
                        <Button size="sm" onClick={() => onBook(service)}>
                            Book
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesPage = ({ initialCategory = 'All', initialQuery = '' }) => {
    const { navigateTo, accentColor, themeClasses, addToast } = useApp();
    const { user } = useAuth();

    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('recommended');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState(() => storage.get('favorites', []));

    // Filter state
    const [filters, setFilters] = useState({
        priceMax: 500,
        minRating: 0,
        maxDistance: 50,
        verifiedOnly: false,
    });

    const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

    const toggleFav = (id) => {
        const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        setFavorites(next);
        storage.set('favorites', next);
        addToast(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites', 'info');
    };

    const handleBook = (service) => {
        if (!user) {
            addToast('Please log in to book a service', 'warning');
            navigateTo('login');
            return;
        }
        navigateTo('booking-wizard', { service });
    };

    // Filtered + sorted results
    const results = useMemo(() => {
        let list = MOCK_SERVICES;

        if (query) list = list.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()));
        if (category !== 'All') list = list.filter(s => s.category === category);
        list = list.filter(s =>
            s.price <= filters.priceMax &&
            s.rating >= filters.minRating &&
            s.distanceKm <= filters.maxDistance &&
            (!filters.verifiedOnly || s.verified)
        );

        switch (sortBy) {
            case 'price_asc': return [...list].sort((a, b) => a.price - b.price);
            case 'price_desc': return [...list].sort((a, b) => b.price - a.price);
            case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
            case 'most_booked': return [...list].sort((a, b) => b.totalBooked - a.totalBooked);
            default: return list;
        }
    }, [query, category, sortBy, filters]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Explore Services</h1>

                    {/* Search + sort row */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search services..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <Button
                            variant={showFilters ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setShowFilters(f => !f)}
                        >
                            <SlidersHorizontal size={14} /> Filters
                        </Button>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === cat
                                        ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white shadow-sm`
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* ---- FILTER SIDEBAR ---- */}
                    {showFilters && (
                        <aside className="w-64 flex-shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                                    <button
                                        onClick={() => setFilters({ priceMax: 500, minRating: 0, maxDistance: 50, verifiedOnly: false })}
                                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        Reset
                                    </button>
                                </div>

                                {/* Price range */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Max Price: <strong>₹{filters.priceMax}</strong>
                                    </label>
                                    <input
                                        type="range" min="50" max="500" step="10"
                                        value={filters.priceMax}
                                        onChange={e => setFilter('priceMax', Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>₹50</span><span>₹500</span>
                                    </div>
                                </div>

                                {/* Min rating */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Min Rating</label>
                                    <div className="flex gap-1">
                                        {[0, 3, 3.5, 4, 4.5].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setFilter('minRating', r)}
                                                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${filters.minRating === r
                                                        ? `${themeClasses.bg[accentColor].split(' ')[0]} text-white`
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}
                                            >
                                                {r === 0 ? 'All' : `${r}★`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Distance */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Max Distance: <strong>{filters.maxDistance} km</strong>
                                    </label>
                                    <input
                                        type="range" min="1" max="50" step="1"
                                        value={filters.maxDistance}
                                        onChange={e => setFilter('maxDistance', Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                {/* Verified only */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setFilter('verifiedOnly', !filters.verifiedOnly)}
                                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${filters.verifiedOnly
                                                ? `${themeClasses.bg[accentColor].split(' ')[0]} border-transparent`
                                                : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    >
                                        {filters.verifiedOnly && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Verified providers only</span>
                                </label>
                            </div>
                        </aside>
                    )}

                    {/* ---- RESULTS ---- */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong className="text-gray-900 dark:text-white">{results.length}</strong> services found
                            </p>
                        </div>

                        {results.length === 0 ? (
                            <EmptyState variant="no-services">
                                <Button onClick={() => { setQuery(''); setCategory('All'); setFilters({ priceMax: 500, minRating: 0, maxDistance: 50, verifiedOnly: false }); }}>
                                    Clear Filters
                                </Button>
                            </EmptyState>
                        ) : (
                            <div className={`grid gap-6 ${showFilters ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                {results.map(service => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onBook={handleBook}
                                        isFav={favorites.includes(service.id)}
                                        onToggleFav={toggleFav}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
