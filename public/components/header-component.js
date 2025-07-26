// Header Component with SWAPPIT Branding
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.setupDropdownHover();
    }

    // Función para obtener la ruta correcta del logo
    getLogoPath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/assets/logos/LogoSinFondo.png';
    }

    render() {
        const logoPath = this.getLogoPath();
        
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                
                :host {
                    display: block;
                    width: 100%;
                }
                
                /* CSS Variables */
                :host {
                    --swappit-blue: #3468c0;
                    --swappit-orange: #ffa424;
                    --swappit-blue-hover: #1d4ed8;
                    --swappit-orange-hover: #ff5722;
                    --neutral-dark: #1e293b;
                    --neutral-medium: #64748b;
                    --neutral-light: #f1f5f9;
                    --background-white: #ffffff;
                    --shadow-color: rgba(37, 99, 235, 0.1);
                    --font-primary: 'Poppins', sans-serif;
                    --font-secondary: 'Inter', sans-serif;
                }
                
                .header {
                    background: var(--background-white);
                    box-shadow: 0 4px 6px var(--shadow-color);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    height: 80px;
                    border-bottom: 1px solid rgba(37, 99, 235, 0.08);
                }
                
                .nav {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                /* Logo - Left side */
                .logo {
                    text-decoration: none;
                    flex-shrink: 0;
                    transition: transform 0.3s ease;
                    z-index: 10;
                }
                
                .logo:hover {
                    transform: translateY(-1px);
                }
                
                .logo img {
                    width: 140px;
                    height: auto;
                    display: block;
                }
                
                /* Menu - Center */
                .menu {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    margin: 0 2rem;
                }
                
                .menu a {
                    color: var(--neutral-dark);
                    text-decoration: none;
                    font-family: var(--font-primary);
                    font-weight: 400;
                    font-size: 0.95rem;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    overflow: hidden;
                    text-transform: capitalize;
                    letter-spacing: 0.2px;
                }
                
                /* Interesting underline effect */
                .menu a::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--swappit-blue), var(--swappit-orange));
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateX(-50%);
                    opacity: 0;
                    border-radius: 2px;
                }
                
                .menu a::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(52, 104, 192, 0.08), transparent);
                    transform: translateX(-50%) scaleX(0);
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .menu a:hover {
                    color: var(--swappit-blue);
                    transform: translateY(-1px);
                }
                
                .menu a:hover::before {
                    width: 80%;
                    opacity: 1;
                }
                
                .menu a:hover::after {
                    transform: translateX(-50%) scaleX(1);
                }
                
                .menu a.active {
                    color: var(--swappit-blue);
                    font-weight: 600;
                }
                
                .menu a.active::before {
                    width: 80%;
                    opacity: 1;
                }
                
                /* Right side - Auth buttons */
                .right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-shrink: 0;
                }
                
                /* Buttons */
                .buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .btn {
                    border: none;
                    border-radius: 50px;
                    padding: 0.5rem 1.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    font-family: var(--font-primary);
                    position: relative;
                    overflow: hidden;
                }
                
                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .btn:hover::before {
                    left: 100%;
                }
                
                .btn-signin {
                    background: transparent;
                    color: var(--swappit-blue);
                    border: 2px solid var(--swappit-blue);
                }
                
                .btn-signin:hover {
                    background: var(--swappit-blue);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }
                
                .btn-signup {
                    background: var(--swappit-orange);
                    color: white;
                    box-shadow: 0 2px 4px rgba(255, 164, 36, 0.3);
                }
                
                .btn-signup:hover {
                    background: var(--swappit-orange-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 164, 36, 0.4);
                }
                
                /* Mobile menu toggle */
                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: var(--neutral-dark);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }
                
                .mobile-toggle:hover {
                    background: var(--neutral-light);
                    color: var(--swappit-blue);
                }
                
                /* Responsive Design */
                @media (max-width: 991px) {
                    .menu {
                        display: none;
                    }
                    
                    .mobile-toggle {
                        display: block;
                    }
                    
                    .container {
                        justify-content: space-between;
                    }
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 0 0.5rem;
                    }
                    
                    .logo img {
                        width: 120px;
                    }
                    
                    .buttons {
                        gap: 0.5rem;
                    }
                    
                    .btn {
                        padding: 0.4rem 1rem;
                        font-size: 0.8rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .btn {
                        padding: 0.3rem 0.8rem;
                        font-size: 0.75rem;
                    }
                    
                    .logo img {
                        width: 100px;
                    }
                }
            </style>
            <style>
                /* Dropdown styles for Marketplace - Prada style */
                .dropdown-container {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-menu.wide {
                    display: none;
                    position: fixed;
                    left: 0;
                    top: 80px;
                    width: 100vw;
                    min-width: unset;
                    background: #fff;
                    box-shadow: 0 8px 32px rgba(37,99,235,0.12), 0 1.5px 6px rgba(0,0,0,0.04);
                    border-radius: 0 0 18px 18px;
                    padding: 205em max(8 20.5em) 20.5em max(8vw, 2.5rem);
                    z-index: 9999;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1), top 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                /* Removed CSS hover rule to let JavaScript handle the dropdown */
                .dropdown-grid {
                    display: flex;
                    flex-direction: row;
                    gap: 2.5rem;
                    align-items: flex-start;
                }
                .dropdown-col {
                    flex: 1 1 0;
                    min-width: 180px;
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }
                .image-col {
                    align-items: flex-start;
                    text-align: left;
                    justify-content: center;
                }
                .dropdown-image {
                    width: 120px;
                    height: auto;
                    border-radius: 12px;
                    margin-bottom: 0;
                    box-shadow: 0 2px 8px rgba(52,104,192,0.10);
                }
                .links-col {
                    align-items: flex-start;
                    text-align: left;
                    justify-content: center;
                }
                .desc-col {
                    align-items: flex-start;
                    text-align: left;
                    justify-content: center;
                }
                .dropdown-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--swappit-blue);
                    margin-bottom: 0.5rem;
                    font-family: var(--font-primary);
                }
                .dropdown-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.7rem;
                }
                .dropdown-list li a {
                    color: var(--neutral-dark);
                    text-decoration: none;
                    font-size: 1.05rem;
                    font-family: var(--font-secondary);
                    padding: 0.2rem 0.5rem;
                    border-radius: 6px;
                    transition: background 0.2s, color 0.2s;
                    display: block;
                }
                .dropdown-list li a:hover {
                    background: var(--swappit-blue);
                    color: #fff;
                }
                .dropdown-desc {
                    font-size: 0.98rem;
                    color: var(--neutral-dark);
                    margin-top: 0;
                    font-family: var(--font-secondary);
                }
                @media (max-width: 991px) {
                    .dropdown-menu.wide {
                        display: none !important;
                    }
                }
                .dropdown-grid.prada-style {
                    display: flex;
                    flex-direction: row;
                    gap: 3rem;
                    align-items: center;
                    justify-content: flex-start;
                }
                .dropdown-col.image-col {
                    flex: 0 0 340px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dropdown-image-large {
                    width: 150px;
                    max-height: 90;
                    height: auto;
                    border-radius: 14px;
                    box-shadow: 0px 8px rgba(52104,0.10);
                    object-fit: cover;
                }
                .dropdown-col.links-col {
                    flex: 1 1 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    min-width: 200px;
                }
                .dropdown-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--swappit-blue);
                    margin-bottom: 0.5rem;
                    font-family: var(--font-primary);
                }
                .dropdown-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.7rem;
                }
                .dropdown-list li a {
                    color: var(--neutral-dark);
                    text-decoration: none;
                    font-size: 1.05rem;
                    font-family: var(--font-secondary);
                    padding: 0.2rem 0.5rem;
                    border-radius: 6px;
                    transition: background 0.2s, color 0.2s;
                    display: block;
                }
                .dropdown-list li a:hover {
                    background: var(--swappit-blue);
                    color: #fff;
                }
                /* Dropdown controlled by JavaScript */
                .dropdown-menu.wide {
                    pointer-events: none;
                    display: none;
                    opacity: 0                }
            </style>
            
            <header class="header">
                <nav class="nav">
                    <div class="container">
                        <!-- Logo - Left -->
                        <a href="${this.getHomePath()}" class="logo">
                            <img src="${logoPath}" alt="SWAPPIT Logo">
                        </a>
                        
                        <!-- Navigation Menu - Center -->
                        <div class="menu">
                            <div class="dropdown-container">
                                <a href="${this.getHomePath()}" class="nav-link" id="homeLink">Home</a>
                                <div class="dropdown-menu wide" id="homeDropdown">
                                    <div class="dropdown-grid prada-style">
                                        <!-- Column 1: Large Image -->
                                        <div class="dropdown-col image-col">
                                            <img src="/assets/logos/LogoSinFondo.png" alt="SWAPPIT Home" class="dropdown-image-large">
                                        </div>
                                        <!-- Column 2: Title + Links -->
                                        <div class="dropdown-col links-col">
                                            <div class="dropdown-title">Home</div>
                                            <ul class="dropdown-list">
                                                <li><a href="${this.getHomePath()}#hero">Hero Section</a></li>
                                                <li><a href="${this.getHomePath()}#features>Features</a></li>
                                                <li><a href="${this.getHomePath()}#services>Services</a></li>
                                                <li><a href="${this.getHomePath()}#contact">Contact</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-container">
                                <a href="${this.getMarketplacePath()}" class="nav-link marketplace-link" id="marketplaceLink">Marketplace</a>
                                <div class="dropdown-menu wide" id="marketplaceDropdown">
                                    <div class="dropdown-grid prada-style">
                                        <!-- Column 1: Large Image -->
                                        <div class="dropdown-col image-col">
                                            <img src="/assets/logos/businesslogin.jpeg" alt="Marketplace Business" class="dropdown-image-large">
                                        </div>
                                        <!-- Column 2: Title + Links -->
                                        <div class="dropdown-col links-col">
                                            <div class="dropdown-title">Marketplace</div>
                                            <ul class="dropdown-list">
                                                <li><a href="${this.getMarketplacePath()}>View Products</a></li>
                                                <li><a href="${this.getMarketplacePath()}?action=add>Post a Product</a></li>
                                                <li><a href="${this.getMarketplacePath()}#categories>Categories</a></li>
                                                <li><a href="${this.getMarketplacePath()}#featured">Featured Products</a></li>
                                                <li><a href="${this.getMarketplacePath()}#bestsellers">Best Sellers</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-container">
                                <a href="${this.getAboutPath()}" class="nav-link" id="aboutLink">About Us</a>
                                <div class="dropdown-menu wide" id="aboutDropdown">
                                    <div class="dropdown-grid prada-style">
                                        <div class="dropdown-col image-col">
                                            <img src="/assets/logos/LogoSinFondo.png" alt="About Us" class="dropdown-image-large">
                                        </div>
                                        <div class="dropdown-col links-col">
                                            <div class="dropdown-title">About Us</div>
                                            <ul class="dropdown-list">
                                                <li><a href="${this.getAboutPath()}#mission">Mission</a></li>
                                                <li><a href="${this.getAboutPath()}#values">Values</a></li>
                                                <li><a href="${this.getAboutPath()}#story">Our Story</a></li>
                                                <li><a href="${this.getAboutPath()}#team">Team</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-container">
                                <a href="${this.getContactPath()}" class="nav-link" id="contactLink">Contact</a>
                                <div class="dropdown-menu wide" id="contactDropdown">
                                    <div class="dropdown-grid prada-style">
                                        <div class="dropdown-col image-col">
                                            <img src="/assets/logos/LogoSinFondo.png" alt="Contact" class="dropdown-image-large">
                                        </div>
                                        <div class="dropdown-col links-col">
                                            <div class="dropdown-title">Contact</div>
                                            <ul class="dropdown-list">
                                                <li><a href="${this.getContactPath()}#form">Contact Form</a></li>
                                                <li><a href="${this.getContactPath()}#info">Information</a></li>
                                                <li><a href="${this.getContactPath()}#hours">Business Hours</a></li>
                                                <li><a href="${this.getContactPath()}#social">Social Media</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Side - Auth Buttons -->
                        <div class="right">
                            <!-- Mobile Menu Toggle -->
                            <button class="mobile-toggle" id="mobileToggle">
                                <i class="fas fa-bars"></i>
                            </button>
                            
                            <!-- Auth Buttons -->
                            <div class="buttons">
                                <a href="${this.getLoginPath()}" class="btn btn-signin">
                                    Sign In
                                </a>
                                <a href="${this.getRegisterPath()}" class="btn btn-signup">
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    // Función para obtener la ruta del home
    getHomePath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/index.html';
    }

    // Función para obtener la ruta del marketplace
    getMarketplacePath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/pages/marketplace/marketplace-page.html';
    }

    // Función para obtener la ruta del login
    getLoginPath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/pages/auth/login.html';
    }

    // Función para obtener la ruta del register
    getRegisterPath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/pages/auth/register.html';
    }

    getAboutPath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/pages/about/about.html';
    }
    getContactPath() {
        // Para Firebase Hosting, siempre usar rutas absolutas
        return '/pages/contact/contact.html';
    }

    attachEventListeners() {
        // Mobile menu toggle
        const mobileToggle = this.shadowRoot.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                // For now, just show an alert. You can implement a mobile menu later
                alert('Menú móvil - Funcionalidad en desarrollo');
            });
        }
        
        // Active link highlighting
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
            });
        });
        
        // Set active link based on current page
        this.setActiveLink();
    }

    setupDropdownHover() {
        const shadow = this.shadowRoot;
        
        // Setup for Home dropdown
        const homeContainer = shadow.querySelector('.dropdown-container:first-of-type');
        const homeDropdown = shadow.getElementById('homeDropdown');
        
        // Setup for Marketplace dropdown
        const marketplaceContainer = shadow.querySelector('.dropdown-container:nth-of-type(2)'); // Changed to nth-of-type(2)
        const marketplaceDropdown = shadow.getElementById('marketplaceDropdown');

        // Setup for About dropdown
        const aboutContainer = shadow.querySelector('.dropdown-container:nth-of-type(3)'); // Changed to nth-of-type(3)
        const aboutDropdown = shadow.getElementById('aboutDropdown');

        // Setup for Contact dropdown
        const contactContainer = shadow.querySelector('.dropdown-container:last-of-type'); // Changed to last-of-type
        const contactDropdown = shadow.getElementById('contactDropdown');
        
        // Function to setup dropdown behavior
        const setupDropdown = (container, dropdown) => {
            if (!container || !dropdown) return;
            
            let showTimer = null;
            let hideTimer = null;
            let isVisible = false;

            const showDropdown = () => {
                clearTimeout(hideTimer);
                if (!isVisible) {
                    dropdown.style.display = 'block';
                    dropdown.style.opacity = '1';
                    dropdown.style.pointerEvents = 'auto';
                    isVisible = true;
                }
            };

            const hideDropdown = () => {
                clearTimeout(showTimer);
                if (isVisible) {
                    dropdown.style.opacity = '0';
                    dropdown.style.pointerEvents = 'none';
                    hideTimer = setTimeout(() => {
                        dropdown.style.display = 'none';
                        isVisible = false;
                    }, 200);
                }
            };

            // Events for container (button)
            container.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
                showTimer = setTimeout(showDropdown, 100); // 0.1 seconds
            });

            container.addEventListener('mouseleave', () => {
                clearTimeout(showTimer);
                hideTimer = setTimeout(hideDropdown, 50);
            });

            // Events for dropdown
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
                clearTimeout(showTimer);
                showDropdown();
            });

            dropdown.addEventListener('mouseleave', () => {
                hideTimer = setTimeout(hideDropdown, 50);
            });

            // Ensure dropdown is hidden initially
            dropdown.style.display = 'none';
            dropdown.style.opacity = '0';
            dropdown.style.pointerEvents = 'none';
        };

        // Setup all dropdowns
        setupDropdown(homeContainer, homeDropdown);
        setupDropdown(marketplaceContainer, marketplaceDropdown);
        setupDropdown(aboutContainer, aboutDropdown);
        setupDropdown(contactContainer, contactDropdown);
    }
    
    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath.includes('index.html') && href.includes('index.html')) ||
                (currentPath.includes('marketplace') && href.includes('marketplace'))) {
                link.classList.add('active');
            }
        });
    }
}

// Registrar el componente
customElements.define('header-component', HeaderComponent); 