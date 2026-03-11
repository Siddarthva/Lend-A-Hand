import React from 'react';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';

const DashboardLayout = ({ children, onNotificationOpen }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar onNotificationOpen={onNotificationOpen} />
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Optional Sidebar could go here */}
                <main className="flex-1 p-4 md:p-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {children}
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DashboardLayout;
