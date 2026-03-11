import React, { createContext, useContext, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const ModalContext = createContext(null);

const Modal = ({ isOpen, onClose, children, size = 'md', className = '' }) => {
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        full: 'max-w-4xl',
    };

    return (
        <ModalContext.Provider value={{ onClose }}>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            >
                <div
                    className={cn(
                        "bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300",
                        sizes[size],
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </ModalContext.Provider>
    );
};

Modal.Header = ({ children, title, className = '' }) => {
    const { onClose } = useContext(ModalContext);
    return (
        <div className={cn("flex justify-between items-center p-6 border-b border-gray-50 dark:border-gray-800/50", className)}>
            {title ? (
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{title}</h3>
            ) : children}
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all btn-bounce text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Close modal"
            >
                <X size={20} />
            </button>
        </div>
    );
};

Modal.Body = ({ children, className = '' }) => (
    <div className={cn("p-6 overflow-y-auto flex-1 custom-scrollbar", className)}>
        {children}
    </div>
);

Modal.Footer = ({ children, className = '' }) => (
    <div className={cn("p-6 border-t border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row justify-end gap-3", className)}>
        {children}
    </div>
);

export default Modal;
