import React from 'react';
import { CheckCircle, XCircle, Bell, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ICONS = {
    success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
    error: <XCircle size={18} className="text-red-500   shrink-0" />,
    warning: <Info size={18} className="text-amber-500 shrink-0" />,
    info: <Bell size={18} className="text-indigo-500 shrink-0" />,
};

const BORDER = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-indigo-500',
};

const ToastContainer = () => {
    const { toasts, removeToast } = useApp();

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
            aria-live="polite"
            aria-atomic="false"
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
            pointer-events-auto
            bg-white dark:bg-gray-800 shadow-2xl rounded-xl
            p-4 border border-gray-100 dark:border-gray-700 border-l-4 ${BORDER[toast.type] || BORDER.info}
            flex items-center gap-3 min-w-[280px] max-w-[360px]
            animate-in slide-in-from-right-full duration-300
          `}
                    role="alert"
                >
                    {ICONS[toast.type] || ICONS.info}
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                        aria-label="Dismiss notification"
                    >
                        <XCircle size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
