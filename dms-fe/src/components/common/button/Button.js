import React from 'react';

const Button = ({disabled, onClick, children}) => {
    return <button
        disabled={disabled}
        onClick={onClick}
        className={`${disabled && 'opacity-50 cursor-not-allowed'} focus:outline-none mx-4 flex-shrink-0 bg-blue-600 text-white text-base font-semi bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200`}>
        {children}
    </button>
};

export default Button;
