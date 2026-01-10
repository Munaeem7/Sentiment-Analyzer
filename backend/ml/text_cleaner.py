"""
This file is used by both the training notebook and the inference script
"""
import re
from sklearn.base import BaseEstimator, TransformerMixin


class TextCleaner(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):

        def clean_text(text):
            text = str(text)
            text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
            text = text.strip()
            
            return text
        
        # Handle pandas Series
        if hasattr(X, 'apply'):
            return X.apply(clean_text)
        
        # Handle lists
        return [clean_text(t) for t in X]