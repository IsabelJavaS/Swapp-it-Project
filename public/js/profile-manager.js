// Profile Management System
import { 
    getCurrentUserData, 
    isAuthenticated 
} from './auth-state.js';
import { 
    updatePersonalInfo, 
    updateBusinessInfo, 
    updateUserEmail,
    getUserProfile 
} from '../firebase/firestore.js';
import { updateEmail } from '../firebase/auth.js';

// ==================== PROFILE UPDATE FUNCTIONS ====================
export const updateUserPersonalProfile = async (personalData) => {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    const { user } = getCurrentUserData();
    
    try {
        const result = await updatePersonalInfo(user.uid, personalData);
        if (result.success) {
            return { success: true, message: 'Personal information updated successfully' };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error updating personal profile:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserBusinessProfile = async (businessData) => {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    const { user } = getCurrentUserData();
    
    try {
        const result = await updateBusinessInfo(user.uid, businessData);
        if (result.success) {
            return { success: true, message: 'Business information updated successfully' };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error updating business profile:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserEmailAddress = async (newEmail, password) => {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    const { user } = getCurrentUserData();
    
    try {
        // First update Firebase Auth email
        const authResult = await updateEmail(user, newEmail);
        if (!authResult.success) {
            throw new Error(authResult.error);
        }

        // Then update Firestore email
        const firestoreResult = await updateUserEmail(user.uid, newEmail);
        if (!firestoreResult.success) {
            throw new Error(firestoreResult.error);
        }

        return { success: true, message: 'Email updated successfully' };
    } catch (error) {
        console.error('Error updating email:', error);
        return { success: false, error: error.message };
    }
};

// ==================== PROFILE VALIDATION ====================
export const validatePersonalData = (data) => {
    const errors = [];

    if (!data.nombre || data.nombre.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!data.telefono || data.telefono.trim().length < 7) {
        errors.push('Phone number must be at least 7 digits');
    }

    if (!data.direccion || data.direccion.trim().length < 5) {
        errors.push('Address must be at least 5 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateBusinessData = (data) => {
    const errors = [];

    if (!data.nombreNegocio || data.nombreNegocio.trim().length < 2) {
        errors.push('Business name must be at least 2 characters long');
    }

    if (!data.ruc || data.ruc.trim().length < 10) {
        errors.push('RUC must be at least 10 digits');
    }

    if (!data.direccionNegocio || data.direccionNegocio.trim().length < 5) {
        errors.push('Business address must be at least 5 characters long');
    }

    if (!data.telefonoNegocio || data.telefonoNegocio.trim().length < 7) {
        errors.push('Business phone must be at least 7 digits');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
        isValid: emailRegex.test(email),
        error: emailRegex.test(email) ? null : 'Please enter a valid email address'
    };
};

// ==================== PROFILE DISPLAY FUNCTIONS ====================
export const loadUserProfile = async () => {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    const { user } = getCurrentUserData();
    
    try {
        const result = await getUserProfile(user.uid);
        if (result.success) {
            return { success: true, data: result.data };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        return { success: false, error: error.message };
    }
};

export const formatUserProfile = (profileData) => {
    const formatted = {
        basic: {
            email: profileData.email,
            role: profileData.role,
            status: profileData.status,
            createdAt: profileData.createdAt,
            lastLogin: profileData.lastLogin
        },
        points: {
            balance: profileData.points?.balance || 0,
            history: profileData.points?.history || []
        },
        stats: {
            totalSales: profileData.stats?.totalSales || 0,
            totalPurchases: profileData.stats?.totalPurchases || 0,
            rating: profileData.stats?.rating || 0,
            reviewCount: profileData.stats?.reviewCount || 0,
            productsCount: profileData.stats?.productsCount || 0
        }
    };

    // Add role-specific data
    if (profileData.role === 'personal' && profileData.personal) {
        formatted.personal = profileData.personal;
    } else if (profileData.role === 'business' && profileData.business) {
        formatted.business = profileData.business;
    }

    return formatted;
};

// ==================== UI HELPER FUNCTIONS ====================
export const showProfileUpdateSuccess = (message) => {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'profile-update-success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
};

export const showProfileUpdateError = (error) => {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'profile-update-error';
    notification.textContent = error;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 