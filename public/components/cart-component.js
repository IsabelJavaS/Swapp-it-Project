// Global cart instance - Define immediately
window.SwappitCart = {
    addToCart: (product) => {
        console.log('SwappitCart.addToCart called with:', product);
        
        // First try to find cart component in main DOM
        let cartComponent = document.querySelector('cart-component');
        
        // If not found in main DOM, try to find it in header shadow DOM
        if (!cartComponent) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
                console.log('Found cart component in header shadow DOM');
            }
        }
        
        console.log('Found cart component:', cartComponent);
        if (cartComponent) {
            cartComponent.addItem(product);
            console.log('Product added to cart successfully');
        } else {
            console.error('Cart component not found!');
        }
    },
    
    getCartCount: () => {
        let cartComponent = document.querySelector('cart-component');
        if (!cartComponent) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
            }
        }
        return cartComponent ? cartComponent.getCartCount() : 0;
    },
    
    getItemCount: () => {
        let cartComponent = document.querySelector('cart-component');
        if (!cartComponent) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
            }
        }
        return cartComponent ? cartComponent.getCartCount() : 0;
    },
    
    getCartTotal: () => {
        let cartComponent = document.querySelector('cart-component');
        if (!cartComponent) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
            }
        }
        return cartComponent ? cartComponent.getCartTotal() : 0;
    }
};

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
        console.log('CartComponent.addToCart called with:', product);
        
        // Ensure product has required fields
        const productToAdd = {
            id: product.id,
            title: product.title || 'Product',
            price: product.price || 0,
            images: product.images || [],
            sellerName: product.sellerDisplayName || product.sellerName || 'Seller',
            description: product.description || ''
        };
        
        console.log('Processed product:', productToAdd);
        
        const existingItem = this.cartItems.find(item => item.id === productToAdd.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Updated existing item quantity to:', existingItem.quantity);
        } else {
            this.cartItems.push({
                ...productToAdd,
                quantity: 1
            });
            console.log('Added new item to cart. Total items:', this.cartItems.length);
        }
        
        console.log('Current cart items:', this.cartItems);
        
        this.calculateTotal();
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Product added to cart');
        
        console.log('Cart updated. Items:', this.cartItems.length, 'Total:', this.total);
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.id !== productId);
        this.calculateTotal();
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Product removed from cart');
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
        console.log('Updating cart count to:', count);
        
        const cartCount = this.shadowRoot.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
            console.log('Updated internal cart count badge');
        } else {
            console.error('Cart count badge not found in shadow root');
        }
        
        // Also update any external cart counters
        const externalCartCounters = document.querySelectorAll('.cart-counter');
        console.log('Found external cart counters:', externalCartCounters.length);
        externalCartCounters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'block' : 'none';
            console.log('Updated external cart counter');
        });
    }

    // Update cart display
    updateCartDisplay() {
        console.log('CartComponent.updateCartDisplay called');
        console.log('Cart items count:', this.cartItems.length);
        console.log('Cart items:', this.cartItems);
        
        const cartItemsContainer = this.shadowRoot.querySelector('.cart-items');
        const cartTotal = this.shadowRoot.querySelector('.cart-total');
        const emptyCart = this.shadowRoot.querySelector('.empty-cart');
        const cartActions = this.shadowRoot.querySelector('.cart-actions');
        
        console.log('Found elements:', {
            cartItemsContainer: !!cartItemsContainer,
            cartTotal: !!cartTotal,
            emptyCart: !!emptyCart,
            cartActions: !!cartActions
        });
        
        if (cartItemsContainer) {
            if (this.cartItems.length === 0) {
                console.log('Cart is empty, showing empty state');
                cartItemsContainer.innerHTML = '';
                if (emptyCart) emptyCart.style.display = 'block';
                if (cartActions) cartActions.style.display = 'none';
            } else {
                console.log('Cart has items, rendering cart items');
                if (emptyCart) emptyCart.style.display = 'none';
                if (cartActions) cartActions.style.display = 'block';
                this.renderCartItems(cartItemsContainer);
            }
        } else {
            console.error('Cart items container not found!');
        }
        
        if (cartTotal) {
            cartTotal.textContent = `${this.total} Swappcoin`;
            console.log('Updated cart total to:', this.total, 'Swappcoin');
        } else {
            console.error('Cart total element not found!');
        }
    }

    // Render cart items
    renderCartItems(container) {
        console.log('CartComponent.renderCartItems called with container:', container);
        console.log('Rendering items:', this.cartItems);
        
        const itemsHTML = this.cartItems.map(item => {
            console.log('Processing item:', item);
            
            // Use product image or default image
            const imageUrl = item.images && item.images.length > 0 
                ? item.images[0] 
                : '/assets/logos/utiles-escolares.jpg';
            
            const sellerName = item.sellerName || item.sellerDisplayName || 'Seller';
            const price = item.price || 0;
            const totalPrice = price * item.quantity;
            
            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${imageUrl}" alt="${item.title}" onerror="this.src='/assets/logos/utiles-escolares.jpg'">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-seller">by ${sellerName}</p>
                        <div class="cart-item-price-info">
                            <span class="cart-item-price">${price} Swappcoin</span>
                            <span class="cart-item-total">Total: ${totalPrice} Swappcoin</span>
                        </div>
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
            `;
        }).join('');
        
        console.log('Generated HTML:', itemsHTML);
        container.innerHTML = itemsHTML;
        console.log('Cart items rendered successfully');
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
                    --border-radius: 12px;
                    --transition: all 0.3s ease;
                }
                
                /* Cart Button */
                .cart-button {
                    position: relative;
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    transition: var(--transition);
                    visibility: visible !important;
                    opacity: 1 !important;
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }
                
                .cart-button:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(52, 104, 192, 0.4);
                }
                
                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--swappit-orange);
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    font-family: var(--font-primary);
                    display: none;
                    box-shadow: 0 2px 8px rgba(255, 164, 36, 0.4);
                    border: 3px solid white;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                /* Cart Sidebar */
                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: -450px;
                    width: 450px;
                    height: 100vh;
                    background: var(--background-white);
                    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    border-radius: 0 0 0 20px;
                }
                
                .cart-sidebar.open {
                    right: 0;
                }
                
                /* Cart Header */
                .cart-header {
                    padding: 2rem 1.5rem 1.5rem;
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    color: white;
                    border-radius: 0 0 20px 20px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .cart-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: rotate 20s linear infinite;
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .cart-title {
                    font-family: var(--font-primary);
                    font-weight: 700;
                    font-size: 1.5rem;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .cart-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 50%;
                    transition: var(--transition);
                    position: relative;
                    z-index: 1;
                }
                
                .cart-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                /* Cart Content */
                .cart-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
                }
                
                /* Empty Cart */
                .empty-cart {
                    display: none;
                    text-align: center;
                    padding: 4rem 1rem;
                    color: var(--neutral-medium);
                }
                
                .empty-cart i {
                    font-size: 5rem;
                    margin-bottom: 1.5rem;
                    color: var(--neutral-light);
                    opacity: 0.6;
                }
                
                .empty-cart h3 {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    color: var(--neutral-dark);
                    font-size: 1.5rem;
                }
                
                .empty-cart p {
                    font-family: var(--font-secondary);
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
                
                .btn-shop-now {
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 30px;
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: var(--transition);
                    text-decoration: none;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(52, 104, 192, 0.3);
                }
                
                .btn-shop-now:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 25px rgba(52, 104, 192, 0.4);
                }
                
                /* Cart Items */
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .cart-item {
                    display: flex;
                    gap: 1.25rem;
                    padding: 1.25rem;
                    border: 2px solid var(--neutral-light);
                    border-radius: var(--border-radius);
                    background: var(--background-white);
                    transition: var(--transition);
                    position: relative;
                    overflow: hidden;
                }
                
                .cart-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(180deg, var(--swappit-blue), var(--swappit-orange));
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }
                
                .cart-item:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border-color: var(--swappit-blue);
                    transform: translateY(-2px);
                }
                
                .cart-item:hover::before {
                    transform: scaleY(1);
                }
                
                .cart-item-image {
                    flex-shrink: 0;
                }
                
                .cart-item-image img {
                    width: 80px;
                    height: 80px;
                    border-radius: var(--border-radius);
                    object-fit: cover;
                    border: 2px solid var(--neutral-light);
                    transition: var(--transition);
                }
                
                .cart-item:hover .cart-item-image img {
                    border-color: var(--swappit-blue);
                    transform: scale(1.05);
                }
                
                .cart-item-details {
                    flex: 1;
                    min-width: 0;
                }
                
                .cart-item-title {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1.1rem;
                    margin: 0 0 0.75rem 0;
                    color: var(--neutral-dark);
                    line-height: 1.3;
                }
                
                .cart-item-seller {
                    font-family: var(--font-secondary);
                    font-size: 0.9rem;
                    color: var(--neutral-medium);
                    margin: 0 0 1rem 0;
                    font-weight: 500;
                }
                
                .cart-item-price-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .cart-item-price {
                    font-family: var(--font-primary);
                    font-weight: 600;
                    color: var(--swappit-blue);
                    font-size: 1rem;
                }
                
                .cart-item-total {
                    font-family: var(--font-primary);
                    font-weight: 700;
                    color: var(--swappit-orange);
                    font-size: 1.1rem;
                }
                
                .cart-item-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-end;
                }
                
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--neutral-light);
                    border-radius: 25px;
                    padding: 0.5rem;
                    border: 2px solid transparent;
                    transition: var(--transition);
                }
                
                .quantity-controls:hover {
                    border-color: var(--swappit-blue);
                    background: rgba(52, 104, 192, 0.05);
                }
                
                .quantity-btn {
                    background: none;
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition);
                    color: var(--neutral-dark);
                    font-size: 0.8rem;
                }
                
                .quantity-btn:hover {
                    background: var(--swappit-blue);
                    color: white;
                    transform: scale(1.1);
                }
                
                .quantity {
                    font-family: var(--font-primary);
                    font-weight: 700;
                    font-size: 0.9rem;
                    min-width: 25px;
                    text-align: center;
                    color: var(--neutral-dark);
                }
                
                .remove-btn {
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: var(--transition);
                    font-size: 0.8rem;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .remove-btn:hover {
                    transform: scale(1.1) rotate(90deg);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
                }
                
                /* Cart Footer */
                .cart-footer {
                    padding: 2rem 1.5rem;
                    background: linear-gradient(135deg, #f8fafc, #ffffff);
                    border-top: 2px solid var(--neutral-light);
                    border-radius: 20px 0 0 0;
                }
                
                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem 1.5rem;
                    background: var(--background-white);
                    border-radius: var(--border-radius);
                    border: 2px solid var(--neutral-light);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
                    font-size: 1.2rem;
                    color: var(--swappit-orange);
                }
                
                .cart-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .btn-checkout {
                    background: linear-gradient(135deg, var(--swappit-orange), var(--swappit-orange-hover));
                    color: white;
                    border: none;
                    padding: 1.25rem;
                    border-radius: var(--border-radius);
                    font-family: var(--font-primary);
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    box-shadow: 0 4px 15px rgba(255, 164, 36, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .btn-checkout:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 25px rgba(255, 164, 36, 0.4);
                }
                
                .btn-continue-shopping {
                    background: transparent;
                    color: var(--swappit-blue);
                    border: 2px solid var(--swappit-blue);
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    font-family: var(--font-primary);
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .btn-continue-shopping:hover {
                    background: var(--swappit-blue);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(52, 104, 192, 0.3);
                }
                
                /* Overlay */
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: var(--transition);
                    backdrop-filter: blur(5px);
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
                    
                    .cart-item {
                        padding: 1rem;
                        gap: 1rem;
                    }
                    
                    .cart-item-image img {
                        width: 70px;
                        height: 70px;
                    }
                    
                    .btn-checkout, .btn-continue-shopping {
                        padding: 1rem;
                        font-size: 1rem;
                    }
                    
                    .cart-items {
                        gap: 1.25rem;
                    }
                    
                    .cart-content {
                        padding: 1.25rem;
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
                    <h2 class="cart-title">
                        <i class="fas fa-shopping-cart"></i>
                        Shopping Cart
                    </h2>
                    <button class="cart-close" id="cartClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-content">
                    <div class="empty-cart" id="emptyCart">
                        <i class="fas fa-shopping-bag"></i>
                        <h3>Your cart is empty</h3>
                        <p>Start shopping to discover amazing deals on school supplies</p>
                        <a href="/pages/marketplace/marketplace.html" class="btn-shop-now">
                            <i class="fas fa-store me-2"></i>
                            Go to Marketplace
                        </a>
                    </div>
                    
                    <div class="cart-items" id="cartItems">
                        <!-- Cart items will be rendered here -->
                    </div>
                </div>
                
                <div class="cart-footer">
                    <div class="cart-total">
                        <span class="total-label">Total:</span>
                        <span class="total-amount cart-total">0 Swappcoin</span>
                    </div>
                    
                    <div class="cart-actions" id="cartActions">
                        <button class="btn-checkout" id="btnCheckout">
                            <i class="fas fa-coins"></i>
                            Purchase with Swappcoin
                        </button>
                        <button class="btn-continue-shopping" id="btnContinueShopping">
                            <i class="fas fa-arrow-left me-2"></i>
                            Continue Shopping
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
        
        if (cartSidebar) {
            cartSidebar.classList.add('open');
            cartSidebar.style.right = '0';
        }
        if (cartOverlay) {
            cartOverlay.classList.add('open');
            cartOverlay.style.display = 'block';
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('Cart opened successfully');
    }

    closeCart() {
        this.isOpen = false;
        const cartSidebar = this.shadowRoot.getElementById('cartSidebar');
        const cartOverlay = this.shadowRoot.getElementById('cartOverlay');
        
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
            cartSidebar.style.right = '-450px';
        }
        if (cartOverlay) {
            cartOverlay.classList.remove('open');
            cartOverlay.style.display = 'none';
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Cart closed successfully');
    }

    proceedToCheckout() {
        if (this.cartItems.length === 0) {
            this.showNotification('Your cart is empty');
            return;
        }
        
        // For SWAPPIT, we'll redirect to the product purchase page of the first item
        // Since we're using Swappcoin, we typically purchase one product at a time
        const firstItem = this.cartItems[0];
        
        // Save product data for purchase page
        localStorage.setItem('swappit-purchase-product', JSON.stringify(firstItem));
        
        // Redirect to product purchase page
        window.location.href = `/pages/marketplace/product-purchase.html?productId=${firstItem.id}`;
    }

    continueShopping() {
        this.closeCart();
        window.location.href = '/pages/marketplace/marketplace.html';
    }

    // Public method to add item to cart
    addItem(product) {
        console.log('CartComponent.addItem called with:', product);
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