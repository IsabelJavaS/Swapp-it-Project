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
        this.removePermanentNotifications();
        this.ensureNotificationsHiddenOnMobile();
    }

    // Remove any permanent notification elements
    removePermanentNotifications() {
        // Remove any notification elements that might be permanently visible
        const notifications = document.querySelectorAll('.notification-toast, .alert, .notification, [class*="notification"], [class*="alert"], [id*="notification"], [id*="alert"]');
        notifications.forEach(notification => {
            // Check if notification is permanently visible (has show class or is visible)
            if (notification.classList.contains('show') || 
                notification.style.display === 'block' || 
                notification.style.visibility === 'visible' ||
                notification.style.opacity === '1' ||
                notification.style.transform === 'translateX(0)' ||
                notification.style.transform === 'translateY(0)') {
                notification.remove();
            }
        });
        
        // Also check for any notification elements in the mobile header
        const mobileHeader = document.querySelector('.mobile-header-container');
        if (mobileHeader) {
            const mobileNotifications = mobileHeader.querySelectorAll('.notification-toast, .alert, .notification, [class*="notification"], [class*="alert"], [id*="notification"], [id*="alert"]');
            mobileNotifications.forEach(notification => {
                notification.remove();
            });
        }
        
        // Remove any notification elements that might be in the header shadow DOM
        const headerElements = document.querySelectorAll('header-component, header-auth-component');
        headerElements.forEach(header => {
            if (header.shadowRoot) {
                const shadowNotifications = header.shadowRoot.querySelectorAll('.notification-toast, .alert, .notification, [class*="notification"], [class*="alert"], [id*="notification"], [id*="alert"]');
                shadowNotifications.forEach(notification => {
                    notification.remove();
                });
            }
        });
        
        // Force hide any remaining notification elements
        const allNotifications = document.querySelectorAll('.notification-toast, .alert, .notification');
        allNotifications.forEach(notification => {
            notification.classList.remove('show');
            notification.style.display = 'none';
            notification.style.visibility = 'hidden';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            notification.style.pointerEvents = 'none';
        });
    }

    // Ensure notifications are properly hidden on mobile devices
    ensureNotificationsHiddenOnMobile() {
        if (window.innerWidth <= 768) {
            const notifications = document.querySelectorAll('.notification-toast, .alert, .notification');
            notifications.forEach(notification => {
                // Force hide notifications on mobile
                notification.classList.remove('show');
                notification.style.display = 'none';
                notification.style.visibility = 'hidden';
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(400px)';
                notification.style.pointerEvents = 'none';
                notification.style.zIndex = '-1';
            });
        }
    }

    // Initialize Firebase Auth
    async initializeAuth() {
        try {
            // Use existing Firebase configuration
            const { auth } = await import('/firebase/config.js');
            const { onAuthStateChange } = await import('/firebase/auth.js');
            
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
                    window.location.href = '/index.html';
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
            window.location.href = '/index.html';
        }
    }

    // Update UI with user data
    updateUserInterface() {
        // Ensure no permanent notifications are visible
        this.removePermanentNotifications();
        this.ensureNotificationsHiddenOnMobile();
        const userAvatar = this.shadowRoot.querySelector('.user-avatar img');
        const userName = this.shadowRoot.querySelector('.user-name');
        const userRole = this.shadowRoot.querySelector('.user-role');
        const dropdownUserName = this.shadowRoot.querySelector('.dropdown-header .user-name');
        const dropdownUserEmail = this.shadowRoot.querySelector('.dropdown-header .user-email');
        
        // Mobile elements
        const mobileUserAvatar = this.shadowRoot.querySelector('#mobileUserAvatarImg');
        const mobileUserName = this.shadowRoot.querySelector('.mobile-user-name');
        const mobileUserRole = this.shadowRoot.querySelector('.mobile-user-role');
        
        if (userAvatar && this.userData) {
            if (this.userData.photoURL) {
                userAvatar.src = this.userData.photoURL;
            } else {
                // Generate avatar from initials
                userAvatar.src = this.generateAvatarFromName(this.userData.displayName);
            }
            userAvatar.alt = `${this.userData.displayName} Avatar`;
        }
        
        // Update mobile avatar
        if (mobileUserAvatar && this.userData) {
            if (this.userData.photoURL) {
                mobileUserAvatar.src = this.userData.photoURL;
            } else {
                // Generate avatar from initials
                mobileUserAvatar.src = this.generateAvatarFromName(this.userData.displayName);
            }
            mobileUserAvatar.alt = `${this.userData.displayName} Avatar`;
        }
        
        if (userName && this.userData) {
            userName.textContent = this.userData.displayName;
        }
        
        // Update mobile user name
        if (mobileUserName && this.userData) {
            mobileUserName.textContent = this.userData.displayName;
        }
        
        // Update user role
        if (userRole) {
            // Try to get role from various sources
            let role = 'Student'; // Default
            
            if (window.userProfile && window.userProfile.role) {
                role = window.userProfile.role;
            } else if (window.localStorage.getItem('userRole')) {
                role = window.localStorage.getItem('userRole');
            } else if (window.sessionStorage.getItem('userRole')) {
                role = window.sessionStorage.getItem('userRole');
            }
            
            // Capitalize first letter
            role = role.charAt(0).toUpperCase() + role.slice(1);
            userRole.textContent = role;
        }
        
        // Update mobile user role
        if (mobileUserRole) {
            // Try to get role from various sources
            let role = 'Student'; // Default
            
            if (window.userProfile && window.userProfile.role) {
                role = window.userProfile.role;
            } else if (window.localStorage.getItem('userRole')) {
                role = window.localStorage.getItem('userRole');
            } else if (window.sessionStorage.getItem('userRole')) {
                role = window.sessionStorage.getItem('userRole');
            }
            
            // Capitalize first letter
            role = role.charAt(0).toUpperCase() + role.slice(1);
            mobileUserRole.textContent = role;
        }
        
        // Update dropdown header as well
        if (dropdownUserName && this.userData) {
            dropdownUserName.textContent = this.userData.displayName;
        }
        
        if (dropdownUserEmail && this.userData) {
            dropdownUserEmail.textContent = this.userData.email;
        }
        
        // Initialize and update coin balance
        this.initializeCoinBalance();
        this.updateCoinBalance();
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
    
    // Update coin balance display
    updateCoinBalance() {
        const coinBalanceElement = this.shadowRoot.getElementById('userCoinBalance');
        const mobileCoinBalanceElement = this.shadowRoot.getElementById('mobileUserCoinBalance');
        const mobileMenuCoinBalanceElement = document.getElementById('mobileMenuCoinBalance');
        
        if (coinBalanceElement) {
            const balance = localStorage.getItem('userCoinBalance') || 0;
            const formattedBalance = parseInt(balance).toLocaleString();
            coinBalanceElement.textContent = formattedBalance;
        }
        
        if (mobileCoinBalanceElement) {
            const balance = localStorage.getItem('userCoinBalance') || 0;
            const formattedBalance = parseInt(balance).toLocaleString();
            mobileCoinBalanceElement.textContent = formattedBalance;
        }
        
        // Update mobile menu coin balance if sidebar is open
        if (mobileMenuCoinBalanceElement) {
            const balance = localStorage.getItem('userCoinBalance') || 0;
            const formattedBalance = parseInt(balance).toLocaleString();
            mobileMenuCoinBalanceElement.textContent = formattedBalance;
        }
    }
    
    // Initialize coin balance if not set
    initializeCoinBalance() {
        if (!localStorage.getItem('userCoinBalance')) {
            localStorage.setItem('userCoinBalance', '0');
        }
    }
    
    // Public method to refresh coin balance (can be called from other components)
    refreshCoinBalance() {
        this.updateCoinBalance();
    }

    // Get logo path
    getLogoPath() {
        return window.pathConfig ? window.pathConfig.getLogoPath() : '/assets/logos/LogoSinFondo.png';
    }

    // Get paths
    getMarketplacePath() {
        return window.pathConfig ? window.pathConfig.getMarketplacePath() : '/pages/marketplace/marketplace.html';
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
        
        // Por defecto, redirigir al dashboard del estudiante
        if (role === 'business') {
            return '/dashboards/business/business-dashboard.html';
        } else {
            return '/dashboards/student/student-dashboard.html';
        }
    }

    getLoginPath() {
        return window.pathConfig ? window.pathConfig.getLoginPath() : '/pages/auth/login.html';
    }

    getSwappitCoinsInfoPath() {
        return window.pathConfig ? window.pathConfig.getSwappitCoinsInfoPath() : '/pages/swapcoin/buy-coins.html';
    }

    getSupportPath() {
        return '/pages/support/support.html';
    }

    getProfilePath() {
        // Intentar obtener el rol del usuario desde el perfil global
        let role = null;
        if (window.userProfile && window.userProfile.role) {
            role = window.userProfile.role;
        } else if (window.localStorage.getItem('userRole')) {
            role = window.localStorage.getItem('userRole');
        } else if (window.sessionStorage.getItem('userRole')) {
            role = window.sessionStorage.getItem('userRole');
        }
        
        // Por defecto, redirigir al perfil del estudiante
        if (role === 'business') {
            return '/dashboards/business/business-dashboard.html#profile';
        } else {
            return '/dashboards/student/student-dashboard.html#profile';
        }
    }

    getSettingsPath() {
        // Intentar obtener el rol del usuario desde el perfil global
        let role = null;
        if (window.userProfile && window.userProfile.role) {
            role = window.userProfile.role;
        } else if (window.localStorage.getItem('userRole')) {
            role = window.localStorage.getItem('userRole');
        } else if (window.sessionStorage.getItem('userRole')) {
            role = window.sessionStorage.getItem('userRole');
        }
        
        // Por defecto, redirigir a la configuración del estudiante
        if (role === 'business') {
            return '/dashboards/business/business-dashboard.html#settings';
        } else {
            return '/dashboards/student/student-dashboard.html#settings';
        }
    }

    render() {
        // Remove any permanent notifications when rendering
        this.removePermanentNotifications();
        this.ensureNotificationsHiddenOnMobile();
        
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
                    border-bottom: 2px solid var(--swappit-orange);
                    backdrop-filter: blur(10px);
                }
                
                /* Desktop/Laptop spacing for single header */
                body {
                    padding-top: 100px; /* Account for 80px header + 20px extra space */
                }
                
                /* Ensure main content areas start after the header */
                main,
                .marketplace-main,
                .all-products-main,
                .main-content {
                    margin-top: 20px; /* Additional spacing */
                }
                
                .nav {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
                
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 0.8fr 2.2fr 1fr;
                    align-items: center;
                    gap: 2rem;
                }

                /* Mobile/Tablet Dual Header Structure */
                .mobile-header-container {
                    display: none;
                }

                .mobile-header-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    background: var(--background-white);
                    border-bottom: 1px solid var(--neutral-light);
                }

                .mobile-header-bottom {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    background: var(--background-white);
                }

                .mobile-logo {
                    text-decoration: none;
                    flex-shrink: 0;
                }

                .mobile-logo img {
                    width: 120px;
                    height: auto;
                }

                .mobile-coins-container {
                    display: none; /* Hidden in first header */
                }

                .mobile-coins-container:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    color: var(--swappit-orange);
                    text-decoration: none;
                }

                .mobile-user-avatar {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: var(--transition);
                    border: 2px solid transparent;
                }

                .mobile-user-avatar:hover {
                    background: var(--neutral-light);
                    border-color: var(--swappit-blue);
                }

                .mobile-user-avatar img {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--swappit-blue);
                }

                .mobile-user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .mobile-user-name {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.8rem;
                    color: var(--neutral-dark);
                    line-height: 1.2;
                }

                .mobile-user-role {
                    font-family: var(--font-secondary);
                    font-size: 0.7rem;
                    color: var(--swappit-blue);
                    line-height: 1.2;
                    font-weight: 500;
                }

                /* Mobile Filter Button */
                .mobile-filter-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: var(--neutral-light);
                    border: none;
                    border-radius: 6px;
                    color: var(--neutral-dark);
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: var(--transition);
                    flex-shrink: 0;
                }

                .mobile-filter-btn:hover {
                    background: var(--swappit-orange);
                    color: white;
                }

                .mobile-filter-btn i {
                    font-size: 1rem;
                }

                /* Mobile Search Container */
                .mobile-search-container {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    min-width: 0;
                }

                .mobile-search-input {
                    width: 100%;
                    border: 2px solid var(--neutral-light);
                    border-radius: 25px;
                    padding: 0.5rem 1rem 0.5rem 2.5rem;
                    font-size: 0.9rem;
                    background: var(--background-white);
                    transition: var(--transition);
                    font-family: var(--font-secondary);
                }

                .mobile-search-input:focus {
                    outline: none;
                    border-color: var(--swappit-orange);
                    box-shadow: 0 0 0 3px rgba(255, 164, 36, 0.1);
                }

                .mobile-search-btn {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--neutral-medium);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .mobile-search-btn:hover {
                    color: var(--swappit-orange);
                }

                .mobile-cart-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: var(--swappit-orange);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: var(--transition);
                    flex-shrink: 0;
                }

                .mobile-cart-btn:hover {
                    background: var(--swappit-orange-hover);
                    transform: scale(1.1);
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
                    transform: translateY(-1px) scale(1.02);
                }
                
                .logo img {
                    width: 140px;
                    height: auto;
                    display: block;
                    object-fit: contain;
                }

                /* Column 1: Logo */
                .column-1 {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }

                /* Column 2: Filters + Explore + Search */
                .column-2 {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    justify-content: center;
                }



                /* Categories Navigation */
                .categories-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-dark);
                    text-decoration: none;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.95rem;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: var(--transition);
                    border: 2px solid transparent;
                }

                .categories-nav:hover {
                    background: rgba(255, 164, 36, 0.1);
                    color: var(--swappit-orange);
                    text-decoration: none;
                    border-color: var(--swappit-orange);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 164, 36, 0.2);
                }

                .categories-nav i {
                    font-size: 1rem;
                    color: var(--text-dark);
                    transition: transform 0.3s ease;
                }

                .categories-nav:hover i {
                    transform: rotate(90deg);
                    animation: pulse 1s infinite;
                    color: var(--swappit-orange);
                }

                @keyframes pulse {
                    0% { transform: rotate(90deg) scale(1); }
                    50% { transform: rotate(90deg) scale(1.1); }
                    100% { transform: rotate(90deg) scale(1); }
                }

                /* Marketplace Navigation */
                .marketplace-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-dark);
                    text-decoration: none;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.95rem;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: var(--transition);
                    border: 2px solid transparent;
                }

                .marketplace-nav:hover {
                    background: rgba(255, 164, 36, 0.1);
                    color: var(--swappit-orange);
                    text-decoration: none;
                    border-color: var(--swappit-orange);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 164, 36, 0.2);
                }

                .marketplace-nav i {
                    font-size: 1rem;
                    color: var(--text-dark);
                    transition: transform 0.3s ease;
                }

                .marketplace-nav:hover i {
                    transform: scale(1.1);
                    color: var(--swappit-orange);
                }

                /* Column 3: SWAPP-IT Coins + Avatar + Cart */
                .column-3 {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    justify-content: flex-end;
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
                    width: 100%;
                    max-width: 500px;
                }
                
                .search-input {
                    width: 100%;
                    border: 2px solid var(--neutral-light);
                    border-radius: 25px;
                    padding: 0.75rem 1rem 0.75rem 3rem;
                    font-size: 0.95rem;
                    background: var(--background-white);
                    transition: var(--transition);
                    font-family: var(--font-secondary);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: var(--swappit-orange);
                    box-shadow: 0 0 0 3px rgba(255, 164, 36, 0.1);
                }
                
                .search-btn {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--neutral-medium);
                    font-size: 1rem;
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .search-btn:hover {
                    color: var(--swappit-orange);
                }
                
                /* SWAPP-IT Coins */
                .coins-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: transparent;
                    border-radius: 25px;
                    color: var(--text-dark);
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: var(--transition);
                    text-decoration: none;
                    cursor: pointer;
                }
                
                .coins-container:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    color: var(--swappit-orange);
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
                
                .user-role {
                    font-family: var(--font-secondary);
                    font-size: 0.75rem;
                    color: var(--swappit-blue);
                    line-height: 1.2;
                    font-weight: 500;
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
                
                /* Dropdown Section Title */
                .dropdown-section-title {
                    padding: 0.5rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--swappit-orange);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: rgba(255, 164, 36, 0.1);
                    border-left: 3px solid var(--swappit-orange);
                    margin: 0.5rem 0;
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

                /* Mobile Menu Styles */
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-menu-content {
                    width: 320px;
                    height: 100vh;
                    background: white;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
                }
                
                .mobile-menu.show .mobile-menu-content {
                    transform: translateX(0);
                }
                
                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-orange));
                    color: white;
                }
                
                .mobile-menu-header h3 {
                    margin: 0;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1.2rem;
                }
                
                .mobile-menu-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                
                .mobile-menu-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .mobile-menu-items {
                    flex: 1;
                    padding: 1rem 0;
                    overflow-y: auto;
                }
                
                .mobile-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    color: var(--neutral-dark);
                    text-decoration: none;
                    font-family: var(--font-secondary);
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border-left: 3px solid transparent;
                }
                
                .mobile-menu-item:hover {
                    background: var(--neutral-light);
                    border-left-color: var(--swappit-blue);
                    color: var(--swappit-blue);
                    transform: translateX(5px);
                }
                
                .mobile-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: var(--neutral-medium);
                    font-size: 1rem;
                }
                
                .mobile-menu-item:hover i {
                    color: var(--swappit-blue);
                }
                
                .mobile-menu-divider {
                    height: 1px;
                    background: var(--neutral-light);
                    margin: 0.5rem 1.5rem;
                }
                
                .mobile-menu-section {
                    padding: 0.5rem 1.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--swappit-orange);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: rgba(255, 164, 36, 0.1);
                    border-left: 3px solid var(--swappit-orange);
                    margin: 0.5rem 0;
                }
                
                .mobile-menu-item.logout {
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout i {
                    color: #dc2626;
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
                    
                    .column-2 {
                        gap: 1rem;
                    }
                    
                    .categories-nav span,
                    .marketplace-nav span {
                        display: none;
                    }
                }
                

                
                /* Mobile/Tablet Responsive - Dual Header */
                @media (max-width: 768px) {
                    /* Hide desktop header */
                    .header .nav .container {
                        display: none;
                    }
                    
                    /* Show mobile dual header */
                    .mobile-header-container {
                        display: block;
                    }
                    
                    /* Force hide notifications on mobile */
                    .notification-toast,
                    .alert,
                    .notification {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        transform: translateX(400px) !important;
                        pointer-events: none !important;
                        z-index: -1 !important;
                    }
                    
                    /* Adjust header height for dual structure */
                    .header {
                        height: auto;
                        min-height: 120px;
                    }
                    
                    .nav {
                        height: auto;
                    }
                    
                    /* Add spacing for page content to start after mobile headers */
                    body {
                        padding-top: 140px; /* Account for dual header height + some extra space */
                    }
                    
                    /* Ensure main content areas start after the header */
                    main,
                    .marketplace-main,
                    .all-products-main,
                    .main-content {
                        margin-top: 20px; /* Additional spacing */
                    }
                }

                @media (max-width: 480px) {
                    .mobile-header-top {
                        padding: 0.5rem 0.75rem;
                    }
                    
                    .mobile-header-bottom {
                        padding: 0.5rem 0.75rem;
                    }
                    
                    .mobile-logo img {
                        width: 100px;
                    }
                    
                    .mobile-coins-container {
                        padding: 0.4rem 0.8rem;
                        font-size: 0.8rem;
                    }
                    
                    .mobile-user-avatar img {
                        width: 30px;
                        height: 30px;
                    }
                    
                    .mobile-user-name {
                        font-size: 0.75rem;
                    }
                    
                    .mobile-user-role {
                        font-size: 0.65rem;
                    }
                    
                    .mobile-filter-btn {
                        padding: 0.4rem 0.8rem;
                        font-size: 0.8rem;
                    }
                    
                    .mobile-search-container {
                        max-width: 200px;
                    }
                    
                    .mobile-search-input {
                        font-size: 0.8rem;
                        padding: 0.4rem 1rem 0.4rem 2.2rem;
                    }
                    
                    .mobile-cart-btn {
                        width: 35px;
                        height: 35px;
                        font-size: 0.9rem;
                    }
                    
                    /* Adjust spacing for smaller mobile screens */
                    body {
                        padding-top: 130px; /* Slightly less padding for smaller screens */
                    }
                    
                    main,
                    .marketplace-main,
                    .all-products-main,
                    .main-content {
                        margin-top: 15px; /* Slightly less margin for smaller screens */
                    }
                }
            </style>
            
                        <header class="header">
                <nav class="nav">
                    <!-- Desktop Header -->
                    <div class="container">
                        <!-- Column 1: Logo -->
                        <div class="column-1">
                            <a href="${this.getMarketplacePath()}" class="logo">
                                <img src="${logoPath}" alt="SWAPPIT Logo">
                            </a>
                        </div>

                        <!-- Column 2: Categories + Search -->
                        <div class="column-2">
                            <!-- Categories Navigation -->
                            <a href="#" class="categories-nav" id="categoriesNav">
                                <i class="fas fa-bars"></i>
                                <span>Categories</span>
                            </a>
                            
                            <!-- Search Bar -->
                            <div class="search-container">
                                <input type="text" class="search-input" placeholder="Search products, categories, sellers..." id="searchInput">
                                <button class="search-btn" id="searchBtn">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Column 3: SWAPP-IT Coins + Avatar + Cart -->
                        <div class="column-3">
                            <!-- Mobile Menu Toggle -->
                            <button class="mobile-toggle" id="mobileToggle">
                                <i class="fas fa-bars"></i>
                            </button>
                            
                            <!-- SWAPP-IT Coins -->
                            <a href="/pages/swapcoin/my-coins.html" class="coins-container">
                                <img src="/assets/coin_SwappIt.png" alt="SWAPP-IT Coins" class="coins-icon" width="30" height="30">
                                <span id="userCoinBalance">0</span>
                            </a>
                            
                            <!-- User Avatar & Dropdown -->
                            <div class="user-container" id="userContainer">
                                <div class="user-avatar" id="userAvatar">
                                    <img src="" alt="User Avatar" id="userAvatarImg">
                                    <div class="user-info">
                                        <div class="user-name">Loading...</div>
                                        <div class="user-role">Student</div>
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
                                        <a href="${this.getDashboardPath()}" class="dropdown-item" id="dashboardLink">
                                            <i class="fas fa-tachometer-alt"></i>
                                            Dashboard
                                        </a>
                                        <a href="${this.getProfilePath()}" class="dropdown-item" id="profileLink">
                                            <i class="fas fa-user"></i>
                                            Profile
                                        </a>
                                        <a href="${this.getSettingsPath()}" class="dropdown-item" id="settingsLink">
                                            <i class="fas fa-cog"></i>
                                            Settings
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <!-- SWAPP-IT Coins Section -->
<div class="dropdown-section-title">SWAPP-IT Coins</div>
                                        <a href="/pages/swapcoin/my-coins.html" class="dropdown-item" id="swapcoinInfoLink">
                                            <i class="fas fa-coins"></i>
                                            My Coins
                                        </a>
                                        <a href="/pages/swapcoin/buy-coins.html" class="dropdown-item" id="buyCoinsLink">
                                            <i class="fas fa-shopping-cart"></i>
                                            Buy Coins
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="${this.getSupportPath()}" class="dropdown-item" id="helpLink">
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
                            
                            <!-- Cart Component -->
                            <cart-component></cart-component>
                        </div>
                    </div>

                    <!-- Mobile/Tablet Dual Header -->
                    <div class="mobile-header-container">
                        <!-- Header Superior: Logo + Avatar + Cart -->
                        <div class="mobile-header-top">
                            <!-- Logo -->
                            <a href="${this.getMarketplacePath()}" class="mobile-logo">
                                <img src="${logoPath}" alt="SWAPPIT Logo">
                            </a>
                            
                            <!-- Right side: Cart + Avatar -->
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <!-- Cart Button -->
                                <button class="mobile-cart-btn" id="mobileCartBtn">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                                
                                <!-- User Avatar (triggers sidebar) -->
                                <div class="mobile-user-avatar" id="mobileUserAvatar">
                                    <img src="" alt="User Avatar" id="mobileUserAvatarImg">
                                    <div class="mobile-user-info">
                                        <div class="mobile-user-name">Loading...</div>
                                        <div class="mobile-user-role">Student</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Header Inferior: Categorías + Search -->
                        <div class="mobile-header-bottom">
                            <!-- Categories Button -->
                            <button class="mobile-filter-btn" id="mobileFilterBtn">
                                <i class="fas fa-bars"></i>
                                <span>Categorías</span>
                            </button>
                            
                            <!-- Search Container -->
                            <div class="mobile-search-container">
                                <input type="text" class="mobile-search-input" placeholder="Buscar productos..." id="mobileSearchInput">
                                <button class="mobile-search-btn" id="mobileSearchBtn">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <!-- Filters Sidebar Component -->
            <filters-sidebar-component></filters-sidebar-component>
        `;
    }

    attachEventListeners() {
        // Listen for coin balance updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'userCoinBalance') {
                this.updateCoinBalance();
                // Dispatch custom event for other components
                window.dispatchEvent(new CustomEvent('coinBalanceUpdated', {
                    detail: { balance: localStorage.getItem('userCoinBalance') }
                }));
            }
        });
        
        // Categories navigation for sidebar
        const categoriesNav = this.shadowRoot.getElementById('categoriesNav');
        
        if (categoriesNav) {
            categoriesNav.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Categories nav clicked');
                
                // Try to find existing filters sidebar
                let filtersSidebar = document.querySelector('filters-sidebar-component');
                
                if (filtersSidebar && typeof filtersSidebar.open === 'function') {
                    console.log('Opening existing filters sidebar');
                    filtersSidebar.open();
                } else {
                    console.log('Filters sidebar not found or not ready - creating new one');
                    // Create the component dynamically
                    const newFiltersSidebar = document.createElement('filters-sidebar-component');
                    document.body.appendChild(newFiltersSidebar);
                    
                    // Wait for the component to be ready
                    setTimeout(() => {
                        if (typeof newFiltersSidebar.open === 'function') {
                            newFiltersSidebar.open();
                        } else {
                            console.log('Fallback: Navigating to all products page');
                            window.location.href = '/pages/marketplace/all-products.html';
                        }
                    }, 200);
                }
            });
        }
        
        // Search functionality
        const searchBtn = this.shadowRoot.getElementById('searchBtn');
        const searchInput = this.shadowRoot.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
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
        
        // Dropdown menu items functionality
        const dashboardLink = this.shadowRoot.getElementById('dashboardLink');
        const profileLink = this.shadowRoot.getElementById('profileLink');
        const settingsLink = this.shadowRoot.getElementById('settingsLink');
        const swapcoinInfoLink = this.shadowRoot.getElementById('swapcoinInfoLink');
        const buyCoinsLink = this.shadowRoot.getElementById('buyCoinsLink');
        const helpLink = this.shadowRoot.getElementById('helpLink');
        const logoutBtn = this.shadowRoot.getElementById('logoutBtn');
        
        if (dashboardLink) {
            dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToDashboard();
            });
        }
        
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToProfile();
            });
        }
        
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSettings();
            });
        }
        
        if (swapcoinInfoLink) {
            swapcoinInfoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSwappitCoinsInfo();
            });
        }
        
        if (buyCoinsLink) {
            buyCoinsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToBuyCoins();
            });
        }
        

        
        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSupport();
            });
        }
        
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
        
        // Mobile avatar click for sidebar
        const mobileUserAvatar = this.shadowRoot.getElementById('mobileUserAvatar');
        if (mobileUserAvatar) {
            mobileUserAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Remove any permanent notifications before opening mobile menu
                this.removePermanentNotifications();
                this.ensureNotificationsHiddenOnMobile();
                this.toggleMobileMenu();
            });
        }
        
        // Mobile filter button
        const mobileFilterBtn = this.shadowRoot.getElementById('mobileFilterBtn');
        if (mobileFilterBtn) {
            mobileFilterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove any permanent notifications before opening filters
                this.removePermanentNotifications();
                this.ensureNotificationsHiddenOnMobile();
                
                // Trigger filters sidebar
                const filtersSidebar = document.querySelector('filters-sidebar-component');
                if (filtersSidebar && filtersSidebar.open) {
                    filtersSidebar.open();
                }
            });
        }
        
        // Mobile search functionality
        const mobileSearchBtn = this.shadowRoot.getElementById('mobileSearchBtn');
        const mobileSearchInput = this.shadowRoot.getElementById('mobileSearchInput');
        
        if (mobileSearchBtn && mobileSearchInput) {
            mobileSearchBtn.addEventListener('click', () => {
                this.performMobileSearch(mobileSearchInput.value);
            });
            
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performMobileSearch(mobileSearchInput.value);
                }
            });
        }
        
        // Mobile cart button
        const mobileCartBtn = this.shadowRoot.getElementById('mobileCartBtn');
        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove any permanent notifications before opening cart
                this.removePermanentNotifications();
                this.ensureNotificationsHiddenOnMobile();
                
                // Trigger cart component to open
                const cartComponent = document.querySelector('cart-component');
                if (cartComponent && cartComponent.openCart) {
                    cartComponent.openCart();
                }
            });
        }
        
        // Active link highlighting
        this.setActiveLink();
        
        // Add window resize listener for responsive behavior
        window.addEventListener('resize', () => {
            this.setActiveLink();
            this.ensureNotificationsHiddenOnMobile();
        });
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
    
    // Navigation methods for dropdown items
    navigateToDashboard() {
        this.closeDropdown();
        window.location.href = this.getDashboardPath();
    }

    navigateToProfile() {
        this.closeDropdown();
        window.location.href = this.getProfilePath();
    }

    navigateToSettings() {
        this.closeDropdown();
        window.location.href = this.getSettingsPath();
    }

    navigateToSwappitCoinsInfo() {
        this.closeDropdown();
        window.location.href = '/pages/swapcoin/my-coins.html';
    }

    navigateToBuyCoins() {
        this.closeDropdown();
        window.location.href = '/pages/swapcoin/buy-coins.html';
    }



    navigateToSupport() {
        this.closeDropdown();
        window.location.href = this.getSupportPath();
    }
    
    async handleLogout() {
        try {
            // Use existing Firebase configuration and logout function
            const { logoutUser } = await import('/firebase/auth.js');
            
            // Close dropdown first
            this.closeDropdown();
            
            // Sign out using existing function
            const result = await logoutUser();
            
            if (result.success) {
                // Redirect to landing page (index.html) instead of login
                window.location.href = '/index.html';
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
            // Navigate to all products page with search query
            window.location.href = `/pages/marketplace/all-products.html?search=${encodeURIComponent(query)}`;
        }
    }
    
    performMobileSearch(query) {
        if (query.trim()) {
            // Navigate to all products page with search query
            window.location.href = `/pages/marketplace/all-products.html?search=${encodeURIComponent(query)}`;
        }
    }
    
    handleSearchInput(value) {
        // Real-time search suggestions could be implemented here
        console.log('Search input:', value);
    }


    
    toggleMobileMenu() {
        // Remove any permanent notifications before opening mobile menu
        this.removePermanentNotifications();
        this.ensureNotificationsHiddenOnMobile();
        
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobileMenu';
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <div class="mobile-menu-header">
                        <div class="mobile-menu-header-content">
                            <h3>Menú</h3>
                            <div class="mobile-menu-coins">
                                <img src="/assets/coin_SwappIt.png" alt="SWAPP-IT Coins" width="20" height="20">
<span id="mobileMenuCoinBalance">0</span> SWAPP-IT Coins
                            </div>
                        </div>
                        <button class="mobile-menu-close" id="mobileMenuClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mobile-menu-items">
                        <a href="${this.getMarketplacePath()}" class="mobile-menu-item">
                            <i class="fas fa-store"></i>
                            Marketplace
                        </a>
                        <a href="${this.getSupportPath()}" class="mobile-menu-item">
                            <i class="fas fa-headset"></i>
                            Support
                        </a>
                        <a href="${this.getSwappitCoinsInfoPath()}" class="mobile-menu-item">
                            <i class="fas fa-coins"></i>
                            SWAPP-IT Coins
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <a href="${this.getDashboardPath()}" class="mobile-menu-item">
                            <i class="fas fa-tachometer-alt"></i>
                            Dashboard
                        </a>
                        <a href="${this.getProfilePath()}" class="mobile-menu-item">
                            <i class="fas fa-user"></i>
                            Profile
                        </a>
                        <a href="${this.getSettingsPath()}" class="mobile-menu-item">
                            <i class="fas fa-cog"></i>
                            Settings
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <a href="#" class="mobile-menu-item logout" id="mobileLogoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            Sign Out
                        </a>
                    </div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-menu-content {
                    width: 300px;
                    height: 100vh;
                    background: white;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .mobile-menu.show .mobile-menu-content {
                    transform: translateX(0);
                }
                
                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: #3468c0;
                    color: white;
                }
                
                .mobile-menu-header-content {
                    flex: 1;
                }
                
                .mobile-menu-header h3 {
                    margin: 0 0 0.5rem 0;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                
                .mobile-menu-coins {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 500;
                    opacity: 0.9;
                }
                
                .mobile-menu-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                
                .mobile-menu-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .mobile-menu-items {
                    flex: 1;
                    padding: 1rem 0;
                    overflow-y: auto;
                }
                
                .mobile-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    color: #1e293b;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    transition: background 0.3s ease;
                    border-left: 3px solid transparent;
                }
                
                .mobile-menu-item:hover {
                    background: #f1f5f9;
                    border-left-color: #3468c0;
                    color: #3468c0;
                }
                
                .mobile-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: #64748b;
                }
                
                .mobile-menu-item:hover i {
                    color: #3468c0;
                }
                
                .mobile-menu-divider {
                    height: 1px;
                    background: #e2e8f0;
                    margin: 0.5rem 0;
                }
                
                .mobile-menu-item.logout {
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout i {
                    color: #dc2626;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(mobileMenu);
            
            // Add event listeners
            const closeBtn = mobileMenu.querySelector('#mobileMenuClose');
            const logoutBtn = mobileMenu.querySelector('#mobileLogoutBtn');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeMobileMenu());
            }
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu();
                    this.handleLogout();
                });
            }
            
            // Close on overlay click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Show mobile menu
        mobileMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update coin balance in mobile menu
        this.updateCoinBalance();
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    setActiveLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            // Check for exact path match
            if (href === currentPath) {
                link.classList.add('active');
            }
            // Check for marketplace pages
            else if (currentPath.includes('marketplace') && href.includes('marketplace')) {
                link.classList.add('active');
            }
            // Check for support pages
            else if (currentPath.includes('support') && href.includes('support')) {
                link.classList.add('active');
            }
            // Check for swapcoin pages
            else if (currentPath.includes('swapcoin') && href.includes('swapcoin')) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        // Remove any permanent notifications before opening mobile menu
        this.removePermanentNotifications();
        this.ensureNotificationsHiddenOnMobile();
        
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobileMenu';
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <div class="mobile-menu-header">
                        <h3>SWAPPIT Menu</h3>
                        <button class="mobile-menu-close" id="mobileMenuClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mobile-menu-items">
                        <div class="mobile-menu-section">Navigation</div>
                        <a href="${this.getMarketplacePath()}" class="mobile-menu-item">
                            <i class="fas fa-store"></i>
                            Marketplace
                        </a>
                        <a href="#" class="mobile-menu-item" id="mobileCategoriesBtn">
                            <i class="fas fa-bars"></i>
                            Categories
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <div class="mobile-menu-section">Account</div>
                        <a href="${this.getDashboardPath()}" class="mobile-menu-item">
                            <i class="fas fa-tachometer-alt"></i>
                            Dashboard
                        </a>
                        <a href="${this.getProfilePath()}" class="mobile-menu-item">
                            <i class="fas fa-user"></i>
                            Profile
                        </a>
                        <a href="${this.getSettingsPath()}" class="mobile-menu-item">
                            <i class="fas fa-cog"></i>
                            Settings
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <div class="mobile-menu-section">SWAPP-IT Coins</div>
                        <a href="/pages/swapcoin/my-coins.html" class="mobile-menu-item">
                            <i class="fas fa-coins"></i>
                            My Coins
                        </a>
                        <a href="/pages/swapcoin/buy-coins.html" class="mobile-menu-item">
                            <i class="fas fa-shopping-cart"></i>
                            Buy Coins
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <div class="mobile-menu-section">Support</div>
                        <a href="${this.getSupportPath()}" class="mobile-menu-item">
                            <i class="fas fa-question-circle"></i>
                            Help & Support
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <div class="mobile-menu-section">Shopping</div>
                        <a href="#" class="mobile-menu-item" id="mobileCartBtn">
                            <i class="fas fa-shopping-cart"></i>
                            Shopping Cart
                        </a>
                        <div class="mobile-menu-divider"></div>
                        <a href="#" class="mobile-menu-item logout" id="mobileLogoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            Sign Out
                        </a>
                    </div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-menu-content {
                    width: 320px;
                    height: 100vh;
                    background: white;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
                }
                
                .mobile-menu.show .mobile-menu-content {
                    transform: translateX(0);
                }
                
                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: linear-gradient(135deg, #3468c0, #ffa424);
                    color: white;
                }
                
                .mobile-menu-header h3 {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 1.2rem;
                }
                
                .mobile-menu-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                
                .mobile-menu-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .mobile-menu-items {
                    flex: 1;
                    padding: 1rem 0;
                    overflow-y: auto;
                }
                
                .mobile-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    color: #1e293b;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border-left: 3px solid transparent;
                }
                
                .mobile-menu-item:hover {
                    background: #f1f5f9;
                    border-left-color: #3468c0;
                    color: #3468c0;
                    transform: translateX(5px);
                }
                
                .mobile-menu-item i {
                    width: 20px;
                    text-align: center;
                    color: #64748b;
                    font-size: 1rem;
                }
                
                .mobile-menu-item:hover i {
                    color: #3468c0;
                }
                
                .mobile-menu-divider {
                    height: 1px;
                    background: #e2e8f0;
                    margin: 0.5rem 1.5rem;
                }
                
                .mobile-menu-section {
                    padding: 0.5rem 1.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #ffa424;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: rgba(255, 164, 36, 0.1);
                    border-left: 3px solid #ffa424;
                    margin: 0.5rem 0;
                }
                
                .mobile-menu-item.logout {
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }
                
                .mobile-menu-item.logout i {
                    color: #dc2626;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(mobileMenu);
            
            // Add event listeners
            const closeBtn = mobileMenu.querySelector('#mobileMenuClose');
            const categoriesBtn = mobileMenu.querySelector('#mobileCategoriesBtn');
            const cartBtn = mobileMenu.querySelector('#mobileCartBtn');
            const logoutBtn = mobileMenu.querySelector('#mobileLogoutBtn');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeMobileMenu());
            }
            
            if (categoriesBtn) {
                categoriesBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu();
                    // Trigger categories sidebar
                    const filtersSidebar = document.querySelector('filters-sidebar-component');
                    if (filtersSidebar && typeof filtersSidebar.open === 'function') {
                        filtersSidebar.open();
                    } else {
                        // Fallback: navigate to all products page
                        window.location.href = '/pages/marketplace/all-products.html';
                    }
                });
            }
            
            if (cartBtn) {
                cartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu();
                    // Trigger cart component to open
                    const cartComponent = document.querySelector('cart-component');
                    if (cartComponent && cartComponent.openCart) {
                        cartComponent.openCart();
                    }
                });
            }
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu();
                    this.handleLogout();
                });
            }
            
            // Close on overlay click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Show mobile menu
        mobileMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
}

// Register the component
customElements.define('header-auth-component', HeaderAuthComponent); 