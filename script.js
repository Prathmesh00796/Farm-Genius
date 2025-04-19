/**
 * FarmGenius - Main JavaScript File
 * Created: April 2025
 * Updated: Enhanced UI/UX
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Check if user is logged in
    const isLoggedIn = checkUserLoginStatus();
    
    if (!isLoggedIn) {
        // Show login page if not logged in
        showPage('login-page');
        // Hide sidebar and adjust content area
        document.querySelector('.sidebar').style.transform = 'translateX(-100%)';
        document.querySelector('.content-area').style.marginLeft = '0';
    } else {
        // Load dashboard if logged in
        showPage('dashboard-page');
    }
    
    // Initialize all event listeners
    initEventListeners();
    
    // Initialize Dashboard components
    initDashboard();
    
    // Initialize Disease Detection components
    initDiseaseDetection();
    
    // Initialize Market Trends Chart
    initMarketTrendsChart();
    
    // Initialize Market Comparison Chart
    initMarketComparisonChart();
    
    // Initialize Yield Prediction
    initYieldPrediction();
    
    // Check for dark mode preference
    checkDarkModePreference();
    
    // Check for notifications
    checkNotifications();
}

/**
 * Check if the user is logged in
 * @returns {boolean} Login status
 */
function checkUserLoginStatus() {
    // In a real app, this would check cookies/localStorage for a valid token
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).loggedIn : false;
}

/**
 * Check for dark mode preference
 */
function checkDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

/**
 * Check for notifications
 */
function checkNotifications() {
    // Simulate fetching notifications
    setTimeout(() => {
        // Show a welcome notification
        showNotification('Welcome to FarmGenius! Explore the new features.', 'info');
    }, 3000);
}

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Mobile menu toggle
    document.querySelector('.navbar .logo').addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const contentArea = document.querySelector('.content-area');
        
        if (window.innerWidth <= 992) {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                contentArea.style.marginLeft = '250px';
            } else {
                contentArea.style.marginLeft = '0';
            }
        }
    });
    
    // Navigation links
    document.querySelectorAll('.nav-link, .sidebar-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId + '-page');
                // Update active class in nav and sidebar
                updateActiveNavLinks(pageId);
                
                // Close mobile sidebar if open
                if (window.innerWidth <= 992) {
                    document.querySelector('.sidebar').classList.remove('active');
                    document.querySelector('.content-area').style.marginLeft = '0';
                }
            }
        });
    });
    
    // Authentication related links
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegistration);
    document.getElementById('register-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register-page');
    });
    document.getElementById('login-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('login-page');
    });
    document.getElementById('forgot-password-link').addEventListener('click', function(e) {
        e.preventDefault();
        showModal('forgot-password-modal');
    });
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    
    // Modal functionality
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            hideAllModals();
        });
    });
    
    // Modal container outside click
    document.getElementById('modal-container').addEventListener('click', function(e) {
        if (e.target === this) {
            hideAllModals();
        }
    });
    
    // Voice assistant
    document.querySelector('.voice-assistant-btn').addEventListener('click', toggleVoiceAssistant);
    document.querySelector('.close-voice-dialog').addEventListener('click', function() {
        document.getElementById('voice-assistant-dialog').style.display = 'none';
    });
    
    // News carousel navigation
    document.getElementById('next-news').addEventListener('click', nextNewsItem);
    document.getElementById('prev-news').addEventListener('click', prevNewsItem);
    
    // Market Trend dropdown
    document.getElementById('trend-crop-select').addEventListener('change', updateMarketTrendsChart);
    
    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    
    // Filter buttons on policies page
    document.querySelectorAll('.policy-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all filter buttons
            document.querySelectorAll('.policy-filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter policies (in a real app, this would actually filter)
            filterPolicies(this.textContent);
        });
    });
    
    // Market filter controls
    if (document.getElementById('market-crop-filter')) {
        document.getElementById('market-crop-filter').addEventListener('change', filterMarketData);
        document.getElementById('market-location-filter').addEventListener('change', filterMarketData);
        document.getElementById('market-date-filter').addEventListener('change', filterMarketData);
        document.getElementById('refresh-market-btn').addEventListener('click', refreshMarketData);
    }
    
    // Map filter buttons
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all filter buttons
            document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter markets (in a real app, this would actually filter)
            filterMarkets(this.textContent);
        });
    });
    
    // Notification close button
    document.querySelector('.close-notification').addEventListener('click', function() {
        document.getElementById('notification-toast').style.display = 'none';
    });
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('darkMode', 'true');
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update charts for dark mode
    if (window.priceChart) {
        updateChartForTheme(window.priceChart);
    }
    if (window.comparisonChart) {
        updateChartForTheme(window.comparisonChart);
    }
    
    // Show notification
    showNotification('Theme changed successfully!', 'success');
}

/**
 * Update chart for current theme
 * @param {Chart} chart - Chart.js instance
 */
function updateChartForTheme(chart) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#263238';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.update();
}

/**
 * Show a specific page and hide all others
 * @param {string} pageId - ID of the page to show
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

/**
 * Update active class in navigation links
 * @param {string} pageId - ID of the active page without '-page' suffix
 */
function updateActiveNavLinks(pageId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link, .sidebar-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to matching links
    document.querySelectorAll(`.nav-link[data-page="${pageId}"], .sidebar-links a[data-page="${pageId}"]`).forEach(link => {
        link.classList.add('active');
    });
}

/**
 * Show a modal dialog
 * @param {string} modalId - ID of the modal to show
 */
function showModal(modalId) {
    document.getElementById('modal-container').style.display = 'flex';
    document.getElementById(modalId).style.display = 'block';
}

/**
 * Hide all modals
 */
function hideAllModals() {
    document.getElementById('modal-container').style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Show notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info, success, warning, error)
 */
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const icon = toast.querySelector('.notification-icon i');
    const messageEl = toast.querySelector('.notification-message');
    
    // Set icon based on type
    icon.className = ''; // Reset class
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            icon.style.color = 'var(--success-color)';
            toast.style.borderLeftColor = 'var(--success-color)';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            icon.style.color = 'var(--warning-color)';
            toast.style.borderLeftColor = 'var(--warning-color)';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            icon.style.color = 'var(--danger-color)';
            toast.style.borderLeftColor = 'var(--danger-color)';
            break;
        default:
            icon.className = 'fas fa-info-circle';
            icon.style.color = 'var(--info-color)';
            toast.style.borderLeftColor = 'var(--info-color)';
    }
    
    // Set message
    messageEl.textContent = message;
    
    // Show toast
    toast.style.display = 'flex';
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show or hide the loader
 */
function toggleLoader(show) {
    document.getElementById('global-loader').style.display = show ? 'flex' : 'none';
}

/**
 * Toggle voice assistant dialog
 */
function toggleVoiceAssistant() {
    const dialog = document.getElementById('voice-assistant-dialog');
    dialog.style.display = dialog.style.display === 'none' || dialog.style.display === '' ? 'block' : 'none';
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
function handleLogin(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    
    // Basic validation
    if (!phone || !password) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Show loader
    toggleLoader(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Hide loader
        toggleLoader(false);
        
        // In a real app, you'd validate credentials with an API
        // For demo purposes, we'll just log in
        
        // Store user info (in a real app, store JWT token)
        localStorage.setItem('user', JSON.stringify({
            name: 'Rajesh Kumar',
            role: role,
            loggedIn: true
        }));
        
        // Show success notification
        showNotification('Login successful! Welcome back.', 'success');
        
        // Update UI for logged in user
        document.getElementById('user-name').textContent = 'Rajesh Kumar';
        document.getElementById('dashboard-user-name').textContent = 'Rajesh Kumar';
        
        // Show sidebar
        document.querySelector('.sidebar').style.transform = 'translateX(0)';
        document.querySelector('.content-area').style.marginLeft = '250px';
        
        // Show dashboard
        showPage('dashboard-page');
        updateActiveNavLinks('dashboard');
        
        // Update sidebars and navigation based on role
        updateUIForRole(role);
    }, 1500); // End of setTimeout
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
function handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const location = document.getElementById('register-location').value;
    const role = document.getElementById('register-role').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Basic validation
    if (!name || !phone || !location || !password || !confirmPassword) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'warning');
        return;
    }
    
    // Show loader
    toggleLoader(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Hide loader
        toggleLoader(false);
        
        // Show success notification
        showNotification('Registration successful! Please login.', 'success');
        
        // Redirect to login page
        showPage('login-page');
    }, 1500);
}

/**
 * Handle logout
 */
function handleLogout() {
    // Show confirmation modal or directly log out
    if (confirm('Are you sure you want to log out?')) {
        // Clear user data
        localStorage.removeItem('user');
        
        // Hide sidebar for login page
        document.querySelector('.sidebar').style.transform = 'translateX(-100%)';
        document.querySelector('.content-area').style.marginLeft = '0';
        
        // Show notification
        showNotification('You have been logged out.', 'info');
        
        // Redirect to login page
        showPage('login-page');
    }
}

/**
 * Update UI elements based on user role
 * @param {string} role - User role (farmer or dealer)
 */
function updateUIForRole(role) {
    if (role === 'farmer') {
        // Update page title and navigation for farmer
        document.querySelector('.page-title').textContent = 'Farmer Dashboard';
        document.querySelector('.user-role').textContent = 'Farmer';
        
        // Show farmer-specific navigation items
        document.querySelectorAll('[data-page="crop-disease"], [data-page="yield-prediction"]').forEach(el => {
            el.style.display = 'block';
        });
        
        // Hide dealer-specific navigation items
        document.querySelectorAll('[data-page="dealer-profile"]').forEach(el => {
            el.style.display = 'none';
        });
    } else if (role === 'dealer') {
        // Update page title and navigation for dealer
        document.querySelector('.page-title').textContent = 'Dealer Dashboard';
        document.querySelector('.user-role').textContent = 'Dealer';
        
        // Hide farmer-specific navigation items
        document.querySelectorAll('[data-page="crop-disease"], [data-page="yield-prediction"]').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show dealer-specific navigation items
        document.querySelectorAll('[data-page="dealer-profile"]').forEach(el => {
            el.style.display = 'block';
        });
    }
}

/**
 * Initialize dashboard components
 */
function initDashboard() {
    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', options);
    
    // Simulate fetching weather data
    // In a real app, this would come from a weather API
    fetchWeatherData();
    
    // Set up news carousel auto-rotation
    setInterval(nextNewsItem, 5000);
}

/**
 * Simulate fetching weather data
 */
function fetchWeatherData() {
    // In a real app, this would be an API call
    const weatherData = {
        current: {
            temp: 30,
            condition: 'Sunny',
            icon: 'sun'
        },
        forecast: [
            { day: 'Today', temp: 30, icon: 'sun' },
            { day: 'Fri', temp: 28, icon: 'cloud-sun' },
            { day: 'Sat', temp: 26, icon: 'cloud' },
            { day: 'Sun', temp: 25, icon: 'cloud-rain' },
            { day: 'Mon', temp: 27, icon: 'cloud-sun' }
        ]
    };
    
    // Update DOM with weather data
    document.getElementById('current-weather').textContent = `${weatherData.current.temp}°C, ${weatherData.current.condition}`;
    
    // Update weather forecast cards
    const weatherCards = document.querySelectorAll('.weather-day');
    weatherData.forecast.forEach((day, index) => {
        if (weatherCards[index]) {
            weatherCards[index].querySelector('p:first-child').textContent = day.day;
            weatherCards[index].querySelector('i').className = `fas fa-${day.icon}`;
            weatherCards[index].querySelector('p:last-child').textContent = `${day.temp}°C`;
        }
    });
}

/**
 * Navigate to next news item
 */
function nextNewsItem() {
    const items = document.querySelectorAll('.news-item');
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    
    // Hide current active item
    items[activeIndex].classList.remove('active');
    
    // Show next item (or first if at the end)
    activeIndex = (activeIndex + 1) % items.length;
    items[activeIndex].classList.add('active');
}

/**
 * Navigate to previous news item
 */
function prevNewsItem() {
    const items = document.querySelectorAll('.news-item');
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    
    // Hide current active item
    items[activeIndex].classList.remove('active');
    
    // Show previous item (or last if at the beginning)
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    items[activeIndex].classList.add('active');
}

/**
 * Initialize crop disease detection page
 */
function initDiseaseDetection() {
    const uploadBtn = document.getElementById('upload-image-btn');
    const fileInput = document.getElementById('crop-image-upload');
    const changeBtn = document.getElementById('change-image-btn');
    const analyzeBtn = document.getElementById('analyze-image-btn');
    const previewCard = document.getElementById('image-preview-card');
    const previewImage = document.getElementById('preview-image');
    const resultSection = document.getElementById('disease-result-section');
    
    // Upload button click handler
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewCard.style.display = 'block';
                
                // Hide results section if changing image
                resultSection.style.display = 'none';
                
                // Show notification
                showNotification('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Change image button
    changeBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Analyze button
    analyzeBtn.addEventListener('click', function() {
        // Show loader
        toggleLoader(true);
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Hide loader
            toggleLoader(false);
            
            // Show results section
            resultSection.style.display = 'block';
            
            // Animate confidence bar
            const confidenceBar = document.querySelector('.confidence-level');
            confidenceBar.style.width = '0%';
            setTimeout(() => {
                confidenceBar.style.width = '92%';
            }, 300);
            
            // Scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Show success notification
            showNotification('Image analysis complete!', 'success');
        }, 2000);
    });
    
    // Save, Share, Print buttons
    document.getElementById('save-result-btn').addEventListener('click', function() {
        showNotification('Result saved successfully!', 'success');
    });
    
    document.getElementById('share-result-btn').addEventListener('click', function() {
        showNotification('Sharing options coming soon!', 'info');
    });
    
    document.getElementById('print-result-btn').addEventListener('click', function() {
        window.print();
    });
    
    // Make upload area a drop zone
    const uploadCard = document.querySelector('.upload-card');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadCard.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadCard.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadCard.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadCard.classList.remove('highlight');
    }
    
    uploadCard.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewCard.style.display = 'block';
                
                // Hide results section if changing image
                resultSection.style.display = 'none';
                
                // Show notification
                showNotification('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    }
}

/**
 * Initialize yield prediction functionality
 */
function initYieldPrediction() {
    const yieldForm = document.getElementById('yield-prediction-form');
    if (!yieldForm) return;
    
    yieldForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loader
        toggleLoader(true);
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Hide loader
            toggleLoader(false);
            
            // Show result section
            document.getElementById('yield-result').style.display = 'grid';
            
            // Show success notification
            showNotification('Yield prediction complete!', 'success');
            
            // Scroll to results
            document.getElementById('yield-result').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
}

/**
 * Initialize market trends chart
 */
function initMarketTrendsChart() {
    const ctx = document.getElementById('price-trend-chart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    // Sample data
    const data = {
        labels: ['Mar 18', 'Mar 25', 'Apr 1', 'Apr 8', 'Apr 15', 'Apr 18'],
        datasets: [{
            label: 'Price (Rs/Quintal)',
            data: [2200, 2300, 2250, 2400, 2350, 2450],
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: 'rgba(76, 175, 80, 0.8)',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: 'rgba(76, 175, 80, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y + ' per Quintal';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    window.priceChart = new Chart(ctx2d, config);
}

/**
 * Initialize market comparison chart
 */
function initMarketComparisonChart() {
    const ctx = document.getElementById('price-comparison-chart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    // Sample data
    const data = {
        labels: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan'],
        datasets: [{
            label: 'Price (Rs/Quintal)',
            data: [2250, 2180, 2080, 2120, 2020],
            backgroundColor: [
                'rgba(76, 175, 80, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(255, 152, 0, 0.7)',
                'rgba(156, 39, 176, 0.7)',
                'rgba(233, 30, 99, 0.7)'
            ],
            borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(233, 30, 99, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1900,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y + ' per Quintal';
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart
    window.comparisonChart = new Chart(ctx2d, config);
    
    // Add event listener for crop selection
    document.getElementById('comparison-crop-select').addEventListener('change', updateComparisonChart);
}

/**
 * Update market trends chart based on selected crop
 */
function updateMarketTrendsChart() {
    const crop = document.getElementById('trend-crop-select').value;
    let newData;
    
    // Different data for different crops
    switch(crop) {
        case 'rice':
            newData = [1850, 1900, 1950, 1920, 2000, 2100];
            break;
        case 'maize':
            newData = [1500, 1550, 1600, 1650, 1700, 1780];
            break;
        case 'potato':
            newData = [1200, 1150, 1250, 1300, 1350, 1400];
            break;
        default: // wheat
            newData = [2200, 2300, 2250, 2400, 2350, 2450];
    }
    
    // Update chart data
    window.priceChart.data.datasets[0].data = newData;
    window.priceChart.update();
    
    // Show notification
    showNotification(`Showing price trends for ${crop.charAt(0).toUpperCase() + crop.slice(1)}`, 'info');
}

/**
 * Update comparison chart based on selected crop
 */
function updateComparisonChart() {
    const crop = document.getElementById('comparison-crop-select').value;
    let newData;
    
    // Different data for different crops
    switch(crop) {
        case 'rice':
            newData = [3950, 3880, 3750, 3820, 3680];
            break;
        case 'maize':
            newData = [1950, 1920, 1880, 1850, 1800];
            break;
        case 'potato':
            newData = [950, 1050, 920, 980, 900];
            break;
        default: // wheat
            newData = [2250, 2180, 2080, 2120, 2020];
    }
    
    // Update chart data
    window.comparisonChart.data.datasets[0].data = newData;
    window.comparisonChart.update();
}

/**
 * Filter market data based on selections
 */
function filterMarketData() {
    // In a real app, this would update the table with filtered data
    toggleLoader(true);
    
    setTimeout(() => {
        toggleLoader(false);
        showNotification('Market data filtered successfully!', 'success');
    }, 800);
}

/**
 * Refresh market data
 */
function refreshMarketData() {
    toggleLoader(true);
    
    setTimeout(() => {
        toggleLoader(false);
        showNotification('Market data updated with latest prices!', 'success');
    }, 1200);
}

/**
 * Filter markets on the map
 * @param {string} filterType - Type of filter
 */
function filterMarkets(filterType) {
    // In a real app, this would update the map and listing
    toggleLoader(true);
    
    setTimeout(() => {
        toggleLoader(false);
        showNotification(`Markets filtered to show ${filterType}`, 'info');
    }, 800);
}

/**
 * Filter policies based on category
 * @param {string} category - Policy category
 */
function filterPolicies(category) {
    // In a real app, this would update the policies display
    toggleLoader(true);
    
    setTimeout(() => {
        toggleLoader(false);
        showNotification(`Policies filtered to show ${category}`, 'info');
    }, 800);
}

// Add mobile-specific behaviors
window.addEventListener('resize', function() {
    if (window.innerWidth <= 992) {
        // Mobile view
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.content-area').style.marginLeft = '0';
    } else {
        // Desktop view - show sidebar if logged in
        if (checkUserLoginStatus()) {
            document.querySelector('.sidebar').style.transform = 'translateX(0)';
            document.querySelector('.content-area').style.marginLeft = '250px';
        }
    }
});

// script.js updates
// Initialize Google Map
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('market-map'), {
        center: {lat: 28.7041, lng: 77.1025},
        zoom: 12
    });
}

// Complete Yield Prediction
function initYieldPrediction() {
    const form = document.getElementById('yield-prediction-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            crop: document.getElementById('crop-type').value,
            area: document.getElementById('area').value,
            soil: document.getElementById('soil-type').value
        };
        
        // Simulate prediction
        const prediction = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        document.getElementById('yield-value').textContent = prediction;
        document.querySelector('.prediction-result').classList.remove('hidden');
        
        // Generate recommendations
        const recs = [
            'Apply nitrogen-rich fertilizer',
            'Ensure proper irrigation',
            'Monitor for pest activity'
        ];
        const recList = document.getElementById('yield-recommendations');
        recList.innerHTML = recs.map(r => `<li>${r}</li>`).join('');
    });
}

// Policy Filtering
function filterPolicies(category) {
    const policies = document.querySelectorAll('.policy-card');
    policies.forEach(card => {
        const cardCategory = card.dataset.category;
        if(category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize Policies
function initPolicies() {
    const container = document.getElementById('policy-container');
    const policyData = [
        {
            title: 'Organic Farming Subsidy',
            category: 'subsidy',
            description: '50% subsidy on organic inputs for small farmers'
        },
        {
            title: 'Low Interest Loans',
            category: 'loan',
            description: '4% interest loans for farm equipment'
        }
    ];
    
    container.innerHTML = policyData.map(policy => `
        <div class="policy-card" data-category="${policy.category}">
            <h4>${policy.title}</h4>
            <p>${policy.description}</p>
            <span class="policy-category">${policy.category}</span>
        </div>
    `).join('');
}

// Mobile Menu Improvement
function handleMobileMenu() {
    const menuToggle = document.querySelector('.navbar .logo');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        if(window.innerWidth <= 992) {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
    });
}

// Add to initApp
function initApp() {
    // Existing code
    initMap();
    initPolicies();
    handleMobileMenu();
}

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});