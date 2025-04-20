/**
 * FarmGenius - Main JavaScript File
 * Created: April 2025
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
        // Hide sidebar
        document.getElementById('sidebar').style.transform = 'translateX(-100%)';
        document.getElementById('content-area').style.marginLeft = '0';
    } else {
        // Load dashboard if logged in
        showPage('dashboard-page');
        // Update UI for logged in user
        updateUIForLoggedInUser();
    }
    
    // Set current date in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize all event listeners
    initEventListeners();
    
    // Initialize Dashboard components
    initDashboard();
    
    // Initialize Disease Detection components
    initDiseaseDetection();
    
    // Initialize Market Trends Chart
    initMarketTrendsChart();
    
    // Initialize Yield Prediction
    initYieldPrediction();
    
    // Initialize Market Info
    initMarketInfo();
    
    // Initialize Nearby Markets
    initNearbyMarkets();
    
    // Initialize Government Policies
    initPolicies();
    
    // Check for dark mode preference
    checkDarkModePreference();
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
 * Update UI elements for logged in user
 */
function updateUIForLoggedInUser() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        document.getElementById('user-name').textContent = userData.name;
        document.getElementById('dashboard-user-name').textContent = userData.name;
        
        // Show sidebar
        document.getElementById('sidebar').style.transform = 'translateX(0)';
        document.getElementById('content-area').style.marginLeft = '250px';
        
        // Update UI based on role
        updateUIForRole(userData.role);
    }
}

/**
 * Check for dark mode preference
 */
function checkDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Mobile menu toggle
    document.getElementById('mobile-menu-toggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            document.getElementById('content-area').style.marginLeft = '250px';
        } else {
            document.getElementById('content-area').style.marginLeft = '0';
        }
    });
    
    // Navigation links
    document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId + '-page');
                // Update active class in sidebar
                updateActiveSidebarLink(pageId);
                
                // Close mobile sidebar if open
                if (window.innerWidth <= 992) {
                    document.getElementById('sidebar').classList.remove('active');
                    document.getElementById('content-area').style.marginLeft = '0';
                }
            }
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.action-card .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId + '-page');
                // Update active class in sidebar
                updateActiveSidebarLink(pageId);
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
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
    
    // News carousel navigation
    document.getElementById('next-news').addEventListener('click', nextNewsItem);
    document.getElementById('prev-news').addEventListener('click', prevNewsItem);
    
    // Market Trend dropdown
    document.getElementById('trend-crop-select').addEventListener('change', updateMarketTrendsChart);
    
    // Window resize event
    window.addEventListener('resize', handleWindowResize);
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    if (window.innerWidth <= 992) {
        // Mobile view
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('content-area').style.marginLeft = '0';
    } else {
        // Desktop view - show sidebar if logged in
        if (checkUserLoginStatus()) {
            document.getElementById('sidebar').style.transform = 'translateX(0)';
            document.getElementById('content-area').style.marginLeft = '250px';
        }
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'true');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update charts for dark mode
    if (window.priceChart) {
        updateChartForTheme(window.priceChart);
    }
    
    // Show notification
    showToast('Theme changed successfully!', 'success');
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
 * Update active class in sidebar links
 * @param {string} pageId - ID of the active page without '-page' suffix
 */
function updateActiveSidebarLink(pageId) {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to matching link
    const activeLink = document.querySelector(`.sidebar-links a[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info, success, warning, error)
 */
function showToast(message, type = 'info', title = '') {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    switch(type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        case 'error':
            icon = 'times-circle';
            break;
    }
    
    // Set default title if not provided
    if (!title) {
        switch(type) {
            case 'success':
                title = 'Success';
                break;
            case 'warning':
                title = 'Warning';
                break;
            case 'error':
                title = 'Error';
                break;
            default:
                title = 'Information';
        }
    }
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show or hide the loader
 */
function toggleLoader(show) {
    document.getElementById('loader').style.display = show ? 'flex' : 'none';
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
        showToast('Please fill all required fields', 'error');
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
        showToast('Login successful! Welcome back.', 'success');
        
        // Update UI for logged in user
        updateUIForLoggedInUser();
        
        // Show dashboard
        showPage('dashboard-page');
        updateActiveSidebarLink('dashboard');
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
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
    }
    
    // Show loader
    toggleLoader(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Hide loader
        toggleLoader(false);
        
        // Show success notification
        showToast('Registration successful! Please login.', 'success');
        
        // Redirect to login page
        showPage('login-page');
    }, 1500);
}

/**translater*/
/**
 * language translation function
 */

/**
 * FarmGenius - Enhanced Language Translation Module
 * 
 * This module provides comprehensive multi-language support for FarmGenius
 * using Google Translate API with enhancements for agricultural terminology
 * and improved user experience.
 */

// Configuration
const CONFIG = {
    // Supported languages with their display names and Google Translate names
    languages: {
      'en': { name: 'English', displayName: 'English', googleName: 'english' },
      'hi': { name: 'हिंदी', displayName: 'Hindi', googleName: 'hindi' },
      'pa': { name: 'ਪੰਜਾਬੀ', displayName: 'Punjabi', googleName: 'punjabi' },
      'ta': { name: 'தமிழ்', displayName: 'Tamil', googleName: 'tamil' },
      'mr': { name: 'मराठी', displayName: 'Marathi', googleName: 'marathi' }
    },
    
    // Default language
    defaultLanguage: 'en',
    
    // Storage key for language preference
    storageKey: 'farmGenius_language',
    
    // Translation customization - agricultural terms that should remain untranslated
    // or have specific translations in each language
    agriculturalTerms: {
      // Format: 'original term': { 'lang_code': 'translation' }
      'FarmGenius': { 'en': 'FarmGenius', 'hi': 'फार्मजीनियस', 'pa': 'ਫਾਰਮਜੀਨੀਅਸ', 'ta': 'ஃபார்ம்ஜீனியஸ்', 'mr': 'फार्मजीनियस' },
      'NPK': { 'en': 'NPK', 'hi': 'एनपीके', 'pa': 'ਐਨਪੀਕੇ', 'ta': 'என்பிகே', 'mr': 'एनपीके' }
      // Add more terms as needed
    },
    
    // Debug mode (set to true for verbose console logging)
    debug: false
  };
  
  // Main class for handling translations
  class TranslationManager {
    constructor(config) {
      this.config = config;
      this.currentLanguage = config.defaultLanguage;
      this.isTranslating = false;
      this.translateElement = null;
      this.initialized = false;
      
      // Bind methods to maintain correct 'this' context
      this.initialize = this.initialize.bind(this);
      this.initEventListeners = this.initEventListeners.bind(this);
      this.changeLanguage = this.changeLanguage.bind(this);
      this.loadSavedLanguage = this.loadSavedLanguage.bind(this);
      this.handleLanguageChange = this.handleLanguageChange.bind(this);
      this.customizeTranslations = this.customizeTranslations.bind(this);
      this.showTranslationLoader = this.showTranslationLoader.bind(this);
      this.hideTranslationLoader = this.hideTranslationLoader.bind(this);
      this.log = this.log.bind(this);
    }
    
    
    // Initialize the translation system
    initialize() {
      if (this.initialized) return;
      
      // Create hidden Google Translate element if it doesn't exist
      if (!document.getElementById('google-translate-element')) {
        this.translateElement = document.createElement('div');
        this.translateElement.id = 'google-translate-element';
        this.translateElement.style.display = 'none';
        document.body.appendChild(this.translateElement);
        
        this.log('Created Google Translate element');
      } else {
        this.translateElement = document.getElementById('google-translate-element');
      }
      
      // Create translation loader if it doesn't exist
      if (!document.querySelector('.translation-loader')) {
        const loader = document.createElement('div');
        loader.className = 'translation-loader';
        loader.style.display = 'none';
        
        loader.innerHTML = `
          <div class="translation-spinner"></div>
          <p>Changing language...</p>
        `;
        
        document.body.appendChild(loader);
        this.log('Created translation loader');
      }
      
      // Inject Google Translate script if not already loaded
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
        
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onerror = () => {
          this.log('Error loading Google Translate script', 'error');
          this.hideTranslationLoader();
          showToast('Unable to load translation service. Please try again later.', 'error');
        };
        
        document.body.appendChild(script);
        this.log('Injected Google Translate script');
      }
      
      // Initialize event listeners
      this.initEventListeners();
      
      // Load saved language preference
      this.loadSavedLanguage();
      
      this.initialized = true;
    }
    
    // Google Translate initialization callback
    googleTranslateElementInit() {
      this.log('Initializing Google Translate element');
      
      new google.translate.TranslateElement({
        pageLanguage: this.config.defaultLanguage,
        includedLanguages: Object.keys(this.config.languages).join(','),
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google-translate-element');
      
      // After Google Translate is initialized, apply saved language
      this.loadSavedLanguage(true);
    }
    
    // Set up event listeners for language selection
    initEventListeners() {
      // Handle language dropdown clicks
      document.querySelectorAll('.dropdown-menu a[data-lang]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const langCode = link.getAttribute('data-lang');
          if (!this.config.languages[langCode]) {
            this.log(`Invalid language code: ${langCode}`, 'warn');
            return;
          }
          
          this.handleLanguageChange(langCode);
        });
      });
      
      // Handle dynamic content - observe DOM changes to translate new content
      this.observeDynamicContent();
      
      this.log('Initialized event listeners');
    }
    
   // Handle language change from UI
handleLanguageChange(langCode) {
    this.log(`Language selected: ${langCode}`);
    
    // Skip if already set to this language
    if (this.currentLanguage === langCode && document.documentElement.lang === langCode) {
      this.log('Already using this language, skipping');
      return;
    }
    
    // Update UI first for immediate feedback
    this.updateLanguageUI(langCode);
    
    // Show loading indicator
    this.showTranslationLoader();
    
    // Save the preference before refreshing
    localStorage.setItem(this.config.storageKey, langCode);
    this.currentLanguage = langCode;
    
    // Show toast about language change
    const langName = this.config.languages[langCode]?.displayName || langCode;
    showToast(`Changing to ${langName}...`, 'info');
    
    // If this is a change from or to the default language, do a full page refresh
    // This ensures complete translation of all content including dynamic elements
    if (langCode === this.config.defaultLanguage || this.currentLanguage === this.config.defaultLanguage) {
      // Short delay to allow toast to be seen
      setTimeout(() => {
        // Reload the page
        window.location.reload();
      }, 1000);
      return;
    }
    
    // For changes between non-default languages, use the Google Translate approach
    // Change language using Google Translate
    this.changeLanguage(langCode);
    
    // Apply customizations for agricultural terms after translation completes
    setTimeout(() => {
      this.customizeTranslations();
      this.hideTranslationLoader();
      
      // Refresh page to ensure complete translation
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }, 1000);
  }
    
    // Update UI elements to reflect selected language
    updateLanguageUI(langCode) {
      const language = this.config.languages[langCode];
      if (!language) return;
      
      // Update dropdown button text
      const dropdownToggle = document.querySelector('.language-dropdown .dropdown-toggle');
      if (dropdownToggle) {
        dropdownToggle.innerHTML = language.name + ' <i class="fas fa-chevron-down"></i>';
      }
      
      // Set document language attribute for accessibility
      document.documentElement.lang = langCode;
      
      // Adjust RTL/LTR direction if needed
      const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
      document.dir = rtlLanguages.includes(langCode) ? 'rtl' : 'ltr';
    }
    
    // Change language using Google Translate
    changeLanguage(langCode) {
      // Skip for default language (return to original)
      if (langCode === this.config.defaultLanguage) {
        // Find and click "Show Original" in Google Translate widget
        this.selectGoogleTranslateOption('original');
        return;
      }
      
      // Otherwise, select the language from Google Translate widget
      const googleName = this.config.languages[langCode]?.googleName;
      this.selectGoogleTranslateOption(googleName);
    }
    
    // Helper to select an option in the Google Translate widget
    selectGoogleTranslateOption(optionName) {
      this.isTranslating = true;
      let attempts = 0;
      const maxAttempts = 20;
      
      const findAndClickOption = () => {
        attempts++;
        
        // Find Google Translate iframe
        const iframe = document.querySelector('.goog-te-menu-frame');
        
        if (iframe) {
          try {
            // Access iframe document
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Find all language options
            const langItems = iframeDoc.querySelectorAll('.goog-te-menu2-item');
            
            if (langItems.length > 0) {
              // Find and click the matching language
              let found = false;
              
              langItems.forEach(item => {
                const langText = item.textContent.trim().toLowerCase();
                
                if (optionName === 'original' && 
                   (langText.includes('original') || langText.includes('source'))) {
                  item.querySelector('div').click();
                  found = true;
                  this.log('Clicked "Show Original" option');
                } 
                else if (langText.includes(optionName)) {
                  item.querySelector('div').click();
                  found = true;
                  this.log(`Clicked "${optionName}" option`);
                }
              });
              
              if (found) {
                this.isTranslating = false;
                return true;
              }
            }
          } catch (error) {
            this.log(`Error accessing Google Translate menu: ${error.message}`, 'error');
          }
        }
        
        if (attempts >= maxAttempts) {
          this.log('Max attempts reached, giving up', 'warn');
          this.isTranslating = false;
          this.hideTranslationLoader();
          return false;
        }
        
        return false;
      };
      
      // Try immediately first
      if (!findAndClickOption()) {
        // If not successful, try periodically
        const intervalId = setInterval(() => {
          if (findAndClickOption() || attempts >= maxAttempts) {
            clearInterval(intervalId);
            setTimeout(() => {
              // Hide loader after a brief delay
              this.hideTranslationLoader();
            }, 500);
          }
        }, 200);
      } else {
        // Success on first try
        setTimeout(() => {
          this.hideTranslationLoader();
        }, 500);
      }
    }
    
    // Load saved language preference
    loadSavedLanguage(forceApply = false) {
      const savedLang = localStorage.getItem(this.config.storageKey);
      
      if (savedLang && this.config.languages[savedLang]) {
        this.log(`Found saved language preference: ${savedLang}`);
        
        // Update UI to show saved language
        this.updateLanguageUI(savedLang);
        
        // Apply the translation if Google Translate is ready or if forced
        if (forceApply || document.querySelector('.goog-te-menu-frame')) {
          this.currentLanguage = savedLang;
          
          // Skip translation if it's the default language
          if (savedLang !== this.config.defaultLanguage) {
            // Brief delay to ensure Google Translate is fully initialized
            setTimeout(() => {
              this.handleLanguageChange(savedLang);
            }, 500);
          }
        }
      } else {
        this.log('No saved language preference found, using default');
        this.currentLanguage = this.config.defaultLanguage;
      }
    }
    
    // Customize translations for agricultural terms
    customizeTranslations() {
      // Skip if using default language
      if (this.currentLanguage === this.config.defaultLanguage) {
        return;
      }
      
      this.log('Applying agricultural term customizations');
      
      const terms = this.config.agriculturalTerms;
      
      // For each term that needs customization
      Object.keys(terms).forEach(originalTerm => {
        const translations = terms[originalTerm];
        const customTranslation = translations[this.currentLanguage];
        
        if (!customTranslation) return;
        
        // Find all instances of the translated term and replace with custom translation
        const textNodes = this.getTextNodesContaining(document.body, originalTerm);
        
        textNodes.forEach(node => {
          node.textContent = node.textContent.replace(
            new RegExp(originalTerm, 'g'), 
            customTranslation
          );
        });
      });
    }
    
    // Helper to find text nodes containing specific text
    getTextNodesContaining(element, text) {
      const textNodes = [];
      const walk = document.createTreeWalker(
        element, 
        NodeFilter.SHOW_TEXT, 
        null, 
        false
      );
      
      let node;
      while(node = walk.nextNode()) {
        if (node.textContent.includes(text)) {
          textNodes.push(node);
        }
      }
      
      return textNodes;
    }
    
    // Observe DOM for dynamic content
    observeDynamicContent() {
      // Skip if the browser doesn't support MutationObserver
      if (!window.MutationObserver) {
        this.log('MutationObserver not supported, skipping dynamic content observation', 'warn');
        return;
      }
      
      const observer = new MutationObserver(mutations => {
        // Only process if we're not currently in the middle of a translation
        if (!this.isTranslating && this.currentLanguage !== this.config.defaultLanguage) {
          let hasNewContent = false;
          
          mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // Check if added nodes contain significant content (not just whitespace)
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && 
                   (node.textContent?.trim().length > 0 || node.childNodes.length > 0)) {
                  hasNewContent = true;
                }
              });
            }
          });
          
          // If new content was added, customize translations after a short delay
          if (hasNewContent) {
            setTimeout(() => this.customizeTranslations(), 500);
          }
        }
      });
      
      // Observe the entire document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      this.log('Dynamic content observation initialized');
    }
    
    // Show translation loading indicator
    showTranslationLoader() {
      const loader = document.querySelector('.translation-loader');
      if (loader) {
        loader.style.display = 'flex';
      }
    }
    
    // Hide translation loading indicator
    hideTranslationLoader() {
      const loader = document.querySelector('.translation-loader');
      if (loader) {
        loader.style.display = 'none';
      }
      
      // Show toast notification
      if (this.currentLanguage && this.currentLanguage !== this.config.defaultLanguage) {
        const langName = this.config.languages[this.currentLanguage]?.displayName || this.currentLanguage;
        showToast(`Content translated to ${langName}`, 'success');
      }
    }
    
    // Helper for logging
    log(message, level = 'info') {
      if (!this.config.debug && level !== 'error') {
        return;
      }
      
      const prefix = '[TranslationManager]';
      
      switch (level) {
        case 'error':
          console.error(`${prefix} ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`);
          break;
        default:
          console.log(`${prefix} ${message}`);
      }
    }
  }
  
  // Create and export translation manager instance
  const translationManager = new TranslationManager(CONFIG);
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    translationManager.initialize();
  });
  
  // Ensure initialization happens even if called after DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      translationManager.initialize();
    });
  } else {
    // DOM already loaded, initialize now
    translationManager.initialize();
  }
  
  // Export for use in other scripts
  window.farmGeniusTranslation = translationManager;

/**
 * Handle logout
 */
function handleLogout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to log out?')) {
        // Clear user data
        localStorage.removeItem('user');
        
        // Hide sidebar for login page
        document.getElementById('sidebar').style.transform = 'translateX(-100%)';
        document.getElementById('content-area').style.marginLeft = '0';
        
        // Show notification
        showToast('You have been logged out.', 'info');
        
        // Redirect to login page
        showPage('login-page');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Attach logout function to the link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault(); // prevent anchor redirect
            handleLogout();
        });
    }

    // Toggle user dropdown (optional improvement)
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', () => {
            profileDropdown.classList.toggle('show');
        });

        // Hide dropdown on click outside
        window.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
});

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        // Clear user data
        localStorage.removeItem('user');

        // Hide sidebar if it's visible
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.style.transform = 'translateX(-100%)';

        // Reset main content margin
        const contentArea = document.getElementById('content-area');
        if (contentArea) contentArea.style.marginLeft = '0';

        // Show notification
        showToast('You have been logged out.', 'info');

        // Redirect to login page
        showPage('login-page');
    }
}

// Show only one page at a time
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
}

/**
 * Update UI elements based on user role
 * @param {string} role - User role (farmer or dealer)
 */
function updateUIForRole(role) {
    if (role === 'farmer') {
        // Update page title for farmer
        document.querySelector('.page-title').textContent = 'Farmer Dashboard';
        document.querySelector('.user-role').textContent = 'Farmer';
    } else if (role === 'dealer') {
        // Update page title for dealer
        document.querySelector('.page-title').textContent = 'Dealer Dashboard';
        document.querySelector('.user-role').textContent = 'Dealer';
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
    
    // Set up news carousel auto-rotation
    setInterval(nextNewsItem, 5000);
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
    const uploadCard = document.getElementById('upload-card');
    const previewCard = document.getElementById('preview-card');
    const tipsCard = document.getElementById('tips-card');
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
                uploadCard.classList.add('hidden');
                previewCard.classList.remove('hidden');
                tipsCard.classList.remove('hidden');
                
                // Hide results section if changing image
                resultSection.classList.add('hidden');
                
                // Show notification
                showToast('Image uploaded successfully!', 'success');
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
            resultSection.classList.remove('hidden');
            
            // Animate confidence bar
            const confidenceBar = document.querySelector('.confidence-level');
            confidenceBar.style.width = '92%';
            
            // Set result date
            document.getElementById('result-date').textContent = new Date().toLocaleDateString();
            
            // Scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // Show success notification
            showToast('Image analysis complete!', 'success');
        }, 2000);
    });
    
    // Save, Share, Print buttons
    document.getElementById('save-result-btn').addEventListener('click', function() {
        showToast('Result saved successfully!', 'success');
    });
    
    document.getElementById('share-result-btn').addEventListener('click', function() {
        showToast('Sharing options coming soon!', 'info');
    });
    
    document.getElementById('print-result-btn').addEventListener('click', function() {
        window.print();
    });
    
    // Make upload area a drop zone
    uploadCard.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('highlight');
    });
    
    uploadCard.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('highlight');
    });
    
    uploadCard.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('highlight');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                uploadCard.classList.add('hidden');
                previewCard.classList.remove('hidden');
                tipsCard.classList.remove('hidden');
                
                // Hide results section if changing image
                resultSection.classList.add('hidden');
                
                // Show notification
                showToast('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Initialize market trends chart
 */
function initMarketTrendsChart() {
    const ctx = document.getElementById('price-trend-chart');
    if (!ctx) return;
    
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
    window.priceChart = new Chart(ctx, config);
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
    showToast(`Showing price trends for ${crop.charAt(0).toUpperCase() + crop.slice(1)}`, 'info');
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
            
            // Generate random prediction data
            const yieldValue = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
            const revenue = yieldValue * 2000;
            const comparison = Math.floor(Math.random() * 15) - 5;
            
            // Update UI with prediction results
            document.getElementById('yield-value').textContent = yieldValue;
            document.getElementById('revenue-value').textContent = revenue.toLocaleString();
            document.getElementById('comparison-value').textContent = `${comparison >= 0 ? '+' : ''}${comparison}%`;
            
            // Show result section
            document.getElementById('yield-results').classList.remove('hidden');
            
            // Show success notification
            showToast('Yield prediction complete!', 'success');
            
            // Scroll to results
            document.getElementById('yield-results').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    // Generate report button
    document.getElementById('generate-report-btn').addEventListener('click', function() {
        showToast('Detailed report has been sent to your email', 'success', 'Report generated');
    });
}

/**
 * Initialize market info page
 */
function initMarketInfo() {
    // Market data
    const marketData = [
        {
            id: 1,
            crop: "Wheat",
            variety: "HD-2967",
            market: "Khanna Mandi, Punjab",
            price: 2450,
            trend: "up",
            change: "+2.5%",
            lastUpdated: "2 hours ago",
        },
        {
            id: 2,
            crop: "Rice",
            variety: "Basmati-1121",
            market: "Karnal Mandi, Haryana",
            price: 3850,
            trend: "down",
            change: "-1.2%",
            lastUpdated: "4 hours ago",
        },
        {
            id: 3,
            crop: "Maize",
            variety: "Pioneer-3396",
            market: "Azadpur Mandi, Delhi",
            price: 1780,
            trend: "stable",
            change: "0%",
            lastUpdated: "6 hours ago",
        },
        {
            id: 4,
            crop: "Potato",
            variety: "Kufri Jyoti",
            market: "Agra Mandi, UP",
            price: 1250,
            trend: "up",
            change: "+5.0%",
            lastUpdated: "3 hours ago",
        },
        {
            id: 5,
            crop: "Cotton",
            variety: "J-34",
            market: "Sirsa Mandi, Haryana",
            price: 6500,
            trend: "down",
            change: "-0.8%",
            lastUpdated: "5 hours ago",
        },
    ];
    
    // Populate market data table
    const marketTable = document.getElementById('market-data-table');
    if (marketTable) {
        marketTable.innerHTML = marketData.map(item => `
            <tr>
                <td class="font-medium">${item.crop}</td>
                <td>${item.variety}</td>
                <td>${item.market}</td>
                <td class="text-right font-medium">₹${item.price}</td>
                <td class="text-center">
                    <div class="trend-indicator ${item.trend}">
                        <i class="fas fa-${item.trend === 'up' ? 'arrow-up' : item.trend === 'down' ? 'arrow-down' : 'minus'}"></i>
                        <span>${item.change}</span>
                    </div>
                </td>
                <td>${item.lastUpdated}</td>
            </tr>
        `).join('');
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-market-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Show loader
            toggleLoader(true);
            
            // Simulate API call
            setTimeout(() => {
                toggleLoader(false);
                showToast('Market data updated with latest prices!', 'success');
            }, 1200);
        });
    }
}

/**
 * Initialize nearby markets page
 */
function initNearbyMarkets() {
    // Market data
    const markets = [
        {
            id: 1,
            name: "Khanna Grain Market",
            distance: "3.2 km",
            address: "G.T. Road, Khanna, Punjab",
            phone: "+91 1234567890",
            hours: "6:00 AM - 8:00 PM",
            crops: ["Wheat", "Rice", "Maize"],
            rating: 4.5,
        },
        {
            id: 2,
            name: "Ludhiana APMC Market",
            distance: "8.7 km",
            address: "Gill Road, Ludhiana, Punjab",
            phone: "+91 9876543210",
            hours: "5:00 AM - 7:00 PM",
            crops: ["Wheat", "Cotton", "Vegetables"],
            rating: 4.2,
        },
        {
            id: 3,
            name: "Jalandhar Wholesale Market",
            distance: "12.4 km",
            address: "Nakodar Road, Jalandhar, Punjab",
            phone: "+91 8765432109",
            hours: "6:00 AM - 6:00 PM",
            crops: ["Rice", "Potato", "Onion"],
            rating: 4.0,
        },
    ];
    
    // Populate markets grid
    const marketsGrid = document.getElementById('markets-grid');
    if (marketsGrid) {
        marketsGrid.innerHTML = markets.map(market => `
            <div class="card">
                <div class="card-content">
                    <div class="market-header">
                        <h4>${market.name}</h4>
                        <span class="market-distance">${market.distance}</span>
                    </div>
                    
                    <div class="market-details">
                        <p><i class="fas fa-map-marker-alt"></i> ${market.address}</p>
                        <p><i class="fas fa-phone"></i> ${market.phone}</p>
                        <p><i class="fas fa-clock"></i> ${market.hours}</p>
                    </div>
                    
                    <div class="market-crops">
                        <p>Available Crops:</p>
                        <div class="crop-tags">
                            ${market.crops.map(crop => `<span class="crop-tag">${crop}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="market-footer">
                        <div class="market-rating">
                            ${generateStarRating(market.rating)}
                            <span>(${market.rating})</span>
                        </div>
                        <button class="btn btn-sm">Get Directions</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Radius filter
    const radiusFilter = document.getElementById('radius-filter');
    if (radiusFilter) {
        radiusFilter.addEventListener('change', function() {
            showToast(`Showing markets within ${this.value} km radius.`, 'info');
        });
    }
}

/**
 * Generate HTML for star rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML for star rating
 */
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

/**
 * FarmGenius Chatbot Assistant
 * This script handles the functionality of the chatbot interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot
    initChatbot();
});

/**
 * Initialize chatbot functionality
 */
function initChatbot() {
    // DOM elements
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const minimizeBtn = document.getElementById('minimize-chatbot');
    const closeBtn = document.getElementById('close-chatbot');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('send-message-btn');
    const micBtn = document.getElementById('chatbot-mic-btn');
    const cameraBtn = document.getElementById('chatbot-camera-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    // Event: Toggle chatbot visibility
    chatbotToggleBtn.addEventListener('click', toggleChatbot);
    
    // Event: Minimize chatbot
    minimizeBtn.addEventListener('click', minimizeChatbot);
    
    // Event: Close chatbot
    closeBtn.addEventListener('click', closeChatbot);
    
    // Event: Send message
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Event: Voice input
    micBtn.addEventListener('click', startVoiceInput);
    
    // Event: Camera input
    cameraBtn.addEventListener('click', openCamera);
    
    // Event: Suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            sendUserMessage(text);
        });
    });
    
    // Replace voice assistant button with chatbot toggle
    replaceVoiceAssistantWithChatbot();
}

/**
 * Replace voice assistant button with chatbot toggle
 */
function replaceVoiceAssistantWithChatbot() {
    const voiceAssistantBtn = document.querySelector('.voice-assistant-btn');
    
    if (voiceAssistantBtn) {
        // Create new chatbot toggle button
        const chatbotToggleBtn = document.createElement('button');
        chatbotToggleBtn.className = 'chatbot-toggle-btn';
        chatbotToggleBtn.id = 'chatbot-toggle-btn';
        chatbotToggleBtn.title = 'FarmGenius Assistant';
        chatbotToggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
        
        // Replace voice assistant button with chatbot toggle
        voiceAssistantBtn.parentNode.replaceChild(chatbotToggleBtn, voiceAssistantBtn);
        
        // Add event listener
        chatbotToggleBtn.addEventListener('click', toggleChatbot);
    }
}

/**
 * Toggle chatbot visibility
 */
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    
    if (chatbotContainer.style.display === 'none' || !chatbotContainer.classList.contains('show')) {
        chatbotContainer.classList.remove('hide');
        chatbotContainer.classList.add('show');
        chatbotContainer.style.display = 'flex';
        
        // Focus on input field
        setTimeout(() => {
            document.getElementById('chatbot-input-field').focus();
        }, 300);
        
        // Scroll to bottom of messages
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
        minimizeChatbot();
    }
}

/**
 * Minimize chatbot
 */
function minimizeChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    
    chatbotContainer.classList.remove('show');
    chatbotContainer.classList.add('hide');
    
    // Hide chatbot after animation completes
    setTimeout(() => {
        chatbotContainer.style.display = 'none';
    }, 300);
}

/**
 * Close chatbot
 */
function closeChatbot() {
    minimizeChatbot();
}

/**
 * Send message from input field
 */
function sendMessage() {
    const inputField = document.getElementById('chatbot-input-field');
    const text = inputField.value.trim();
    
    if (text) {
        sendUserMessage(text);
        inputField.value = '';
    }
}

/**
 * Send user message to chatbot
 * @param {string} text - Message text
 */
function sendUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Create user message element
    const userMessageElement = createMessageElement('user', text);
    messagesContainer.appendChild(userMessageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process user message and generate response after delay
    setTimeout(() => {
        generateBotResponse(text);
    }, 1000);
}

/**
 * Create message element
 * @param {string} sender - Message sender ('user' or 'bot')
 * @param {string} text - Message text
 * @returns {HTMLElement} Message element
 */
function createMessageElement(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'bot') {
        const avatarImg = document.createElement('img');
        avatarImg.src = 'logo.png';
        avatarImg.alt = 'FarmGenius Assistant';
        avatarDiv.appendChild(avatarImg);
    } else {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = 'Just now';
    
    contentDiv.appendChild(messageText);
    contentDiv.appendChild(messageTime);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

/**
 * Show typing indicator in chat
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Create typing indicator element
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot typing-indicator-container';
    typingIndicator.id = 'typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    const avatarImg = document.createElement('img');
    avatarImg.src = 'logo.png';
    avatarImg.alt = 'FarmGenius Assistant';
    avatarDiv.appendChild(avatarImg);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(indicatorDiv);
    
    typingIndicator.appendChild(avatarDiv);
    typingIndicator.appendChild(contentDiv);
    
    messagesContainer.appendChild(typingIndicator);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Generate bot response based on user input
 * @param {string} userMessage - User's message
 */
function generateBotResponse(userMessage) {
    // Hide typing indicator
    hideTypingIndicator();
    
    const messagesContainer = document.getElementById('chatbot-messages');
    let botResponse = '';
    
    // Simple response logic based on keywords in user message
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
        botResponse = "Hello! How can I help you with your farming needs today?";
    }
    else if (lowercaseMessage.includes('weather')) {
        botResponse = "Today's weather in your area is 30°C and sunny. The forecast shows possible light rain tomorrow.";
    }
    else if (lowercaseMessage.includes('crop') && lowercaseMessage.includes('disease')) {
        botResponse = "To identify crop diseases, please upload a clear photo of the affected plant part using the camera button. I can help diagnose common diseases in wheat, rice, maize, and vegetables.";
    }
    else if (lowercaseMessage.includes('plant') || lowercaseMessage.includes('sow')) {
        botResponse = "Based on your location and the current season, recommended crops include wheat, mustard, and peas. Would you like more specific recommendations based on your soil type?";
    }
    else if (lowercaseMessage.includes('price') || lowercaseMessage.includes('market')) {
        botResponse = "Current market prices in your area: Wheat ₹2,450/quintal, Rice ₹3,850/quintal, Maize ₹1,780/quintal. Would you like to see more commodities or check nearby markets?";
    }
    else if (lowercaseMessage.includes('fertilizer') || lowercaseMessage.includes('nutrient')) {
        botResponse = "For optimal crop health, apply NPK fertilizer at 10-15 kg/acre during the vegetative growth phase. Organic options include vermicompost and neem cake.";
    }
    else if (lowercaseMessage.includes('subsidy') || lowercaseMessage.includes('government') || lowercaseMessage.includes('scheme')) {
        botResponse = "Recent government schemes include PM-KISAN (₹6,000 yearly support), Soil Health Card, and crop insurance under PMFBY. Would you like details on how to apply?";
    }
    else if (lowercaseMessage.includes('irrigation') || lowercaseMessage.includes('water')) {
        botResponse = "For efficient water usage, drip irrigation can save 30-50% water compared to flood irrigation. Current soil moisture in your area is optimal for most crops.";
    }
    else if (lowercaseMessage.includes('thank')) {
        botResponse = "You're welcome! Feel free to ask if you need any other assistance with your farming activities.";
    }
    else {
        botResponse = "I'm here to help with crop recommendations, disease identification, weather forecasts, market prices, and agricultural practices. How can I assist you today?";
    }
    
    // Create bot message element
    const botMessageElement = createMessageElement('bot', botResponse);
    messagesContainer.appendChild(botMessageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update suggestions based on context
    updateSuggestions(lowercaseMessage);
}

/**
 * Update suggestion buttons based on conversation context
 * @param {string} context - Current message context
 */
function updateSuggestions(context) {
    const suggestionsContainer = document.querySelector('.chatbot-suggestions');
    let newSuggestions = [];
    
    if (context.includes('weather')) {
        newSuggestions = [
            "7-day forecast",
            "Rainfall prediction",
            "Best time to irrigate",
            "Weather alerts"
        ];
    }
    else if (context.includes('crop') && context.includes('disease')) {
        newSuggestions = [
            "Upload disease photo",
            "Common wheat diseases",
            "Preventive measures",
            "Organic treatments"
        ];
    }
    else if (context.includes('plant') || context.includes('sow')) {
        newSuggestions = [
            "Crop calendar",
            "Soil preparation",
            "Seed treatment",
            "Crop rotation tips"
        ];
    }
    else if (context.includes('price') || context.includes('market')) {
        newSuggestions = [
            "Price trends",
            "Nearby markets",
            "Best time to sell",
            "MSP details"
        ];
    }
    else if (context.includes('fertilizer') || context.includes('nutrient')) {
        newSuggestions = [
            "Organic options",
            "Application timing",
            "Soil testing",
            "Micronutrients"
        ];
    }
    else if (context.includes('subsidy') || context.includes('government')) {
        newSuggestions = [
            "PM-KISAN details",
            "Apply for subsidies",
            "Loan schemes",
            "Insurance options"
        ];
    }
    else {
        // Default suggestions
        newSuggestions = [
            "Weather forecast",
            "Crop recommendations",
            "Market prices",
            "Identify disease"
        ];
    }
    
    // Update suggestion buttons
    suggestionsContainer.innerHTML = '';
    
    newSuggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.className = 'suggestion-btn';
        button.textContent = suggestion;
        
        button.addEventListener('click', function() {
            sendUserMessage(this.textContent);
        });
        
        suggestionsContainer.appendChild(button);
    });
}




/**
 * Start voice input
 */
function startVoiceInput() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Create speech recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        // Change mic button appearance
        const micBtn = document.getElementById('chatbot-mic-btn');
        micBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
        micBtn.classList.add('recording');
        
        // Show toast notification
        showToast('Listening... Speak now', 'info');
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatbot-input-field').value = transcript;
            
            // Reset mic button
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            micBtn.classList.remove('recording');
            
            // Send the message after a short delay
            setTimeout(() => {
                sendMessage();
            }, 500);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            
            // Reset mic button
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            micBtn.classList.remove('recording');
            
            // Show error toast
            showToast('Could not recognize speech. Please try again.', 'error');
        };
        
        recognition.onend = function() {
            // Reset mic button if not already reset
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            micBtn.classList.remove('recording');
        };
    } else {
        // Show error toast if speech recognition not supported
        showToast('Speech recognition is not supported in your browser.', 'error');
    }
}

/**
 * Open camera for image capture
 */
function openCamera() {
    // Check if browser supports camera access
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'environment';
        
        // Listen for file selection
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                sendUserMessage(`I'm sending an image for analysis: ${file.name}`);
            }
        });
        
        // Trigger file selection
        fileInput.click();
    } else {
        // Show error toast if camera access not supported
        showToast('Camera access is not supported in your browser.', 'error');
    }
}

/**
 * Initialize government policies page
 */
function initPolicies() {
    // Policy data
    const policies = [
        {
            id: 1,
            title: "PM-KISAN Scheme",
            category: "subsidy",
            description: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
            date: "April 10, 2025",
            link: "#",
        },
        {
            id: 2,
            title: "Kisan Credit Card",
            category: "loan",
            description: "Provides farmers with affordable credit for their agricultural operations and other needs.",
            date: "March 15, 2025",
            link: "#",
        },
        {
            id: 3,
            title: "Pradhan Mantri Fasal Bima Yojana",
            category: "insurance",
            description: "Crop insurance scheme that provides coverage and financial support to farmers in case of crop failure.",
            date: "February 28, 2025",
            link: "#",
        },
        {
            id: 4,
            title: "Soil Health Card Scheme",
            category: "subsidy",
            description: "Provides information on soil health and recommends appropriate dosage of nutrients for improving soil health and fertility.",
            date: "January 20, 2025",
            link: "#",
        },
        {
            id: 5,
            title: "National Mission for Sustainable Agriculture",
            category: "program",
            description: "Promotes sustainable agriculture through climate change adaptation measures and resource conservation technologies.",
            date: "March 5, 2025",
            link: "#",
        },
        {
            id: 6,
            title: "Agricultural Infrastructure Fund",
            category: "loan",
            description: "Provides medium to long-term debt financing for investment in viable projects for post-harvest management infrastructure.",
            date: "April 5, 2025",
            link: "#",
        },
    ];
    
    // Populate policies grid
    const policiesGrid = document.getElementById('policies-grid');
    if (policiesGrid) {
        policiesGrid.innerHTML = policies.map(policy => `
            <div class="card policy-card" data-category="${policy.category}">
                <div class="card-content">
                    <span class="policy-category">${policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}</span>
                    <h4>${policy.title}</h4>
                    <p>${policy.description}</p>
                    <div class="policy-footer">
                        <span class="policy-date"><i class="fas fa-calendar"></i> ${policy.date}</span>
                        <a href="${policy.link}" class="link">Read More</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Policy filter buttons
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterPolicies(filter);
            
            showToast(`Showing ${filter === 'all' ? 'all policies' : filter + ' policies'}.`, 'info');
        });
    });
}

/**
 * Filter policies based on category
 * @param {string} category - Policy category
 */
function filterPolicies(category) {
    const policyCards = document.querySelectorAll('.policy-card');
    
    policyCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
