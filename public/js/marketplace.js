// Marketplace Logged JavaScript
console.log('Marketplace.js loaded successfully');

class MarketplaceLogged {
    constructor() {
        console.log('MarketplaceLogged constructor called');
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            search: '',
            categories: [],
            priceRange: { min: 0, max: 200 },
            condition: [],
            sellerType: [],
            rating: []
        };
        this.sortBy = 'relevance';
        this.viewMode = 'grid';
        
        this.init();
    }

    init() {
        console.log('MarketplaceLogged init called');
        this.loadProducts();
        this.attachEventListeners();
        this.setupFilters();
        this.showLoadingState();
        
        // Load specific sections if on main marketplace page
        this.loadMainPageSections();
    }

    // Load products from Firebase
    async loadProducts(targetGridId = null, customFilters = null) {
        console.log('loadProducts called - Loading from Firebase');
        try {
            this.showLoadingState();
            
            // Import Firebase functions
            const { getProducts } = await import('../../firebase/firestore.js');
            
            // Use custom filters if provided, otherwise use default
            const filters = customFilters || {
                orderBy: 'createdAt',
                orderDirection: 'desc'
            };
            
            // Get products from Firebase with filters
            const result = await getProducts(filters);
            
            if (result.success) {
                const formattedProducts = result.products.map(product => this.formatProductForDisplay(product));
                console.log(`Loaded ${formattedProducts.length} products from Firebase`);
                
                if (targetGridId) {
                    // Load products to specific grid
                    this.renderProductsToGrid(targetGridId, formattedProducts);
                } else {
                    // Load all products (main marketplace page)
                    this.products = formattedProducts;
                    this.filteredProducts = [...this.products];
                    this.renderProducts();
                    this.updateProductCount();
                }
                
                this.hideLoadingState();
            } else {
                console.error('Error loading products from Firebase:', result.error);
                this.showNoResults();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNoResults();
        }
    }

    // Format Firebase product data for display
    formatProductForDisplay(firebaseProduct) {
        return {
            id: firebaseProduct.id,
            title: firebaseProduct.productName,
            description: firebaseProduct.description,
            price: firebaseProduct.price || 0,
            originalPrice: firebaseProduct.originalPrice || null,
            category: firebaseProduct.category,
            condition: firebaseProduct.condition,
            sellerType: this.getSellerType(firebaseProduct.sellerEmail),
            sellerName: firebaseProduct.sellerDisplayName || firebaseProduct.sellerEmail,
            rating: firebaseProduct.rating || 0,
            reviewCount: firebaseProduct.reviewCount || 0,
            images: firebaseProduct.images || [],
            location: firebaseProduct.location || 'Campus',
            createdAt: firebaseProduct.createdAt ? new Date(firebaseProduct.createdAt) : new Date(),
            isFeatured: firebaseProduct.isFeatured || false,
            isNew: this.isNewProduct(firebaseProduct.createdAt),
            stock: 1, // Default stock for now
            transactionType: firebaseProduct.transactionType,
            brand: firebaseProduct.brand,
            swappPreferences: firebaseProduct.swappPreferences,
            phone: firebaseProduct.phone,
            views: firebaseProduct.views || 0,
            favorites: firebaseProduct.favorites || 0
        };
    }

    // Determine seller type based on email domain
    getSellerType(email) {
        if (!email) return 'student';
        // You can add logic here to determine if it's a business email
        // For now, we'll assume all are students
        return 'student';
    }

    // Check if product is new (less than 7 days old)
    isNewProduct(createdAt) {
        if (!createdAt) return false;
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(createdAt) > oneWeekAgo;
    }

    // Attach event listeners
    attachEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebarFilters = document.getElementById('sidebarFilters');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebarFilters.classList.add('show');
            });
        }

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebarFilters.classList.remove('show');
            });
        }

        // Search filter
        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Category filters
        const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
            });
        });

        // Price range
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const priceSlider = document.getElementById('priceSlider');

        if (minPrice) {
            minPrice.addEventListener('input', () => {
                this.filters.priceRange.min = parseFloat(minPrice.value) || 0;
                this.applyFilters();
            });
        }

        if (maxPrice) {
            maxPrice.addEventListener('input', () => {
                this.filters.priceRange.max = parseFloat(maxPrice.value) || 200;
                this.applyFilters();
            });
        }

        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.filters.priceRange.max = parseFloat(e.target.value);
                if (maxPrice) maxPrice.value = e.target.value;
                this.applyFilters();
            });
        }

        // Sort controls
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortProducts();
                this.renderProducts();
            });
        }

        // View controls
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setViewMode(e.target.dataset.view);
            });
        });

        // Filter actions
        const clearFilters = document.getElementById('clearFilters');
        const applyFilters = document.getElementById('applyFilters');
        const resetFilters = document.getElementById('resetFilters');

        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Close sidebar on outside click
  document.addEventListener('click', (e) => {
            if (sidebarFilters && !sidebarFilters.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebarFilters.classList.remove('show');
            }
        });
    }

    // Setup filters
    setupFilters() {
        this.updateCategoryFilters();
        this.applyFilters();
    }

    // Update category filters
    updateCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        this.filters.categories = [];
        this.filters.condition = [];
        this.filters.sellerType = [];
        this.filters.rating = [];

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const value = checkbox.value;
                if (['new', 'like-new', 'good', 'fair'].includes(value)) {
                    this.filters.condition.push(value);
                } else if (['student', 'business'].includes(value)) {
                    this.filters.sellerType.push(value);
                } else if (['3', '4', '5'].includes(value)) {
                    this.filters.rating.push(parseInt(value));
                } else {
                    this.filters.categories.push(value);
                }
            }
        });
    }

    // Apply filters
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const searchableText = `${product.title} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price range filter (only for sale products)
            if (product.transactionType === 'sale' && product.price) {
                if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                    return false;
                }
            }

            // Condition filter
            if (this.filters.condition.length > 0 && !this.filters.condition.includes(product.condition)) {
                return false;
            }

            // Seller type filter
            if (this.filters.sellerType.length > 0 && !this.filters.sellerType.includes(product.sellerType)) {
                return false;
            }

            // Rating filter
            if (this.filters.rating.length > 0 && !this.filters.rating.includes(product.rating)) {
                return false;
            }

            return true;
        });

        this.sortProducts();
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductCount();
    }

    // Sort products
    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            default: // relevance
                // Keep original order for relevance
                break;
        }
    }

    // Set view mode
    setViewMode(mode) {
        this.viewMode = mode;
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');

        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });

        if (productsGrid) {
            productsGrid.className = `products-grid ${mode}-view`;
        }

        this.renderProducts();
    }

    // Render products in sections
    renderProducts() {
        console.log('renderProducts called');
        
        // Render New Products
        const newProducts = this.getNewArrivals();
        console.log('New products:', newProducts.length);
        this.renderSection('newProductsGrid', newProducts, 4);
        
        // Render Swap Products
        const swapProducts = this.getSwapProducts();
        console.log('Swap products:', swapProducts.length);
        this.renderSection('swapProductsGrid', swapProducts, 4);
        
        // Render Business Products
        const businessProducts = this.getBusinessProducts();
        console.log('Business products:', businessProducts.length);
        this.renderSection('businessProductsGrid', businessProducts, 4);
    }

    // Render a specific section
    renderSection(sectionId, products, maxProducts = 4) {
        console.log(`renderSection called for ${sectionId} with ${products.length} products`);
        const sectionGrid = document.getElementById(sectionId);
        if (!sectionGrid) {
            console.error(`Section grid with id '${sectionId}' not found`);
            return;
        }

        const productsToShow = products.slice(0, maxProducts);
        console.log(`Showing ${productsToShow.length} products in ${sectionId}`);
        
        if (productsToShow.length === 0) {
            sectionGrid.innerHTML = '<p class="no-products">No products available</p>';
    return;
  }
  
        sectionGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        console.log(`Rendered ${productsToShow.length} products in ${sectionId}`);
    }

    // Render all products section
    renderAllProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            this.showNoResults();
    return;
  }
  
        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.updateLoadMoreButton();
    }

    // Get Best Sellers (products with highest ratings and reviews)
    getBestSellers() {
        return this.products
            .filter(product => product.rating >= 3 && product.reviewCount >= 1)
            .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
            .slice(0, 8);
    }

    // Get New Arrivals (products created in the last 7 days)
    getNewArrivals() {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return this.products
            .filter(product => new Date(product.createdAt) > oneWeekAgo)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);
    }

    // Get Featured Products (products with high views or ratings)
    getFeaturedProducts() {
        return this.products
            .filter(product => product.views >= 5 || product.rating >= 4)
            .sort((a, b) => (b.views + b.rating) - (a.views + a.rating))
            .slice(0, 8);
    }

    // Get Swap Products (products available for swapping)
    getSwapProducts() {
        return this.products
            .filter(product => product.transactionType === 'swapp')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);
    }

    // Get Business Products (products from business sellers)
    getBusinessProducts() {
        return this.products
            .filter(product => product.sellerType === 'business')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);
    }

    // Load main page sections
    async loadMainPageSections() {
        console.log('Loading main page sections...');
        
        // Load New Products (recently added)
        await this.loadProducts('newProductsGrid', {
            orderBy: 'createdAt',
            orderDirection: 'desc',
            limit: 8
        });
        
        // Load Swapp Products
        await this.loadProducts('swappProductsGrid', {
            transactionType: 'swapp',
            orderBy: 'createdAt',
            orderDirection: 'desc',
            limit: 8
        });
        
        // Load Business Products
        await this.loadProducts('businessProductsGrid', {
            sellerType: 'business',
            orderBy: 'createdAt',
            orderDirection: 'desc',
            limit: 8
        });
    }

    // Render products to specific grid
    renderProductsToGrid(gridId, products) {
        const grid = document.getElementById(gridId);
        if (!grid) {
            console.error(`Grid with id '${gridId}' not found`);
            return;
        }
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <p>No products found</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    // View more products for a specific section
    viewMoreProducts(sectionId) {
        console.log(`viewMoreProducts called for section: ${sectionId}`);
        
        // Navigate to specific section pages
        const sectionUrls = {
            'newProductsGrid': '/pages/marketplace/sections/new-products.html',
            'swappProductsGrid': '/pages/marketplace/sections/swapp-products.html',
            'businessProductsGrid': '/pages/marketplace/sections/business-products.html',
            'bestSellersGrid': '/pages/marketplace/sections/best-sellers.html',
            'newArrivalsGrid': '/pages/marketplace/sections/new-arrivals.html',
            'featuredGrid': '/pages/marketplace/sections/featured-products.html'
        };
        
        const url = sectionUrls[sectionId];
        if (url) {
            window.location.href = url;
        } else {
            // Fallback to all products
            window.location.href = '/pages/marketplace/all-products.html';
        }
    }

    // Create product card HTML
    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const badges = this.generateBadges(product);
        // Calcular el precio en Swapp-it Coins (1 SWAPPIT Coin = $0.03)
        const swappitCoinRate = 0.03;
        const priceInSwappitCoins = product.price / swappitCoinRate;
        const originalPriceInSwappitCoins = product.originalPrice ? product.originalPrice / swappitCoinRate : null;
        const originalPrice = product.originalPrice ? `<span class="original-price"><span style='white-space:nowrap;'><img src='/assets/coin_SwappIt.png' alt='SwappIt Coin' style='width:18px;vertical-align:middle;margin-right:4px;'>${originalPriceInSwappitCoins.toFixed(0)}</span></span>` : '';
        const priceDisplay = product.transactionType === 'sale' ? 
            `<div class="product-price"><span style='white-space:nowrap;'><img src='/assets/coin_SwappIt.png' alt='SwappIt Coin' style='width:22px;vertical-align:middle;margin-right:4px;'>${priceInSwappitCoins.toFixed(0)}</span> ${originalPrice}</div>` : 
            `<div class="product-price swapp-price">For Swapp</div>`;
        const defaultImage = product.images && product.images.length > 0 ? 
            product.images[0].url || product.images[0] : 
            '/assets/logos/utiles-escolares.jpg';
        return `
            <div class="product-card" data-product-id="${product.id}" onclick="marketplace.showProductDetails('${product.id}')" style="cursor: pointer;">
                <div class="product-image">
                    <img src="${defaultImage}" alt="${product.title}" loading="lazy">
                    ${badges}
                    <div class="product-overlay">
                        <button class="btn-wishlist" onclick="event.stopPropagation(); marketplace.toggleWishlist('${product.id}')" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-seller">by ${product.sellerName}</p>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">(${product.reviewCount} reviews)</span>
                    </div>
                    ${priceDisplay}
                    <div class="product-actions">
                        ${product.transactionType === 'sale' ? 
                            `<button class="btn btn-add-cart" onclick="event.stopPropagation(); marketplace.addToCart('${product.id}')">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>` : 
                            `<button class="btn btn-swapp" onclick="event.stopPropagation(); marketplace.initiateSwapp('${product.id}')">
                                <i class="fas fa-exchange-alt me-2"></i>Initiate Swapp
                            </button>`
                        }
                        <a href="/pages/marketplace/productDetail.html?id=${product.id}" class="btn btn-details" onclick="event.stopPropagation()">
                            <i class="fas fa-info-circle me-2"></i>Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate stars HTML
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Generate badges HTML
    generateBadges(product) {
        let badges = '';
        if (product.isFeatured) {
            badges += '<span class="product-badge featured">Featured</span>';
        }
        if (product.isNew) {
            badges += '<span class="product-badge new">New</span>';
        }
        if (product.originalPrice) {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            badges += `<span class="product-badge sale">-${discount}%</span>`;
        }
        return badges;
    }

    // Add to cart
    addToCart(productId) {
        console.log('Marketplace.addToCart called with productId:', productId);
        const product = this.products.find(p => p.id === productId);
        console.log('Found product:', product);
        
        if (!product) {
            console.error('Product not found with ID:', productId);
            return;
        }

        // Wait for cart component to be available
        this.waitForCartComponent().then(() => {
            if (window.SwappitCart) {
                console.log('SwappitCart found, adding product to cart');
                window.SwappitCart.addToCart(product);
                
                // Show success notification
                this.showNotification(`"${product.title}" added to cart successfully!`, 'success');
                
                // Update cart counter in header
                this.updateCartCounter();
                
                // Open cart sidebar automatically
                setTimeout(() => {
                    this.openCartSidebar();
                }, 500);
            } else {
                console.error('Cart component not available');
                this.showNotification('Error: Cart not available', 'error');
            }
        });
    }

    // Wait for cart component to be available
    waitForCartComponent() {
        return new Promise((resolve) => {
            const checkCart = () => {
                // First try to find cart component in main DOM
                let cartComponent = document.querySelector('cart-component');
                
                // If not found in main DOM, try to find it in header shadow DOM
                if (!cartComponent) {
                    const headerComponent = document.querySelector('header-component, header-auth-component');
                    if (headerComponent && headerComponent.shadowRoot) {
                        cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
                        console.log('Searching in header shadow DOM...');
                    }
                }
                
                if (cartComponent) {
                    console.log('Cart component found, proceeding...');
                    resolve();
                } else {
                    console.log('Cart component not found, waiting...');
                    setTimeout(checkCart, 100);
                }
            };
            checkCart();
        });
    }

    // Update cart counter
    updateCartCounter() {
        console.log('Marketplace.updateCartCounter called');
        
        // Try to find cart counter in main DOM first
        let cartCounter = document.querySelector('.cart-counter');
        
        // If not found, try to find it in header shadow DOM
        if (!cartCounter) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartCounter = headerComponent.shadowRoot.querySelector('.cart-counter');
                console.log('Found cart counter in header shadow DOM');
            }
        }
        
        console.log('Found cart counter element:', cartCounter);
        
        if (cartCounter && window.SwappitCart) {
            const itemCount = window.SwappitCart.getItemCount();
            console.log('Cart item count:', itemCount);
            cartCounter.textContent = itemCount;
            cartCounter.style.display = itemCount > 0 ? 'block' : 'none';
        } else {
            console.error('Cart counter element or SwappitCart not found');
        }
    }

    // Open cart sidebar
    openCartSidebar() {
        console.log('Marketplace.openCartSidebar called');
        
        // First try to find cart component in main DOM
        let cartComponent = document.querySelector('cart-component');
        
        // If not found, try to find it in header shadow DOM
        if (!cartComponent) {
            const headerComponent = document.querySelector('header-component, header-auth-component');
            if (headerComponent && headerComponent.shadowRoot) {
                cartComponent = headerComponent.shadowRoot.querySelector('cart-component');
                console.log('Found cart component in header shadow DOM');
            }
        }
        
        console.log('Found cart component:', cartComponent);
        
        if (cartComponent) {
            console.log('Opening cart sidebar...');
            cartComponent.openCart();
        } else {
            console.error('Cart component not found');
        }
    }

    // Initiate swapp
    initiateSwapp(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // For now, just show a notification
        this.showNotification('Swapp feature coming soon!', 'info');
        
        // TODO: Implement swapp functionality
        // This could open a modal or navigate to a swapp page
        console.log('Initiating swapp for product:', product);
    }

    // Show product details
    showProductDetails(productId) {
        window.location.href = `/pages/marketplace/productDetail.html?id=${productId}`;
    }

    // Toggle wishlist
    toggleWishlist(productId) {
        try {
            // Get current wishlist from localStorage
            let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            // Check if product is already in wishlist
            const existingIndex = wishlist.findIndex(item => item.id === productId);
            
            if (existingIndex > -1) {
                // Remove from wishlist
                wishlist.splice(existingIndex, 1);
                this.showNotification('Removed from wishlist!', 'info');
            } else {
                // Add to wishlist
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    wishlist.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image || '/assets/logos/utiles-escolares.jpg',
                        addedAt: new Date().toISOString()
                    });
                    this.showNotification('Added to wishlist!', 'success');
                }
            }
            
            // Save updated wishlist
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            this.updateWishlistButton(productId, existingIndex === -1);
            
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            this.showNotification('Error updating wishlist', 'error');
        }
    }
    
    // Update wishlist button appearance
    updateWishlistButton(productId, isAdded) {
        const button = document.querySelector(`[data-product-id="${productId}"] .btn-wishlist`);
        if (button) {
            const icon = button.querySelector('i');
            if (isAdded) {
                icon.classList.add('fas');
                icon.classList.remove('far');
                button.style.color = '#e74c3c';
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
                button.style.color = '#6c757d';
            }
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-content i');
        
        if (toast && toastMessage) {
            // Set message
            toastMessage.textContent = message;
            
            // Set icon based on type
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle',
                warning: 'fas fa-exclamation-triangle'
            };
            
            if (toastIcon) {
                toastIcon.className = icons[type] || icons.success;
            }
            
            // Set notification type class
            toast.className = `notification-toast ${type}`;
            
            // Show notification
            toast.classList.add('show');
            
            // Auto hide after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    }

    // Update product count
    updateProductCount() {
        const showingCount = document.getElementById('showingCount');
        const totalCount = document.getElementById('totalCount');
        
        if (showingCount) {
            showingCount.textContent = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
        }
        
        if (totalCount) {
            totalCount.textContent = this.filteredProducts.length;
        }
    }

    // Update load more button
    updateLoadMoreButton() {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        const hasMoreProducts = this.currentPage * this.productsPerPage < this.filteredProducts.length;
        
        if (loadMoreContainer) {
            loadMoreContainer.style.display = hasMoreProducts ? 'block' : 'none';
        }
    }

    // Load more products
    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
        this.updateProductCount();
    }

    // Clear all filters
    clearAllFilters() {
        // Reset search
        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) searchFilter.value = '';

        // Reset checkboxes
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);

        // Reset price range
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const priceSlider = document.getElementById('priceSlider');
        
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (priceSlider) priceSlider.value = 100;

        // Reset filters
        this.filters = {
            search: '',
            categories: [],
            priceRange: { min: 0, max: 200 },
            condition: [],
            sellerType: [],
            rating: []
        };

        this.applyFilters();
    }

    // Show loading state
    showLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        
        if (loadingState) loadingState.style.display = 'block';
        if (productsGrid) productsGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
    }

    // Hide loading state
    hideLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const productsGrid = document.getElementById('productsGrid');
        
        if (loadingState) loadingState.style.display = 'none';
        if (productsGrid) productsGrid.style.display = 'grid';
    }

    // Show no results
    showNoResults() {
        const noResults = document.getElementById('noResults');
        const productsGrid = document.getElementById('productsGrid');
        const loadingState = document.getElementById('loadingState');
        
        if (noResults) {
            noResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-box-open"></i>
                    <h3>No products available</h3>
                    <p>There are no products in the marketplace yet. Be the first to add a product!</p>
                    <div class="no-results-actions">
                        <a href="/dashboards/student/student-dashboard.html" class="btn btn-primary">
                            <i class="fas fa-plus me-2"></i>Add Your First Product
                        </a>
                        <button class="btn btn-outline" onclick="marketplace.clearAllFilters()">
                            <i class="fas fa-refresh me-2"></i>Clear Filters
                        </button>
                    </div>
                </div>
            `;
            noResults.style.display = 'block';
        }
        
        if (productsGrid) productsGrid.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing marketplace');
    window.marketplace = new MarketplaceLogged();
});

// Close notification toast
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toast-close')) {
        const toast = document.getElementById('notificationToast');
        if (toast) {
            toast.classList.remove('show');
        }
    }
});

// Handle category navigation
const handleCategoryNavigation = () => {
    console.log('Setting up category navigation');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.getAttribute('data-category');
            console.log(`Category button clicked: ${category}`);
            
            // Navigate to category page
            const categoryUrls = {
                'notebooks': '/pages/marketplace/categories/notebooks.html',
                'bags': '/pages/marketplace/categories/school-bags.html',
                'shoes': '/pages/marketplace/categories/shoes.html',
                'uniforms': '/pages/marketplace/categories/uniforms.html',
                'books': '/pages/marketplace/categories/books.html',
                'stationery': '/pages/marketplace/categories/stationery.html',
                'electronics': '/pages/marketplace/categories/electronics.html',
                'sports': '/pages/marketplace/categories/sports.html',
                'art': '/pages/marketplace/categories/art.html',
                'accessories': '/pages/marketplace/categories/accessories.html'
            };
            
            const url = categoryUrls[category];
            if (url) {
                console.log(`Navigating to: ${url}`);
                window.location.href = url;
            } else {
                // Fallback to all-products with category filter
                console.log(`Fallback to all-products with category: ${category}`);
                window.location.href = `/pages/marketplace/all-products.html?categories=${category}`;
            }
        });
    });
};

// Initialize category navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleCategoryNavigation();
}); 