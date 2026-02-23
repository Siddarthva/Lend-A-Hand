import React from 'react';
import { PackageSearch, Calendar, MessageSquare, Bell, Star } from 'lucide-react';

const VARIANTS = {
    'no-services': {
        icon: PackageSearch,
        title: 'No services found',
        description: 'Try adjusting your filters or search terms.',
    },
    'no-bookings': {
        icon: Calendar,
        title: 'No bookings yet',
        description: 'Book a local professional and your history will appear here.',
    },
    'no-messages': {
        icon: MessageSquare,
        title: 'No conversations yet',
        description: 'Start chatting with a provider after you make a booking.',
    },
    'no-notifications': {
        icon: Bell,
        title: 'All caught up!',
        description: 'No new notifications right now.',
    },
    'no-reviews': {
        icon: Star,
        title: 'No reviews yet',
        description: 'Be the first to leave a review for this service.',
    },
};

const EmptyState = ({ variant = 'no-services', title, description, children, className = '' }) => {
    const config = VARIANTS[variant] || VARIANTS['no-services'];
    const Icon = config.icon;

    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={28} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {title || config.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {description || config.description}
            </p>
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
};

export default EmptyState;
