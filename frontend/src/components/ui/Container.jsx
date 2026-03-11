import React from 'react';

const Container = ({ children, size = 'lg', className = '', ...props }) => {
    const sizes = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        full: 'max-w-full',
    };

    return (
        <div
            className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container;
