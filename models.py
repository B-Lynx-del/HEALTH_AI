 ============================================
# FILE: models.py - ML Anomaly Detection Model
# ============================================

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class AnomalyDetector:
    def __init__(self):
        """Initialize the anomaly detection model"""
        self.model = IsolationForest(
            contamination=0.1,  # Expected proportion of anomalies
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        
        # Train with initial data
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize model with sample data"""
        # Generate normal training data
        np.random.seed(42)
        normal_heart_rate = np.random.normal(75, 10, 500)
        normal_blood_oxygen = np.random.normal(97, 2, 500)
        
        # Generate some anomalous data
        anomaly_heart_rate = np.concatenate([
            np.random.normal(110, 5, 25),  # High heart rate
            np.random.normal(45, 5, 25)    # Low heart rate
        ])
        anomaly_blood_oxygen = np.random.normal(88, 3, 50)  # Low oxygen
        
        # Combine data
        heart_rates = np.concatenate([normal_heart_rate, anomaly_heart_rate])
        blood_oxygen = np.concatenate([normal_blood_oxygen, anomaly_blood_oxygen])
        
        X_train = np.column_stack([heart_rates, blood_oxygen])
        
        # Train the model
        self.train(X_train)
    
    def train(self, X):
        """Train the anomaly detection model"""
        X = np.array(X)
        
        # Scale the data
        X_scaled = self.scaler.fit_transform(X)
        
        # Train the model
        self.model.fit(X_scaled)
        self.is_trained = True
        
        print(f"Model trained with {len(X)} samples")
    
    def detect_anomaly(self, heart_rate, blood_oxygen):
        """Detect if the given metrics are anomalous"""
        if not self.is_trained:
            raise Exception("Model not trained yet")
        
        # Prepare input
        X = np.array([[heart_rate, blood_oxygen]])
        X_scaled = self.scaler.transform(X)
        
        # Predict (-1 for anomaly, 1 for normal)
        prediction = self.model.predict(X_scaled)
        
        return prediction[0] == -1
    
    def get_confidence_score(self, heart_rate, blood_oxygen):
        """Get confidence score for the prediction"""
        if not self.is_trained:
            raise Exception("Model not trained yet")
        
        X = np.array([[heart_rate, blood_oxygen]])
        X_scaled = self.scaler.transform(X)
        
        # Get anomaly score (lower is more anomalous)
        score = self.model.score_samples(X_scaled)[0]
        
        # Convert to confidence percentage (0-100)
        confidence = max(0, min(100, (score + 0.5) * 100))
        
        return round(confidence, 2)
