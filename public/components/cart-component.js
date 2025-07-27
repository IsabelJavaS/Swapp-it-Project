// Cart Component for SWAPPIT
class CartComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cartItems = [];
        this.isOpen = false;
        this.total = 0;
    }

    connectedCallback() {
        this.loadCartFromStorage();
        this.render();
        this.attachEventListeners();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('swappit-cart');
            if (savedCart) {
                this.cartItems = JSON.parse(savedCart);
                this.calculateTotal();
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cartItems = [];
        }
    }

    // Save cart to localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('swappit-cart', JSON.stringify(this.cartItems));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        this.calculateTotal();
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto agregado al carrito');
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.id !== productId);
        this.calculateTotal();
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto removido del carrito');
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.cartItems.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.calculateTotal();
            this.saveCartToStorage();
            this.updateCartDisplay();
        }
    }

    // Calculate total
    calculateTotal() {
        this.total = this.cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }

    // Update cart count badge
    updateCartCount() {
        const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = this.shadowRoot.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Update cart display
    updateCartDisplay() {
        const cartItemsContainer = this.shadowRoot.querySelector('.cart-items');
        const cartTotal = this.shadowRoot.querySelector('.cart-total');
        const emptyCart = this.shadowRoot.querySelector('.empty-cart');
        const cartActions = this.shadowRoot.querySelector('.cart-actions');
        
        if (cartItemsContainer) {
            if (this.cartItems.length === 0) {
                cartItemsContainer.innerHTML = '';
                if (emptyCart) emptyCart.style.display = 'block';
                if (cartActions) cartActions.style.display = 'none';
            } else {
                if (emptyCart) emptyCart.style.display = 'none';
                if (cartActions) cartActions.style.display = 'block';
                this.renderCartItems(cartItemsContainer);
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    // Render cart items
    renderCartItems(container) {
        container.innerHTML = this.cartItems.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.images?.[0] || 'https://via.placeholder.com/60x60'}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-seller">por ${item.sellerName || 'Vendedor'}</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-product-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-product-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #3468c0;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                
                :host {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: auto !important;
                    height: auto !important;
                    margin-left: 1rem !important;
                }
                
                /* CSS Variables */
                :host {
                    --swappit-blue: #3468c0;
                    --swappit-orange: #ffa424;
                    --swappit-blue-hover: #1d4ed8;
                    --swappit-orange-hover: #ff5722;
                    --neutral-dark: #1e293b;
                    --neutral-medium: #64748b;
                    --neutral-light: #f1f5f9;
                    --background-white: #ffffff;
                    --shadow-color: rgba(37, 99, 235, 0.1);
                    --font-primary: 'Poppins', sans-serif;
                    --font-secondary: 'Inter', sans-serif;
                    --border-radius: 8px;
                    --transition: all 0.3s ease;
                }
                
                /* Cart Button */
                .cart-button {
                    position: relative;
                    background: none;
                    border: none;
                    color: var(--swappit-blue);
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    transition: var(--transition);
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                
                .cart-button:hover {
                    background: var(--neutral-light);
                    color: var(--swappit-blue-hover);
                    transform: scale(1.05);
                }
                
                .cart-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--swappit-orange);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    font-family: var(--font-primary);
                    display: none;
                    box-shadow: 0 2px 4px rgba(255, 164, 36, 0.4);
                    border: 2px solid white;
                }
                
                /* Cart Sidebar */
                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: var(--background-white);
                    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    transition: right 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-sidebar.open {
                    right: 0;
                }
                
                /* Cart Header */
                .cart-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--neutral-light);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    color: white;
                }
                
                .cart-title {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1.25rem;
                    margin: 0;
                }
                
                .cart-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: var(--transition);
                }
                
                .cart-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                /* Cart Content */
                .cart-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                }
                
                /* Empty Cart */
                .empty-cart {
                    display: none;
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--neutral-medium);
                }
                
                .empty-cart i {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    color: var(--neutral-light);
                }
                
                .empty-cart h3 {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--neutral-dark);
                }
                
                .empty-cart p {
                    font-family: var(--font-secondary);
                    margin-bottom: 2rem;
                }
                
                .btn-shop-now {
                    background: var(--swappit-blue);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    text-decoration: none;
                    display: inline-block;
                }
                
                .btn-shop-now:hover {
                    background: var(--swappit-blue-hover);
                    transform: translateY(-2px);
                }
                
                /* Cart Items */
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .cart-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid var(--neutral-light);
                    border-radius: var(--border-radius);
                    background: var(--background-white);
                    transition: var(--transition);
                }
                
                .cart-item:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .cart-item-image {
                    flex-shrink: 0;
                }
                
                .cart-item-image img {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius);
                    object-fit: cover;
                }
                
                .cart-item-details {
                    flex: 1;
                    min-width: 0;
                }
                
                .cart-item-title {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin: 0 0 0.25rem 0;
                    color: var(--neutral-dark);
                    line-height: 1.3;
                }
                
                .cart-item-seller {
                    font-family: var(--font-secondary);
                    font-size: 0.8rem;
                    color: var(--neutral-medium);
                    margin: 0 0 0.5rem 0;
                }
                
                .cart-item-price {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    color: var(--swappit-blue);
                    font-size: 0.9rem;
                }
                
                .cart-item-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                }
                
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--neutral-light);
                    border-radius: 20px;
                    padding: 0.25rem;
                }
                
                .quantity-btn {
                    background: none;
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition);
                    color: var(--neutral-dark);
                    font-size: 0.7rem;
                }
                
                .quantity-btn:hover {
                    background: var(--swappit-blue);
                    color: white;
                }
                
                .quantity {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 0.8rem;
                    min-width: 20px;
                    text-align: center;
                }
                
                .remove-btn {
                    background: none;
                    border: none;
                    color: #dc2626;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: var(--transition);
                    font-size: 0.8rem;
                }
                
                .remove-btn:hover {
                    background: #fef2f2;
                    transform: scale(1.1);
                }
                
                /* Cart Footer */
                .cart-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--neutral-light);
                    background: var(--background-white);
                }
                
                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--neutral-light);
                }
                
                .total-label {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: var(--neutral-dark);
                }
                
                .total-amount {
                    font-family: var(--font-primary);
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: var(--swappit-blue);
                }
                
                .cart-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .btn-checkout {
                    background: var(--swappit-orange);
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    font-family: var(--font-primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .btn-checkout:hover {
                    background: var(--swappit-orange-hover);
                    transform: translateY(-2px);
                }
                
                .btn-continue-shopping {
                    background: transparent;
                    color: var(--swappit-blue);
                    border: 2px solid var(--swappit-blue);
                    padding: 0.75rem;
                    border-radius: var(--border-radius);
                    font-family: var(--font-primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .btn-continue-shopping:hover {
                    background: var(--swappit-blue);
                    color: white;
                }
                
                /* Overlay */
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: var(--transition);
                }
                
                .cart-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .cart-sidebar {
                        width: 100vw;
                        right: -100vw;
                    }
                }
            </style>
            
            <!-- Cart Button -->
            <button class="cart-button" id="cartButton">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
            </button>
            
            <!-- Cart Overlay -->
            <div class="cart-overlay" id="cartOverlay"></div>
            
            <!-- Cart Sidebar -->
            <div class="cart-sidebar" id="cartSidebar">
                <div class="cart-header">
                    <h2 class="cart-title">Carrito de Compras</h2>
                    <button class="cart-close" id="cartClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-content">
                    <div class="empty-cart" id="emptyCart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Tu carrito está vacío</h3>
                        <p>Agrega algunos productos para comenzar a comprar</p>
                        <a href="/pages/marketplace/marketplace-page.html" class="btn-shop-now">
                            Ir al Marketplace
                        </a>
                    </div>
                    
                    <div class="cart-items" id="cartItems">
                        <!-- Cart items will be rendered here -->
                    </div>
                </div>
                
                <div class="cart-footer">
                    <div class="cart-total">
                        <span class="total-label">Total:</span>
                        <span class="total-amount cart-total">$0.00</span>
                    </div>
                    
                    <div class="cart-actions" id="cartActions">
                        <button class="btn-checkout" id="btnCheckout">
                            <i class="fas fa-credit-card"></i>
                            Proceder al Pago
                        </button>
                        <button class="btn-continue-shopping" id="btnContinueShopping">
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Cart button
        const cartButton = this.shadowRoot.getElementById('cartButton');
        const cartSidebar = this.shadowRoot.getElementById('cartSidebar');
        const cartOverlay = this.shadowRoot.getElementById('cartOverlay');
        const cartClose = this.shadowRoot.getElementById('cartClose');
        
        if (cartButton) {
            cartButton.addEventListener('click', () => this.openCart());
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        // Cart actions
        const btnCheckout = this.shadowRoot.getElementById('btnCheckout');
        const btnContinueShopping = this.shadowRoot.getElementById('btnContinueShopping');
        
        if (btnCheckout) {
            btnCheckout.addEventListener('click', () => this.proceedToCheckout());
        }
        
        if (btnContinueShopping) {
            btnContinueShopping.addEventListener('click', () => this.continueShopping());
        }
        
        // Event delegation for cart items
        const cartItems = this.shadowRoot.getElementById('cartItems');
        if (cartItems) {
            cartItems.addEventListener('click', (e) => {
                const target = e.target;
                const productId = target.closest('[data-product-id]')?.dataset.productId;
                
                if (!productId) return;
                
                if (target.classList.contains('minus')) {
                    const item = this.cartItems.find(item => item.id === productId);
                    if (item) {
                        this.updateQuantity(productId, item.quantity - 1);
                    }
                } else if (target.classList.contains('plus')) {
                    const item = this.cartItems.find(item => item.id === productId);
                    if (item) {
                        this.updateQuantity(productId, item.quantity + 1);
                    }
                } else if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
                    this.removeFromCart(productId);
                }
            });
        }
        
        // Close cart on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    openCart() {
        this.isOpen = true;
        const cartSidebar = this.shadowRoot.getElementById('cartSidebar');
        const cartOverlay = this.shadowRoot.getElementById('cartOverlay');
        
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.isOpen = false;
        const cartSidebar = this.shadowRoot.getElementById('cartSidebar');
        const cartOverlay = this.shadowRoot.getElementById('cartOverlay');
        
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('open');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    proceedToCheckout() {
        if (this.cartItems.length === 0) {
            this.showNotification('Tu carrito está vacío');
            return;
        }
        
        // Save cart data for checkout
        localStorage.setItem('swappit-checkout-cart', JSON.stringify({
            items: this.cartItems,
            total: this.total
        }));
        
        // Redirect to checkout page
        window.location.href = '/pages/checkout/checkout.html';
    }

    continueShopping() {
        this.closeCart();
        window.location.href = '/pages/marketplace/marketplace-page.html';
    }

    // Public method to add item to cart
    addItem(product) {
        this.addToCart(product);
    }

    // Public method to get cart count
    getCartCount() {
        return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Public method to get cart total
    getCartTotal() {
        return this.total;
    }
}

// Register the component
customElements.define('cart-component', CartComponent);

// Global cart instance
window.SwappitCart = {
    addToCart: (product) => {
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent) {
            cartComponent.addItem(product);
        }
    },
    
    getCartCount: () => {
        const cartComponent = document.querySelector('cart-component');
        return cartComponent ? cartComponent.getCartCount() : 0;
    },
    
    getCartTotal: () => {
        const cartComponent = document.querySelector('cart-component');
        return cartComponent ? cartComponent.getCartTotal() : 0;
    }
}; 