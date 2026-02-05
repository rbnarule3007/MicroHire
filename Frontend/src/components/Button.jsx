import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-purple-500',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 shadow-md hover:bg-purple-50 focus:ring-purple-500',
    outline: 'bg-transparent text-purple-600 border-2 border-purple-600 hover:bg-purple-50 focus:ring-purple-500'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
