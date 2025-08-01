// Enhanced Register JavaScript - Simplified Version
console.log('Register script loaded');

// DOM elements
let registerForm, registerBtn, personalBtn, businessBtn, personalFields, businessFields;
let colegioSelect, otherSchoolGroup, otherSchoolInput;

// Loading state
let isLoading = false;

// ==================== DOM INITIALIZATION ====================
function initializeDOM() {
    console.log('Initializing DOM elements...');
    
    registerForm = document.getElementById('registerForm');
    registerBtn = document.querySelector('.register-btn');
    personalBtn = document.getElementById('personalBtn');
    businessBtn = document.getElementById('businessBtn');
    personalFields = document.getElementById('personalFields');
    businessFields = document.getElementById('businessFields');
    colegioSelect = document.getElementById('colegio');
    otherSchoolGroup = document.getElementById('otherSchoolGroup');
    otherSchoolInput = document.getElementById('otherSchool');

    console.log('DOM elements found:', {
        registerForm: !!registerForm,
        registerBtn: !!registerBtn,
        personalBtn: !!personalBtn,
        businessBtn: !!businessBtn,
        personalFields: !!personalFields,
        businessFields: !!businessFields,
        colegioSelect: !!colegioSelect,
        otherSchoolGroup: !!otherSchoolGroup,
        otherSchoolInput: !!otherSchoolInput
    });

    // Verify all elements exist
    if (!registerForm || !registerBtn || !personalBtn || !businessBtn || !personalFields || !businessFields) {
        console.error('Required DOM elements not found');
        return false;
    }

    return true;
}

// ==================== ROLE SELECTION ====================
function initializeRoleSelection() {
    console.log('Initializing role selection...');
    
    if (!personalBtn || !businessBtn) {
        console.error('Role buttons not found');
        return;
    }

    // Remove any existing event listeners
    personalBtn.replaceWith(personalBtn.cloneNode(true));
    businessBtn.replaceWith(businessBtn.cloneNode(true));
    
    // Get fresh references
    personalBtn = document.getElementById('personalBtn');
    businessBtn = document.getElementById('businessBtn');

    personalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Personal button clicked');
        switchToRole('personal');
    });
    
    businessBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Business button clicked');
        switchToRole('business');
    });
    
    // Set initial state
    switchToRole('personal');
}

function switchToRole(role) {
    console.log('Switching to role:', role);
    
    // Update button states
    personalBtn.classList.toggle('active', role === 'personal');
    businessBtn.classList.toggle('active', role === 'business');
    
    console.log('Button states updated');
    console.log('Personal button active:', personalBtn.classList.contains('active'));
    console.log('Business button active:', businessBtn.classList.contains('active'));
    
    // Show/hide fields with animation
    if (role === 'personal') {
        businessFields.classList.add('hidden');
        personalFields.classList.remove('hidden');
        personalFields.style.animation = 'slideInFromRight 0.5s ease';
        console.log('Showing personal fields, hiding business fields');
    } else {
        personalFields.classList.add('hidden');
        businessFields.classList.remove('hidden');
        businessFields.style.animation = 'slideInFromRight 0.5s ease';
        console.log('Showing business fields, hiding personal fields');
    }
    
    // Update form validation
    updateFormValidation(role);
}

function updateFormValidation(role) {
    const personalInputs = personalFields.querySelectorAll('input, select');
    const businessInputs = businessFields.querySelectorAll('input, select, textarea');
    
    if (role === 'personal') {
        personalInputs.forEach(input => input.required = true);
        businessInputs.forEach(input => input.required = false);
    } else {
        personalInputs.forEach(input => input.required = false);
        businessInputs.forEach(input => input.required = true);
    }
}

// ==================== SCHOOL SELECTION ====================
function initializeSchoolSelection() {
    if (!colegioSelect) {
        console.error('School select not found');
        return;
    }
    
    colegioSelect.addEventListener('change', handleSchoolSelection);
}

function handleSchoolSelection() {
    const selectedValue = colegioSelect.value;
    
    if (selectedValue === 'other') {
        otherSchoolGroup.style.display = 'block';
        otherSchoolInput.required = true;
        otherSchoolInput.focus();
    } else {
        otherSchoolGroup.style.display = 'none';
        otherSchoolInput.required = false;
        otherSchoolInput.value = '';
    }
}

// ==================== FORM VALIDATION ====================
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
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
    
    // Confirm password validation
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }
    
    // Role-specific validation
    const activeRole = personalBtn.classList.contains('active') ? 'personal' : 'business';
    
    if (activeRole === 'personal') {
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const colegio = colegioSelect.value;
        
        if (!nombre || !telefono || !direccion || !colegio) {
            showError('Please fill in all required fields for personal account');
            return false;
        }
        
        if (colegio === 'other' && !otherSchoolInput.value) {
            showError('Please enter your school name');
            return false;
        }
    } else {
        const businessInputs = businessFields.querySelectorAll('input[required], select[required], textarea[required]');
        for (let input of businessInputs) {
            if (!input.value.trim()) {
                showError('Please fill in all required fields for business account');
                return false;
            }
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
        border-radius: 8px;
        padding: 12px 16px;
        margin: 10px 0;
        text-align: center;
        font-size: 0.9rem;
        animation: slideInFromTop 0.3s ease;
    `;

    registerForm.insertBefore(errorDiv, registerForm.firstChild);

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
        border-radius: 8px;
        padding: 12px 16px;
        margin: 10px 0;
        text-align: center;
        font-size: 0.9rem;
        animation: slideInFromTop 0.3s ease;
    `;

    registerForm.insertBefore(successDiv, registerForm.firstChild);
}

function setLoadingState(loading) {
    isLoading = loading;
    
    if (loading) {
        registerBtn.classList.add('loading');
        registerBtn.disabled = true;
        const btnText = registerBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Creating Account...';
        }
    } else {
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
        const btnText = registerBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Create Account';
        }
    }
}

// ==================== PASSWORD TOGGLE ====================
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const eyeIcon = button.querySelector('.eye-icon');
            
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
        });
    });
}

// ==================== FORM SUBMISSION ====================
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isLoading) return;

    // Validate form
    if (!validateForm()) {
        return;
    }

    setLoadingState(true);

    try {
        // Get form data
        const formData = new FormData(registerForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const activeRole = personalBtn.classList.contains('active') ? 'personal' : 'business';
        
        console.log('Form submitted:', { email, activeRole });
        
        // For now, just show success message
        showSuccess(activeRole === 'personal' ? 
            'Personal account created successfully! Welcome to Swapp-it!' : 
            'Business account created successfully! Welcome to Swapp-it!');
        
        // In a real implementation, you would create the user account here
        // const authResult = await createUserWithEmailAndPassword(email, password);
        
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Failed to create account. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// ==================== INPUT ANIMATIONS ====================
function addInputAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            const wrapper = input.closest('.input-3d-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'translateY(-2px)';
            }
        });
        
        input.addEventListener('blur', () => {
            const wrapper = input.closest('.input-3d-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'translateY(0)';
            }
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

// ==================== BACK BUTTON ====================
function initializeBackButton() {
    const backBtn = document.getElementById('backBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // Animation effect
            this.style.transform = 'translateX(-5px) scale(0.95)';
            
            setTimeout(() => {
                // Go back in history or to home
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/';
                }
            }, 150);
        });
        
        // Restore button after animation
        backBtn.addEventListener('transitionend', function() {
            this.style.transform = '';
        });
    }
}

// ==================== SOCIAL LOGIN ====================
function initializeSocialLogin() {
    const googleBtn = document.querySelector('.google-btn');
    const microsoftBtn = document.querySelector('.microsoft-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showError('Google sign-up coming soon!');
        });
    }
    
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', () => {
            showError('Microsoft sign-up coming soon!');
        });
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Register page loaded');
    
    // Initialize DOM elements
    if (!initializeDOM()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    // Initialize all components
    initializeRoleSelection();
    initializeSchoolSelection();
    initializePasswordToggles();
    initializeBackButton();
    initializeSocialLogin();
    addInputAnimations();
    
    // Set up form submission
    registerForm.addEventListener('submit', handleFormSubmit);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromTop {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .register-btn.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .register-btn.loading .btn-icon {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Register page initialization complete');
});

// Make functions available globally for testing
window.registerFunctions = {
    switchToRole,
    validateForm,
    showError,
    showSuccess
}; 