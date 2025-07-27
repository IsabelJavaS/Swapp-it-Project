// Filters Sidebar Component
class FiltersSidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.filters = {
            categories: [],
            priceRange: { min: 0, max: 200 },
            condition: [],
            sellerType: [],
            rating: [],
            saleType: [] // Nuevo filtro para tipo de venta
        };
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                
                :host {
                    display: block;
                }
                
                /* CSS Variables */
                :host {
                    --swappit-blue: #3468c0;
                    --swappit-orange: #ffa424;
                    --swappit-blue-hover: #2a5aa0;
                    --swappit-orange-hover: #e6941a;
                    --neutral-light: #f8f9fa;
                    --neutral-medium: #6c757d;
                    --neutral-dark: #343a40;
                    --background-white: #ffffff;
                    --border-radius: 12px;
                    --transition: all 0.3s ease;
                    --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
                    --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
                    --shadow-heavy: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                /* Sidebar Container */
                .filters-sidebar {
                    position: fixed;
                    top: 0;
                    left: -450px;
                    width: 450px;
                    height: 100vh;
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                    box-shadow: 4px 0 30px rgba(52, 104, 192, 0.15);
                    z-index: 2000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                    overflow-x: hidden; /* Eliminar scroll horizontal */
                    padding: 0;
                    border-right: 1px solid rgba(52, 104, 192, 0.1);
                }

                .filters-sidebar.show {
                    left: 0;
                }

                /* Overlay */
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1999;
                    opacity: 0;
                    visibility: hidden;
                    transition: var(--transition);
                }

                .sidebar-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                /* Header */
                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem 2rem 1.5rem 2rem;
                    background: linear-gradient(135deg, var(--swappit-blue) 0%, var(--swappit-blue-hover) 100%);
                    color: white;
                    margin-bottom: 0;
                    border-bottom: none;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .sidebar-header h3 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .sidebar-header h3 i {
                    color: var(--swappit-orange);
                    font-size: 1.6rem;
                }

                .close-sidebar {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: var(--transition);
                }

                .close-sidebar:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                /* Search Section */
                .search-section {
                    margin-bottom: 2rem;
                    padding: 0 2rem;
                    margin-top: 1rem; /* Añadir espacio arriba del search */
                }

                .search-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-input {
                    width: 100%;
                    border: 2px solid var(--neutral-light);
                    border-radius: 25px;
                    padding: 0.75rem 1rem 0.75rem 3rem;
                    font-size: 0.95rem;
                    background: var(--background-white);
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--swappit-blue);
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                .search-btn {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--neutral-medium);
                    font-size: 1rem;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .search-btn:hover {
                    color: var(--swappit-blue);
                }

                /* Filter Sections */
                .filter-section {
                    margin-bottom: 0;
                    padding: 1.5rem 2rem;
                    background: white;
                    border-bottom: 1px solid rgba(52, 104, 192, 0.05);
                }

                .filter-section:last-child {
                    border-bottom: none;
                }

                .filter-section h4 {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--neutral-dark);
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .filter-section h4::before {
                    content: '';
                    width: 4px;
                    height: 20px;
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-orange));
                    border-radius: 2px;
                }

                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .filter-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: var(--transition);
                }

                .filter-option:hover {
                    background: var(--neutral-light);
                }

                .filter-option input[type="checkbox"] {
                    display: none;
                }

                .checkmark {
                    width: 18px;
                    height: 18px;
                    border: 2px solid var(--neutral-medium);
                    border-radius: 4px;
                    position: relative;
                    transition: var(--transition);
                }

                .filter-option input[type="checkbox"]:checked + .checkmark {
                    background: var(--swappit-blue);
                    border-color: var(--swappit-blue);
                }

                .filter-option input[type="checkbox"]:checked + .checkmark::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 0.7rem;
                    font-weight: bold;
                }

                .option-text {
                    font-size: 0.9rem;
                    color: var(--neutral-dark);
                    flex: 1;
                }

                .option-text i {
                    color: var(--swappit-orange);
                    margin-right: 0.25rem;
                }

                /* Price Range */
                .price-range {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .price-inputs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .price-inputs input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 2px solid var(--neutral-light);
                    border-radius: 6px;
                    font-size: 0.9rem;
                }

                .price-inputs input:focus {
                    outline: none;
                    border-color: var(--swappit-blue);
                }

                .price-inputs span {
                    color: var(--neutral-medium);
                    font-weight: 600;
                }

                .price-slider {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .price-slider input[type="range"] {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--neutral-light);
                    outline: none;
                    -webkit-appearance: none;
                }

                .price-slider input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--swappit-blue);
                    cursor: pointer;
                    box-shadow: var(--shadow-light);
                }

                .price-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--neutral-medium);
                }

                /* Filter Actions */
                .filter-actions {
                    display: flex;
                    gap: 1rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-top: 1px solid rgba(52, 104, 192, 0.1);
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                }

                .filter-actions .btn {
                    flex: 1;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-family: 'Inter', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                }

                .btn-outline {
                    background: white;
                    border: 2px solid rgba(52, 104, 192, 0.2);
                    color: var(--neutral-dark);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .btn-outline:hover {
                    background: var(--neutral-dark);
                    border-color: var(--neutral-dark);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--swappit-blue) 0%, var(--swappit-blue-hover) 100%);
                    border: 2px solid var(--swappit-blue);
                    color: white;
                    box-shadow: 0 4px 16px rgba(52, 104, 192, 0.3);
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, var(--swappit-blue-hover) 0%, var(--swappit-blue) 100%);
                    border-color: var(--swappit-blue-hover);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(52, 104, 192, 0.4);
                }

                .btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .btn-primary:hover::before {
                    left: 100%;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .filters-sidebar {
                        width: 100%;
                        left: -100%;
                    }
                    
                    .search-section {
                        padding: 0 1.5rem;
                    }
                    
                    .filter-section {
                        padding: 1.5rem 1.5rem;
                    }
                    
                    .filter-actions {
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .filters-sidebar {
                        width: 100%;
                        left: -100%;
                    }
                    
                    .search-section {
                        padding: 0 1rem;
                    }
                    
                    .filter-section {
                        padding: 1rem;
                    }
                    
                    .filter-actions {
                        padding: 1rem;
                        flex-direction: column;
                    }
                    
                    .filter-actions .btn {
                        width: 100%;
                    }
                }
            </style>

            <!-- Overlay -->
            <div class="sidebar-overlay" id="sidebarOverlay"></div>

            <!-- Sidebar -->
            <aside class="filters-sidebar" id="filtersSidebar">
                <div class="sidebar-header">
                    <h3><i class="fas fa-filter"></i> Filters</h3>
                    <button class="close-sidebar" id="closeSidebar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Search Section -->
                <div class="search-section">
                    <div class="search-container">
                        <input type="text" class="search-input" id="searchInput" placeholder="Search products, categories, sellers...">
                        <button class="search-btn" id="searchBtn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Sale Type Filter -->
                <div class="filter-section">
                    <h4>Sale Type</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" value="sale">
                            <span class="checkmark"></span>
                            <span class="option-text">
                                <i class="fas fa-dollar-sign"></i>
                                For Sale
                            </span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="swap">
                            <span class="checkmark"></span>
                            <span class="option-text">
                                <i class="fas fa-exchange-alt"></i>
                                For Swap
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Categories Filter -->
                <div class="filter-section">
                    <h4>Categories</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" value="notebooks">
                            <span class="checkmark"></span>
                            <span class="option-text">Notebooks</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="bags">
                            <span class="checkmark"></span>
                            <span class="option-text">School Bags</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="shoes">
                            <span class="checkmark"></span>
                            <span class="option-text">School Shoes</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="uniforms">
                            <span class="checkmark"></span>
                            <span class="option-text">Uniforms</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="books">
                            <span class="checkmark"></span>
                            <span class="option-text">Textbooks</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="stationery">
                            <span class="checkmark"></span>
                            <span class="option-text">Stationery</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="electronics">
                            <span class="checkmark"></span>
                            <span class="option-text">Electronics</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="sports">
                            <span class="checkmark"></span>
                            <span class="option-text">Sports Equipment</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="art">
                            <span class="checkmark"></span>
                            <span class="option-text">Art Supplies</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="accessories">
                            <span class="checkmark"></span>
                            <span class="option-text">Accessories</span>
                        </label>
                    </div>
                </div>

                <!-- Price Range Filter -->
                <div class="filter-section">
                    <h4>Price Range</h4>
                    <div class="price-range">
                        <div class="price-inputs">
                            <input type="number" id="minPrice" placeholder="Min" min="0">
                            <span>-</span>
                            <input type="number" id="maxPrice" placeholder="Max" min="0">
                        </div>
                        <div class="price-slider">
                            <input type="range" id="priceSlider" min="0" max="200" value="100">
                            <div class="price-labels">
                                <span>$0</span>
                                <span>$200</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Condition Filter -->
                <div class="filter-section">
                    <h4>Condition</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" value="new">
                            <span class="checkmark"></span>
                            <span class="option-text">New</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="like-new">
                            <span class="checkmark"></span>
                            <span class="option-text">Like New</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="good">
                            <span class="checkmark"></span>
                            <span class="option-text">Good</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="fair">
                            <span class="checkmark"></span>
                            <span class="option-text">Fair</span>
                        </label>
                    </div>
                </div>

                <!-- Seller Type Filter -->
                <div class="filter-section">
                    <h4>Seller Type</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" value="student">
                            <span class="checkmark"></span>
                            <span class="option-text">Students</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="business">
                            <span class="checkmark"></span>
                            <span class="option-text">Businesses</span>
                        </label>
                    </div>
                </div>

                <!-- Rating Filter -->
                <div class="filter-section">
                    <h4>Rating</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" value="5">
                            <span class="checkmark"></span>
                            <span class="option-text">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="4">
                            <span class="checkmark"></span>
                            <span class="option-text">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                & up
                            </span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" value="3">
                            <span class="checkmark"></span>
                            <span class="option-text">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                & up
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Filter Actions -->
                <div class="filter-actions">
                    <button class="btn btn-outline" id="clearFilters">
                        <i class="fas fa-times me-2"></i>Clear All
                    </button>
                    <button class="btn btn-primary" id="applyFilters">
                        <i class="fas fa-check me-2"></i>Apply Filters
                    </button>
                </div>
            </aside>
        `;
    }

    attachEventListeners() {
        // Close sidebar
        const closeSidebar = this.shadowRoot.getElementById('closeSidebar');
        const sidebarOverlay = this.shadowRoot.getElementById('sidebarOverlay');
        const filtersSidebar = this.shadowRoot.getElementById('filtersSidebar');

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                this.close();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.close();
            });
        }

        // Search functionality
        const searchBtn = this.shadowRoot.getElementById('searchBtn');
        const searchInput = this.shadowRoot.getElementById('searchInput');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        // Filter functionality
        const clearFilters = this.shadowRoot.getElementById('clearFilters');
        const applyFilters = this.shadowRoot.getElementById('applyFilters');

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

        // Price slider
        const priceSlider = this.shadowRoot.getElementById('priceSlider');
        const maxPrice = this.shadowRoot.getElementById('maxPrice');

        if (priceSlider && maxPrice) {
            priceSlider.addEventListener('input', (e) => {
                maxPrice.value = e.target.value;
            });
        }
    }

    // Public methods
    open() {
        const filtersSidebar = this.shadowRoot.getElementById('filtersSidebar');
        const sidebarOverlay = this.shadowRoot.getElementById('sidebarOverlay');
        
        if (filtersSidebar) filtersSidebar.classList.add('show');
        if (sidebarOverlay) sidebarOverlay.classList.add('show');
        
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        const filtersSidebar = this.shadowRoot.getElementById('filtersSidebar');
        const sidebarOverlay = this.shadowRoot.getElementById('sidebarOverlay');
        
        if (filtersSidebar) filtersSidebar.classList.remove('show');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
        
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    performSearch(query) {
        if (query.trim()) {
            // Navigate to all products page with search query
            window.location.href = `/pages/marketplace/all-products.html?search=${encodeURIComponent(query)}`;
        }
    }

    clearAllFilters() {
        // Reset all filter checkboxes
        const checkboxes = this.shadowRoot.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        
        // Reset price inputs
        const minPrice = this.shadowRoot.getElementById('minPrice');
        const maxPrice = this.shadowRoot.getElementById('maxPrice');
        const priceSlider = this.shadowRoot.getElementById('priceSlider');
        
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (priceSlider) priceSlider.value = 100;
        
        this.close();
        
        // Navigate to marketplace main page (not all products)
        window.location.href = '/pages/marketplace/marketplace.html';
    }

    applyFilters() {
        // Get selected filters
        const selectedCategories = [];
        const selectedConditions = [];
        const selectedSellerTypes = [];
        const selectedRatings = [];
        const selectedSaleTypes = []; // Nuevo filtro
        
        const checkboxes = this.shadowRoot.querySelectorAll('.filter-option input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const value = checkbox.value;
            if (['new', 'like-new', 'good', 'fair'].includes(value)) {
                selectedConditions.push(value);
            } else if (['student', 'business'].includes(value)) {
                selectedSellerTypes.push(value);
            } else if (['3', '4', '5'].includes(value)) {
                selectedRatings.push(value);
            } else if (['sale', 'swap'].includes(value)) {
                selectedSaleTypes.push(value);
            } else {
                selectedCategories.push(value);
            }
        });
        
        // Get price range
        const minPrice = this.shadowRoot.getElementById('minPrice')?.value || '';
        const maxPrice = this.shadowRoot.getElementById('maxPrice')?.value || '';
        
        this.close();
        
        // Check if only one category is selected and no other filters
        if (selectedCategories.length === 1 && 
            selectedConditions.length === 0 && 
            selectedSellerTypes.length === 0 && 
            selectedRatings.length === 0 && 
            selectedSaleTypes.length === 0 && 
            !minPrice && !maxPrice) {
            
            // Navigate to specific category page
            const category = selectedCategories[0];
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
            
            const categoryUrl = categoryUrls[category];
            if (categoryUrl) {
                window.location.href = categoryUrl;
                return;
            }
        }
        
        // Build query string for all products page with filters
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
        if (selectedConditions.length > 0) params.append('conditions', selectedConditions.join(','));
        if (selectedSellerTypes.length > 0) params.append('sellerTypes', selectedSellerTypes.join(','));
        if (selectedRatings.length > 0) params.append('ratings', selectedRatings.join(','));
        if (selectedSaleTypes.length > 0) params.append('saleTypes', selectedSaleTypes.join(','));
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        
        // Navigate to all products page with filters
        const queryString = params.toString();
        const url = queryString ? `/pages/marketplace/all-products.html?${queryString}` : '/pages/marketplace/all-products.html';
        window.location.href = url;
    }
}

// Register the component
customElements.define('filters-sidebar-component', FiltersSidebarComponent); 