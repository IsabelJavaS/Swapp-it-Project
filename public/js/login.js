// Firebase imports
import { loginUser } from '../firebase/auth.js';
import { getUserProfile, updateLastLogin } from '../firebase/firestore.js';
import { isAuthenticated, navigateToDashboard } from './auth-state.js';
import pathConfig from './config.js';

// DOM elements
const loginForm = document.getElementById('loginForm');
const loginBtn = document.querySelector('.login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.querySelector('.toggle-password');

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
    
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        loginBtn.querySelector('.btn-text').textContent = 'Signing In...';
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        loginBtn.querySelector('.btn-text').textContent = 'Sign In';
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
        showSuccessAnimation();
        showSuccess('Login successful! Redirecting...');
        
        // Store login info for welcome icon (but don't show icon yet)
        sessionStorage.setItem('justLoggedIn', 'true');
        sessionStorage.setItem('userRole', userProfile.role);
        
        setTimeout(() => {
            pathConfig.redirectToDashboard(userProfile.role);
        }, 2000);

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

    // Add loading animation
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.classList.add('loading');
    }

    // Validate form
    if (!validateForm()) {
        if (loginBtn) {
            loginBtn.classList.remove('loading');
        }
        return;
    }

    // Get form data
    const formData = new FormData(loginForm);
    
    // Handle login
    await handleLogin(formData);
}

// ==================== PASSWORD TOGGLE ====================
function togglePasswordVisibility() {
    const targetId = togglePasswordBtn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    
    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.innerHTML = `<svg class="icon-eye-off" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-11-7-11-7a18.77 18.77 0 0 1 5.06-5.94M1 1l22 22"/>
                <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
            </svg>`;
        } else {
            input.type = 'password';
            eyeIcon.innerHTML = `<svg class="icon-eye" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`;
        }
    }
}

// ==================== INPUT ANIMATIONS ====================
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        // Add typing animation
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
    });
}

// ==================== FORM VALIDATION ENHANCEMENTS ====================
function addFormValidation() {
    // Real-time email validation
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
        } else {
            clearFieldError(emailInput);
        }
    });
    
    // Real-time password validation
    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value;
        
        if (password && password.length < 6) {
            showFieldError(passwordInput, 'Password must be at least 6 characters');
        } else {
            clearFieldError(passwordInput);
        }
    });
}

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorDiv = formGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ==================== SUCCESS ANIMATION ====================
function showSuccessAnimation() {
    const loginBox = document.querySelector('.login-box');
    loginBox.classList.add('success');
    
    // Create success particles (Spline-style)
    createSuccessParticles(loginBox);
    
    setTimeout(() => {
        loginBox.classList.remove('success');
    }, 1800);
}



function createSuccessParticles(container) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #48bb78, #38a169);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);

        // Animate particle
        setTimeout(() => {
            particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
            particle.style.opacity = '0';
        }, i * 50);

            setTimeout(() => {
                particle.remove();
            }, 1000 + i * 50);
        }
    }



// ==================== EVENT LISTENERS ====================
loginForm.addEventListener('submit', handleFormSubmit);

// Password toggle
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
        navigateToDashboard();
    }
    
    // Initialize animations
    addInputAnimations();
    addFormValidation();
    
    // Add floating shapes animation
    animateFloatingShapes();
});

// ==================== FLOATING SHAPES ANIMATION ====================
function animateFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Add mouse interaction
        shape.addEventListener('mouseenter', () => {
            shape.style.transform = 'scale(1.2) rotate(45deg)';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.transform = '';
        });
    });
} 