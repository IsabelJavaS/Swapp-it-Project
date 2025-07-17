import { AppConfig } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Test backend and Firebase connections
    testConnections();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get header height for offset (Web Component compatible)
                const appHeader = document.querySelector('app-header');
                const shadowHeader = appHeader?.shadowRoot?.querySelector('.marketplace-header');
                const headerHeight = shadowHeader ? shadowHeader.offsetHeight : 0;
                
                // Calculate scroll position
                const scrollPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        // Get header height for offset (Web Component compatible)
        const appHeader = document.querySelector('app-header');
        const shadowHeader = appHeader?.shadowRoot?.querySelector('.marketplace-header');
        const headerHeight = shadowHeader ? shadowHeader.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Section animations with Intersection Observer
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add click handlers for CTA buttons
    setupCTAButtons();
});

// Test backend and Firebase connections
async function testConnections() {
    if (AppConfig.isDebugMode()) {
        console.log('🔧 Testing connections...');
        console.log('📍 Environment:', AppConfig.isDevelopment() ? 'Development' : 'Production');
        console.log('🌐 Base URL:', AppConfig.getBaseUrl());
    }
    
    // Test backend
    if (window.api) {
        try {
            const backendTest = await window.api.testBackend();
            if (AppConfig.isDebugMode()) {
                console.log('✅ Backend test:', backendTest);
            }
        } catch (error) {
            console.warn('⚠️ Backend test failed:', error);
        }
        
        try {
            const firebaseTest = await window.api.testFirebase();
            if (AppConfig.isDebugMode()) {
                console.log('✅ Firebase test:', firebaseTest);
            }
        } catch (error) {
            console.warn('⚠️ Firebase test failed:', error);
        }
    } else {
        if (AppConfig.isDebugMode()) {
            console.log('ℹ️ API module not loaded');
        }
    }
}

// Setup CTA button handlers
function setupCTAButtons() {
    // Start Selling button
    const startSellingBtn = document.querySelector('.btn-primary-large');
    if (startSellingBtn) {
        startSellingBtn.addEventListener('click', function() {
            // Check if user is logged in
            if (isUserLoggedIn()) {
                window.location.href = AppConfig.getMarketplacePath();
            } else {
                window.location.href = AppConfig.getRegisterPath();
            }
        });
    }

    // Browse Items button
    const browseItemsBtn = document.querySelector('.btn-secondary-large');
    if (browseItemsBtn) {
        browseItemsBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getMarketplacePath();
        });
    }

    // Register as Business button
    const businessBtn = document.querySelector('.cta-buttons .btn-primary-large');
    if (businessBtn) {
        businessBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getRegisterPath();
        });
    }

    // Log In button
    const loginBtn = document.querySelector('.btn-secondary-large');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getLoginPath();
        });
    }
}

// Check if user is logged in (you can implement this based on your auth system)
function isUserLoggedIn() {
    // For now, return false - you can implement this with your auth system
    return false;
}

// Función helper para obtener la altura del header (compatible con Web Components)
export function getHeaderHeight() {
    const appHeader = document.querySelector('app-header');
    if (!appHeader) return 0;
    
    const shadowHeader = appHeader.shadowRoot?.querySelector('.marketplace-header');
    return shadowHeader ? shadowHeader.offsetHeight : 0;
}

// Función helper para scroll suave a una sección
export function smoothScrollToSection(sectionId, offset = 0) {
    const targetSection = document.querySelector(sectionId);
    if (!targetSection) return;
    
    const headerHeight = getHeaderHeight();
    const scrollPosition = targetSection.offsetTop - headerHeight - offset;
    
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}