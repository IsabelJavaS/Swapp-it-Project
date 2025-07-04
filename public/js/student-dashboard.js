// Student Dashboard Navigation and Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Dashboard initialized');
    
    // Wait a bit for components to load
    setTimeout(() => {
        // Initialize navigation
        initializeNavigation();
        
        // Load default section (dashboard)
        loadSection('dashboard');
        
        // Initialize sidebar collapse functionality
        initializeSidebarCollapse();
        
        addStatCardRippleEffect();
        addActivityItemRippleEffect();
    }, 100);
});

// Initialize navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-section]');
    
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        console.log('Setting up event listener for:', link.getAttribute('data-section'));
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('data-section'));
            
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get section name
            const sectionName = this.getAttribute('data-section');
            console.log('Loading section:', sectionName);
            
            // Load the section
            loadSection(sectionName);
        });
    });
}

// Load section content dynamically
async function loadSection(sectionName) {
    const mainContent = document.getElementById('dashboard-main');
    
    if (!mainContent) {
        console.error('Main content container not found');
        return;
    }
    
    try {
        // Show loading state
        mainContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading ${sectionName}...</p>
            </div>
        `;
        
        // Load section content
        const sectionUrl = `${sectionName}.html`;
        console.log('Fetching section from:', sectionUrl);
        const response = await fetch(sectionUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        
        // Update main content
        mainContent.innerHTML = content;
        
        // Re-initialize navigation after content is loaded
        initializeNavigation();
        
        // Initialize section-specific functionality
        initializeSectionFunctionality(sectionName);
        
        // Aplica el ripple si es dashboard
        if (sectionName === 'dashboard') {
            addStatCardRippleEffect();
            addActivityItemRippleEffect();
        }
        
        console.log(`Section ${sectionName} loaded successfully`);
        
    } catch (error) {
        console.error('Error loading section:', error);
        mainContent.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error Loading Section</h4>
                <p>Sorry, there was an error loading the ${sectionName} section.</p>
                <hr>
                <p class="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
        `;
    }
}

// Initialize section-specific functionality
function initializeSectionFunctionality(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            initializeDashboardCharts();
            break;
        case 'add-product':
            initializeAddProductForm();
            break;
        case 'my-products':
            initializeMyProducts();
            break;
        case 'profile':
            initializeProfileForm();
            break;
        case 'settings':
            initializeSettings();
            break;
        case 'notifications':
            initializeNotifications();
            break;
        case 'purchases':
            initializePurchases();
            break;
        case 'sales':
            initializeSales();
            break;
        default:
            console.log(`No specific initialization for section: ${sectionName}`);
    }
}

// Initialize dashboard charts
function initializeDashboardCharts() {
    console.log('Initializing dashboard charts...');
    
    // Check if ApexCharts is available
    if (typeof ApexCharts !== 'undefined') {
        // Sales Chart
        const salesChartOptions = {
            series: [{
                name: 'Sales',
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
            }],
            chart: {
                type: 'area',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        };
        
        const salesChart = new ApexCharts(document.querySelector("#salesChart"), salesChartOptions);
        salesChart.render();
        
        // Categories Chart
        const categoriesChartOptions = {
            series: [44, 55, 13, 43, 22],
            chart: {
                type: 'pie',
                height: 350
            },
            labels: ['Books', 'Electronics', 'Clothing', 'Sports', 'Other'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        
        const categoriesChart = new ApexCharts(document.querySelector("#categoriesChart"), categoriesChartOptions);
        categoriesChart.render();
    } else {
        console.warn('ApexCharts not available');
    }
}

// Initialize add product form
function initializeAddProductForm() {
    console.log('Initializing add product form...');
    
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Product form submitted');
            // Add form submission logic here
        });
    }
}

// Initialize my products
function initializeMyProducts() {
    console.log('Initializing my products...');
    // Add products management logic here
}

// Initialize profile form
function initializeProfileForm() {
    console.log('Initializing profile form...');
    
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Profile form submitted');
            // Add form submission logic here
        });
    }
}

// Initialize settings
function initializeSettings() {
    console.log('Initializing settings...');
    // Add settings logic here
}

// Initialize notifications
function initializeNotifications() {
    console.log('Initializing notifications...');
    // Add notifications logic here
}

// Initialize purchases
function initializePurchases() {
    console.log('Initializing purchases...');
    // Add purchases logic here
}

// Initialize sales
function initializeSales() {
    console.log('Initializing sales...');
    // Add sales logic here
}

// Initialize sidebar collapse functionality
function initializeSidebarCollapse() {
    const collapseButton = document.getElementById('collapseButton');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.getElementById('dashboard-main');
    const footer = document.querySelector('.dashboard-footer');
    
    if (collapseButton && sidebar && mainContent && footer) {
        collapseButton.addEventListener('click', function() {
            console.log('Sidebar collapse button clicked');
            
            // Toggle collapsed state
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            footer.classList.toggle('expanded');
            
            // Update button icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-angles-left');
                icon.classList.toggle('fa-angles-right');
            }
            
            // Log current state
            console.log('Sidebar collapsed:', sidebar.classList.contains('collapsed'));
            console.log('Main expanded:', mainContent.classList.contains('expanded'));
            console.log('Footer expanded:', footer.classList.contains('expanded'));
        });
    } else {
        console.warn('Some elements not found for sidebar collapse:', {
            collapseButton: !!collapseButton,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            footer: !!footer
        });
    }
}

function addStatCardRippleEffect() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            card.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

function addActivityItemRippleEffect() {
    document.querySelectorAll('.activity-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = item.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            item.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
} 