// Cart Debug Script
// This script helps debug cart component issues

console.log('🛒 Cart Debug - Starting...');

class CartDebugger {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔍 Initializing Cart Debugger...');
        this.checkCartComponent();
        this.checkHeaders();
        this.testCartFunctionality();
    }

    checkCartComponent() {
        console.log('\n📋 Check 1: Cart Component...');
        
        // Check if component is registered
        const isRegistered = customElements.get('cart-component');
        if (isRegistered) {
            console.log('✅ Cart component is registered');
        } else {
            console.error('❌ Cart component is NOT registered');
            return false;
        }

        // Check if component exists in DOM
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent) {
            console.log('✅ Cart component found in DOM');
            
            // Check shadow root
            if (cartComponent.shadowRoot) {
                console.log('✅ Cart component has shadow root');
                
                // Check cart button
                const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
                if (cartButton) {
                    console.log('✅ Cart button found');
                    
                    // Check icon
                    const icon = cartButton.querySelector('i.fas.fa-shopping-cart');
                    if (icon) {
                        console.log('✅ Cart icon found');
                    } else {
                        console.error('❌ Cart icon NOT found');
                    }
                    
                    // Check count badge
                    const countBadge = cartButton.querySelector('.cart-count');
                    if (countBadge) {
                        console.log('✅ Cart count badge found');
                    } else {
                        console.error('❌ Cart count badge NOT found');
                    }
                } else {
                    console.error('❌ Cart button NOT found');
                }
                
                // Check sidebar
                const cartSidebar = cartComponent.shadowRoot.querySelector('#cartSidebar');
                if (cartSidebar) {
                    console.log('✅ Cart sidebar found');
                } else {
                    console.error('❌ Cart sidebar NOT found');
                }
            } else {
                console.error('❌ Cart component does NOT have shadow root');
            }
        } else {
            console.error('❌ Cart component NOT found in DOM');
        }
    }

    checkHeaders() {
        console.log('\n🏠 Check 2: Headers...');
        
        // Check normal header
        const normalHeader = document.querySelector('header-component');
        if (normalHeader && normalHeader.shadowRoot) {
            console.log('✅ Normal header found');
            
            const cartInNormal = normalHeader.shadowRoot.querySelector('cart-component');
            if (cartInNormal) {
                console.log('✅ Cart component found in normal header');
            } else {
                console.error('❌ Cart component NOT found in normal header');
            }
        } else {
            console.log('ℹ️ Normal header not found (user might be authenticated)');
        }
        
        // Check auth header
        const authHeader = document.querySelector('header-auth-component');
        if (authHeader && authHeader.shadowRoot) {
            console.log('✅ Auth header found');
            
            const cartInAuth = authHeader.shadowRoot.querySelector('cart-component');
            if (cartInAuth) {
                console.log('✅ Cart component found in auth header');
            } else {
                console.error('❌ Cart component NOT found in auth header');
            }
        } else {
            console.log('ℹ️ Auth header not found (user might not be authenticated)');
        }
    }

    testCartFunctionality() {
        console.log('\n🧪 Check 3: Cart Functionality...');
        
        // Check global cart object
        if (window.SwappitCart) {
            console.log('✅ Global SwappitCart object found');
            
            // Test adding a product
            const testProduct = {
                id: 'debug-test-' + Date.now(),
                title: 'Debug Test Product',
                price: 19.99,
                images: ['https://via.placeholder.com/150'],
                sellerName: 'Debug Seller'
            };
            
            try {
                window.SwappitCart.addToCart(testProduct);
                console.log('✅ Test product added successfully');
                
                // Check if count updated
                const cartComponent = document.querySelector('cart-component');
                if (cartComponent) {
                    const countBadge = cartComponent.shadowRoot.querySelector('.cart-count');
                    if (countBadge) {
                        console.log(`✅ Cart count updated: ${countBadge.textContent}`);
                    }
                }
            } catch (error) {
                console.error('❌ Error adding test product:', error);
            }
        } else {
            console.error('❌ Global SwappitCart object NOT found');
        }
    }

    // Force cart component to show
    forceShowCart() {
        console.log('\n🔧 Force showing cart...');
        
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent && window.SwappitCart) {
            // Add a test product
            const testProduct = {
                id: 'force-test-' + Date.now(),
                title: 'Force Test Product',
                price: 29.99,
                images: ['https://via.placeholder.com/150'],
                sellerName: 'Force Seller'
            };
            
            window.SwappitCart.addToCart(testProduct);
            
            // Try to open cart
            const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
            if (cartButton) {
                cartButton.click();
                console.log('✅ Cart button clicked');
            }
        }
    }

    // Check CSS issues
    checkCSSIssues() {
        console.log('\n🎨 Check 4: CSS Issues...');
        
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent) {
            const computedStyle = window.getComputedStyle(cartComponent);
            console.log('Cart component display:', computedStyle.display);
            console.log('Cart component visibility:', computedStyle.visibility);
            console.log('Cart component width:', computedStyle.width);
            console.log('Cart component height:', computedStyle.height);
        }
    }
}

// Auto-run debugger
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const cartDebugger = new CartDebugger();
            
            // Make debugger available globally
            window.cartDebug = {
                checkAll: () => cartDebugger.init(),
                forceShow: () => cartDebugger.forceShowCart(),
                checkCSS: () => cartDebugger.checkCSSIssues()
            };
            
            console.log('\n🔧 Cart Debug Commands Available:');
            console.log('  window.cartDebug.checkAll() - Run all checks');
            console.log('  window.cartDebug.forceShow() - Force show cart');
            console.log('  window.cartDebug.checkCSS() - Check CSS issues');
        }, 2000);
    });
} 