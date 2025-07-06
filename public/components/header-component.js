// Header Component with SWAPPIT Branding
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    // Función para obtener la ruta correcta del logo
    getLogoPath() {
        const currentPath = window.location.pathname;
        
        // Detectar si estamos usando Live Server (puerto 5500 o 3000)
        const isLiveServer = window.location.port === '5500' || window.location.port === '3000' || window.location.port === '8080';
        
        if (isLiveServer) {
            // Con Live Server, las rutas son desde la raíz del proyecto
            return '/public/assets/logos/LogoSinFondo.png';
        }
        
        // Con servidor Python normal
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        // Si estamos en la raíz (index.html)
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1] === 'index.html') {
            return 'assets/logos/LogoSinFondo.png';
        }
        
        // Si estamos en una subcarpeta, necesitamos subir niveles
        const levelsUp = pathSegments.length - 1; // -1 porque no contamos el archivo
        const prefix = '../'.repeat(levelsUp);
        return `${prefix}assets/logos/LogoSinFondo.png`;
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
            
            <header class="header">
                <nav class="nav">
                    <div class="container">
                        <!-- Logo - Left -->
                        <a href="${this.getHomePath()}" class="logo">
                            <img src="${logoPath}" alt="SWAPPIT Logo">
                        </a>
                        
                        <!-- Navigation Menu - Center -->
                        <div class="menu">
                            <a href="${this.getHomePath()}" class="nav-link">Home</a>
                            <a href="${this.getMarketplacePath()}" class="nav-link">Marketplace</a>
                            <a href="#about" class="nav-link">About Us</a>
                            <a href="#contact" class="nav-link">Contact</a>
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
        const isLiveServer = window.location.port === '5500' || window.location.port === '3000' || window.location.port === '8080';
        
        if (isLiveServer) {
            return '/public/index.html';
        }
        
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1] === 'index.html') {
            return 'index.html';
        }
        
        const levelsUp = pathSegments.length - 1;
        const prefix = '../'.repeat(levelsUp);
        return `${prefix}index.html`;
    }

    // Función para obtener la ruta del marketplace
    getMarketplacePath() {
        const isLiveServer = window.location.port === '5500' || window.location.port === '3000' || window.location.port === '8080';
        
        if (isLiveServer) {
            return '/public/pages/marketplace/marketplace-page.html';
        }
        
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1] === 'index.html') {
            return 'pages/marketplace/marketplace-page.html';
        }
        
        const levelsUp = pathSegments.length - 1;
        const prefix = '../'.repeat(levelsUp);
        return `${prefix}pages/marketplace/marketplace-page.html`;
    }

    // Función para obtener la ruta del login
    getLoginPath() {
        const isLiveServer = window.location.port === '5500' || window.location.port === '3000' || window.location.port === '8080';
        
        if (isLiveServer) {
            return '/public/pages/auth/login.html';
        }
        
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1] === 'index.html') {
            return 'pages/auth/login.html';
        }
        
        const levelsUp = pathSegments.length - 1;
        const prefix = '../'.repeat(levelsUp);
        return `${prefix}pages/auth/login.html`;
    }

    // Función para obtener la ruta del register
    getRegisterPath() {
        const isLiveServer = window.location.port === '5500' || window.location.port === '3000' || window.location.port === '8080';
        
        if (isLiveServer) {
            return '/public/pages/auth/register.html';
        }
        
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1] === 'index.html') {
            return 'pages/auth/register.html';
        }
        
        const levelsUp = pathSegments.length - 1;
        const prefix = '../'.repeat(levelsUp);
        return `${prefix}pages/auth/register.html`;
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