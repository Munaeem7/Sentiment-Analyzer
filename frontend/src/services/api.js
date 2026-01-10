
import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000
};

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'sentiment-analyzer-ui'
  },
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: originalRequest.url
    });

    if (error.response?.status >= 400 && error.response?.status < 500) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const analyzeSentiment = async (text) => {
  try {
    console.log('Sending text for analysis:', text.substring(0, 50) + '...');
    
    const response = await api.post('/predict', { 
      text,
      timestamp: new Date().toISOString()
    });
    
    console.log('Received response:', response.data);

    const data = response.data;
    
    const sentiment = (data.sentiment || data.prediction || 'neutral').toLowerCase();
    
    let confidence = data.confidence || data.probability || 0.5;
    if (confidence <= 1) {
      confidence = Math.round(confidence * 100 * 10) / 10;
    } else if (confidence <= 100) {
      confidence = Math.round(confidence * 10) / 10;
    }
    
    const label = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
    
    const { color } = getSentimentVisuals(sentiment);
    
    const probabilities = data.probabilities || {
      positive: sentiment === 'positive' ? confidence / 100 : 0,
      neutral: sentiment === 'neutral' ? confidence / 100 : 0,
      negative: sentiment === 'negative' ? confidence / 100 : 0
    };
    
    return {
      success: true,
      text: data.text || text,
      sentiment,
      confidence,
      label,
      color,
      probabilities,
      timestamp: data.timestamp || new Date().toISOString(),
      model: data.model || 'sentiment-analyzer-v2',
      raw: data
    };
    
  } catch (error) {
    console.error('Analysis failed:', error);
    
    const errorMap = {
      'Network Error': 'Cannot connect to the sentiment analysis service. Please ensure the backend server is running on http://localhost:8000',
      'timeout of 10000ms exceeded': 'Request timeout. The service is taking longer than expected.',
      'Request failed with status code 400': 'Invalid input. Please check your text and try again.',
      'Request failed with status code 404': 'Analysis endpoint not found.',
      'Request failed with status code 500': 'Server error. Please try again in a moment.',
      'Request failed with status code 503': 'Service temporarily unavailable.'
    };

    const errorMessage = errorMap[error.message] || 
                        error.response?.data?.detail || 
                        'Unable to analyze text. Please check your connection and try again.';

    throw new Error(errorMessage);
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    return {
      status: 'healthy',
      message: response.data.message || 'Service operational',
      version: response.data.version,
      model: response.data.model || 'sentiment-analyzer-v1',
      classes: response.data.classes || ['Positive', 'Negative'],
      uptime: response.data.uptime
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Service unavailable',
      error: error.message
    };
  }
};

const getSentimentVisuals = (sentiment) => {
  const visuals = {
    positive: {
      color: '#10b981'
    },
    negative: {
      color: '#ef4444'
    },
    neutral: {
      color: '#6b7280'
    }
  };

  return visuals[sentiment] || visuals.neutral;
};

export default api;