"""
Shared text cleaning module for sentiment analysis
This file is used by both the training notebook and the inference script
"""
import re
from sklearn.base import BaseEstimator, TransformerMixin


class TextCleaner(BaseEstimator, TransformerMixin):
    """
    Custom transformer to clean text data
    - Removes URLs
    - Strips whitespace
    
    This class inherits from sklearn base classes so it can be
    used in a sklearn Pipeline
    """
    
    def fit(self, X, y=None):
        """Required by sklearn but we don't need to learn anything"""
        return self
    
    def transform(self, X):
        """
        Clean the input text
        
        Args:
            X: Text data (pandas Series or list of strings)
            
        Returns:
            Cleaned text in same format as input
        """
        def clean_text(text):
            # Convert to string (handles NaN, numbers, etc.)
            text = str(text)
            
            # Remove URLs
            text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
            
            # Remove extra whitespace
            text = text.strip()
            
            return text
        
        # Handle pandas Series
        if hasattr(X, 'apply'):
            return X.apply(clean_text)
        
        # Handle lists
        return [clean_text(t) for t in X]