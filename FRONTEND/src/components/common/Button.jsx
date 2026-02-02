import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md",
        outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-purple-600",
        ghost: "bg-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50",
        link: "bg-transparent text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline p-0 h-auto"
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg",
        icon: "p-2"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
