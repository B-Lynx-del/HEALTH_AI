💓 HealthAI Monitor
🌟 Project Overview
HealthAI Monitor is a full‑stack health monitoring application that blends a sleek frontend with a powerful Python backend. It delivers real‑time health metrics, anomaly detection, and personalized recommendations — whether you’re running it standalone or connected to the backend.

✨ Frontend: HTML, CSS, JavaScript (5 pages, fully responsive) 🐍 Backend: Flask REST API + ML anomaly detection (Isolation Forest) 🎯 Modes: Works offline with simulated data OR online with real device integration

👤 Created by: Praise Becklyn 📑 Pitch Deck: View Here (https://gamma.app/docs/HealthAI-Monitor-y860pmqvqer41rw?mode=doc)

📂 File Structure
Code
📂 project-root
 ├── frontend/
 │    ├── index.html        # 🏠 5-page website (Home, Dashboard, Analytics, Recommendations, About)
 │    ├── styles.css        # 🎨 Styling (gradients, animations, responsive design)
 │    └── script.js         # ⚙️ Frontend logic, API calls, real-time updates
 │
 ├── backend/
 │    ├── app.py            # 🌐 Flask REST API server
 │    ├── models.py         # 🤖 ML anomaly detection (Isolation Forest)
 │    ├── data_generator.py # 🔄 Health data simulator
 │
 ├── requirements.txt       # 📦 Python dependencies
 └── README.md              # 📖 Documentation
🎨 Features
✨ Frontend
🖼️ index.html — 5 complete pages (Home, Dashboard, Analytics, Recommendations, About)

📱 Responsive navigation with mobile menu

💳 Health metrics cards + anomaly alerts

🎇 Hero section with animated pulse effect

🌈 styles.css — modern gradient design system, smooth animations, responsive layouts, color‑coded metrics

⏱️ script.js — real‑time updates every 5 seconds, API integration, anomaly detection, navigation, simulated fallback

🐍 Backend
🌐 app.py — Flask REST API with 5 endpoints, CORS enabled

🤖 models.py — Isolation Forest ML anomaly detection with confidence scoring

🔄 data_generator.py — health data simulator (heart rate, oxygen, sleep, activity)

⚡ Setup Instructions
🔧 1. Clone the Repository
bash
git clone https://https://github.com/B-Lynx-del/healthai-monitor.git
cd healthai-monitor
📦 2. Install Python Dependencies
bash
pip install -r requirements.txt
✅ Installs Flask, scikit‑learn, pandas, and other libraries.

🚀 3. Start the Backend Server
bash
python backend/app.py
🖥️ Server runs at http://localhost:5000 🔌 API endpoints become available.

🌐 4. Launch the Frontend
Option A: Open frontend/index.html directly in your browser Option B: Serve locally:

bash
cd frontend
python -m http.server 8000
📱 Visit http://localhost:8000 to view the app.

🔄 5. Real‑Time Updates
Dashboard refreshes every 5 seconds

Backend offline? → automatic simulated data fallback

🚨 Anomaly alerts appear in red when unusual patterns are detected

🧪 6. Development Tips
🛠️ Modify data_generator.py for custom simulated data

🤖 Extend models.py with more ML models (ECG, temperature, etc.)

🔧 Update script.js to fetch data from real APIs (Fitbit, Apple Health, Google Fit)

🎉 7. Done!
You’re all set! 🎯 Explore the Dashboard, check Analytics, and view Recommendations.

🔌 API Endpoints
Endpoint	Method	Description
/api/health-data	GET	📊 Fetch latest health metrics
/api/anomaly	POST	🚨 Run anomaly detection
/api/history	GET	📜 Retrieve measurement history
/api/recommendations	GET	💡 Get personalized health recommendations
/api/submit-health-data	POST	📥 Submit real device data
📊 Data Flow
🖥️ Frontend requests /api/health-data every 5 seconds

🐍 Backend returns simulated or device data

🤖 ML model runs anomaly detection

🎨 Frontend updates dashboard with metrics + alerts

📱 Device Integration (Optional)
🍎 Apple HealthKit

⌚ Fitbit API

📊 Google Fit

🔧 IoT sensors (MAX30102, accelerometers, Raspberry Pi)

📜 License
MIT License — free to use, modify, and distribute. 🎉
