import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';

const Header = () => {
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: '' });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkBackendHealth();
        setApiStatus({
          status: health.status,
          message: health.message || 'API Connected'
        });
      } catch (error) {
        setApiStatus({
          status: 'error',
          message: 'API Offline'
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case 'healthy': return 'text-green-500 bg-green-50 border-green-200';
      case 'checking': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default: return 'text-red-500 bg-red-50 border-red-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <span className="text-white font-bold">SA</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sentiment Analyzer</h1>
              <p className="text-sm text-gray-500">AI-Powered Text Analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getStatusColor()}`}>
              <span className="text-sm font-medium">
                {apiStatus.status === 'checking' ? 'Checking...' : apiStatus.message}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;