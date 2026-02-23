import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, ...props }) => {
  const { accentColor, themeClasses } = useApp();

  const variants = {
    primary: `${themeClasses.bg[accentColor]} text-white shadow-md hover:shadow-lg`,
    secondary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: `bg-transparent border-2 border-current ${themeClasses.text[accentColor]} hover:bg-gray-50 dark:hover:bg-gray-800`,
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${sizes[size]} rounded-lg font-medium transition-all duration-200
        flex items-center justify-center gap-2 active:scale-95
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;