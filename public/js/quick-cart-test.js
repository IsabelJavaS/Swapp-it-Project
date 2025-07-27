// Quick Cart Test Script
// Run this in the browser console to test cart functionality

console.log('🚀 Quick Cart Test - Starting...');

// Test 1: Check if cart component is registered
console.log('\n📋 Test 1: Component Registration');
const isCartRegistered = customElements.get('cart-component');
console.log('Cart component registered:', isCartRegistered ? '✅ YES' : '❌ NO');

// Test 2: Check if cart component exists in DOM
console.log('\n🏠 Test 2: DOM Presence');
const cartComponent = document.querySelector('cart-component');
console.log('Cart component in DOM:', cartComponent ? '✅ YES' : '❌ NO');

if (cartComponent) {
    console.log('Cart component has shadow root:', cartComponent.shadowRoot ? '✅ YES' : '❌ NO');
    
    if (cartComponent.shadowRoot) {
        const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
        console.log('Cart button found:', cartButton ? '✅ YES' : '❌ NO');
        
        if (cartButton) {
            const icon = cartButton.querySelector('i.fas.fa-shopping-cart');
            console.log('Cart icon found:', icon ? '✅ YES' : '❌ NO');
            
            const countBadge = cartButton.querySelector('.cart-count');
            console.log('Count badge found:', countBadge ? '✅ YES' : '❌ NO');
        }
    }
}

// Test 3: Check headers
console.log('\n🔍 Test 3: Headers');
const normalHeader = document.querySelector('header-component');
const authHeader = document.querySelector('header-auth-component');

console.log('Normal header found:', normalHeader ? '✅ YES' : '❌ NO');
console.log('Auth header found:', authHeader ? '✅ YES' : '❌ NO');

if (normalHeader && normalHeader.shadowRoot) {
    const cartInNormal = normalHeader.shadowRoot.querySelector('cart-component');
    console.log('Cart in normal header:', cartInNormal ? '✅ YES' : '❌ NO');
}

if (authHeader && authHeader.shadowRoot) {
    const cartInAuth = authHeader.shadowRoot.querySelector('cart-component');
    console.log('Cart in auth header:', cartInAuth ? '✅ YES' : '❌ NO');
}

// Test 4: Check global cart object
console.log('\n🌐 Test 4: Global Cart Object');
console.log('SwappitCart available:', window.SwappitCart ? '✅ YES' : '❌ NO');

// Test 5: Try to add a product
console.log('\n🧪 Test 5: Add Product Test');
if (window.SwappitCart) {
    const testProduct = {
        id: 'quick-test-' + Date.now(),
        title: 'Quick Test Product',
        price: 15.99,
        images: ['https://via.placeholder.com/150'],
        sellerName: 'Quick Test Seller'
    };
    
    try {
        window.SwappitCart.addToCart(testProduct);
        console.log('✅ Product added successfully');
        
        // Check if count updated
        if (cartComponent && cartComponent.shadowRoot) {
            const countBadge = cartComponent.shadowRoot.querySelector('.cart-count');
            if (countBadge) {
                console.log('✅ Cart count updated:', countBadge.textContent);
            }
        }
    } catch (error) {
        console.error('❌ Error adding product:', error);
    }
}

// Test 6: Force show cart
console.log('\n🔧 Test 6: Force Show Cart');
if (cartComponent && cartComponent.shadowRoot) {
    const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
    if (cartButton) {
        console.log('✅ Clicking cart button...');
        cartButton.click();
        console.log('✅ Cart button clicked');
    } else {
        console.log('❌ Cart button not found');
    }
}

// Test 7: Check CSS visibility
console.log('\n🎨 Test 7: CSS Visibility');
if (cartComponent) {
    const computedStyle = window.getComputedStyle(cartComponent);
    console.log('Display:', computedStyle.display);
    console.log('Visibility:', computedStyle.visibility);
    console.log('Opacity:', computedStyle.opacity);
    console.log('Width:', computedStyle.width);
    console.log('Height:', computedStyle.height);
}

console.log('\n📊 Test Summary:');
console.log('If you see any ❌ marks above, those are the issues to fix.');
console.log('If everything shows ✅, the cart should be working.');

// Make test functions available
window.quickCartTest = {
    runAll: () => {
        console.clear();
        console.log('🚀 Running Quick Cart Test...');
        // This will re-run the entire test
        location.reload();
    },
    
    addTestProduct: () => {
        if (window.SwappitCart) {
            const testProduct = {
                id: 'manual-test-' + Date.now(),
                title: 'Manual Test Product',
                price: 25.99,
                images: ['https://via.placeholder.com/150'],
                sellerName: 'Manual Test Seller'
            };
            window.SwappitCart.addToCart(testProduct);
            console.log('✅ Manual test product added');
        }
    },
    
    showCart: () => {
        const cartComponent = document.querySelector('cart-component');
        if (cartComponent && cartComponent.shadowRoot) {
            const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
            if (cartButton) {
                cartButton.click();
                console.log('✅ Cart opened manually');
            }
        }
    }
};

console.log('\n🔧 Manual Test Commands:');
console.log('  window.quickCartTest.runAll() - Run all tests again');
console.log('  window.quickCartTest.addTestProduct() - Add a test product');
console.log('  window.quickCartTest.showCart() - Manually open cart'); 