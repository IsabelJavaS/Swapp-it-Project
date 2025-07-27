// Header Debug Script
// This script helps verify that all header components are loading correctly

class HeaderDebugger {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔍 Header Debugger initialized');
        this.checkComponents();
        this.checkCartComponent();
        this.checkHeaderAuth();
        this.checkGlobalManager();
    }

    checkComponents() {
        console.log('📋 Checking Web Components...');
        
        // Check if components are registered
        const components = [
            'header-component',
            'header-auth-component',
            'cart-component'
        ];

        components.forEach(componentName => {
            const isRegistered = customElements.get(componentName);
            if (isRegistered) {
                console.log(`✅ ${componentName} is registered`);
            } else {
                console.error(`❌ ${componentName} is NOT registered`);
            }
        });
    }

    checkCartComponent() {
        console.log('🛒 Checking Cart Component...');
        
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent) {
            console.log('✅ Cart component found in DOM');
            
            // Check if cart component has shadow root
            if (cartComponent.shadowRoot) {
                console.log('✅ Cart component has shadow root');
                
                // Check for cart button
                const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
                if (cartButton) {
                    console.log('✅ Cart button found');
                } else {
                    console.error('❌ Cart button NOT found');
                }
                
                // Check for cart sidebar
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

    checkHeaderAuth() {
        console.log('🔐 Checking Header Auth Component...');
        
        const authHeader = document.querySelector('header-auth-component');
        if (authHeader) {
            console.log('✅ Auth header found in DOM');
            
            if (authHeader.shadowRoot) {
                console.log('✅ Auth header has shadow root');
                
                // Check menu items
                const menuItems = authHeader.shadowRoot.querySelectorAll('.nav-link');
                console.log(`📝 Found ${menuItems.length} menu items:`);
                menuItems.forEach((item, index) => {
                    console.log(`  ${index + 1}. ${item.textContent.trim()} -> ${item.href}`);
                });
                
                // Check dropdown items
                const dropdownItems = authHeader.shadowRoot.querySelectorAll('.dropdown-item');
                console.log(`📝 Found ${dropdownItems.length} dropdown items:`);
                dropdownItems.forEach((item, index) => {
                    console.log(`  ${index + 1}. ${item.textContent.trim()}`);
                });
                
                // Check cart component in auth header
                const cartInAuth = authHeader.shadowRoot.querySelector('cart-component');
                if (cartInAuth) {
                    console.log('✅ Cart component found in auth header');
                } else {
                    console.error('❌ Cart component NOT found in auth header');
                }
            } else {
                console.error('❌ Auth header does NOT have shadow root');
            }
        } else {
            console.log('ℹ️ Auth header not found (user might not be authenticated)');
        }
    }

    checkHeaderNormal() {
        console.log('🏠 Checking Normal Header Component...');
        
        const normalHeader = document.querySelector('header-component');
        if (normalHeader) {
            console.log('✅ Normal header found in DOM');
            
            if (normalHeader.shadowRoot) {
                console.log('✅ Normal header has shadow root');
                
                // Check cart component in normal header
                const cartInNormal = normalHeader.shadowRoot.querySelector('cart-component');
                if (cartInNormal) {
                    console.log('✅ Cart component found in normal header');
                } else {
                    console.error('❌ Cart component NOT found in normal header');
                }
            } else {
                console.error('❌ Normal header does NOT have shadow root');
            }
        } else {
            console.log('ℹ️ Normal header not found (user might be authenticated)');
        }
    }

    checkGlobalManager() {
        console.log('🌐 Checking Global Header Manager...');
        
        // Check if global manager is working
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            console.log('✅ Header container found');
            
            const currentHeader = headerContainer.querySelector('header-component, header-auth-component');
            if (currentHeader) {
                console.log(`✅ Current header: ${currentHeader.tagName.toLowerCase()}`);
            } else {
                console.error('❌ No header component found in container');
            }
        } else {
            console.error('❌ Header container NOT found');
        }
    }

    // Test cart functionality
    testCartFunctionality() {
        console.log('🧪 Testing Cart Functionality...');
        
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent && window.SwappitCart) {
            console.log('✅ Cart component and global cart available');
            
            // Test adding item to cart
            const testProduct = {
                id: 'test-123',
                title: 'Test Product',
                price: 29.99,
                images: ['https://via.placeholder.com/300x200'],
                sellerName: 'Test Seller'
            };
            
            try {
                window.SwappitCart.addToCart(testProduct);
                console.log('✅ Test product added to cart successfully');
            } catch (error) {
                console.error('❌ Error adding test product to cart:', error);
            }
        } else {
            console.error('❌ Cart component or global cart not available');
        }
    }

    // Check localStorage
    checkLocalStorage() {
        console.log('💾 Checking Local Storage...');
        
        const cartData = localStorage.getItem('swappit-cart');
        if (cartData) {
            try {
                const cart = JSON.parse(cartData);
                console.log(`✅ Cart data found: ${cart.length} items`);
                console.log('Cart contents:', cart);
            } catch (error) {
                console.error('❌ Error parsing cart data:', error);
            }
        } else {
            console.log('ℹ️ No cart data in localStorage');
        }
    }
}

// Auto-initialize debugger
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for components to load
        setTimeout(() => {
            const headerDebugger = new HeaderDebugger();
            
            // Add debug methods to window for manual testing
            window.headerDebug = {
                testCart: () => headerDebugger.testCartFunctionality(),
                checkStorage: () => headerDebugger.checkLocalStorage(),
                checkAll: () => headerDebugger.init()
            };
            
            console.log('🔧 Debug methods available:');
            console.log('  window.headerDebug.testCart() - Test cart functionality');
            console.log('  window.headerDebug.checkStorage() - Check localStorage');
            console.log('  window.headerDebug.checkAll() - Run all checks');
        }, 1000);
    });
} 