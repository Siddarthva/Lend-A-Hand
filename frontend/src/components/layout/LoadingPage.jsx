import React from 'react';
import { Loader } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const LoadingPage = () => {
    const { accentColor, themeClasses } = useApp();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${themeClasses.lightBg[accentColor]} mb-6`}>
                <Loader size={32} className={`${themeClasses.text[accentColor]} animate-spin`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Preparing your hand-picked service marketplace experience.
            </p>
        </div>
    );
};

export default LoadingPage;
