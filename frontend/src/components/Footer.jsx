import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              Made for NLP enthusiasts
            </p>
            <p className="text-sm text-gray-500 mt-1">© {currentYear} Sentiment Analyzer</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">
              Powered by FastAPI + React + ML
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;