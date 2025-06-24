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
                // Get header height for offset
                const headerHeight = document.querySelector('.navbar-custom').offsetHeight;
                
                // Calculate scroll position
                const scrollPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const headerHeight = document.querySelector('.navbar-custom').offsetHeight;

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
    console.log('Testing connections...');
    
    // Test backend
    if (window.api) {
        const backendTest = await window.api.testBackend();
        console.log('Backend test:', backendTest);
        
        const firebaseTest = await window.api.testFirebase();
        console.log('Firebase test:', firebaseTest);
    } else {
        console.log('API module not loaded');
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
                window.location.href = '/products';
            } else {
                window.location.href = '/register';
            }
        });
    }

    // Browse Items button
    const browseItemsBtn = document.querySelector('.btn-secondary-large');
    if (browseItemsBtn) {
        browseItemsBtn.addEventListener('click', function() {
            window.location.href = '/products';
        });
    }

    // Register as Business button
    const businessBtn = document.querySelector('.cta-buttons .btn-primary-large');
    if (businessBtn) {
        businessBtn.addEventListener('click', function() {
            window.location.href = '/register';
        });
    }
}

// Check if user is logged in (you can implement this based on your auth system)
function isUserLoggedIn() {
    // For now, return false - you can implement this with your auth system
    return false;
}