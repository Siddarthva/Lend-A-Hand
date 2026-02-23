import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${rounded} ${className}`} />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                rounded="rounded"
                className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
            />
        ))}
    </div>
);

export const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        <Skeleton className="h-48 w-full" rounded="rounded-none" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    </div>
);

export const SkeletonList = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
);
