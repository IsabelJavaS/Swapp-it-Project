// Header Component Simple
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
                :host {
                    display: block;
                    width: 100%;
                }
                
                .header {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    height: 80px;
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
                
                /* Logo */
                .logo {
                    text-decoration: none;
                    flex-shrink: 0;
                }
                
                .logo img {
                    width: 140px;
                    height: auto;
                    display: block;
                }
                
                /* Menu */
                .menu {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    flex: 1;
                    margin: 0 2rem;
                }
                
                .menu a {
                    color: #1f2937;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1.1rem;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: background 0.2s, color 0.2s;
                    white-space: nowrap;
                }
                
                .menu a:hover {
                    background: #f3f4f6;
                    color: #2563eb;
                }
                
                /* Right side */
                .right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-shrink: 0;
                }
                
                /* Search */
                .search {
                    position: relative;
                    margin-right: 1rem;
                }
                
                .search-btn {
                    background: none;
                    border: none;
                    color: #1f2937;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                
                .search-btn:hover {
                    background: #f3f4f6;
                }
                
                .search-input {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    opacity: 0;
                    border: 1px solid #e5e7eb;
                    border-radius: 25px;
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                    background: #fff;
                    transition: width 0.3s, opacity 0.3s;
                    z-index: 10;
                }
                
                .search.active .search-input {
                    width: 200px;
                    opacity: 1;
                }
                
                /* Buttons */
                .buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .btn {
                    border: none;
                    border-radius: 25px;
                    padding: 0.5rem 1.25rem;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                }
                
                .btn-signin {
                    background: #f3f4f6;
                    color: #2563eb;
                }
                
                .btn-signin:hover {
                    background: #2563eb;
                    color: white;
                }
                
                .btn-signup {
                    background: #2563eb;
                    color: white;
                }
                
                .btn-signup:hover {
                    background: #1d4ed8;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .menu {
                        display: none;
                    }
                    
                    .right {
                        gap: 0.5rem;
                    }
                    
                    .search {
                        margin-right: 0.5rem;
                    }
                    
                    .logo img {
                        width: 120px;
                    }
                }
                
                @media (max-width: 480px) {
                    .buttons {
                        gap: 0.5rem;
                    }
                    
                    .btn {
                        padding: 0.5rem 0.75rem;
                        font-size: 0.85rem;
                    }
                    
                    .logo img {
                        width: 100px;
                    }
                }
            </style>
            
            <header class="header">
                <nav class="nav">
                    <div class="container">
                        <!-- Logo -->
                        <a class="logo" href="${this.getHomePath()}">
                            <img src="${logoPath}" alt="Logo Swapp-it">
                        </a>
                        
                        <!-- Menu -->
                        <div class="menu">
                            <a href="${this.getHomePath()}">Home</a>
                            <a href="${this.getMarketplacePath()}">Marketplace</a>
                            <a href="${this.getHomePath()}#about">About Us</a>
                            <a href="${this.getHomePath()}#contact">Contact</a>
                        </div>
                        
                        <!-- Right -->
                        <div class="right">
                            <!-- Search -->
                            <div class="search" id="search">
                                <button class="search-btn" id="searchBtn">
                                    <i class="fas fa-search"></i>
                                </button>
                                <input type="text" class="search-input" id="searchInput" placeholder="Search products...">
                            </div>
                            
                            <!-- Buttons -->
                            <div class="buttons">
                                <a href="${this.getLoginPath()}" class="btn btn-signin">Sign In</a>
                                <a href="${this.getRegisterPath()}" class="btn btn-signup">Sign Up</a>
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
        // Search functionality
        const search = this.shadowRoot.getElementById('search');
        const searchBtn = this.shadowRoot.getElementById('searchBtn');
        const searchInput = this.shadowRoot.getElementById('searchInput');
        
        if (searchBtn && search && searchInput) {
            searchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                search.classList.toggle('active');
                if (search.classList.contains('active')) {
                    searchInput.focus();
                }
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.shadowRoot.contains(e.target)) {
                    search.classList.remove('active');
                }
            });
            
            // Enter to search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    search.classList.remove('active');
                }
            });
        }
    }
}

// Registrar el componente
customElements.define('header-component', HeaderComponent); 