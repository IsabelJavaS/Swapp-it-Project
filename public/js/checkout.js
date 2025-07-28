// Checkout Page Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeCheckout();
});

// Initialize checkout
const initializeCheckout = () => {
    loadOrderSummary();
    setupEventListeners();
    setupFormValidation();
    setupPaymentMethodToggle();
};

// Load order summary from cart
const loadOrderSummary = () => {
    try {
        const checkoutCart = localStorage.getItem('swappit-checkout-cart');
        if (!checkoutCart) {
            // Redirect to marketplace if no cart data
            window.location.href = '/pages/marketplace/marketplace-page.html';
            return;
        }

        const cartData = JSON.parse(checkoutCart);
        const { items, total } = cartData;

        if (!items || items.length === 0) {
            // Redirect to marketplace if cart is empty
            window.location.href = '/pages/marketplace/marketplace-page.html';
            return;
        }

        renderOrderSummary(items, total);
        populateUserData();
    } catch (error) {
        console.error('Error loading order summary:', error);
        showNotification('Error loading order summary', 'error');
    }
};

// Render order summary
const renderOrderSummary = (items, total) => {
    const orderSummary = document.getElementById('orderSummary');
    const mobileOrderSummary = document.getElementById('mobileOrderSummary');
    
    if (!orderSummary && !mobileOrderSummary) return;

    const summaryHTML = `
        <div class="order-items">
            ${items.map(item => `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${item.images?.[0] || 'https://via.placeholder.com/60x60'}" alt="${item.title}">
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-title">${item.title}</div>
                        <div class="order-item-seller">por ${item.sellerName || 'Vendedor'}</div>
                        <div class="order-item-price">
                            $${item.price.toFixed(2)}
                            <span class="order-item-quantity">x${item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-totals">
            <div class="order-total-row subtotal">
                <span>Subtotal:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="order-total-row shipping">
                <span>Envío:</span>
                <span>Gratis</span>
            </div>
            <div class="order-total-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;

    if (orderSummary) {
        orderSummary.innerHTML = summaryHTML;
    }
    
    if (mobileOrderSummary) {
        mobileOrderSummary.innerHTML = summaryHTML;
    }
};

// Populate user data if available
const populateUserData = () => {
    // Try to get user data from various sources
    let userData = null;
    
    if (window.SwappitApp?.user) {
        userData = window.SwappitApp.user;
    } else if (localStorage.getItem('userData')) {
        userData = JSON.parse(localStorage.getItem('userData'));
    }

    if (userData) {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');

        if (firstName && userData.displayName) {
            const names = userData.displayName.split(' ');
            firstName.value = names[0] || '';
            if (lastName && names.length > 1) {
                lastName.value = names.slice(1).join(' ') || '';
            }
        }

        if (email && userData.email) {
            email.value = userData.email;
        }
    }
};

// Setup event listeners
const setupEventListeners = () => {
    // Place order button
    const btnPlaceOrder = document.getElementById('btnPlaceOrder');
    if (btnPlaceOrder) {
        btnPlaceOrder.addEventListener('click', handlePlaceOrder);
    }

    // Continue shopping button
    const btnContinueShopping = document.getElementById('btnContinueShopping');
    if (btnContinueShopping) {
        btnContinueShopping.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/pages/marketplace/marketplace-page.html';
        });
    }

    // Form validation on input
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
};

// Setup payment method toggle
const setupPaymentMethodToggle = () => {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardForm = document.getElementById('creditCardForm');

    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                creditCardForm.style.display = 'block';
            } else {
                creditCardForm.style.display = 'none';
            }
        });
    });
};

// Setup form validation
const setupFormValidation = () => {
    const form = document.querySelector('.checkout-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                handlePlaceOrder();
            }
        });
    }
};

// Validate form
const validateForm = () => {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'address', 'city', 'state', 'zipCode'
    ];

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    // Validate payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showFieldError('paymentMethod', 'Por favor selecciona un método de pago');
        isValid = false;
    }

    // Validate credit card if selected
    if (selectedPayment && selectedPayment.value === 'card') {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        cardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !validateField(field)) {
                isValid = false;
            }
        });
    }

    return isValid;
};

// Validate individual field
const validateField = (field) => {
    if (!field) return false;

    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }

    // Email validation
    if (fieldId === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor ingresa un email válido';
        }
    }

    // Phone validation
    if (fieldId === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Por favor ingresa un número de teléfono válido';
        }
    }

    // Credit card validations
    if (fieldId === 'cardNumber' && value) {
        const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor ingresa un número de tarjeta válido';
        }
    }

    if (fieldId === 'expiryDate' && value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato: MM/YY';
        }
    }

    if (fieldId === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorMessage = 'CVV debe tener 3 o 4 dígitos';
        }
    }

    // Show/hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(fieldId, errorMessage);
    }

    return isValid;
};

// Show field error
const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
};

// Clear field error
const clearFieldError = (field) => {
    if (!field) return;

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
};

// Handle place order
const handlePlaceOrder = async () => {
    if (!validateForm()) {
        showNotification('Por favor corrige los errores en el formulario', 'error');
        return;
    }

    const btnPlaceOrder = document.getElementById('btnPlaceOrder');
    if (btnPlaceOrder) {
        btnPlaceOrder.disabled = true;
        btnPlaceOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    }

    try {
        // Get form data
        const formData = getFormData();
        
        // Get cart data
        const checkoutCart = localStorage.getItem('swappit-checkout-cart');
        const cartData = JSON.parse(checkoutCart);

        // Create order object
        const order = {
            ...formData,
            items: cartData.items,
            total: cartData.total,
            orderDate: new Date().toISOString(),
            status: 'pending',
            orderId: generateOrderId()
        };

        // Process payment
        const paymentResult = await processPayment(order);
        
        if (paymentResult.success) {
            // Clear cart
            localStorage.removeItem('swappit-cart');
            localStorage.removeItem('swappit-checkout-cart');
            
            // Show success message
            showNotification('¡Pedido realizado con éxito!', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = `/pages/orders/confirmation.html?orderId=${order.orderId}`;
            }, 2000);
        } else {
            throw new Error(paymentResult.error);
        }

    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error procesando el pedido. Por favor intenta de nuevo.', 'error');
    } finally {
        if (btnPlaceOrder) {
            btnPlaceOrder.disabled = false;
            btnPlaceOrder.innerHTML = '<i class="fas fa-lock"></i> Confirmar Pedido';
        }
    }
};

// Get form data
const getFormData = () => {
    const formData = {
        // Shipping information
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        zipCode: document.getElementById('zipCode')?.value || '',
        
        // Payment method
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || '',
        
        // Order notes
        notes: document.getElementById('orderNotes')?.value || ''
    };

    // Add credit card info if selected
    if (formData.paymentMethod === 'card') {
        formData.cardNumber = document.getElementById('cardNumber')?.value || '';
        formData.expiryDate = document.getElementById('expiryDate')?.value || '';
        formData.cvv = document.getElementById('cvv')?.value || '';
        formData.cardName = document.getElementById('cardName')?.value || '';
    }

    return formData;
};

// Process payment
const processPayment = async (order) => {
    // Simulate payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful payment
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                message: 'Payment processed successfully'
            });
        }, 2000);
    });
};

// Generate order ID
const generateOrderId = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Generate transaction ID
const generateTransactionId = () => {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Show notification
const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `checkout-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3468c0'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}; 