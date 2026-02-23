import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Input = ({ label, error, helper, className = '', ...props }) => {
    const { accentColor, themeClasses } = useApp();
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                className={`
          px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 ${themeClasses.ring[accentColor]} transition-all outline-none
          ${error
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-300'
                        : 'border-gray-200 dark:border-gray-700'
                    }
        `}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
            {helper && !error && <span className="text-xs text-gray-400">{helper}</span>}
        </div>
    );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
    const { accentColor, themeClasses } = useApp();
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <textarea
                className={`
          px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800
          text-gray-900 dark:text-white placeholder-gray-400
          focus:ring-2 ${themeClasses.ring[accentColor]} transition-all outline-none resize-none
          ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}
        `}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export const Select = ({ label, error, children, className = '', ...props }) => {
    const { accentColor, themeClasses } = useApp();
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <select
                className={`
          px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:ring-2 ${themeClasses.ring[accentColor]} transition-all outline-none
          ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}
        `}
                {...props}
            >
                {children}
            </select>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export const Toggle = ({ checked, onChange, label, description }) => {
    const { accentColor, themeClasses } = useApp();
    return (
        <div className="flex items-center justify-between gap-4">
            {(label || description) && (
                <div>
                    {label && <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>}
                    {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
                </div>
            )}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? themeClasses.bg[accentColor].split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'
                    }`}
            >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`} />
            </button>
        </div>
    );
};

export default Input;
