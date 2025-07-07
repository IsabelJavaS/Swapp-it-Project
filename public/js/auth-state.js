// Global Authentication State Management
import { onAuthStateChange, getCurrentUser, logoutUser } from '../firebase/auth.js';
import { getUserProfile } from '../firebase/firestore.js';
import pathConfig from './config.js';

// Global state
let currentUser = null;
let userProfile = null;
let authStateListeners = [];

// ==================== AUTH STATE MANAGEMENT ====================
export const initializeAuthState = () => {
    onAuthStateChange(async (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            
            try {
                // Get user profile from Firestore
                const profileResult = await getUserProfile(user.uid);
                if (profileResult.success) {
                    userProfile = profileResult.data;
                } else {
                    console.error('Failed to get user profile:', profileResult.error);
                    userProfile = null;
                }
            } catch (error) {
                console.error('Error getting user profile:', error);
                userProfile = null;
            }
            
            console.log('User signed in:', user.email);
        } else {
            // User is signed out
            currentUser = null;
            userProfile = null;
            console.log('User signed out');
        }
        
        // Notify all listeners
        authStateListeners.forEach(callback => callback(currentUser, userProfile));
    });
};

// ==================== UTILITY FUNCTIONS ====================
export const getCurrentUserData = () => {
    return { user: currentUser, profile: userProfile };
};

export const isAuthenticated = () => {
    return !!currentUser;
};

export const isBusinessUser = () => {
    return userProfile && userProfile.role === 'business';
};

export const isPersonalUser = () => {
    return userProfile && userProfile.role === 'personal';
};

export const getUserRole = () => {
    return userProfile ? userProfile.role : null;
};

// ==================== AUTH STATE LISTENERS ====================
export const onAuthStateChanged = (callback) => {
    authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
        const index = authStateListeners.indexOf(callback);
        if (index > -1) {
            authStateListeners.splice(index, 1);
        }
    };
};

// ==================== ROUTE PROTECTION ====================
export const requireAuth = (redirectTo = '../../pages/auth/login.html') => {
    if (!isAuthenticated()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
};

export const requireRole = (requiredRole, redirectTo = '../../pages/auth/login.html') => {
    if (!requireAuth(redirectTo)) {
        return false;
    }
    if (getUserRole() !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const userRole = getUserRole();
        pathConfig.redirectToDashboard(userRole);
        return false;
    }
    return true;
};

export const requirePersonalUser = (redirectTo = '../../pages/auth/login.html') => {
    return requireRole('personal', redirectTo);
};

export const requireBusinessUser = (redirectTo = '../../pages/auth/login.html') => {
    return requireRole('business', redirectTo);
};

// ==================== LOGOUT FUNCTION ====================
export const handleLogout = async () => {
    try {
        const result = await logoutUser();
        if (result.success) {
            // Clear local state
            currentUser = null;
            userProfile = null;
            
            // Redirect to login page
            window.location.href = '../../pages/auth/login.html';
        } else {
            console.error('Logout failed:', result.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// ==================== NAVIGATION HELPERS ====================
export const navigateToDashboard = () => {
    if (!isAuthenticated()) {
        pathConfig.redirectTo(pathConfig.getLoginPath());
        return;
    }
    const role = getUserRole();
    pathConfig.redirectToDashboard(role);
};

// Initialize auth state when module is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeAuthState();
    });
} 