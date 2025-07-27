// Marketplace Logged JavaScript
class MarketplaceLogged {
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
        this.setupFilters();
        this.showLoadingState();
    }

    // Load products from Firebase or mock data
    async loadProducts() {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock products data
            this.products = this.generateMockProducts();
            this.filteredProducts = [...this.products];
            
            this.renderProducts();
            this.updateProductCount();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNoResults();
        }
    }

    // Generate mock products for demonstration
    generateMockProducts() {
        const categories = ['notebooks', 'bags', 'shoes', 'uniforms', 'books', 'stationery', 'electronics', 'sports', 'art', 'accessories'];
        const conditions = ['new', 'like-new', 'good', 'fair'];
        const sellerTypes = ['student', 'business'];
        const ratings = [3, 4, 5];
        
        const products = [];
        
        for (let i = 1; i <= 50; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const sellerType = sellerTypes[Math.floor(Math.random() * sellerTypes.length)];
            const rating = ratings[Math.floor(Math.random() * ratings.length)];
            const price = Math.floor(Math.random() * 150) + 10;
            
            products.push({
                id: `product-${i}`,
                title: this.generateProductTitle(category, i),
                description: `High-quality ${category} perfect for students. This item is in ${condition} condition and comes from a verified ${sellerType}.`,
                price: price,
                originalPrice: Math.random() > 0.7 ? price + Math.floor(Math.random() * 20) + 5 : null,
                category: category,
                condition: condition,
                sellerType: sellerType,
                sellerName: this.generateSellerName(sellerType),
                rating: rating,
                reviewCount: Math.floor(Math.random() * 100) + 5,
                images: [
                    `https://picsum.photos/400/300?random=${i}`,
                    `https://picsum.photos/400/300?random=${i + 100}`,
                    `https://picsum.photos/400/300?random=${i + 200}`
                ],
                location: this.generateLocation(),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                isFeatured: Math.random() > 0.8,
                isNew: Math.random() > 0.9,
                stock: Math.floor(Math.random() * 10) + 1
            });
        }
        
        return products;
    }

    generateProductTitle(category, index) {
        const titles = {
            notebooks: ['Premium Notebook Set', 'Spiral Bound Notebook', 'College Ruled Notebook', 'Hardcover Journal', 'Planner Notebook'],
            bags: ['School Backpack', 'Laptop Bag', 'Messenger Bag', 'Duffel Bag', 'Tote Bag'],
            shoes: ['School Shoes', 'Athletic Shoes', 'Dress Shoes', 'Casual Shoes', 'Boots'],
            uniforms: ['School Uniform', 'PE Uniform', 'Lab Coat', 'Chef Uniform', 'Work Uniform'],
            books: ['Textbook', 'Reference Book', 'Novel', 'Study Guide', 'Workbook'],
            stationery: ['Pen Set', 'Pencil Case', 'Stapler', 'Calculator', 'Ruler Set'],
            electronics: ['Laptop', 'Tablet', 'Smartphone', 'Headphones', 'Charger'],
            sports: ['Basketball', 'Soccer Ball', 'Tennis Racket', 'Gym Equipment', 'Water Bottle'],
            art: ['Paint Set', 'Sketchbook', 'Brushes', 'Canvas', 'Easel'],
            accessories: ['Watch', 'Jewelry', 'Hat', 'Scarf', 'Belt']
        };
        
        const categoryTitles = titles[category] || ['Product'];
        return categoryTitles[Math.floor(Math.random() * categoryTitles.length)] + ` #${index}`;
    }

    generateSellerName(sellerType) {
        const studentNames = ['John Smith', 'Maria Garcia', 'Alex Johnson', 'Sarah Wilson', 'David Brown'];
        const businessNames = ['School Essentials', 'Student Supplies Co.', 'Academic Gear', 'Campus Store', 'Education Plus'];
        
        const names = sellerType === 'student' ? studentNames : businessNames;
        return names[Math.floor(Math.random() * names.length)];
    }

    generateLocation() {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
        return cities[Math.floor(Math.random() * cities.length)];
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
            if (this.filters.search && !product.title.toLowerCase().includes(this.filters.search.toLowerCase()) &&
                !product.description.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
            }

            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price range filter
            if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                return false;
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
        // Render Best Sellers
        this.renderSection('bestSellersGrid', this.getBestSellers(), 4);
        
        // Render New Arrivals
        this.renderSection('newArrivalsGrid', this.getNewArrivals(), 4);
        
        // Render Featured Products
        this.renderSection('featuredGrid', this.getFeaturedProducts(), 4);
    }

    // Render a specific section
    renderSection(sectionId, products, maxProducts = 4) {
        const sectionGrid = document.getElementById(sectionId);
        if (!sectionGrid) return;

        const productsToShow = products.slice(0, maxProducts);
        
        if (productsToShow.length === 0) {
            sectionGrid.innerHTML = '<p class="no-products">No products available</p>';
            return;
        }

        sectionGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
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
            .filter(product => product.rating >= 4 && product.reviewCount >= 20)
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

    // Get Featured Products (products marked as featured)
    getFeaturedProducts() {
        return this.products
            .filter(product => product.isFeatured)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8);
    }

    // View more products for a specific section
    viewMoreProducts(sectionId) {
        // For now, just scroll to the all products section
        const allProductsSection = document.querySelector('.section-container:last-child');
        if (allProductsSection) {
            allProductsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Create product card HTML
    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const badges = this.generateBadges(product);
        const originalPrice = product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : '';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                    ${badges}
                    <div class="product-overlay">
                        <button class="btn-quick-view" onclick="marketplace.showProductDetails('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-wishlist" onclick="marketplace.toggleWishlist('${product.id}')">
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
                    <div class="product-price">
                        $${product.price}
                        ${originalPrice}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-add-cart" onclick="marketplace.addToCart('${product.id}')">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
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
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (window.SwappitCart) {
            window.SwappitCart.addToCart(product);
            this.showNotification('Product added to cart successfully!');
        } else {
            console.error('Cart component not available');
            this.showNotification('Error: Cart not available', 'error');
        }
    }

    // Show product details
    showProductDetails(productId) {
        window.location.href = `/pages/marketplace/productDetail.html?id=${productId}`;
    }

    // Toggle wishlist
    toggleWishlist(productId) {
        // Implement wishlist functionality
        this.showNotification('Added to wishlist!');
    }

    // Show notification
    showNotification(message, type = 'success') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = toast.querySelector('.toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
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
        
        if (noResults) noResults.style.display = 'block';
        if (productsGrid) productsGrid.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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