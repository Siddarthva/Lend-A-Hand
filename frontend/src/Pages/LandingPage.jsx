import React, { useState, useEffect } from 'react';
import {
    Search, Star, MapPin, ChevronRight, Shield, CheckCircle,
    ArrowRight, Zap, Clock, Award, Users,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_SERVICES, CATEGORIES } from '../data/mockData';
import PromoBanner from '../components/PromoBanner';
import Button from '../components/ui/Button';

const STATS = [
    { label: 'Verified Providers', value: '312+', icon: Shield },
    { label: 'Bookings Completed', value: '18K+', icon: CheckCircle },
    { label: 'Service Categories', value: '8', icon: Zap },
    { label: 'Happy Customers', value: '5.4K+', icon: Users },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Choose a Service', desc: 'Browse our wide range of home and personal services.' },
    { step: '02', title: 'Pick a Provider', desc: 'Compare profiles, ratings, and real reviews.' },
    { step: '03', title: 'Book & Pay', desc: 'Secure booking with flexible payment options.' },
    { step: '04', title: 'Relax', desc: 'Your verified professional arrives on time, guaranteed.' },
];

const ServiceCardMini = ({ service }) => {
    const { navigateTo, accentColor, themeClasses } = useApp();
    return (
        <button
            onClick={() => navigateTo('service-detail', { serviceId: service.id })}
            className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="relative h-44 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {service.verified && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield size={10} fill="currentColor" /> Verified
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{service.rating}</span>
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{service.category}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{service.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{service.provider}</p>
                <div className="flex items-center justify-between mt-3">
                    <div>
                        <span className={`text-base font-bold ${themeClasses.text[accentColor]}`}>₹{service.price}</span>
                        <span className="text-xs text-gray-400">/{service.priceUnit}</span>
                    </div>
                    <ChevronRight size={16} className={`${themeClasses.text[accentColor]} group-hover:translate-x-1 transition-transform`} />
                </div>
            </div>
        </button>
    );
};

const LandingPage = () => {
    const { navigateTo, accentColor, themeClasses } = useApp();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const featuredServices = MOCK_SERVICES.slice(0, 6);

    const handleSearch = (e) => {
        e.preventDefault();
        navigateTo('services', { query: searchQuery });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* ---- HERO ---- */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white">
                {/* Background blobs */}
                <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${themeClasses.gradient[accentColor]}`} />
                <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 bg-indigo-500" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${themeClasses.lightBg[accentColor]} ${themeClasses.text[accentColor]}`}>
                        <Zap size={12} /> 312+ Verified Professionals in Your Area
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Home Services,
                        <br />
                        <span className={`bg-gradient-to-r ${themeClasses.gradient[accentColor]} bg-clip-text text-transparent`}>
                            Done Right.
                        </span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Book trusted local professionals for cleaning, plumbing, electrical, and more — all on demand.
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="What service do you need?"
                                className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                aria-label="Search services"
                            />
                        </div>
                        <Button type="submit" size="lg" className="!px-6 !py-4">
                            Search <ArrowRight size={16} />
                        </Button>
                    </form>

                    {/* Quick category chips */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                            <button
                                key={cat}
                                onClick={() => navigateTo('services', { category: cat })}
                                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm border border-white/20"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- PROMO BANNER ---- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
                <PromoBanner />
            </div>

            {/* ---- STATS ---- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className={`w-12 h-12 ${themeClasses.lightBg[accentColor]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                <Icon size={22} className={themeClasses.text[accentColor]} />
                            </div>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- FEATURED SERVICES ---- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Services</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hand-picked by our team</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigateTo('services')}>
                        View All <ArrowRight size={14} />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredServices.map(s => <ServiceCardMini key={s.id} service={s} />)}
                </div>
            </section>

            {/* ---- HOW IT WORKS ---- */}
            <section className="bg-white dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How it Works</h2>
                        <p className="text-gray-500 dark:text-gray-400">From booking to completion in 4 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gray-100 dark:bg-gray-800" />
                        {HOW_IT_WORKS.map((item, i) => (
                            <div key={i} className="relative text-center">
                                <div className={`w-20 h-20 rounded-2xl ${themeClasses.lightBg[accentColor]} flex items-center justify-center mx-auto mb-4 relative z-10`}>
                                    <span className={`text-xl font-extrabold ${themeClasses.text[accentColor]}`}>{item.step}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- CTA ---- */}
            {!user && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className={`bg-gradient-to-br ${themeClasses.gradient[accentColor]} rounded-3xl p-12 text-white shadow-2xl`}>
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-white/80 mb-8 max-w-md mx-auto">Join thousands of happy homeowners who trust Lend a Hand for their service needs.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Button variant="secondary" size="lg" onClick={() => navigateTo('register')}>
                                Create Free Account <ArrowRight size={16} />
                            </Button>
                            <Button variant="ghost" size="lg" onClick={() => navigateTo('services')} className="text-white border-2 border-white/30 hover:bg-white/10">
                                Browse Services
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default LandingPage;
