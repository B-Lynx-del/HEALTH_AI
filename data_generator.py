# FILE: data_generator.py - Health Data Simulator
# ============================================

import numpy as np
import random
from datetime import datetime, timedelta

class HealthDataGenerator:
    def __init__(self):
        """Initialize health data generator"""
        self.activity_levels = ['Low', 'Moderate', 'High']
        
    def generate_heart_rate(self, activity_level='Moderate'):
        """Generate realistic heart rate based on activity"""
        base_rates = {
            'Low': (60, 75),
            'Moderate': (70, 90),
            'High': (90, 120)
        }
        
        min_rate, max_rate = base_rates[activity_level]
        
        # Add some variability
        heart_rate = random.randint(min_rate, max_rate)
        
        # Occasionally generate anomalies (5% chance)
        if random.random() < 0.05:
            if random.random() < 0.5:
                heart_rate = random.randint(40, 55)  # Too low
            else:
                heart_rate = random.randint(105, 130)  # Too high
        
        return heart_rate
    
    def generate_blood_oxygen(self):
        """Generate realistic blood oxygen level"""
        # Normal range: 95-100%
        blood_oxygen = random.randint(95, 100)
        
        # Occasionally generate anomalies (5% chance)
        if random.random() < 0.05:
            blood_oxygen = random.randint(88, 94)  # Low oxygen
        
        return blood_oxygen
    
    def generate_sleep_hours(self):
        """Generate sleep duration"""
        # Normal range: 6-9 hours
        sleep_hours = round(random.uniform(6.0, 9.0), 1)
        
        return sleep_hours
    
    def generate_activity_level(self):
        """Generate activity level"""
        return random.choice(self.activity_levels)

# Create global generator instance
generator = HealthDataGenerator()

def generate_health_data():
    """Generate a complete set of health metrics"""
    activity_level = generator.generate_activity_level()
    
    return {
        'heart_rate': generator.generate_heart_rate(activity_level),
        'blood_oxygen': generator.generate_blood_oxygen(),
        'sleep_hours': generator.generate_sleep_hours(),
        'activity_level': activity_level,
        'timestamp': datetime.now().isoformat()
    }

def generate_historical_data(days=7):
    """Generate historical health data for analysis"""
    data = []
    
    for day in range(days):
        date = datetime.now() - timedelta(days=day)
        
        # Generate multiple readings per day
        for _ in range(24):  # Hourly readings
            reading = generate_health_data()
            reading['timestamp'] = (date + timedelta(hours=_)).isoformat()
            data.append(reading)
    
    return data