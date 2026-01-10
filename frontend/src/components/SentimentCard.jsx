import React from 'react';

const SentimentCard = ({ sentiment, confidence, label, probabilities }) => {
  const getColor = () => {
    switch(label) {
      case 'Positive': return '#10b981';
      case 'Negative': return '#ef4444';
      case 'Neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const color = getColor();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Analysis Result</h3>
          <p className="text-sm text-gray-600">Sentiment detected in your text</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold" style={{ color }}>{label}</div>
          <div className="text-sm text-gray-500">Primary Sentiment</div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Confidence Level</span>
          <span className="font-medium" style={{ color }}>{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${confidence}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      

      {/* Model Info */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Model used</span>
          <span className="font-medium text-gray-900">Logistic Regression</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
