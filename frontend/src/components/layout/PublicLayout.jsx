import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';

const PublicLayout = ({ children, onNotificationOpen }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar onNotificationOpen={onNotificationOpen} />
            <main className="flex-1 animate-in fade-in duration-300">
                {children}
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
};

export default PublicLayout;
