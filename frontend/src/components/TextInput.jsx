
import React, { useState } from 'react';

const TextInput = ({ value, onChange, placeholder, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">Text to Analyze</label>
        <div className="text-sm text-gray-500">
          {characterCount} chars • {wordCount} words
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-48 p-4 bg-white border rounded-lg 
            outline-none transition-colors duration-150 
            resize-none text-gray-800 placeholder-gray-500
            ${isFocused 
              ? 'border-blue-500 ring-1 ring-blue-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
          rows="6"
          maxLength={5000}
        />
        
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Enter at least 10 characters for accurate analysis. Maximum 5,000 characters.
      </div>
    </div>
  );
};

export default TextInput;