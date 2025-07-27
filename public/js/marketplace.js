// Marketplace Logic
import { 
  getProducts, 
  getProduct, 
  addProduct, 
  createTransaction, 
  completeTransaction,
  addReview,
  subscribeToProducts,
  subscribeToUserPoints,
  subscribeToUserTransactions
} from '../firebase/firestore.js';
import { 
  uploadProductImages, 
  validateFile, 
  compressImage 
} from '../firebase/storage.js';
import { showNotification, formatPrice, formatDate } from './app.js';

// Marketplace state
let currentProducts = [];
let userPoints = null;
let userTransactions = [];

// Initialize marketplace
export const initializeMarketplace = async () => {
  try {
    console.log('Initializing marketplace...');
    
    // Load initial products
    await loadProducts();
    
    // Set up real-time listeners
    setupRealtimeListeners();
    
    // Initialize event listeners
    setupEventListeners();
    
  } catch (error) {
    console.error('Error initializing marketplace:', error);
    showNotification('Error initializing marketplace', 'danger');
  }
};

// Load products
const loadProducts = async (filters = {}) => {
  try {
    const result = await getProducts(filters);
    if (result.success) {
      currentProducts = result.products;
      renderProducts(currentProducts);
    } else {
      showNotification('Error loading products', 'danger');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showNotification('Error loading products', 'danger');
  }
};

// Render products
const renderProducts = (products) => {
  const productsContainer = document.querySelector('.products-grid');
  if (!productsContainer) return;
  
  productsContainer.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
};

// Create product card
const createProductCard = (product) => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.images?.[0] || 'https://via.placeholder.com/300x200'}" alt="${product.title}">
      <div class="product-overlay">
        <button class="btn btn-quick-view" data-product-id="${product.id}">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-wishlist" data-product-id="${product.id}">
          <i class="far fa-heart"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-seller">by ${product.sellerName || 'Unknown'}</p>
      <div class="product-price">${formatPrice(product.price)}</div>
      <div class="product-rating">
        <div class="stars">
          ${generateStars(product.rating)}
        </div>
        <span class="rating-count">(${product.reviewCount})</span>
      </div>
      <button class="btn btn-add-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
  
  return card;
};

// Generate stars HTML
const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
};

// Setup real-time listeners
const setupRealtimeListeners = () => {
  // Listen to products changes
  subscribeToProducts((products) => {
    currentProducts = products;
    renderProducts(products);
  });
  
  // Listen to user points (if authenticated)
  if (window.SwappitApp?.user) {
    subscribeToUserPoints(window.SwappitApp.user.uid, (points) => {
      userPoints = points;
      updatePointsDisplay();
    });
    
    subscribeToUserTransactions(window.SwappitApp.user.uid, (transactions) => {
      userTransactions = transactions;
      updateTransactionsDisplay();
    });
  }
};

// Update points display
const updatePointsDisplay = () => {
  const pointsElements = document.querySelectorAll('.user-points');
  pointsElements.forEach(element => {
    if (userPoints) {
      element.textContent = `${userPoints.balance} points`;
    } else {
      element.textContent = '0 points';
    }
  });
};

// Update transactions display
const updateTransactionsDisplay = () => {
  const transactionsContainer = document.querySelector('.recent-transactions');
  if (!transactionsContainer) return;
  
  transactionsContainer.innerHTML = '';
  
  userTransactions.slice(0, 5).forEach(transaction => {
    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction-item';
    transactionElement.innerHTML = `
      <div class="transaction-info">
        <h6>${transaction.productTitle || 'Product'}</h6>
        <p>${transaction.status}</p>
      </div>
      <div class="transaction-amount">
        ${formatPrice(transaction.amount)}
      </div>
    `;
    transactionsContainer.appendChild(transactionElement);
  });
};

// Setup event listeners
const setupEventListeners = () => {
  // Product card interactions
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-quick-view')) {
      const productId = e.target.closest('.btn-quick-view').dataset.productId;
      viewProduct(productId);
    }
    
    if (e.target.closest('.btn-add-cart')) {
      const productId = e.target.closest('.btn-add-cart').dataset.productId;
      addToCart(productId);
    }
    
    if (e.target.closest('.btn-wishlist')) {
      const productId = e.target.closest('.btn-wishlist').dataset.productId;
      toggleWishlist(productId);
    }
  });
  
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  
  // Filter functionality
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', handleFilter);
  });
};

// View product details
const viewProduct = async (productId) => {
  try {
    const result = await getProduct(productId);
    if (result.success) {
      // Navigate to product detail page
      window.location.href = `productDetail.html?id=${productId}`;
    } else {
      showNotification('Product not found', 'warning');
    }
  } catch (error) {
    console.error('Error viewing product:', error);
    showNotification('Error loading product', 'danger');
  }
};

// Add to cart
const addToCart = async (productId) => {
  try {
    // Get product details
    const result = await getProduct(productId);
    if (result.success) {
      const product = result.product;
      
      // Add to global cart
      if (window.SwappitCart) {
        window.SwappitCart.addToCart(product);
      }
      
      showNotification('Producto agregado al carrito', 'success');
    } else {
      showNotification('Error loading product', 'danger');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Error adding to cart', 'danger');
  }
};

// Toggle wishlist
const toggleWishlist = async (productId) => {
  if (!window.SwappitApp?.isAuthenticated) {
    showNotification('Please login to add to wishlist', 'warning');
    return;
  }
  
  try {
    // Wishlist logic here
    showNotification('Added to wishlist', 'success');
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    showNotification('Error updating wishlist', 'danger');
  }
};

// Handle search
const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  if (searchTerm.length === 0) {
    renderProducts(currentProducts);
    return;
  }
  
  const filteredProducts = currentProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm)
  );
  
  renderProducts(filteredProducts);
};

// Handle filters
const handleFilter = async () => {
  const filters = {};
  
  const categoryFilter = document.querySelector('.category-filter');
  if (categoryFilter && categoryFilter.value) {
    filters.category = categoryFilter.value;
  }
  
  const priceFilter = document.querySelector('.price-filter');
  if (priceFilter && priceFilter.value) {
    const [min, max] = priceFilter.value.split('-');
    if (min) filters.priceMin = parseFloat(min);
    if (max) filters.priceMax = parseFloat(max);
  }
  
  await loadProducts(filters);
};

// Purchase product with points
export const purchaseWithPoints = async (productId, quantity = 1) => {
  if (!window.SwappitApp?.isAuthenticated) {
    showNotification('Please login to make a purchase', 'warning');
    return;
  }
  
  try {
    // Get product details
    const productResult = await getProduct(productId);
    if (!productResult.success) {
      showNotification('Product not found', 'warning');
      return;
    }
    
    const product = productResult.product;
    const totalCost = product.price * quantity;
    
    // Check if user has enough points
    if (!userPoints || userPoints.balance < totalCost) {
      showNotification('Insufficient points', 'warning');
      return;
    }
    
    // Create transaction
    const transactionData = {
      buyerId: window.SwappitApp.user.uid,
      sellerId: product.sellerId,
      productId: productId,
      amount: totalCost,
      quantity: quantity,
      paymentMethod: 'points'
    };
    
    const transactionResult = await createTransaction(transactionData);
    if (!transactionResult.success) {
      showNotification('Error creating transaction', 'danger');
      return;
    }
    
    // Complete transaction
    const completeResult = await completeTransaction(transactionResult.transactionId, 'points');
    if (completeResult.success) {
      showNotification('Purchase completed successfully!', 'success');
      
      // Refresh user points
      if (userPoints) {
        userPoints.balance -= totalCost;
        updatePointsDisplay();
      }
    } else {
      showNotification('Error completing transaction', 'danger');
    }
    
  } catch (error) {
    console.error('Error purchasing product:', error);
    showNotification('Error processing purchase', 'danger');
  }
};

// Add product review
export const addProductReview = async (productId, rating, comment) => {
  if (!window.SwappitApp?.isAuthenticated) {
    showNotification('Please login to add a review', 'warning');
    return;
  }
  
  try {
    const reviewData = {
      productId: productId,
      buyerId: window.SwappitApp.user.uid,
      sellerId: '', // Will be filled from product data
      rating: rating,
      comment: comment,
      reviewerName: window.SwappitApp.user.displayName || window.SwappitApp.user.email
    };
    
    const result = await addReview(reviewData);
    if (result.success) {
      showNotification('Review added successfully!', 'success');
    } else {
      showNotification('Error adding review', 'danger');
    }
  } catch (error) {
    console.error('Error adding review:', error);
    showNotification('Error adding review', 'danger');
  }
};

// Utility function: debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Export functions for use in other modules
export {
  loadProducts,
  renderProducts,
  createProductCard,
  updatePointsDisplay,
  updateTransactionsDisplay
}; 