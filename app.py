 FILE: app.py - Flask Backend API
# ============================================

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from datetime import datetime
from models import AnomalyDetector
from data_generator import generate_health_data

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize ML model
detector = AnomalyDetector()

@app.route('/')
def home():
    return jsonify({
        'message': 'HealthAI API is running',
        'version': '1.0.0',
        'endpoints': {
            'health_data': '/api/health-data',
            'predict': '/api/predict',
            'recommendations': '/api/recommendations'
        }
    })

@app.route('/api/health-data', methods=['GET'])
def get_health_data():
    """Generate and return simulated health data"""
    data = generate_health_data()
    
    # Check for anomalies
    is_anomaly = detector.detect_anomaly(data['heart_rate'], data['blood_oxygen'])
    
    return jsonify({
        'heart_rate': data['heart_rate'],
        'blood_oxygen': data['blood_oxygen'],
        'sleep_hours': data['sleep_hours'],
        'activity_level': data['activity_level'],
        'status': 'Alert' if is_anomaly else 'Normal',
        'anomaly': is_anomaly,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict if health metrics indicate an anomaly"""
    data = request.json
    heart_rate = data.get('heart_rate', 70)
    blood_oxygen = data.get('blood_oxygen', 98)
    
    is_anomaly = detector.detect_anomaly(heart_rate, blood_oxygen)
    confidence = detector.get_confidence_score(heart_rate, blood_oxygen)
    
    return jsonify({
        'prediction': 'Anomaly' if is_anomaly else 'Normal',
        'confidence': confidence,
        'heart_rate': heart_rate,
        'blood_oxygen': blood_oxygen,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get personalized health recommendations"""
    recommendations = {
        'exercise': [
            '30 minutes of moderate cardio daily',
            'Include strength training 2-3 times per week',
            'Try yoga or stretching for flexibility'
        ],
        'sleep': [
            'Maintain consistent sleep schedule',
            'Aim for 7-9 hours of quality sleep',
            'Avoid screens 1 hour before bedtime'
        ],
        'nutrition': [
            'Stay hydrated with 8 glasses of water daily',
            'Include more omega-3 rich foods',
            'Reduce processed sugar intake'
        ]
    }
    
    return jsonify(recommendations)

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the anomaly detection model with new data"""
    try:
        # Generate training data
        training_samples = 1000
        X_train = []
        
        for _ in range(training_samples):
            data = generate_health_data()
            X_train.append([data['heart_rate'], data['blood_oxygen']])
        
        detector.train(X_train)
        
        return jsonify({
            'status': 'success',
            'message': f'Model trained with {training_samples} samples',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting HealthAI Backend Server...")
    print("Server running at http://localhost:5000")
    app.run(debug=True, port=5000)