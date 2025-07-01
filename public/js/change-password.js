// Change Password Functionality
import { updatePassword, confirmPasswordReset } from '../firebase/auth.js';
import { isAuthenticated, navigateToDashboard } from './auth-state.js';

// DOM elements
const changePasswordForm = document.getElementById('changePasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const resetNewPasswordInput = document.getElementById('resetNewPassword');
const resetConfirmPasswordInput = document.getElementById('resetConfirmPassword');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const resetStrengthFill = document.getElementById('resetStrengthFill');
const resetStrengthText = document.getElementById('resetStrengthText');
const pageTitle = document.getElementById('pageTitle');
const pageDescription = document.getElementById('pageDescription');

// Loading state
let isLoading = false;
let isResetMode = false;
let actionCode = null;

// ==================== URL PARSING ====================
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function checkResetMode() {
    // Check if we have action code in URL (from email reset)
    actionCode = getUrlParameter('oobCode') || getUrlParameter('actionCode');
    
    if (actionCode) {
        isResetMode = true;
        pageTitle.textContent = 'Restablecer Contraseña';
        pageDescription.textContent = 'Ingresa tu nueva contraseña para restablecer tu cuenta';
        changePasswordForm.style.display = 'none';
        resetPasswordForm.style.display = 'block';
        
        // Update submit button text
        const resetSubmitBtn = resetPasswordForm.querySelector('.submit-btn');
        const resetBtnText = resetSubmitBtn.querySelector('.btn-text');
        resetBtnText.textContent = 'Restablecer Contraseña';
        
        return true;
    } else {
        isResetMode = false;
        pageTitle.textContent = 'Cambiar Contraseña';
        pageDescription.textContent = 'Ingresa tu nueva contraseña para actualizar tu cuenta';
        changePasswordForm.style.display = 'block';
        resetPasswordForm.style.display = 'none';
        
        return false;
    }
}

// ==================== PASSWORD STRENGTH VALIDATION ====================
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
        score += 25;
        feedback.push('✓ Al menos 8 caracteres');
    } else {
        feedback.push('✗ Al menos 8 caracteres');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 25;
        feedback.push('✓ Letra minúscula');
    } else {
        feedback.push('✗ Letra minúscula');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 25;
        feedback.push('✓ Letra mayúscula');
    } else {
        feedback.push('✗ Letra mayúscula');
    }

    // Number check
    if (/\d/.test(password)) {
        score += 25;
        feedback.push('✓ Número');
    } else {
        feedback.push('✗ Número');
    }

    // Determine strength level
    let strength = 'weak';
    let strengthLabel = 'Débil';

    if (score >= 100) {
        strength = 'strong';
        strengthLabel = 'Fuerte';
    } else if (score >= 75) {
        strength = 'good';
        strengthLabel = 'Buena';
    } else if (score >= 50) {
        strength = 'fair';
        strengthLabel = 'Regular';
    }

    return { score, strength, strengthLabel, feedback };
}

function updatePasswordStrength(password, isReset = false) {
    const strengthInfo = checkPasswordStrength(password);
    
    if (isReset) {
        // Update reset form strength bar
        resetStrengthFill.className = `strength-fill ${strengthInfo.strength}`;
        resetStrengthText.textContent = `Fuerza: ${strengthInfo.strengthLabel}`;
    } else {
        // Update normal form strength bar
        strengthFill.className = `strength-fill ${strengthInfo.strength}`;
        strengthText.textContent = `Fuerza: ${strengthInfo.strengthLabel}`;
    }
    
    return strengthInfo;
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
                button.classList.add('active');
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
                button.classList.remove('active');
            }
        });
    });
}

// ==================== FORM VALIDATION ====================
function validateChangePasswordForm() {
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if current password is provided
    if (!currentPassword) {
        showMessage('Por favor ingresa tu contraseña actual', 'error');
        currentPasswordInput.focus();
        return false;
    }

    // Check if new password is provided
    if (!newPassword) {
        showMessage('Por favor ingresa tu nueva contraseña', 'error');
        newPasswordInput.focus();
        return false;
    }

    // Check password strength
    const strengthInfo = checkPasswordStrength(newPassword);
    if (strengthInfo.score < 75) {
        showMessage('La nueva contraseña debe ser más segura. Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.', 'error');
        newPasswordInput.focus();
        return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        confirmPasswordInput.focus();
        return false;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
        showMessage('La nueva contraseña debe ser diferente a la actual', 'error');
        newPasswordInput.focus();
        return false;
    }

    return true;
}

function validateResetPasswordForm() {
    const newPassword = resetNewPasswordInput.value;
    const confirmPassword = resetConfirmPasswordInput.value;

    // Check if new password is provided
    if (!newPassword) {
        showMessage('Por favor ingresa tu nueva contraseña', 'error');
        resetNewPasswordInput.focus();
        return false;
    }

    // Check password strength
    const strengthInfo = checkPasswordStrength(newPassword);
    if (strengthInfo.score < 75) {
        showMessage('La nueva contraseña debe ser más segura. Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.', 'error');
        resetNewPasswordInput.focus();
        return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        resetConfirmPasswordInput.focus();
        return false;
    }

    return true;
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
    
    // Insert before the active form
    const activeForm = isResetMode ? resetPasswordForm : changePasswordForm;
    activeForm.parentNode.insertBefore(messageDiv, activeForm);
    
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
    
    const activeForm = isResetMode ? resetPasswordForm : changePasswordForm;
    const activeSubmitBtn = activeForm.querySelector('.submit-btn');
    const activeBtnText = activeSubmitBtn.querySelector('.btn-text');
    const activeBtnLoading = activeSubmitBtn.querySelector('.btn-loading');
    
    if (loading) {
        activeSubmitBtn.disabled = true;
        activeBtnText.style.display = 'none';
        activeBtnLoading.style.display = 'flex';
        
        // Disable all inputs in the active form
        const inputs = activeForm.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);
    } else {
        activeSubmitBtn.disabled = false;
        activeBtnText.style.display = 'inline';
        activeBtnLoading.style.display = 'none';
        
        // Enable all inputs in the active form
        const inputs = activeForm.querySelectorAll('input');
        inputs.forEach(input => input.disabled = false);
    }
}

// ==================== PASSWORD CHANGE FUNCTIONS ====================
async function handlePasswordChange(currentPassword, newPassword) {
    try {
        setLoadingState(true);
        
        // Update password in Firebase Auth
        const result = await updatePassword(newPassword);
        
        if (result.success) {
            showMessage(
                '¡Contraseña actualizada exitosamente! Serás redirigido al login.',
                'success'
            );
            
            // Clear form
            changePasswordForm.reset();
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Fuerza de la contraseña';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Password change error:', error);
        
        // Handle specific Firebase Auth errors
        let errorMessage = 'Error al cambiar la contraseña. Por favor intenta de nuevo.';
        
        if (error.message.includes('wrong-password')) {
            errorMessage = 'La contraseña actual es incorrecta.';
        } else if (error.message.includes('weak-password')) {
            errorMessage = 'La nueva contraseña es demasiado débil.';
        } else if (error.message.includes('requires-recent-login')) {
            errorMessage = 'Por seguridad, necesitas volver a iniciar sesión antes de cambiar tu contraseña.';
        } else if (error.message.includes('network-request-failed')) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoadingState(false);
    }
}

async function handlePasswordReset(newPassword) {
    try {
        setLoadingState(true);
        
        // Confirm password reset with action code
        const result = await confirmPasswordReset(actionCode, newPassword);
        
        if (result.success) {
            showMessage(
                '¡Contraseña restablecida exitosamente! Serás redirigido al login.',
                'success'
            );
            
            // Clear form
            resetPasswordForm.reset();
            resetStrengthFill.className = 'strength-fill';
            resetStrengthText.textContent = 'Fuerza de la contraseña';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        // Handle specific Firebase Auth errors
        let errorMessage = 'Error al restablecer la contraseña. Por favor intenta de nuevo.';
        
        if (error.message.includes('expired-action-code')) {
            errorMessage = 'El enlace de restablecimiento ha expirado. Solicita uno nuevo.';
        } else if (error.message.includes('invalid-action-code')) {
            errorMessage = 'El enlace de restablecimiento no es válido. Solicita uno nuevo.';
        } else if (error.message.includes('weak-password')) {
            errorMessage = 'La nueva contraseña es demasiado débil.';
        } else if (error.message.includes('network-request-failed')) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoadingState(false);
    }
}

// ==================== FORM SUBMISSION ====================
async function handleChangePasswordSubmit(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    // Validate form
    if (!validateChangePasswordForm()) {
        return;
    }
    
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    
    await handlePasswordChange(currentPassword, newPassword);
}

async function handleResetPasswordSubmit(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    // Validate form
    if (!validateResetPasswordForm()) {
        return;
    }
    
    const newPassword = resetNewPasswordInput.value;
    
    await handlePasswordReset(newPassword);
}

// ==================== EVENT LISTENERS ====================
changePasswordForm.addEventListener('submit', handleChangePasswordSubmit);
resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in reset mode
    const isReset = checkResetMode();
    
    if (isReset) {
        // Reset mode - no need to check authentication
        console.log('Password reset mode detected');
    } else {
        // Normal change password mode - require authentication
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    // Setup password toggles
    setupPasswordToggles();
    
    // Focus on appropriate input
    if (isReset) {
        resetNewPasswordInput.focus();
    } else {
        currentPasswordInput.focus();
    }
    
    // Add password strength monitoring for both forms
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        if (password) {
            updatePasswordStrength(password, false);
        } else {
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Fuerza de la contraseña';
        }
    });
    
    resetNewPasswordInput.addEventListener('input', () => {
        const password = resetNewPasswordInput.value;
        if (password) {
            updatePasswordStrength(password, true);
        } else {
            resetStrengthFill.className = 'strength-fill';
            resetStrengthText.textContent = 'Fuerza de la contraseña';
        }
    });
    
    // Add input validation feedback for both forms
    const allInputs = [
        currentPasswordInput, newPasswordInput, confirmPasswordInput,
        resetNewPasswordInput, resetConfirmPasswordInput
    ];
    
    allInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.style.borderColor = '#28a745';
                input.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            } else {
                input.style.borderColor = '#e1e5e9';
                input.style.boxShadow = 'none';
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.style.borderColor = '#28a745';
                input.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            } else {
                input.style.borderColor = '#e1e5e9';
                input.style.boxShadow = 'none';
            }
        });
    });
}); 