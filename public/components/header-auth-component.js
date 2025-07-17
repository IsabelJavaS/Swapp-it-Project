// Authenticated Header Component for SWAPPIT
class HeaderAuthComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isSearchOpen = false;
        this.isDropdownOpen = false;
        this.userData = null;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.initializeAuth();
    }

    // Initialize Firebase Auth
    async initializeAuth() {
        try {
            // Use existing Firebase configuration
            const { auth } = await import('/public/firebase/config.js');
            const { onAuthStateChange } = await import('/public/firebase/auth.js');
            
            onAuthStateChange((user) => {
                if (user) {
                    this.userData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0],
                        photoURL: user.photoURL || null
                    };
                    this.updateUserInterface();
                } else {
                    // Redirect to landing page if not authenticated
                    window.location.href = '/public/index.html';
                }
            });
            
            // Check current user immediately
            const currentUser = auth.currentUser;
            if (currentUser) {
                this.userData = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName || currentUser.email.split('@')[0],
                    photoURL: currentUser.photoURL || null
                };
                this.updateUserInterface();
            }
            
        } catch (error) {
            console.error('Error initializing auth:', error);
            // Redirect to landing page on error
            window.location.href = '/public/index.html';
        }
    }

    // Update UI with user data
    updateUserInterface() {
        const userAvatar = this.shadowRoot.querySelector('.user-avatar img');
        const userName = this.shadowRoot.querySelector('.user-name');
        const userEmail = this.shadowRoot.querySelector('.user-email');
        const dropdownUserName = this.shadowRoot.querySelector('.dropdown-header .user-name');
        const dropdownUserEmail = this.shadowRoot.querySelector('.dropdown-header .user-email');
        
        if (userAvatar && this.userData) {
            if (this.userData.photoURL) {
                userAvatar.src = this.userData.photoURL;
            } else {
                // Generate avatar from initials
                userAvatar.src = this.generateAvatarFromName(this.userData.displayName);
            }
            userAvatar.alt = `${this.userData.displayName} Avatar`;
        }
        
        if (userName && this.userData) {
            userName.textContent = this.userData.displayName;
        }
        
        if (userEmail && this.userData) {
            userEmail.textContent = this.userData.email;
        }
        
        // Update dropdown header as well
        if (dropdownUserName && this.userData) {
            dropdownUserName.textContent = this.userData.displayName;
        }
        
        if (dropdownUserEmail && this.userData) {
            dropdownUserEmail.textContent = this.userData.email;
        }
    }

    // Generate avatar from user name
    generateAvatarFromName(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        // Clean and process the name
        const cleanName = name ? name.trim() : 'U';
        const initials = this.getInitials(cleanName);
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 40, 40);
        gradient.addColorStop(0, '#3468c0');
        gradient.addColorStop(1, '#ffa424');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 40, 40);
        
        // Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials.toUpperCase(), 20, 20);
        
        return canvas.toDataURL();
    }
    
    // Get initials from name
    getInitials(name) {
        if (!name || name.length === 0) return 'U';
        
        const words = name.split(' ').filter(word => word.length > 0);
        
        if (words.length === 0) return 'U';
        
        if (words.length === 1) {
            return words[0].charAt(0);
        }
        
        // Return first letter of first and last name
        return words[0].charAt(0) + words[words.length - 1].charAt(0);
    }

    // Get logo path
    getLogoPath() {
        return window.pathConfig ? window.pathConfig.getLogoPath() : '../../assets/logos/LogoSinFondo.png';
    }

    // Get paths
    getMarketplacePath() {
        return window.pathConfig ? window.pathConfig.getMarketplacePath() : '../../pages/marketplace/marketplace-page.html';
    }

    getDashboardPath() {
        // Intentar obtener el rol del usuario desde el perfil global
        let role = null;
        if (window.userProfile && window.userProfile.role) {
            role = window.userProfile.role;
        } else if (window.localStorage.getItem('userRole')) {
            role = window.localStorage.getItem('userRole');
        } else if (window.sessionStorage.getItem('userRole')) {
            role = window.sessionStorage.getItem('userRole');
        }
        if (window.pathConfig) {
            if (role === 'business') {
                return window.pathConfig.getBusinessDashboardPath();
            } else {
                return window.pathConfig.getStudentDashboardPath();
            }
        }
        // Fallback
        if (role === 'business') {
            return '../../dashboards/business/business-dashboard.html';
        } else {
            return '../../dashboards/student/student-dashboard.html';
        }
    }

    getLoginPath() {
        return window.pathConfig ? window.pathConfig.getLoginPath() : '../../pages/auth/login.html';
    }

    getSwapcoinInfoPath() {
        return window.pathConfig ? window.pathConfig.getSwapcoinInfoPath() : '../../pages/swapcoin/info.html';
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
                    --border-radius: 6px;
                    --transition: all 0.3s ease;
                }
                
                .header {
                    background: var(--background-white);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    height: 80px;
                    border-bottom: 1px solid rgba(37, 99, 235, 0.08);
                    backdrop-filter: blur(10px);
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
                
                /* Logo - Left */
                .logo {
                    text-decoration: none;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    padding: 0.5rem 0;
                }
                
                .logo:hover {
                    transform: translateY(-1px);
                }
                
                .logo img {
                    width: 140px;
                    height: auto;
                    display: block;
                    object-fit: contain;
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
                
                /* Menu hover effects */
                .menu a::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--swappit-blue), var(--swappit-orange));
                    transition: var(--transition);
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
                    transition: var(--transition);
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
                
                /* Right side */
                .right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-shrink: 0;
                }
                
                /* Search */
                .search-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .search-btn {
                    background: none;
                    border: none;
                    color: var(--neutral-dark);
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    transition: var(--transition);
                    position: relative;
                    z-index: 2;
                }
                
                .search-btn:hover {
                    background: var(--neutral-light);
                    color: var(--swappit-blue);
                    transform: scale(1.05);
                }
                
                .search-input {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    opacity: 0;
                    border: 2px solid var(--swappit-blue);
                    border-radius: 25px;
                    padding: 0.75rem 1rem;
                    font-size: 0.95rem;
                    background: var(--background-white);
                    transition: var(--transition);
                    z-index: 1;
                    font-family: var(--font-secondary);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.15);
                }
                
                .search-container.active .search-input {
                    width: 280px;
                    opacity: 1;
                }
                
                .search-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }
                
                /* SWAPPIT Coins */
                .coins-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, var(--swappit-orange), #ff8c00);
                    border-radius: 25px;
                    color: white;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 2px 8px rgba(255, 164, 36, 0.3);
                    transition: var(--transition);
                    text-decoration: none;
                    cursor: pointer;
                }
                
                .coins-container:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 164, 36, 0.4);
                    color: white;
                    text-decoration: none;
                }
                
                .coins-icon {
                    font-size: 1rem;
                }
                
                /* User Avatar */
                .user-container {
                    position: relative;
                }
                
                .user-avatar {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: var(--transition);
                    border: 2px solid transparent;
                }
                
                .user-avatar:hover {
                    background: var(--neutral-light);
                    border-color: var(--swappit-blue);
                }
                
                .user-avatar img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--swappit-blue);
                }
                
                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .user-name {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--neutral-dark);
                    line-height: 1.2;
                }
                
                .user-email {
                    font-family: var(--font-secondary);
                    font-size: 0.75rem;
                    color: var(--neutral-medium);
                    line-height: 1.2;
                }
                
                .dropdown-arrow {
                    color: var(--neutral-medium);
                    font-size: 0.8rem;
                    transition: var(--transition);
                }
                
                .user-container.active .dropdown-arrow {
                    transform: rotate(180deg);
                }
                
                /* Dropdown Menu */
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 0.5rem;
                    background: var(--background-white);
                    border-radius: var(--border-radius);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    min-width: 220px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: var(--transition);
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }
                
                .user-container.active .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .dropdown-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--neutral-light);
                    text-align: center;
                }
                
                .dropdown-header .user-name {
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }
                
                .dropdown-header .user-email {
                    font-size: 0.8rem;
                }
                
                .dropdown-list {
                    padding: 0.5rem 0;
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: var(--neutral-dark);
                    text-decoration: none;
                    font-family: var(--font-secondary);
                    font-size: 0.9rem;
                    transition: var(--transition);
                    border-left: 3px solid transparent;
                }
                
                .dropdown-item:hover {
                    background: var(--neutral-light);
                    color: var(--swappit-blue);
                    border-left-color: var(--swappit-blue);
                }
                
                .dropdown-item i {
                    width: 16px;
                    text-align: center;
                    color: var(--neutral-medium);
                }
                
                .dropdown-item:hover i {
                    color: var(--swappit-blue);
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: var(--neutral-light);
                    margin: 0.5rem 0;
                }
                
                .dropdown-item.logout {
                    color: #dc2626;
                }
                
                .dropdown-item.logout:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }
                
                .dropdown-item.logout i {
                    color: #dc2626;
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
                    border-radius: var(--border-radius);
                    transition: var(--transition);
                }
                
                .mobile-toggle:hover {
                    background: var(--neutral-light);
                    color: var(--swappit-blue);
                }
                
                /* Responsive Design */
                @media (max-width: 1024px) {
                    .menu {
                        gap: 2rem;
                        margin: 0 2rem;
                    }
                    
                    .search-container.active .search-input {
                        width: 240px;
                    }
                }
                
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
                    
                    .user-info {
                        display: none;
                    }
                    
                    .search-container.active .search-input {
                        width: 200px;
                    }
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 0 1rem;
                    }
                    
                    .logo img {
                        width: 120px;
                    }
                    
                    .right {
                        gap: 1rem;
                    }
                    
                    .coins-container {
                        padding: 0.4rem 0.8rem;
                        font-size: 0.8rem;
                    }
                    
                    .search-container.active .search-input {
                        width: 160px;
                    }
                }
                
                @media (max-width: 480px) {
                    .coins-container {
                        display: none;
                    }
                    
                    .search-container.active .search-input {
                        width: 140px;
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
                        <a href="${this.getDashboardPath()}" class="logo">
                            <img src="${logoPath}" alt="SWAPPIT Logo">
                        </a>
                        
                        <!-- Navigation Menu - Center -->
                        <div class="menu">
                            <a href="${this.getDashboardPath()}" class="nav-link">Dashboard</a>
                            <a href="${this.getMarketplacePath()}" class="nav-link">Marketplace</a>
                            <a href="#support" class="nav-link">Support</a>
                            <a href="#faq" class="nav-link">FAQ</a>
                        </div>
                        
                        <!-- Right Side -->
                        <div class="right">
                            <!-- Search -->
                            <div class="search-container">
                                <button class="search-btn" id="searchBtn">
                                    <i class="fas fa-search"></i>
                                </button>
                                <input type="text" class="search-input" placeholder="Search products, users..." id="searchInput">
                            </div>
                            
                            <!-- SWAPPIT Coins -->
                            <a href="${this.getSwapcoinInfoPath()}" class="coins-container">
                                <i class="fas fa-coins coins-icon"></i>
                                <span>1,250</span>
                            </a>
                            
                            <!-- Mobile Menu Toggle -->
                            <button class="mobile-toggle" id="mobileToggle">
                                <i class="fas fa-bars"></i>
                            </button>
                            
                            <!-- User Avatar & Dropdown -->
                            <div class="user-container" id="userContainer">
                                <div class="user-avatar" id="userAvatar">
                                    <img src="" alt="User Avatar" id="userAvatarImg">
                                    <div class="user-info">
                                        <div class="user-name">Loading...</div>
                                        <div class="user-email">user@example.com</div>
                                    </div>
                                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                                </div>
                                
                                <!-- Dropdown Menu -->
                                <div class="dropdown-menu" id="dropdownMenu">
                                    <div class="dropdown-header">
                                        <div class="user-name">Loading...</div>
                                        <div class="user-email">user@example.com</div>
                                    </div>
                                    <div class="dropdown-list">
                                        <a href="${this.getDashboardPath()}" class="dropdown-item">
                                            <i class="fas fa-tachometer-alt"></i>
                                            Dashboard
                                        </a>
                                        <a href="#profile" class="dropdown-item">
                                            <i class="fas fa-user"></i>
                                            Profile
                                        </a>
                                        <a href="#settings" class="dropdown-item">
                                            <i class="fas fa-cog"></i>
                                            Settings
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#help" class="dropdown-item">
                                            <i class="fas fa-question-circle"></i>
                                            Help & Support
                                        </a>
                                        <a href="#" class="dropdown-item logout" id="logoutBtn">
                                            <i class="fas fa-sign-out-alt"></i>
                                            Sign Out
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    attachEventListeners() {
        // Search functionality
        const searchContainer = this.shadowRoot.querySelector('.search-container');
        const searchBtn = this.shadowRoot.getElementById('searchBtn');
        const searchInput = this.shadowRoot.getElementById('searchInput');
        
        if (searchBtn && searchContainer && searchInput) {
            searchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSearch();
            });
            
            // Close search on outside click
            document.addEventListener('click', (e) => {
                if (!this.shadowRoot.contains(e.target)) {
                    this.closeSearch();
                }
            });
            
            // Handle search input
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
            
            searchInput.addEventListener('input', (e) => {
                // Real-time search suggestions could be implemented here
                this.handleSearchInput(e.target.value);
            });
        }
        
        // User dropdown functionality
        const userContainer = this.shadowRoot.getElementById('userContainer');
        const userAvatar = this.shadowRoot.getElementById('userAvatar');
        const dropdownMenu = this.shadowRoot.getElementById('dropdownMenu');
        
        if (userAvatar && dropdownMenu) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
            
            // Close dropdown on outside click
            document.addEventListener('click', (e) => {
                if (!this.shadowRoot.contains(e.target)) {
                    this.closeDropdown();
                }
            });
        }
        
        // Logout functionality
        const logoutBtn = this.shadowRoot.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Mobile menu toggle
        const mobileToggle = this.shadowRoot.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Active link highlighting
        this.setActiveLink();
    }
    
    toggleSearch() {
        const searchContainer = this.shadowRoot.querySelector('.search-container');
        const searchInput = this.shadowRoot.getElementById('searchInput');
        
        if (searchContainer && searchInput) {
            this.isSearchOpen = !this.isSearchOpen;
            
            if (this.isSearchOpen) {
                searchContainer.classList.add('active');
                setTimeout(() => searchInput.focus(), 300);
            } else {
                this.closeSearch();
            }
        }
    }
    
    closeSearch() {
        const searchContainer = this.shadowRoot.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.remove('active');
            this.isSearchOpen = false;
        }
    }
    
    toggleDropdown() {
        const userContainer = this.shadowRoot.getElementById('userContainer');
        if (userContainer) {
            this.isDropdownOpen = !this.isDropdownOpen;
            
            if (this.isDropdownOpen) {
                userContainer.classList.add('active');
            } else {
                this.closeDropdown();
            }
        }
    }
    
    closeDropdown() {
        const userContainer = this.shadowRoot.getElementById('userContainer');
        if (userContainer) {
            userContainer.classList.remove('active');
            this.isDropdownOpen = false;
        }
    }
    
    async handleLogout() {
        try {
            // Use existing Firebase configuration and logout function
            const { logoutUser } = await import('/public/firebase/auth.js');
            
            // Close dropdown first
            this.closeDropdown();
            
            // Sign out using existing function
            const result = await logoutUser();
            
            if (result.success) {
                // Redirect to landing page (index.html) instead of login
                window.location.href = '/public/index.html';
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    }
    
    performSearch(query) {
        if (query.trim()) {
            // Implement search functionality
            console.log('Searching for:', query);
            this.closeSearch();
            // Redirect to search results or perform search
        }
    }
    
    handleSearchInput(value) {
        // Implement real-time search suggestions
        console.log('Search input:', value);
    }
    
    toggleMobileMenu() {
        // Implement mobile menu functionality
        alert('Mobile menu - Coming soon!');
    }
    
    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath.includes('marketplace') && href.includes('marketplace')) ||
                (currentPath.includes('dashboard') && href.includes('dashboard'))) {
                link.classList.add('active');
            }
        });
    }
}

// Register the component
customElements.define('header-auth-component', HeaderAuthComponent); 