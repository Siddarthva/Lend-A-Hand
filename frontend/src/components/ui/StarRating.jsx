import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
    value = 0,
    onChange,
    readonly = false,
    size = 20,
    className = '',
    label = '',
    showValue = false,
}) => {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => !readonly && onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        <Star
                            size={size}
                            className={`transition-colors ${star <= display
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 dark:text-gray-600 fill-transparent'
                                }`}
                        />
                    </button>
                ))}
                {showValue && value > 0 && (
                    <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {value.toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    );
};

export const CategoryRatings = ({ ratings, onChange, readonly = false }) => {
    const categories = [
        { key: 'quality', label: 'Quality' },
        { key: 'punctuality', label: 'Punctuality' },
        { key: 'professionalism', label: 'Professionalism' },
        { key: 'value', label: 'Value for Money' },
    ];

    return (
        <div className="space-y-3">
            {categories.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-36">{label}</span>
                    <StarRating
                        value={ratings?.[key] || 0}
                        onChange={(v) => onChange?.({ ...ratings, [key]: v })}
                        readonly={readonly}
                        size={16}
                    />
                </div>
            ))}
        </div>
    );
};

export default StarRating;
