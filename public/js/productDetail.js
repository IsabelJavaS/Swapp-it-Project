// Product Detail Page JavaScript
console.log('ProductDetail.js loaded successfully');

class ProductDetailPage {
    constructor() {
        console.log('ProductDetailPage constructor called');
        this.productId = null;
        this.product = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
        
        this.init();
    }

    init() {
        console.log('ProductDetailPage init called');
        this.getProductIdFromUrl();
        this.loadProductDetails();
        this.attachEventListeners();
    }

    // Get product ID from URL parameters
    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.productId = urlParams.get('id');
        console.log('Product ID from URL:', this.productId);
        
        if (!this.productId) {
            this.showError('No product ID provided');
            return;
        }
    }

    // Load product details from Firebase
    async loadProductDetails() {
        try {
            console.log('Loading product details for ID:', this.productId);
            this.showLoadingState();
            
            // Check if this is a test product
            if (this.productId === 'test-product-123') {
                console.log('Loading test product...');
                const testProduct = window.loadTestProduct ? window.loadTestProduct() : null;
                if (testProduct) {
                    this.product = testProduct;
                    console.log('Test product loaded successfully:', this.product);
                    this.updatePageContent();
                    this.loadRelatedProducts();
                    this.hideLoadingState();
                    return;
                }
            }
            
            // Import Firebase functions
            const { getProduct, getProducts } = await import('../../firebase/firestore.js');
            console.log('Firebase functions imported successfully');
            
            // Get the specific product
            console.log('Calling getProduct with ID:', this.productId);
            const result = await getProduct(this.productId);
            console.log('getProduct result:', result);
            
            if (result.success) {
                this.product = result.product;
                console.log('Product loaded successfully:', this.product);
                
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    this.updatePageContent();
                    this.loadRelatedProducts();
                    this.hideLoadingState();
                }, 100);
            } else {
                console.error('Error loading product:', result.error);
                this.showError(`Product not found: ${result.error}`);
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            this.showError(`Error loading product details: ${error.message}`);
        }
    }

    // Update page content with product data
    updatePageContent() {
        console.log('Updating page content...');
        try {
            this.updateBreadcrumb();
            this.updateProductGallery();
            this.updateProductInfo();
            this.updateProductTabs();
            this.updateSellerInfo();
            this.updatePageTitle();
            console.log('Page content updated successfully');
        } catch (error) {
            console.error('Error updating page content:', error);
        }
    }

    // Update breadcrumb
    updateBreadcrumb() {
        console.log('Updating breadcrumb...');
        const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
        if (breadcrumbItems.length >= 3) {
            // Update category link
            const categoryLink = breadcrumbItems[1].querySelector('a');
            if (categoryLink) {
                categoryLink.textContent = this.product.category || 'Category';
                categoryLink.href = `../marketplace/marketplace.html?category=${this.product.category}`;
            }
            
            // Update product name
            breadcrumbItems[2].textContent = this.product.productName || 'Product';
        }
        console.log('Breadcrumb updated');
    }

    // Update product gallery
    updateProductGallery() {
        console.log('Updating product gallery...');
        console.log('Full product data:', this.product);
        
        const mainSwiper = document.querySelector('.gallery-main .swiper-wrapper');
        const thumbsSwiper = document.querySelector('.gallery-thumbs .swiper-wrapper');
        
        if (!mainSwiper || !thumbsSwiper) {
            console.warn('Gallery elements not found');
            return;
        }
        
        // Clear existing slides
        mainSwiper.innerHTML = '';
        thumbsSwiper.innerHTML = '';
        
        // Check different possible image field names
        const images = this.product.images || this.product.imageUrls || this.product.productImages || [];
        console.log('Product images array:', images);
        console.log('Images type:', typeof images);
        console.log('Images length:', images.length);
        
        if (images.length === 0) {
            // Use placeholder image if no images
            const placeholderImage = 'https://via.placeholder.com/600x400/f3f4f6/6b7280?text=No+Image';
            console.log('No images found, using placeholder:', placeholderImage);
            this.addImageSlide(mainSwiper, thumbsSwiper, placeholderImage, 'Product Image');
        } else {
            // Add all product images
            images.forEach((imageData, index) => {
                console.log(`Adding image ${index + 1}:`, imageData);
                console.log(`Image data type:`, typeof imageData);
                
                // Handle both string URLs and object with url property
                let imageUrl;
                if (typeof imageData === 'string') {
                    imageUrl = imageData;
                } else if (imageData && typeof imageData === 'object' && imageData.url) {
                    imageUrl = imageData.url;
                } else {
                    console.warn(`Invalid image data at index ${index}:`, imageData);
                    return; // Skip this image
                }
                
                console.log(`Extracted image URL:`, imageUrl);
                console.log(`Image URL valid:`, imageUrl && imageUrl.startsWith('http'));
                this.addImageSlide(mainSwiper, thumbsSwiper, imageUrl, `Product Image ${index + 1}`);
            });
        }
        
        // Reinitialize Swiper
        this.initializeSwiper();
        console.log('Product gallery updated successfully');
    }

    // Add image slide to gallery
    addImageSlide(mainSwiper, thumbsSwiper, imageUrl, altText) {
        console.log(`Adding image slide: ${imageUrl}`);
        
        // Main slide
        const mainSlide = document.createElement('div');
        mainSlide.className = 'swiper-slide';
        mainSlide.innerHTML = `<img src="${imageUrl}" alt="${altText}" onerror="console.error('Failed to load image:', this.src);">`;
        mainSwiper.appendChild(mainSlide);
        
        // Thumbnail slide
        const thumbSlide = document.createElement('div');
        thumbSlide.className = 'swiper-slide';
        thumbSlide.innerHTML = `<img src="${imageUrl}" alt="${altText}" onerror="console.error('Failed to load thumbnail:', this.src);">`;
        thumbsSwiper.appendChild(thumbSlide);
        
        console.log(`Image slide added successfully: ${altText}`);
    }

    // Initialize Swiper gallery
    initializeSwiper() {
        console.log('Initializing Swiper gallery...');
        
        // Destroy existing Swiper instances if they exist
        if (window.galleryThumbs) {
            window.galleryThumbs.destroy();
        }
        if (window.galleryMain) {
            window.galleryMain.destroy();
        }
        
        // Initialize thumbnail swiper
        window.galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });

        // Initialize main swiper
        window.galleryMain = new Swiper('.gallery-main', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: window.galleryThumbs
            }
        });
        
        console.log('Swiper gallery initialized successfully');
    }

    // Update product information
    updateProductInfo() {
        console.log('Updating product info...');
        try {
            // Update title
            const titleElement = document.querySelector('.product-title');
            if (titleElement) {
                titleElement.textContent = this.product.productName || 'Product Name';
                console.log('Title updated:', this.product.productName);
            } else {
                console.warn('Title element not found');
            }
            
            // Update price
            this.updatePrice();
            
            // Update description
            const descriptionElement = document.querySelector('.product-short-description p');
            if (descriptionElement) {
                descriptionElement.textContent = this.product.description || 'No description available.';
                console.log('Description updated');
            } else {
                console.warn('Description element not found');
            }
            
            // Update status badges
            this.updateStatusBadges();
            
            // Update rating
            this.updateRating();
            
            // Update stock info
            this.updateStockInfo();
            
            // Update action buttons
            this.updateActionButtons();
            
            console.log('Product info updated successfully');
        } catch (error) {
            console.error('Error updating product info:', error);
        }
    }

    // Update price display
    updatePrice() {
        const currentPriceElement = document.querySelector('.current-price');
        const originalPriceElement = document.querySelector('.original-price');
        const discountBadgeElement = document.querySelector('.discount-badge');
        const price = this.product.price || 0;
        const originalPrice = this.product.originalPrice || price;
        // Calcular Swappit Coins
        const swappitCoinRate = 0.03;
        const priceInSwappitCoins = price / swappitCoinRate;
        const originalPriceInSwappitCoins = originalPrice / swappitCoinRate;
        if (currentPriceElement) {
            currentPriceElement.innerHTML = `
                <span class="swappit-price" style='white-space:nowrap;'><img src='/assets/coin_SwappIt.png' alt='SwappIt Coin' style='width:22px;vertical-align:middle;margin-right:4px;'>${priceInSwappitCoins.toFixed(0)}</span>
                <span class="dollar-price">($${price.toFixed(2)})</span>
            `;
        }
        if (originalPriceElement && originalPrice > price) {
            originalPriceElement.innerHTML = `
                <span class="swappit-price" style='white-space:nowrap;'><img src='/assets/coin_SwappIt.png' alt='SwappIt Coin' style='width:18px;vertical-align:middle;margin-right:4px;'>${originalPriceInSwappitCoins.toFixed(0)}</span>
                <span class="dollar-price">($${originalPrice.toFixed(2)})</span>
            `;
            originalPriceElement.style.display = 'inline';
            if (discountBadgeElement) {
                const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
                discountBadgeElement.textContent = `-${discount}%`;
                discountBadgeElement.style.display = 'inline';
            }
        } else {
            if (originalPriceElement) originalPriceElement.style.display = 'none';
            if (discountBadgeElement) discountBadgeElement.style.display = 'none';
        }
    }

    // Update status badges
    updateStatusBadges() {
        const statusContainer = document.querySelector('.product-status');
        if (!statusContainer) return;
        
        statusContainer.innerHTML = '';
        
        // Stock status
        const stockBadge = document.createElement('span');
        stockBadge.className = 'badge bg-success';
        stockBadge.textContent = 'In Stock';
        statusContainer.appendChild(stockBadge);
        
        // Transaction type badge
        if (this.product.transactionType === 'swapp') {
            const swappBadge = document.createElement('span');
            swappBadge.className = 'badge bg-warning';
            swappBadge.textContent = 'For Swap';
            statusContainer.appendChild(swappBadge);
        }
        
        // Seller type badge
        if (this.product.sellerType === 'business') {
            const businessBadge = document.createElement('span');
            businessBadge.className = 'badge bg-primary';
            businessBadge.textContent = 'Business Product';
            statusContainer.appendChild(businessBadge);
        }
    }

    // Update rating display
    updateRating() {
        const ratingContainer = document.querySelector('.product-rating');
        if (!ratingContainer) return;
        
        const starsContainer = ratingContainer.querySelector('.stars');
        const ratingCountElement = ratingContainer.querySelector('.rating-count');
        
        if (starsContainer) {
            starsContainer.innerHTML = this.generateStars(this.product.rating || 0);
        }
        
        if (ratingCountElement) {
            const reviewCount = this.product.reviewCount || 0;
            ratingCountElement.textContent = `(${reviewCount} Reviews)`;
        }
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        return starsHTML;
    }

    // Update stock information
    updateStockInfo() {
        const stockInfoElement = document.querySelector('.stock-info');
        if (stockInfoElement) {
            const stock = this.product.stock || 1;
            stockInfoElement.textContent = `${stock} item${stock > 1 ? 's' : ''} left`;
        }
    }

    // Update action buttons
    updateActionButtons() {
        const addToCartBtn = document.querySelector('.btn-add-to-cart');
        const buyNowBtn = document.querySelector('.btn-buy-now');
        
        if (addToCartBtn) {
            addToCartBtn.onclick = () => this.addToCart();
        }
        
        if (buyNowBtn) {
            if (this.product.transactionType === 'swapp') {
                buyNowBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Proceed to Swap';
                buyNowBtn.className = 'btn btn-warning btn-buy-now';
                buyNowBtn.onclick = () => this.proceedToSwap();
            } else {
                buyNowBtn.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
                buyNowBtn.className = 'btn btn-outline-primary btn-buy-now';
                buyNowBtn.onclick = () => this.buyNow();
            }
        }
    }

    // Update product tabs content
    updateProductTabs() {
        this.updateDescriptionTab();
        this.updateSpecificationsTab();
        this.updateReviewsTab();
    }

    // Update description tab
    updateDescriptionTab() {
        const descriptionTab = document.querySelector('#description .product-description');
        if (!descriptionTab) return;
        
        descriptionTab.innerHTML = `
            <h3>${this.product.productName || 'Product'}</h3>
            <p>${this.product.description || 'No description available.'}</p>
            
            ${this.product.features ? `
                <h4>Key Features:</h4>
                <ul>
                    ${this.product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${this.product.condition ? `
                <h4>Condition:</h4>
                <p>${this.product.condition}</p>
            ` : ''}
        `;
    }

    // Update specifications tab
    updateSpecificationsTab() {
        const specificationsTab = document.querySelector('#specifications .product-specifications');
        if (!specificationsTab) return;
        
        const specs = this.product.specifications || {};
        let specsHTML = '';
        
        Object.keys(specs).forEach(category => {
            specsHTML += `
                <div class="spec-group">
                    <h4>${category}</h4>
                    ${Object.entries(specs[category]).map(([key, value]) => `
                        <div class="spec-item">
                            <span class="spec-label">${key}</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        });
        
        if (specsHTML === '') {
            specsHTML = '<p>No specifications available for this product.</p>';
        }
        
        specificationsTab.innerHTML = specsHTML;
    }

    // Update reviews tab
    updateReviewsTab() {
        const reviewsTab = document.querySelector('#reviews .product-reviews');
        if (!reviewsTab) return;
        
        // For now, show a placeholder since reviews are not implemented yet
        reviewsTab.innerHTML = `
            <div class="reviews-summary">
                <div class="rating-average">
                    <h2>${this.product.rating || 0}</h2>
                    <div class="stars">
                        ${this.generateStars(this.product.rating || 0)}
                    </div>
                    <p>Based on ${this.product.reviewCount || 0} reviews</p>
                </div>
            </div>
            <div class="write-review">
                <p>Reviews feature coming soon!</p>
                <button class="btn btn-primary" disabled>Write a Review</button>
            </div>
        `;
    }

    // Update seller information
    updateSellerInfo() {
        const sellerCard = document.querySelector('.seller-card');
        if (!sellerCard) return;
        
        const sellerName = this.product.sellerDisplayName || this.product.sellerEmail || 'Unknown Seller';
        const sellerAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}`;
        
        sellerCard.innerHTML = `
            <div class="seller-header">
                <img src="${sellerAvatar}" alt="${sellerName}" class="seller-avatar">
                <div class="seller-details">
                    <h4>${sellerName}</h4>
                    <div class="seller-rating">
                        <div class="stars">
                            ${this.generateStars(4.5)}
                        </div>
                        <span>(4.5 / 5)</span>
                    </div>
                    <span class="seller-status">
                        <i class="fas fa-check-circle"></i> Verified Seller
                    </span>
                </div>
                <button class="btn btn-outline-primary">Visit Store</button>
            </div>
            <div class="seller-stats">
                <div class="stat-item">
                    <span class="stat-value">98%</span>
                    <span class="stat-label">Positive Feedback</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">1,234</span>
                    <span class="stat-label">Products Sold</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">24h</span>
                    <span class="stat-label">Response Time</span>
                </div>
            </div>
        `;
    }

    // Update page title
    updatePageTitle() {
        const title = this.product.productName || 'Product Details';
        document.title = `${title} - SWAPPIT Marketplace`;
    }

    // Load related products
    async loadRelatedProducts() {
        try {
            const { getProducts } = await import('../../firebase/firestore.js');
            
            // Get products from the same category
            const result = await getProducts({
                category: this.product.category,
                limit: 8
            });
            
            if (result.success) {
                const relatedProducts = result.products
                    .filter(p => p.id !== this.productId)
                    .slice(0, 4);
                
                this.renderRelatedProducts(relatedProducts);
            }
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    }

    // Render related products
    renderRelatedProducts(products) {
        const relatedSwiper = document.querySelector('.related-swiper .swiper-wrapper');
        if (!relatedSwiper) return;
        
        relatedSwiper.innerHTML = '';
        
        products.forEach(product => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = this.createRelatedProductCard(product);
            relatedSwiper.appendChild(slide);
        });
        
        // Reinitialize related products swiper
        this.initializeRelatedSwiper();
    }

    // Create related product card
    createRelatedProductCard(product) {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=No+Image';
        const swappitCoinRate = 0.03;
        const priceInSwappitCoins = (product.price || 0) / swappitCoinRate;
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.productName}">
                    <div class="product-overlay">
                        <button class="btn btn-quick-view" onclick="window.location.href='productDetail.html?id=${product.id}'">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.productName}</h3>
                    <p class="product-seller">by ${product.sellerDisplayName || product.sellerEmail}</p>
                    <div class="product-price">
                        <span class="swappit-price" style='white-space:nowrap;'><img src='/assets/coin_SwappIt.png' alt='SwappIt Coin' style='width:18px;vertical-align:middle;margin-right:4px;'>${priceInSwappitCoins.toFixed(0)}</span>
                        <span class="dollar-price">($${product.price.toFixed(2)})</span>
                    </div>
                    <button class="btn btn-add-cart" onclick="productDetailPage.addToCart('${product.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    // Initialize related products swiper
    initializeRelatedSwiper() {
        if (window.relatedSwiper) {
            window.relatedSwiper.destroy();
        }
        
        window.relatedSwiper = new Swiper('.related-swiper', {
            spaceBetween: 30,
            slidesPerView: 4,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    }

    // Add to cart functionality
    async addToCart() {
        try {
            // Wait for cart component to be available
            await this.waitForCartComponent();
            
            // Get cart component
            const cartComponent = document.querySelector('cart-component');
            if (cartComponent && cartComponent.addToCart) {
                cartComponent.addToCart(this.productId, this.quantity);
                this.showNotification('Product added to cart!', 'success');
            } else {
                console.error('Cart component not found or addToCart method not available');
                this.showNotification('Error adding to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
        }
    }

    // Proceed to swap functionality
    proceedToSwap() {
        // Redirect to swap process page
        window.location.href = `swap-process.html?productId=${this.productId}`;
    }

    // Buy now functionality
    buyNow() {
        // Redirect to product purchase page
        window.location.href = `../../pages/marketplace/product-purchase.html?productId=${this.productId}&quantity=${this.quantity}`;
    }

    // Wait for cart component to be available
    waitForCartComponent() {
        return new Promise((resolve) => {
            const checkCart = () => {
                const cartComponent = document.querySelector('cart-component');
                if (cartComponent && cartComponent.addToCart) {
                    resolve();
                } else {
                    setTimeout(checkCart, 100);
                }
            };
            checkCart();
        });
    }

    // Attach event listeners
    attachEventListeners() {
        // Quantity selector
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const qtyInput = document.querySelector('.quantity-selector input');
        
        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                    this.quantity = currentValue - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                const maxStock = this.product.stock || 10;
                if (currentValue < maxStock) {
                    qtyInput.value = currentValue + 1;
                    this.quantity = currentValue + 1;
                }
            });
            
            qtyInput.addEventListener('change', () => {
                this.quantity = parseInt(qtyInput.value) || 1;
            });
        }
        
        // Wishlist button
        const wishlistBtn = document.querySelector('.btn-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist();
            });
        }
    }

    // Toggle wishlist
    toggleWishlist() {
        // Implement wishlist functionality
        this.showNotification('Added to wishlist!', 'success');
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notificationToast');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notificationToast';
            notification.className = 'notification-toast';
            notification.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-check-circle"></i>
                    <span class="toast-message">${message}</span>
                </div>
            `;
            document.body.appendChild(notification);
        } else {
            const messageElement = notification.querySelector('.toast-message');
            const iconElement = notification.querySelector('i');
            
            if (messageElement) messageElement.textContent = message;
            
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle',
                warning: 'fas fa-exclamation-triangle'
            };
            
            if (iconElement) {
                iconElement.className = icons[type] || icons.success;
            }
        }
        
        notification.className = `notification-toast ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    // Show loading state
    showLoadingState() {
        const main = document.querySelector('main');
        if (main) {
            // Add loading overlay instead of replacing content
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="container text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading product details...</p>
                </div>
            `;
            main.appendChild(loadingOverlay);
        }
    }

    // Hide loading state
    hideLoadingState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // Show error
    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="container text-center py-5">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${message}
                    </div>
                    <a href="../marketplace/marketplace.html" class="btn btn-primary mt-3">
                        <i class="fas fa-arrow-left me-2"></i>
                        Back to Marketplace
                    </a>
                </div>
            `;
        }
    }
}

// Initialize product detail page
let productDetailPage;
document.addEventListener('DOMContentLoaded', () => {
    productDetailPage = new ProductDetailPage();
}); 