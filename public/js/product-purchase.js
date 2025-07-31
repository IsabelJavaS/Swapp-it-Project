// Product Purchase Page
import { getProduct } from '../firebase/firestore.js';
import { getUserPoints } from '../firebase/firestore.js';
import { getCurrentUser } from '../firebase/auth.js';

class ProductPurchasePage {
    constructor() {
        this.productId = null;
        this.product = null;
        this.userBalance = 0;
        this.selectedDeliveryMethod = 'delivery';
        this.deliveryFees = {
            delivery: 5, // 5 Swappit Coins for home delivery
            pickup: 0    // Free pickup
        };
    }

    async init() {
        console.log('Initializing Product Purchase Page...');
        
        // Get product ID from URL
        this.productId = this.getProductIdFromUrl();
        if (!this.productId) {
            this.showError('Product ID not found in URL');
            return;
        }

        // Load product data
        await this.loadProductData();
        
        // Load user balance
        await this.loadUserBalance();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update purchase summary
        this.updatePurchaseSummary();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('productId');
    }

    async loadProductData() {
        try {
            console.log('Loading product data for ID:', this.productId);
            
            const result = await getProduct(this.productId);
            console.log('Product data result:', result);
            
            if (result.success) {
                this.product = result.product;
                this.updateProductDisplay();
            } else {
                this.showError(`Error loading product: ${result.error}`);
            }
        } catch (error) {
            console.error('Error loading product data:', error);
            this.showError('Failed to load product data');
        }
    }

    async loadUserBalance() {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                this.showError('User not authenticated');
                return;
            }

            const result = await getUserPoints(currentUser.uid);
            if (result.success) {
                this.userBalance = result.points || 0;
                this.updateBalanceDisplay();
                this.checkInsufficientFunds();
            } else {
                console.error('Error loading user balance:', result.error);
                this.userBalance = 0;
                this.updateBalanceDisplay();
            }
        } catch (error) {
            console.error('Error loading user balance:', error);
            this.userBalance = 0;
            this.updateBalanceDisplay();
        }
    }

    updateProductDisplay() {
        if (!this.product) return;

        // Update product image
        const productImage = document.getElementById('product-image');
        if (productImage) {
            const images = this.product.images || [];
            if (images.length > 0) {
                // Handle both string URLs and object with url property
                let imageUrl;
                const firstImage = images[0];
                if (typeof firstImage === 'string') {
                    imageUrl = firstImage;
                } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
                    imageUrl = firstImage.url;
                } else {
                    imageUrl = 'https://via.placeholder.com/120x120/f3f4f6/6b7280?text=No+Image';
                }
                productImage.src = imageUrl;
            } else {
                productImage.src = 'https://via.placeholder.com/120x120/f3f4f6/6b7280?text=No+Image';
            }
        }

        // Update product name
        const productName = document.getElementById('product-name');
        if (productName) {
            productName.textContent = this.product.productName || 'Product Name';
        }

        // Update product description
        const productDescription = document.getElementById('product-description');
        if (productDescription) {
            productDescription.textContent = this.product.description || 'No description available';
        }

        // Update product price
        const productPrice = document.getElementById('product-price');
        if (productPrice) {
            const price = this.product.price || 0;
            productPrice.textContent = price;
        }
    }

    updateBalanceDisplay() {
        const balanceElement = document.getElementById('user-balance');
        if (balanceElement) {
            balanceElement.textContent = this.userBalance;
        }
    }

    setupEventListeners() {
        // Delivery method selection
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                deliveryOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Update selected method
                this.selectedDeliveryMethod = option.dataset.method;
                
                // Update purchase summary
                this.updatePurchaseSummary();
            });
        });

        // Set default selection
        const defaultOption = document.querySelector('.delivery-option[data-method="delivery"]');
        if (defaultOption) {
            defaultOption.classList.add('selected');
        }
    }

    updatePurchaseSummary() {
        if (!this.product) return;

        const productPrice = this.product.price || 0;
        const deliveryFee = this.deliveryFees[this.selectedDeliveryMethod] || 0;
        const total = productPrice + deliveryFee;

        // Update summary display
        const summaryPrice = document.getElementById('summary-price');
        if (summaryPrice) {
            summaryPrice.textContent = `${productPrice} Swappit Coins`;
        }

        const summaryDelivery = document.getElementById('summary-delivery');
        if (summaryDelivery) {
            summaryDelivery.textContent = `${deliveryFee} Swappit Coins`;
        }

        const summaryTotal = document.getElementById('summary-total');
        if (summaryTotal) {
            summaryTotal.textContent = `${total} Swappit Coins`;
        }

        // Check if user has sufficient funds
        this.checkInsufficientFunds();
    }

    checkInsufficientFunds() {
        if (!this.product) return;

        const productPrice = this.product.price || 0;
        const deliveryFee = this.deliveryFees[this.selectedDeliveryMethod] || 0;
        const total = productPrice + deliveryFee;

        const insufficientFunds = document.getElementById('insufficient-funds');
        const purchaseBtn = document.getElementById('purchase-btn');

        if (this.userBalance < total) {
            // Show insufficient funds warning
            if (insufficientFunds) {
                insufficientFunds.style.display = 'block';
            }
            
            // Disable purchase button
            if (purchaseBtn) {
                purchaseBtn.disabled = true;
                purchaseBtn.textContent = 'Insufficient Swappit Coins';
            }
        } else {
            // Hide insufficient funds warning
            if (insufficientFunds) {
                insufficientFunds.style.display = 'none';
            }
            
            // Enable purchase button
            if (purchaseBtn) {
                purchaseBtn.disabled = false;
                purchaseBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Complete Purchase';
            }
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showError(message) {
        console.error('Error:', message);
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        alert(`Success: ${message}`);
    }
}

// Global functions for onclick handlers
window.processPurchase = async function() {
    const purchasePage = window.purchasePage;
    if (!purchasePage) return;

    try {
        purchasePage.showLoading();

        // Get current user
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        // Calculate total
        const productPrice = purchasePage.product.price || 0;
        const deliveryFee = purchasePage.deliveryFees[purchasePage.selectedDeliveryMethod] || 0;
        const total = productPrice + deliveryFee;

        // Check if user has sufficient funds
        if (purchasePage.userBalance < total) {
            throw new Error('Insufficient Swappit Coins');
        }

        // TODO: Implement actual purchase logic
        // This would involve:
        // 1. Creating a transaction record
                    // 2. Deducting Swappit Coins from user
        // 3. Updating product status
        // 4. Sending notifications

        // For now, just show success message
        setTimeout(() => {
            purchasePage.hideLoading();
            purchasePage.showSuccess('Purchase completed successfully!');
            
            // Redirect to dashboard or order confirmation
            window.location.href = '../../dashboards/student/student-dashboard.html';
        }, 2000);

    } catch (error) {
        purchasePage.hideLoading();
        purchasePage.showError(error.message);
    }
};

        window.buyMoreSwappitCoins = function() {
    // Redirect to Swappcoin purchase page
                    window.location.href = '../../pages/swapcoin/buy-coins.html';
};

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    window.purchasePage = new ProductPurchasePage();
    await window.purchasePage.init();
}); 