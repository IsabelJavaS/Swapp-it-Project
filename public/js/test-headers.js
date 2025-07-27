// Quick Header Test Script
// This script runs a quick test to verify headers are working

console.log('🚀 Starting Header Test...');

// Test 1: Check if components are loaded
function testComponents() {
    console.log('📋 Test 1: Checking Components...');
    
    const components = [
        'header-component',
        'header-auth-component', 
        'cart-component'
    ];
    
    let allGood = true;
    components.forEach(component => {
        const isRegistered = customElements.get(component);
        if (isRegistered) {
            console.log(`✅ ${component} - OK`);
        } else {
            console.error(`❌ ${component} - MISSING`);
            allGood = false;
        }
    });
    
    return allGood;
}

// Test 2: Check if headers are rendered
function testHeaders() {
    console.log('🏠 Test 2: Checking Headers...');
    
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        console.error('❌ Header container not found');
        return false;
    }
    
    const currentHeader = headerContainer.querySelector('header-component, header-auth-component');
    if (currentHeader) {
        console.log(`✅ Header found: ${currentHeader.tagName.toLowerCase()}`);
        return true;
    } else {
        console.error('❌ No header component found');
        return false;
    }
}

// Test 3: Check cart functionality
function testCart() {
    console.log('🛒 Test 3: Checking Cart...');
    
    const cartComponent = document.querySelector('cart-component');
    if (!cartComponent) {
        console.error('❌ Cart component not found');
        return false;
    }
    
    if (cartComponent.shadowRoot) {
        console.log('✅ Cart component has shadow root');
        
        const cartButton = cartComponent.shadowRoot.querySelector('#cartButton');
        if (cartButton) {
            console.log('✅ Cart button found');
        } else {
            console.error('❌ Cart button not found');
            return false;
        }
        
        return true;
    } else {
        console.error('❌ Cart component has no shadow root');
        return false;
    }
}

// Test 4: Check global cart object
function testGlobalCart() {
    console.log('🌐 Test 4: Checking Global Cart...');
    
    if (window.SwappitCart) {
        console.log('✅ Global SwappitCart object found');
        
        // Test adding a product
        const testProduct = {
            id: 'test-' + Date.now(),
            title: 'Test Product',
            price: 19.99,
            images: ['https://via.placeholder.com/150'],
            sellerName: 'Test Seller'
        };
        
        try {
            window.SwappitCart.addToCart(testProduct);
            console.log('✅ Test product added successfully');
            return true;
        } catch (error) {
            console.error('❌ Error adding test product:', error);
            return false;
        }
    } else {
        console.error('❌ Global SwappitCart object not found');
        return false;
    }
}

// Test 5: Check auth header menu (if authenticated)
function testAuthHeader() {
    console.log('🔐 Test 5: Checking Auth Header...');
    
    const authHeader = document.querySelector('header-auth-component');
    if (authHeader && authHeader.shadowRoot) {
        const menuItems = authHeader.shadowRoot.querySelectorAll('.nav-link');
        console.log(`✅ Found ${menuItems.length} menu items in auth header`);
        
        const dropdownItems = authHeader.shadowRoot.querySelectorAll('.dropdown-item');
        console.log(`✅ Found ${dropdownItems.length} dropdown items in auth header`);
        
        return true;
    } else {
        console.log('ℹ️ Auth header not found (user might not be authenticated)');
        return true; // This is not an error
    }
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running all header tests...\n');
    
    const tests = [
        { name: 'Components', fn: testComponents },
        { name: 'Headers', fn: testHeaders },
        { name: 'Cart', fn: testCart },
        { name: 'Global Cart', fn: testGlobalCart },
        { name: 'Auth Header', fn: testAuthHeader }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    tests.forEach(test => {
        console.log(`\n--- ${test.name} Test ---`);
        const result = test.fn();
        if (result) {
            passed++;
            console.log(`✅ ${test.name} test PASSED`);
        } else {
            console.log(`❌ ${test.name} test FAILED`);
        }
    });
    
    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Headers are working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the console for details.');
    }
}

// Auto-run tests after a delay
setTimeout(runAllTests, 2000);

// Make tests available globally for manual testing
window.headerTests = {
    runAll: runAllTests,
    testComponents,
    testHeaders,
    testCart,
    testGlobalCart,
    testAuthHeader
}; 