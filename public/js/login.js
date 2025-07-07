// Firebase imports
import { loginUser } from '../firebase/auth.js';
import { getUserProfile, updateLastLogin } from '../firebase/firestore.js';
import { isAuthenticated, navigateToDashboard } from './auth-state.js';
import pathConfig from './config.js';

// DOM elements
const loginForm = document.getElementById('loginForm');

// Loading state
let isLoading = false;

// ==================== FORM VALIDATION ====================
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Password validation
    if (password.length < 1) {
        showError('Please enter your password');
        return false;
    }

    return true;
}

// ==================== USER FEEDBACK ====================
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
        text-align: center;
    `;

    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        color: #155724;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
        text-align: center;
    `;

    const form = document.getElementById('loginForm');
    form.insertBefore(successDiv, form.firstChild);
}

function setLoadingState(loading) {
    isLoading = loading;
    const submitBtn = document.querySelector('.login-btn');
    
    if (loading) {
        submitBtn.textContent = 'Logging In...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.textContent = 'Log In';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// ==================== FIREBASE INTEGRATION ====================
async function handleLogin(formData) {
    try {
        setLoadingState(true);
        
        const email = formData.get('email');
        const password = formData.get('password');

        // 1. Login with Firebase Auth
        const authResult = await loginUser(email, password);
        
        if (!authResult.success) {
            throw new Error(authResult.error);
        }

        // 2. Get user profile from Firestore
        const profileResult = await getUserProfile(authResult.user.uid);
        
        if (!profileResult.success) {
            throw new Error('User profile not found');
        }

        const userProfile = profileResult.data;

        // 3. Update last login timestamp
        await updateLastLogin(authResult.user.uid);

        // 4. Success - redirect based on role
        showSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
            pathConfig.redirectToDashboard(userProfile.role);
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Firebase Auth errors
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.message.includes('user-not-found')) {
            errorMessage = 'No account found with this email address.';
        } else if (error.message.includes('wrong-password')) {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.message.includes('too-many-requests')) {
            errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (error.message.includes('user-disabled')) {
            errorMessage = 'This account has been disabled.';
        }
        
        showError(errorMessage);
    } finally {
        setLoadingState(false);
    }
}

// ==================== FORM SUBMISSION ====================
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isLoading) return;

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Get form data
    const formData = new FormData(loginForm);
    
    // Handle login
    await handleLogin(formData);
}

// ==================== EVENT LISTENERS ====================
loginForm.addEventListener('submit', handleFormSubmit);

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
        navigateToDashboard();
    }
}); 