import React from 'react';
import ToastContainer from './ToastContainer';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <main className="flex-1">
                {children}
            </main>
            <ToastContainer />
        </div>
    );
};

export default AuthLayout;
