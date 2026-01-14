import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',  // for production  import.meta.env.VITE_BACKEND_URL, for now there is issue in hosting model
  TIMEOUT: 15000, // Increased timeout
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client': 'sentiment-analyzer-ui'
  },
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: false,
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
      url: originalRequest?.url,
      response: error.response?.data
    });

    // Handle specific errors
    if (!error.response) {
      error.message = 'Network Error: Cannot connect to backend service';
    }
    
    return Promise.reject(error);
  }
);

export const analyzeSentiment = async (text) => {
  try {
    console.log('Sending text for analysis:', text.substring(0, 50) + '...');
    
    const response = await api.post('/predict', { 
      text,
    });
    
    console.log('Received response:', response.data);

    const data = response.data;
    
    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }
    
    // Extract sentiment
    let sentiment = 'neutral';
    if (data.sentiment) {
      sentiment = String(data.sentiment).toLowerCase();
    } else if (data.prediction) {
      sentiment = String(data.prediction).toLowerCase();
    }
    
    // Handle confidence score
    let confidence = data.confidence || data.probability || 0.5;
    if (typeof confidence === 'string') {
      confidence = parseFloat(confidence);
    }
    
    if (confidence <= 1) {
      confidence = Math.round(confidence * 100 * 10) / 10;
    } else if (confidence <= 100) {
      confidence = Math.round(confidence * 10) / 10;
    }
    
    const label = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
    const { color } = getSentimentVisuals(sentiment);
    
    // Handle probabilities
    let probabilities = data.probabilities;
    if (!probabilities && data.confidence) {
      probabilities = {
        positive: sentiment === 'positive' ? confidence / 100 : 0.1,
        neutral: sentiment === 'neutral' ? confidence / 100 : 0.1,
        negative: sentiment === 'negative' ? confidence / 100 : 0.1
      };
    }
    
    return {
      success: true,
      text: data.text || text,
      sentiment,
      confidence,
      label,
      color,
      probabilities,
      timestamp: data.timestamp || new Date().toISOString(),
      model: data.model || 'sentiment-analyzer-v1',
      raw: data
    };
    
  } catch (error) {
    console.error('Analysis failed:', error);
    
    // Enhanced error handling
    let errorMessage = 'Unable to analyze text. Please try again.';
    
    if (error.message.includes('Network Error')) {
      errorMessage = `Cannot connect to backend service. Please check if the backend is running `;  //at ${API_CONFIG.BASE_URL}
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout. The service is taking longer than expected.';
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.detail || 'Invalid input. Please check your text.';
    } else if (error.response?.status === 404) {
      errorMessage = 'API endpoint not found.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    } else if (error.response?.status === 503) {
      errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      status: 'healthy',
      message: response.data.message || 'Service operational',
      version: response.data.version,
      model: response.data.model || 'sentiment-analyzer-v1',
      uptime: response.data.uptime,
      timestamp: response.data.timestamp
    };
  } catch (error) {
    // Try fallback endpoint
    try {
      const response = await api.get('/ping');
      return {
        status: 'healthy',
        message: 'Service responding to ping',
        timestamp: new Date().toISOString()
      };
    } catch (pingError) {
      return {
        status: 'error',
        message: 'Service unavailable',
        error: error.message || 'Connection failed',
        url: API_CONFIG.BASE_URL
      };
    }
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