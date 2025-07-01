// Firebase imports
import { registerUser } from '../firebase/auth.js';
import { createUserProfile } from '../firebase/firestore.js';
import { isAuthenticated, navigateToDashboard } from './auth-state.js';

// DOM elements
const roleButtons = document.querySelectorAll('.role-btn');
const personalFields = document.getElementById('personalFields');
const businessFields = document.getElementById('businessFields');
const registerForm = document.getElementById('registerForm');

// Loading state
let isLoading = false;

// ==================== ROLE SELECTION ====================
function handleRoleChange(event) {
    const selectedRole = event.target.dataset.role;
    
    // Update buttons
    roleButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide fields based on role
    if (selectedRole === 'personal') {
        personalFields.classList.remove('hidden');
        businessFields.classList.add('hidden');
        toggleRequiredFields(personalFields, true);
        toggleRequiredFields(businessFields, false);
    } else {
        personalFields.classList.add('hidden');
        businessFields.classList.remove('hidden');
        toggleRequiredFields(personalFields, false);
        toggleRequiredFields(businessFields, true);
    }
}

function toggleRequiredFields(container, required) {
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (required) {
            input.setAttribute('required', '');
        } else {
            input.removeAttribute('required');
        }
    });
}

// ==================== FORM VALIDATION ====================
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const selectedRole = document.querySelector('.role-btn.active').dataset.role;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Password validation
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }

    // Role-specific validation
    if (selectedRole === 'personal') {
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;

        if (!nombre.trim() || !telefono.trim() || !direccion.trim()) {
            showError('Please fill in all required personal fields');
            return false;
        }
    } else {
        const nombreNegocio = document.getElementById('nombreNegocio').value;
        const ruc = document.getElementById('ruc').value;
        const direccionNegocio = document.getElementById('direccionNegocio').value;
        const telefonoNegocio = document.getElementById('telefonoNegocio').value;

        if (!nombreNegocio.trim() || !ruc.trim() || !direccionNegocio.trim() || !telefonoNegocio.trim()) {
            showError('Please fill in all required business fields');
            return false;
        }
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

    const form = document.getElementById('registerForm');
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

    const form = document.getElementById('registerForm');
    form.insertBefore(successDiv, form.firstChild);
}

function setLoadingState(loading) {
    isLoading = loading;
    const submitBtn = document.querySelector('.register-btn');
    
    if (loading) {
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.textContent = 'Sign Up';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// ==================== FIREBASE INTEGRATION ====================
async function handleRegistration(formData) {
    try {
        setLoadingState(true);
        
        const email = formData.get('email');
        const password = formData.get('password');
        const selectedRole = document.querySelector('.role-btn.active').dataset.role;

        console.log('Starting registration process...');
        console.log('Email:', email);
        console.log('Role:', selectedRole);

        // 1. Create Firebase Auth user
        console.log('Creating Firebase Auth user...');
        const authResult = await registerUser(email, password, formData.get('nombre') || formData.get('nombreNegocio'));
        
        if (!authResult.success) {
            console.error('Auth creation failed:', authResult.error);
            throw new Error(authResult.error);
        }

        console.log('Firebase Auth user created successfully:', authResult.user.uid);

        // 2. Prepare user profile data
        const userProfile = {
            email: email,
            role: selectedRole,
            createdAt: new Date(),
            status: 'active'
        };

        // Add role-specific data
        if (selectedRole === 'personal') {
            userProfile.personal = {
                nombre: formData.get('nombre'),
                telefono: formData.get('telefono'),
                direccion: formData.get('direccion')
            };
        } else {
            userProfile.business = {
                nombreNegocio: formData.get('nombreNegocio'),
                ruc: formData.get('ruc'),
                direccionNegocio: formData.get('direccionNegocio'),
                telefonoNegocio: formData.get('telefonoNegocio'),
                tipoNegocio: formData.get('tipoNegocio'),
                descripcionNegocio: formData.get('descripcionNegocio')
            };
        }

        console.log('User profile data prepared:', userProfile);

        // 3. Create Firestore user profile
        console.log('Creating Firestore user profile...');
        console.log('User ID:', authResult.user.uid);
        console.log('User Profile Data:', JSON.stringify(userProfile, null, 2));
        
        const profileResult = await createUserProfile(authResult.user.uid, userProfile);
        
        console.log('Profile creation result:', profileResult);
        
        if (!profileResult.success) {
            console.error('Profile creation failed:', profileResult.error);
            console.error('Error code:', profileResult.errorCode);
            console.error('Original error:', profileResult.originalError);
            
            // If profile creation fails, we should clean up the auth user
            // But for now, let's just show the error
            throw new Error(`Profile creation failed: ${profileResult.error}`);
        }

        console.log('Firestore user profile created successfully');

        // 4. Success - redirect to dashboard
        showSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            // Redirect based on role
            if (selectedRole === 'personal') {
                window.location.href = '../marketplace/dashboardStudent.html';
            } else {
                window.location.href = '../marketplace/dashboardBusiness.html';
            }
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message;
        
        if (error.message.includes('permission') || error.message.includes('insufficient')) {
            errorMessage = 'Permission error: Please check your Firebase configuration and security rules.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error: Please check your internet connection and try again.';
        } else if (error.message.includes('auth/email-already-in-use')) {
            errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
        } else if (error.message.includes('auth/weak-password')) {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('auth/invalid-email')) {
            errorMessage = 'Please enter a valid email address.';
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
    const formData = new FormData(registerForm);
    
    // Handle registration
    await handleRegistration(formData);
}

// ==================== EVENT LISTENERS ====================
roleButtons.forEach(button => {
    button.addEventListener('click', handleRoleChange);
});

registerForm.addEventListener('submit', handleFormSubmit);

// Initialize form state
document.addEventListener('DOMContentLoaded', () => {
    console.log('Registration page loaded');
    
    // Check if user is already authenticated
    if (isAuthenticated()) {
        console.log('User already authenticated, redirecting...');
        navigateToDashboard();
        return;
    }
    
    // Set initial role
    document.querySelector('.role-btn.active').click();
}); 