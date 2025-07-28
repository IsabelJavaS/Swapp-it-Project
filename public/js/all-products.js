// All Products JavaScript
class AllProducts {
    constructor() {
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
        this.loadProducts();
        this.attachEventListeners();
        this.loadFiltersFromURL();
        this.showLoadingState();
        
        // Check if we're on a category or section page
        this.checkPageType();
    }

    // Load products from Firebase
    async loadProducts() {
        try {
            this.showLoadingState();
            
            // Import Firebase functions
            const { getProducts } = await import('/firebase/firestore.js');
            
            // Get products from Firebase with filters
            const result = await getProducts({
                orderBy: 'createdAt',
                orderDirection: 'desc'
            });
            
            if (result.success) {
                this.products = result.products.map(product => this.formatProductForDisplay(product));
                console.log(`Loaded ${this.products.length} products from Firebase`);
                this.filteredProducts = [...this.products];
                
                this.applyFilters();
                this.renderProducts();
                this.updateProductCount();
                this.hideLoadingState();
                
                // Check page type after products are loaded
                this.checkPageType();
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

    attachEventListeners() {
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
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.closest('.view-btn').dataset.view;
                this.setViewMode(mode);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Reset filters button
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Search functionality
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
                this.renderProducts();
            });
        }
    }

    // Load filters from URL parameters
    loadFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log('Loading filters from URL:', window.location.search);
        
        // Load search query
        const search = urlParams.get('search');
        if (search) {
            console.log('Search filter:', search);
            this.filters.search = search;
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.value = search;
            }
        }

        // Load categories
        const categories = urlParams.get('categories');
        if (categories) {
            console.log('Categories filter:', categories);
            this.filters.categories = categories.split(',');
        }

        // Load sale types
        const saleTypes = urlParams.get('saleTypes');
        if (saleTypes) {
            this.filters.saleTypes = saleTypes.split(',');
        }

        // Load price range
        const minPrice = urlParams.get('minPrice');
        const maxPrice = urlParams.get('maxPrice');
        if (minPrice && maxPrice) {
            this.filters.priceRange = { min: parseInt(minPrice), max: parseInt(maxPrice) };
        }

        // Load condition
        const conditions = urlParams.get('conditions');
        if (conditions) {
            this.filters.condition = conditions.split(',');
        }

        // Load seller type
        const sellerTypes = urlParams.get('sellerTypes');
        if (sellerTypes) {
            this.filters.sellerType = sellerTypes.split(',');
        }

        // Load rating
        const ratings = urlParams.get('ratings');
        if (ratings) {
            this.filters.rating = ratings.split(',').map(r => parseInt(r));
        }
    }

    // Check page type and apply appropriate filters
    checkPageType() {
        console.log('Checking page type...');
        console.log('Current category:', window.currentCategory);
        console.log('Current section:', window.currentSection);
        
        // Check for category page
        if (window.currentCategory) {
            console.log(`Applying category filter: ${window.currentCategory}`);
            this.filters.categories = [window.currentCategory];
            this.applyFilters();
            this.renderProducts();
            return;
        }

        // Check for section page
        if (window.currentSection) {
            console.log(`Applying section filter: ${window.currentSection}`);
            this.filterBySection(window.currentSection);
            this.applyFilters();
            this.renderProducts();
            return;
        }
        
        console.log('No specific page type detected, using default filters');
    }

    // Filter products by section
    filterBySection(section) {
        console.log(`Filtering by section: ${section}`);
        
        switch (section) {
            case 'best-sellers':
                // Sort by popularity (review count)
                console.log('Applying best-sellers filter');
                this.sortBy = 'popular';
                break;
            case 'new-arrivals':
                // Filter by recent products (last 7 days)
                console.log('Applying new-arrivals filter');
                this.filteredProducts = this.products.filter(product => {
                    const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                    return daysSinceCreated <= 7;
                });
                this.sortBy = 'newest';
                break;
            case 'featured':
                // Filter by featured products
                console.log('Applying featured filter');
                this.filteredProducts = this.products.filter(product => product.isFeatured);
                this.sortBy = 'featured';
                break;
            default:
                console.log(`Unknown section: ${section}`);
                break;
        }
        
        console.log(`Products after section filter: ${this.filteredProducts.length}`);
    }

    // Apply filters
    applyFilters() {
        console.log('Applying filters:', this.filters);
        console.log('Total products before filtering:', this.products.length);
        
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

            // Sale type filter (if implemented)
            if (this.filters.saleTypes && this.filters.saleTypes.length > 0) {
                // This would need to be implemented based on your product data structure
                // For now, we'll skip this filter
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
        
        console.log('Filtered products:', this.filteredProducts.length);
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
            case 'featured':
                this.filteredProducts.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
                });
                break;
            default: // relevance
                this.filteredProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        }
    }

    // Set view mode
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update active button
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === mode) {
                btn.classList.add('active');
            }
        });

        // Update grid class
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.className = `products-grid ${mode}-view`;
        }

        this.renderProducts();
    }

    // Render products
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Only show no results if there are no filtered products at all
        if (this.filteredProducts.length === 0) {
            console.log('No filtered products found, showing no results');
            this.showNoResults();
            return;
        }

        console.log(`Found ${this.filteredProducts.length} filtered products, showing them`);

        // If we have products but none on current page, show first page
        if (productsToShow.length === 0 && this.filteredProducts.length > 0) {
            this.currentPage = 1;
            this.renderProducts();
            return;
        }

        // Hide no results and show products
        if (noResults) {
            noResults.style.display = 'none';
            console.log('Hiding no results message');
        }
        
        if (productsGrid) {
            productsGrid.style.display = 'grid';
            console.log('Showing products grid');
        }

        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.updateLoadMoreButton();
    }

    // Create product card HTML
    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const badges = this.generateBadges(product);
        const originalPrice = product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : '';
        const priceDisplay = product.transactionType === 'sale' ? 
            `<div class="product-price">$${product.price} ${originalPrice}</div>` : 
            `<div class="product-price swapp-price">For Swapp</div>`;
        
        const defaultImage = product.images && product.images.length > 0 ? 
            product.images[0].url || product.images[0] : 
            '/assets/logos/utiles-escolares.jpg';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${defaultImage}" alt="${product.title}" loading="lazy">
                    ${badges}
                    <div class="product-overlay">
                        <button class="btn-quick-view" onclick="allProducts.showProductDetails('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-wishlist" onclick="allProducts.toggleWishlist('${product.id}')">
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
                            `<button class="btn btn-add-cart" onclick="allProducts.addToCart('${product.id}')">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>` : 
                            `<button class="btn btn-swapp" onclick="allProducts.initiateSwapp('${product.id}')">
                                <i class="fas fa-exchange-alt me-2"></i>Initiate Swapp
                            </button>`
                        }
                        <a href="/pages/marketplace/productDetail.html?id=${product.id}" class="btn btn-details">
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
        console.log('AllProducts.addToCart called with productId:', productId);
        const product = this.products.find(p => p.id === productId);
        console.log('Found product:', product);
        
        if (product) {
            // Wait for cart component to be available
            this.waitForCartComponent().then(() => {
                // Add to global cart
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
                    console.error('SwappitCart not found');
                    this.showNotification('Error: Cart not available', 'error');
                }
            });
        } else {
            console.error('Product not found with ID:', productId);
        }
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
        console.log('AllProducts.updateCartCounter called');
        
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
        console.log('AllProducts.openCartSidebar called');
        
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
        // Implement wishlist functionality
        this.showNotification('Product added to wishlist!');
    }

    // Show notification
    showNotification(message, type = 'success') {
        const toast = document.getElementById('notificationToast');
        const messageEl = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-content i');
        
        if (messageEl) {
            messageEl.textContent = message;
        }
        
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
        
        toast.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.classList.remove('show');
            };
        }
    }

    // Update product count
    updateProductCount() {
        const showingCount = document.getElementById('showingCount');
        const totalCount = document.getElementById('totalCount');
        const productsCount = document.getElementById('productsCount');
        
        if (showingCount) {
            showingCount.textContent = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
        }
        
        if (totalCount) {
            totalCount.textContent = this.filteredProducts.length;
        }
        
        if (productsCount) {
            productsCount.style.display = this.filteredProducts.length > 0 ? 'block' : 'none';
        }
        
        console.log(`Product count updated: ${this.filteredProducts.length} products`);
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
    }

    // Clear all filters
    clearAllFilters() {
        this.filters = {
            search: '',
            categories: [],
            priceRange: { min: 0, max: 200 },
            condition: [],
            sellerType: [],
            rating: []
        };
        
        // Clear search input
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.applyFilters();
        this.renderProducts();
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Show loading state
    showLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        
        if (loadingState) {
            loadingState.style.display = 'block';
        }
        
        if (productsGrid) {
            productsGrid.style.display = 'none';
        }
        
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    // Hide loading state
    hideLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Only show products grid if we have products, otherwise let renderProducts handle it
        if (productsGrid && this.filteredProducts.length > 0) {
            productsGrid.style.display = 'grid';
        }
        
        // Hide no results during loading
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    // Show no results
    showNoResults() {
        const noResults = document.getElementById('noResults');
        const productsGrid = document.getElementById('productsGrid');
        
        if (noResults) {
            // Customize message based on page type
            let message = 'No products available';
            let suggestion = 'There are no products in the marketplace yet. Be the first to add a product!';
            let actionText = 'Add Your First Product';
            let actionUrl = '/dashboards/student/student-dashboard.html';
            
            if (window.currentCategory) {
                const categoryName = window.currentCategory.charAt(0).toUpperCase() + window.currentCategory.slice(1);
                message = `No ${categoryName} available`;
                suggestion = `No ${categoryName} in the marketplace yet. Be the first to add ${categoryName}!`;
                actionText = `Add ${categoryName}`;
            } else if (window.currentSection) {
                const sectionName = window.currentSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                message = `No ${sectionName} available`;
                suggestion = `No ${sectionName} in the marketplace yet. Be the first to add products!`;
                actionText = 'Add Products';
            } else if (this.filters.search) {
                message = `No results found for "${this.filters.search}"`;
                suggestion = 'Try different keywords or check your spelling.';
                actionText = 'Clear Search';
                actionUrl = '#';
            }
            
            noResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-box-open"></i>
                    <h3>${message}</h3>
                    <p>${suggestion}</p>
                    <div class="no-results-actions">
                        ${actionUrl !== '#' ? 
                            `<a href="${actionUrl}" class="btn btn-primary">
                                <i class="fas fa-plus me-2"></i>${actionText}
                            </a>` : 
                            `<button class="btn btn-primary" onclick="allProducts.clearAllFilters()">
                                <i class="fas fa-refresh me-2"></i>${actionText}
                            </button>`
                        }
                        <button class="btn btn-outline" onclick="allProducts.clearAllFilters()">
                            <i class="fas fa-refresh me-2"></i>Clear Filters
                        </button>
                    </div>
                </div>
            `;
            
            // Show no results and hide products grid
            noResults.style.display = 'block';
            console.log('Showing no results message');
        }
        
        if (productsGrid) {
            productsGrid.style.display = 'none';
            console.log('Hiding products grid');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.allProducts = new AllProducts();
}); 