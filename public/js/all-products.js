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

    // Load products from Firebase or mock data
    async loadProducts() {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock products data
            this.products = this.generateMockProducts();
            this.filteredProducts = [...this.products];
            
            this.applyFilters();
            this.renderProducts();
            this.updateProductCount();
            this.hideLoadingState();
            
            // Check page type after products are loaded
            this.checkPageType();
            
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
        
        for (let i = 1; i <= 100; i++) {
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
            sports: ['Basketball', 'Soccer Ball', 'Tennis Racket', 'Gym Bag', 'Water Bottle'],
            art: ['Paint Set', 'Sketchbook', 'Brushes', 'Canvas', 'Easel'],
            accessories: ['Watch', 'Jewelry', 'Wallet', 'Belt', 'Scarf']
        };
        
        const categoryTitles = titles[category] || ['Product'];
        return `${categoryTitles[Math.floor(Math.random() * categoryTitles.length)]} ${index}`;
    }

    generateSellerName(sellerType) {
        const names = sellerType === 'business' 
            ? ['School Essentials', 'Tech Solutions', 'Creative Arts', 'Urban Gear', 'Luxury Stationary']
            : ['John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Michael Brown'];
        return names[Math.floor(Math.random() * names.length)];
    }

    generateLocation() {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
        return cities[Math.floor(Math.random() * cities.length)];
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
            if (this.filters.search && !product.title.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
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

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
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
                    <div class="product-price">
                        $${product.price}
                        ${originalPrice}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-add-cart" onclick="allProducts.addToCart('${product.id}')">
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
        if (product) {
            // Add to global cart
            if (window.SwappitCart) {
                window.SwappitCart.addToCart(product);
            }
            
            this.showNotification(`"${product.title}" added to cart!`);
        }
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
        
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
        
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
            let message = 'No products found';
            let suggestion = 'Try adjusting your filters or search terms';
            
            if (window.currentCategory) {
                const categoryName = window.currentCategory.charAt(0).toUpperCase() + window.currentCategory.slice(1);
                message = `No ${categoryName} found`;
                suggestion = `No ${categoryName} available at the moment. Try checking back later or browse other categories.`;
            } else if (window.currentSection) {
                const sectionName = window.currentSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                message = `No ${sectionName} found`;
                suggestion = `No ${sectionName} available at the moment. Try checking back later.`;
            } else if (this.filters.search) {
                message = `No results found for "${this.filters.search}"`;
                suggestion = 'Try different keywords or check your spelling.';
            }
            
            // Update the message in the HTML
            const messageElement = noResults.querySelector('h3');
            const suggestionElement = noResults.querySelector('p');
            
            if (messageElement) {
                messageElement.textContent = message;
            }
            if (suggestionElement) {
                suggestionElement.textContent = suggestion;
            }
            
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