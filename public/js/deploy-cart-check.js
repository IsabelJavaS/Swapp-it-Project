// Deploy Cart Check Script
// This script helps diagnose cart issues in production

console.log('🚀 Deploy Cart Check - Starting...');

// Wait for everything to load
setTimeout(() => {
    console.log('🔍 Checking cart component in production...');
    
    // Check 1: Component registration
    const isCartRegistered = customElements.get('cart-component');
    console.log('✅ Cart component registered:', isCartRegistered ? 'YES' : 'NO');
    
    // Check 2: Component in DOM
    const cartComponent = document.querySelector('cart-component');
    console.log('✅ Cart component in DOM:', cartComponent ? 'YES' : 'NO');
    
    if (cartComponent) {
        console.log('✅ Cart component has shadow root:', cartComponent.shadowRoot ? 'YES' : 'NO');
        
        if (cartComponent.shadowRoot) {
            const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
            console.log('✅ Cart button found:', cartButton ? 'YES' : 'NO');
            
            if (cartButton) {
                const icon = cartButton.querySelector('i.fas.fa-shopping-cart');
                console.log('✅ Cart icon found:', icon ? 'YES' : 'NO');
                
                // Check computed styles
                const computedStyle = window.getComputedStyle(cartButton);
                console.log('✅ Cart button display:', computedStyle.display);
                console.log('✅ Cart button visibility:', computedStyle.visibility);
                console.log('✅ Cart button opacity:', computedStyle.opacity);
                console.log('✅ Cart button background:', computedStyle.background);
            }
        }
    }
    
    // Check 3: Headers
    const normalHeader = document.querySelector('header-component');
    const authHeader = document.querySelector('header-auth-component');
    
    console.log('✅ Normal header found:', normalHeader ? 'YES' : 'NO');
    console.log('✅ Auth header found:', authHeader ? 'YES' : 'NO');
    
    if (normalHeader && normalHeader.shadowRoot) {
        const cartInNormal = normalHeader.shadowRoot.querySelector('cart-component');
        console.log('✅ Cart in normal header:', cartInNormal ? 'YES' : 'NO');
        
        if (cartInNormal) {
            const computedStyle = window.getComputedStyle(cartInNormal);
            console.log('✅ Cart in normal header display:', computedStyle.display);
            console.log('✅ Cart in normal header visibility:', computedStyle.visibility);
        }
    }
    
    if (authHeader && authHeader.shadowRoot) {
        const cartInAuth = authHeader.shadowRoot.querySelector('cart-component');
        console.log('✅ Cart in auth header:', cartInAuth ? 'YES' : 'NO');
        
        if (cartInAuth) {
            const computedStyle = window.getComputedStyle(cartInAuth);
            console.log('✅ Cart in auth header display:', computedStyle.display);
            console.log('✅ Cart in auth header visibility:', computedStyle.visibility);
        }
    }
    
    // Check 4: Global cart object
    console.log('✅ SwappitCart available:', window.SwappitCart ? 'YES' : 'NO');
    
    // Check 5: Script loading
    const scripts = document.querySelectorAll('script[src]');
    const cartScript = Array.from(scripts).find(script => script.src.includes('cart-component.js'));
    console.log('✅ Cart script loaded:', cartScript ? 'YES' : 'NO');
    
    if (cartScript) {
        console.log('✅ Cart script src:', cartScript.src);
    }
    
    // Check 6: Force show cart
    if (cartComponent && cartComponent.shadowRoot) {
        const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
        if (cartButton) {
            console.log('🔧 Attempting to click cart button...');
            cartButton.click();
            console.log('✅ Cart button clicked');
        }
    }
    
    // Check 7: Add test product
    if (window.SwappitCart) {
        const testProduct = {
            id: 'deploy-test-' + Date.now(),
            title: 'Deploy Test Product',
            price: 25.99,
            images: ['https://via.placeholder.com/150'],
            sellerName: 'Deploy Test Seller'
        };
        
        try {
            window.SwappitCart.addToCart(testProduct);
            console.log('✅ Test product added successfully');
        } catch (error) {
            console.error('❌ Error adding test product:', error);
        }
    }
    
    console.log('📊 Deploy Cart Check Complete');
    console.log('If you see any issues above, please share the results.');
    
}, 3000);

// Make check available globally
window.deployCartCheck = {
    runCheck: () => {
        console.clear();
        console.log('🚀 Running Deploy Cart Check...');
        location.reload();
    }
}; 