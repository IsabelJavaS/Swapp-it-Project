// Test script to verify Firestore indexes are working
import { getProducts } from './public/firebase/firestore.js';

async function testIndexes() {
  console.log('Testing Firestore indexes...');
  
  try {
    // Test 1: Get products with category filter
    console.log('Test 1: Getting products with category filter...');
    const result1 = await getProducts({
      category: 'Electronics',
      limit: 5
    });
    
    if (result1.success) {
      console.log('✅ Test 1 passed: Category filter works');
      console.log(`Found ${result1.products.length} products`);
    } else {
      console.error('❌ Test 1 failed:', result1.error);
    }
    
    // Test 2: Get products with sellerId filter
    console.log('\nTest 2: Getting products with sellerId filter...');
    const result2 = await getProducts({
      sellerId: 'test-seller-id',
      limit: 5
    });
    
    if (result2.success) {
      console.log('✅ Test 2 passed: SellerId filter works');
      console.log(`Found ${result2.products.length} products`);
    } else {
      console.error('❌ Test 2 failed:', result2.error);
    }
    
    // Test 3: Get products with status filter
    console.log('\nTest 3: Getting products with status filter...');
    const result3 = await getProducts({
      status: 'active',
      limit: 5
    });
    
    if (result3.success) {
      console.log('✅ Test 3 passed: Status filter works');
      console.log(`Found ${result3.products.length} products`);
    } else {
      console.error('❌ Test 3 failed:', result3.error);
    }
    
    // Test 4: Get all products (no filters)
    console.log('\nTest 4: Getting all products...');
    const result4 = await getProducts({
      limit: 10
    });
    
    if (result4.success) {
      console.log('✅ Test 4 passed: Getting all products works');
      console.log(`Found ${result4.products.length} products`);
    } else {
      console.error('❌ Test 4 failed:', result4.error);
    }
    
    console.log('\n🎉 All index tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testIndexes(); 