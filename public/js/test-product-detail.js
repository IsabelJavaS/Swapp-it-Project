// Test script for Product Detail Page
console.log('Test Product Detail script loaded');

// Test function to create a sample product and navigate to detail page
function testProductDetail() {
    console.log('Testing product detail functionality...');
    
    // Create a sample product ID (this would normally come from Firebase)
    const testProductId = 'test-product-123';
    
    // Navigate to product detail page with test ID
    const detailUrl = `/pages/marketplace/productDetail.html?id=${testProductId}`;
    console.log('Navigating to:', detailUrl);
    
    // For testing purposes, we'll simulate a product object
    const testProduct = {
        id: testProductId,
        productName: 'Test Product - Premium Notebook Set',
        description: 'This is a test product to verify the product detail page functionality. It includes a high-quality notebook set perfect for students and professionals.',
        price: 15.99,
        originalPrice: 19.99,
        category: 'notebooks',
        condition: 'new',
        brand: 'Test Brand',
        transactionType: 'sale', // or 'swapp'
        sellerType: 'student',
        sellerEmail: 'test@example.com',
        sellerDisplayName: 'Test Seller',
        images: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3',
            'https://images.unsplash.com/photo-1544716280-aa053eb21b45?ixlib=rb-4.0.3',
            'https://images.unsplash.com/photo-1544716279-e514d1d45b10?ixlib=rb-4.0.3'
        ],
        rating: 4.5,
        reviewCount: 12,
        stock: 5,
        features: [
            'Premium 100 GSM paper',
            'Hardcover with elegant design',
            'Bookmark ribbon',
            'Inner pocket for loose papers',
            'Elastic closure band'
        ],
        specifications: {
            'Physical Specifications': {
                'Dimensions': '21 x 14.8 cm (A5)',
                'Weight': '250g per notebook',
                'Paper Weight': '100 GSM'
            },
            'Materials': {
                'Cover Material': 'Vegan Leather',
                'Paper Type': 'Acid-free Paper',
                'Binding': 'Thread-bound'
            }
        },
        createdAt: new Date().toISOString(),
        views: 45,
        favorites: 8
    };
    
    // Store test product in localStorage for testing
    localStorage.setItem('testProduct', JSON.stringify(testProduct));
    
    // Navigate to the detail page
    window.location.href = detailUrl;
}

// Function to load test product data (for testing without Firebase)
function loadTestProduct() {
    const testProductData = localStorage.getItem('testProduct');
    if (testProductData) {
        return JSON.parse(testProductData);
    }
    return null;
}

// Export functions for testing
window.testProductDetail = testProductDetail;
window.loadTestProduct = loadTestProduct;

console.log('Test functions available: testProductDetail(), loadTestProduct()'); 