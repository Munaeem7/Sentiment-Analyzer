import React from 'react';

const AnalysisButton = ({ onClick, isLoading, disabled, text }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full px-6 py-3.5 
        text-base font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${disabled || isLoading 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{text || 'Analyzing...'}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span>{text || 'Analyze Text'}</span>
        </div>
      )}
    </button>
  );
};

export default AnalysisButton;