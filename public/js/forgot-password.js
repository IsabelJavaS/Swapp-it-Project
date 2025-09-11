// Forgot Password Functionality
import { resetPassword } from '../firebase/auth.js';
import { isAuthenticated, navigateToDashboard } from './auth-state.js';

// DOM elements
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

// Loading state
let isLoading = false;

// ==================== FORM VALIDATION ====================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Add appropriate icon
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    messageDiv.innerHTML = `${icon} ${message}`;
    
    // Insert before form
    forgotPasswordForm.parentNode.insertBefore(messageDiv, forgotPasswordForm);
    
    // Auto-remove after 5 seconds for success/info, 8 seconds for error
    const timeout = type === 'error' ? 8000 : 5000;
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, timeout);
}

function setLoadingState(loading) {
    isLoading = loading;
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        emailInput.disabled = true;
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        emailInput.disabled = false;
    }
}

// ==================== PASSWORD RESET FUNCTION ====================
async function handlePasswordReset(email) {
    try {
        setLoadingState(true);
        
        // Validate email
        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        console.log('Attempting to send password reset email to:', email);
        
        // Send password reset email
        const result = await resetPassword(email);
        
        console.log('Reset password result:', result);
        
        if (result.success) {
            showMessage(
                '🎉 Password reset email sent successfully! Check your inbox and follow the instructions to reset your password.',
                'success'
            );
            
            // Clear form
            forgotPasswordForm.reset();
            
            // Show additional instructions
            setTimeout(() => {
                showMessage(
                    '💡 If you don\'t see the email, please check your spam or junk folder.',
                    'info'
                );
            }, 3000);
            
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Password reset error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        // Handle specific Firebase Auth errors
        let errorMessage = '❌ Failed to send password reset email. Please try again.';
        
        if (error.message.includes('user-not-found') || error.message.includes('auth/user-not-found')) {
            errorMessage = '🔍 No account found with this email address. Please verify your email is correct.';
        } else if (error.message.includes('too-many-requests') || error.message.includes('auth/too-many-requests')) {
            errorMessage = '⏰ Too many attempts. Please wait a few minutes before trying again.';
        } else if (error.message.includes('invalid-email') || error.message.includes('auth/invalid-email')) {
            errorMessage = '📧 Invalid email format. Please enter a valid email address.';
        } else if (error.message.includes('network-request-failed') || error.message.includes('auth/network-request-failed')) {
            errorMessage = '🌐 Connection error. Please check your internet connection and try again.';
        } else if (error.message.includes('Firebase Auth not initialized')) {
            errorMessage = '⚙️ Configuration error. Please refresh the page and try again.';
        } else if (error.message.includes('auth/operation-not-allowed')) {
            errorMessage = '🚫 Password recovery is not enabled for this project.';
        } else if (error.message.includes('auth/invalid-action-code')) {
            errorMessage = '🔗 Invalid recovery link.';
        } else if (error.message.includes('auth/expired-action-code')) {
            errorMessage = '⏳ Recovery link has expired.';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoadingState(false);
    }
}

// ==================== FORM SUBMISSION ====================
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('📧 Please enter your email address', 'error');
        emailInput.focus();
        return;
    }
    
    await handlePasswordReset(email);
}

// ==================== EVENT LISTENERS ====================
forgotPasswordForm.addEventListener('submit', handleFormSubmit);

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
        navigateToDashboard();
        return;
    }
    
    // Focus on email input
    emailInput.focus();
    
    // Add input validation feedback
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            emailInput.style.borderColor = '#dc3545';
            emailInput.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        } else if (email) {
            emailInput.style.borderColor = '#28a745';
            emailInput.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
        } else {
            emailInput.style.borderColor = '#e1e5e9';
            emailInput.style.boxShadow = 'none';
        }
    });
    
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            emailInput.style.borderColor = '#28a745';
            emailInput.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
        } else {
            emailInput.style.borderColor = '#e1e5e9';
            emailInput.style.boxShadow = 'none';
        }
    });
}); 