// ===========================
// GLOBAL STATE & CONFIGURATION
// ===========================

const API_BASE_URL = 'http://localhost:5000/api';
let healthData = {
    heartRate: 72,
    bloodOxygen: 98,
    sleepHours: 7.5,
    activityLevel: 'Moderate',
    status: 'Normal'
};
let alertsData = [];
let updateInterval = null;

// ===========================
// NAVIGATION FUNCTIONS
// ===========================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').substring(1);
        if (linkHref === sectionId) {
            link.classList.add('active');
        }
    });

    // Close mobile menu
    closeMobileMenu();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNavigation() {
    // Setup navigation link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href ? href.substring(1) : 'home';
            showSection(sectionId);
        });
    });

    // Setup mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Setup button clicks for hero section
    const startBtn = document.getElementById('startMonitoringBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => showSection('dashboard'));
    }

    const learnBtn = document.getElementById('learnMoreBtn');
    if (learnBtn) {
        learnBtn.addEventListener('click', () => showSection('about'));
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

// ===========================
// DATA FETCHING & UPDATES
// ===========================

async function fetchHealthData() {
    try {
        const response = await fetch(`${API_BASE_URL}/health-data`);
        const data = await response.json();
        updateHealthData(data);
    } catch (error) {
        console.log('Backend not available, using simulated data');
        generateSimulatedData();
    }
}

function generateSimulatedData() {
    // Generate realistic health data
    const heartRate = 60 + Math.floor(Math.random() * 40);
    const bloodOxygen = 92 + Math.floor(Math.random() * 8);
    const sleepHours = (6 + Math.random() * 3).toFixed(1);
    const activityLevels = ['Low', 'Moderate', 'High'];
    const activityLevel = activityLevels[Math.floor(Math.random() * activityLevels.length)];

    // Check for anomalies
    const isAnomalous = heartRate > 95 || heartRate < 60 || bloodOxygen < 95;

    const data = {
        heart_rate: heartRate,
        blood_oxygen: bloodOxygen,
        sleep_hours: parseFloat(sleepHours),
        activity_level: activityLevel,
        status: isAnomalous ? 'Alert' : 'Normal',
        anomaly: isAnomalous
    };

    updateHealthData(data);
}

function updateHealthData(data) {
    // Update global state
    healthData = {
        heartRate: data.heart_rate,
        bloodOxygen: data.blood_oxygen,
        sleepHours: data.sleep_hours,
        activityLevel: data.activity_level,
        status: data.status
    };

    // Update UI
    updateVitalsDisplay();

    // Check for anomalies
    if (data.anomaly) {
        addAlert({
            type: data.heart_rate > 95 ? 'High Heart Rate' : data.blood_oxygen < 95 ? 'Low Blood Oxygen' : 'Abnormal Reading',
            value: data.heart_rate > 95 ? data.heart_rate : data.blood_oxygen,
            time: new Date().toLocaleTimeString()
        });
    }
}

// ===========================
// UI UPDATE FUNCTIONS
// ===========================

function updateVitalsDisplay() {
    // Update heart rate
    const heartRateEl = document.getElementById('heartRate');
    const heartBadgeEl = document.getElementById('heartBadge');
    if (heartRateEl) {
        animateValue(heartRateEl, parseInt(heartRateEl.textContent) || 0, healthData.heartRate, 500);
    }

    // Update blood oxygen
    const bloodOxygenEl = document.getElementById('bloodOxygen');
    const oxygenBadgeEl = document.getElementById('oxygenBadge');
    if (bloodOxygenEl) {
        animateValue(bloodOxygenEl, parseInt(bloodOxygenEl.textContent) || 0, healthData.bloodOxygen, 500);
    }

    // Update sleep hours
    const sleepEl = document.getElementById('sleepHours');
    if (sleepEl) {
        sleepEl.textContent = healthData.sleepHours;
    }

    // Update activity level
    const activityEl = document.getElementById('activityLevel');
    if (activityEl) {
        activityEl.textContent = healthData.activityLevel;
    }

    // Update status badges
    const badges = [heartBadgeEl, oxygenBadgeEl];
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = healthData.status;
            badge.className = `vital-badge ${healthData.status === 'Normal' ? 'badge-normal' : 'badge-alert'}`;
        }
    });
}

function animateValue(element, start, end, duration) {
    if (!element) return;

    const startTime = performance.now();
    const difference = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentValue = Math.round(start + difference * easeProgress);
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===========================
// ALERTS MANAGEMENT
// ===========================

function addAlert(alert) {
    // Add to beginning of array (most recent first)
    alertsData.unshift(alert);

    // Keep only last 10 alerts
    if (alertsData.length > 10) {
        alertsData = alertsData.slice(0, 10);
    }

    updateAlertsDisplay();
}

function updateAlertsDisplay() {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;

    if (alertsData.length === 0) {
        alertsContainer.innerHTML = `
            <div class="alert-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p>All vitals are within normal range</p>
                <span>Keep up the healthy habits! 🎉</span>
            </div>
        `;
    } else {
        alertsContainer.innerHTML = alertsData.map(alert => `
            <div class="alert-item">
                <div class="alert-info">
                    <span class="alert-icon">⚠️</span>
                    <div class="alert-details">
                        <h4>${alert.type}</h4>
                        <p>${alert.time}</p>
                    </div>
                </div>
                <span class="alert-value">${alert.value}</span>
            </div>
        `).join('');
    }
}

// ===========================
// API INTERACTION
// ===========================

async function makePrediction() {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                heart_rate: healthData.heartRate,
                blood_oxygen: healthData.bloodOxygen
            })
        });

        const data = await response.json();
        console.log('Prediction result:', data);
        return data;
    } catch (error) {
        console.log('Prediction service unavailable');
        return null;
    }
}

async function getRecommendations() {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations`);
        const data = await response.json();
        console.log('Recommendations:', data);
        return data;
    } catch (error) {
        console.log('Using default recommendations');
        return null;
    }
}

// ===========================
// INITIALIZATION
// ===========================

function initializeApp() {
    console.log('🏥 HealthAI Application Starting...');

    // Setup navigation
    setupNavigation();

    // Initial data fetch
    fetchHealthData();

    // Setup automatic updates every 5 seconds
    updateInterval = setInterval(() => {
        fetchHealthData();
    }, 5000);

    // Setup prediction checks every 30 seconds
    setInterval(() => {
        makePrediction();
    }, 30000);

    // Log initialization
    console.log('✅ HealthAI initialized successfully');
    console.log('📊 Real-time monitoring active');
    console.log('🤖 AI anomaly detection enabled');
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ===========================
// EVENT LISTENERS
// ===========================

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle window resize for mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Handle page visibility change (pause/resume updates)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('⏸️ Page hidden - pausing updates');
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    } else {
        console.log('▶️ Page visible - resuming updates');
        if (!updateInterval) {
            fetchHealthData();
            updateInterval = setInterval(() => {
                fetchHealthData();
            }, 5000);
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// ===========================
// EXPORT FOR TESTING
// ===========================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        updateHealthData,
        addAlert,
        generateSimulatedData
    };
}