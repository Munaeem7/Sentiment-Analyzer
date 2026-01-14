import React, { useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import AnalysisButton from '../components/AnalysisButton';
import SentimentCard from '../components/SentimentCard';
import Features from '../components/Features';
import { analyzeSentiment, checkBackendHealth } from '../services/api';

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  const exampleTexts = [
    {
      text: "The product exceeded all expectations. Exceptional quality and outstanding customer support.",
      type: "Positive"
    },
    {
      text: "Extremely disappointed with the service. Multiple issues were never resolved despite repeated requests.",
      type: "Negative"
    },
    {
      text: "The software functions as described. It meets basic requirements without any standout features.",
      type: "Neutral"
    }
  ];

  // Check backend status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkBackendHealth();
        setBackendStatus(status.status);
      } catch (error) {
        setBackendStatus('error');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    if (text.length < 10) {
      setError('Please enter at least 10 characters for accurate analysis');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const analysisResult = await analyzeSentiment(text);
      setResult(analysisResult);
    } catch (error) {
      setError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleText) => {
    setText(exampleText);
    setError('');
    setResult(null);
  };

  const handleClear = () => {
    setText('');
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white">


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Text Sentiment Analysis</h2>
          <p className="text-gray-600">
            Analyze the emotional tone of your text using machine learning. Detects positive, negative, and neutral sentiments.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Enter Text</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput 
                  value={text} 
                  onChange={setText}
                  placeholder="Enter your text here (product reviews, social media comments)"
                  disabled={isLoading}
                />

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <AnalysisButton 
                      onClick={handleSubmit}
                      isLoading={isLoading}
                      disabled={!text.trim() || text.length < 10}
                      text={isLoading ? "Analyzing..." : "Analyze Text"}
                    />
                    
                    {text && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded">
                      <p className="text-rose-700 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Examples */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3">Example Texts</h4>
                <div className="space-y-2">
                  {exampleTexts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.text)}
                      disabled={isLoading}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-700 line-clamp-2">{example.text}</p>
                        <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                          example.type === 'Positive' ? 'bg-emerald-100 text-emerald-700' :
                          example.type === 'Negative' ? 'bg-rose-100 text-rose-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {example.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-700 mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3">
                  <div className="text-lg font-semibold text-blue-600">83%</div>
                  <div className="text-xs text-gray-500 mt-1">Accuracy</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-lg font-semibold text-blue-600">&lt;1s</div>
                  <div className="text-xs text-gray-500 mt-1">Response Time</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-lg font-semibold text-blue-600">3</div>
                  <div className="text-xs text-gray-500 mt-1">Sentiment Classes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-gray-900">Analysis Results</h3>
                <div className="text-sm text-gray-500">
                  {result ? 'Analysis Complete' : 'Awaiting Input'}
                </div>
              </div>

              <div className="min-h-[400px]">
                {result ? (
                  <SentimentCard 
                    sentiment={result.sentiment}
                    confidence={result.confidence}
                    label={result.label}
                    probabilities={result.probabilities}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4">
                      <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-500 mb-2">No Analysis Yet</h4>
                    <p className="text-gray-400 text-sm max-w-xs">
                      Enter text on the left and click "Analyze Text" to see sentiment analysis results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Features />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">Sentiment Analysis Tool</p>
              <p className="text-xs text-gray-500 mt-1">© {new Date().getFullYear()} • Powered by FastAPI + React</p>
            </div>
            <div className="text-sm text-gray-500">
              Model Version: Sentiment Analyzer v2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SentimentAnalyzer;