/**
 * Global Header Manager
 * Manages dynamic header switching across all pages based on Firebase authentication state
 * This script should be included in all pages to ensure consistent header behavior
 */
class GlobalHeaderManager {
    constructor() {
        this.headerContainer = document.getElementById('header-container');
        this.currentHeader = null;
        this.init();
    }
    
    async init() {
        try {
            // Use existing Firebase configuration
            const { auth } = await import('/firebase/config.js');
            const { onAuthStateChange } = await import('/firebase/auth.js');
            
            // Listen for auth state changes
            onAuthStateChange((user) => {
                this.handleAuthStateChange(user);
            });
            
            // Check current auth state immediately
            const currentUser = auth.currentUser;
            this.handleAuthStateChange(currentUser);
            
        } catch (error) {
            console.error('Error initializing global header manager:', error);
            // Fallback to non-authenticated header
            this.showNonAuthHeader();
        }
    }
    
    handleAuthStateChange(user) {
        if (user) {
            // User is authenticated - show auth header
            this.showAuthHeader();
            
            // If we're on the index page and user is logged in, redirect to marketplace
            if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                console.log('User is logged in on index page, redirecting to marketplace...');
                            setTimeout(() => {
                    window.location.href = '/pages/marketplace/marketplace.html';
                }, 100); // Small delay to ensure header is loaded
            }
        } else {
            // User is not authenticated - show normal header
            this.showNonAuthHeader();
        }
    }
    
    showAuthHeader() {
        if (this.currentHeader && this.currentHeader.tagName === 'HEADER-AUTH-COMPONENT') {
            return; // Already showing auth header
        }
        
        this.clearHeader();
        const authHeader = document.createElement('header-auth-component');
        this.headerContainer.appendChild(authHeader);
        this.currentHeader = authHeader;
    }
    
    showNonAuthHeader() {
        if (this.currentHeader && this.currentHeader.tagName === 'HEADER-COMPONENT') {
            return; // Already showing non-auth header
        }
        
        this.clearHeader();
        const nonAuthHeader = document.createElement('header-component');
        this.headerContainer.appendChild(nonAuthHeader);
        this.currentHeader = nonAuthHeader;
    }
    
    clearHeader() {
        if (this.currentHeader) {
            this.currentHeader.remove();
            this.currentHeader = null;
        }
    }
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlobalHeaderManager();
    });
} 