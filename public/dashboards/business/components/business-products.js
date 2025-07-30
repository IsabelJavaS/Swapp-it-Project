// Web component for business products
class BusinessProducts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        console.log('BusinessProducts: Component connected');
        this.render();
        this.loadProducts();
    }

    async loadProducts() {
        try {
            console.log('BusinessProducts: Loading products...');
            
            // Get current user
            const { getCurrentUser } = await import('/firebase/auth.js');
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('BusinessProducts: No current user found');
                this.showNoProductsMessage();
                return;
            }

            console.log('BusinessProducts: Current user found:', currentUser.email);

            // Get business products from Firebase
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: currentUser.uid });
            
            console.log('BusinessProducts: Firebase result:', result);
            
            if (result.success && result.products && result.products.length > 0) {
                console.log('BusinessProducts: Found', result.products.length, 'products');
                this.updateProductsList(result.products);
                this.updateStats(result.products);
            } else {
                console.log('BusinessProducts: No products found or error:', result.error);
                this.showNoProductsMessage();
                this.updateStats([]); // Update stats with empty array
            }
        } catch (error) {
            console.error('BusinessProducts: Error loading products:', error);
            this.showNoProductsMessage();
            this.updateStats([]); // Update stats with empty array
        }
    }

    updateProductsList(products) {
        console.log('BusinessProducts: updateProductsList called with', products ? products.length : 0, 'products');
        const productsList = this.shadowRoot.getElementById('productsList');
        if (!productsList) {
            console.log('BusinessProducts: Products list container not found');
            console.log('BusinessProducts: Available elements in shadowRoot:', this.shadowRoot.querySelectorAll('*'));
            return;
        }

        if (!products || products.length === 0) {
            console.log('BusinessProducts: No products to display');
            this.showNoProductsMessage();
            return;
        }

        console.log('BusinessProducts: Updating products list with', products.length, 'products');
        
        productsList.innerHTML = products.map(product => {
            const validatedProduct = this.validateProduct(product);
            return `
                <div class="product-card ${validatedProduct.status}">
                    <div class="product-image">
                        <img src="${validatedProduct.image}" alt="${validatedProduct.productName}" 
                             onerror="this.src='/assets/logos/utiles-escolares.jpg'" />
                        <div class="product-status ${validatedProduct.status}">
                            ${validatedProduct.status === 'sold' ? '<i class="fas fa-check"></i>' : 
                              validatedProduct.status === 'pending' ? '<i class="fas fa-clock"></i>' : 
                              '<i class="fas fa-eye"></i>'}
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-header">
                            <h3 class="product-title">${validatedProduct.productName}</h3>
                            <div class="product-price">$${validatedProduct.price.toFixed(2)}</div>
                        </div>
                        <div class="product-meta">
                            <span class="meta-item">
                                <i class="fas fa-tag"></i>
                                ${validatedProduct.category}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-star"></i>
                                ${validatedProduct.condition}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-eye"></i>
                                ${validatedProduct.views} views
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDate(validatedProduct.createdAt)}
                            </span>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary edit-btn" data-id="${validatedProduct.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-secondary view-btn" data-id="${validatedProduct.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            <button class="btn btn-danger delete-btn" data-id="${validatedProduct.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        this.shadowRoot.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.editProduct(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.viewProduct(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteProduct(e.target.dataset.id));
        });
        
        console.log('BusinessProducts: Products list updated successfully');
    }

    editProduct(productId) {
        console.log('Edit product:', productId);
        // Navigate to edit product page
    }

    viewProduct(productId) {
        console.log('View product:', productId);
        // Navigate to product detail page
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            console.log('Delete product:', productId);
            // Delete product from Firebase
        }
    }

    render() {
        console.log('BusinessProducts: Rendering component');
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .products-overview {
                    padding: 0.5rem 3rem 0.5rem 3rem;
                }

                .section-header {
                    margin-bottom: 2rem;
                }

                .section-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .section-header p {
                    color: #64748b;
                    font-size: 1rem;
                    margin: 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    text-align: center;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    color: white;
                    margin: 0 auto 1rem;
                }

                .stat-icon.active {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .stat-icon.sold {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .stat-icon.pending {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.revenue {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .products-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                .product-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    gap: 1.5rem;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .product-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .product-card.sold {
                    opacity: 0.7;
                }

                .product-card.sold::after {
                    content: 'SOLD';
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #10b981;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .product-image {
                    position: relative;
                    flex-shrink: 0;
                }

                .product-image img {
                    width: 120px;
                    height: 120px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .product-status {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    color: white;
                }

                .product-status.active {
                    background: #3468c0;
                }

                .product-status.sold {
                    background: #10b981;
                }

                .product-status.pending {
                    background: #ffa424;
                }

                .product-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .product-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .product-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .product-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #3468c0;
                }

                .product-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .meta-item i {
                    color: #3468c0;
                }

                .product-actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }

                .btn-danger:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #64748b;
                }

                .empty-state i {
                    font-size: 3rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    margin: 0 0 1.5rem 0;
                }

                .add-product-btn {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .add-product-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(52, 104, 192, 0.3);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .products-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .product-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .product-image img {
                        width: 100px;
                        height: 100px;
                    }

                    .product-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .product-actions {
                        justify-content: center;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="products-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>My Products</h1>
                    <p>Manage your product inventory and track performance</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-number">15</div>
                        <div class="stat-label">Active Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon sold">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">28</div>
                        <div class="stat-label">Sold Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-number">7</div>
                        <div class="stat-label">Pending Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon revenue">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-number">$8,450</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                </div>

                <!-- Products List -->
                <div class="products-grid" id="productsList">
                    <!-- Products will be loaded here -->
                </div>
            </div>
        `;
    }

    validateProduct(product) {
        // Ensure the product has all necessary fields
        let imageUrl = '/assets/logos/utiles-escolares.jpg'; // Default image
        
        // Try to get the real product image
        if (product.images && product.images.length > 0) {
            // If there are images, use the first one
            if (typeof product.images[0] === 'string') {
                imageUrl = product.images[0];
            } else if (product.images[0].url) {
                imageUrl = product.images[0].url;
            }
        } else if (product.image) {
            // If there's a direct image
            imageUrl = product.image;
        }
        
        return {
            id: product.id || 'unknown',
            productName: product.productName || product.name || 'Unnamed Product',
            price: product.price !== null && product.price !== undefined ? product.price : 0,
            category: product.category || 'No Category',
            condition: product.condition || 'New',
            description: product.description || 'No description',
            status: product.status || 'active',
            views: product.views !== null && product.views !== undefined ? product.views : 0,
            createdAt: product.createdAt || new Date().toISOString(),
            image: imageUrl,
            images: product.images || []
        };
    }

    updateStats(products) {
        const activeProducts = products.filter(p => p.status === 'active').length;
        const soldProducts = products.filter(p => p.status === 'sold').length;
        const pendingProducts = products.filter(p => p.status === 'pending').length;
        const totalRevenue = products.filter(p => p.status === 'sold').reduce((sum, p) => sum + (p.price || 0), 0);

        // Update stats in the DOM
        const activeElement = this.shadowRoot.querySelector('.stat-card:nth-child(1) .stat-number');
        const soldElement = this.shadowRoot.querySelector('.stat-card:nth-child(2) .stat-number');
        const pendingElement = this.shadowRoot.querySelector('.stat-card:nth-child(3) .stat-number');
        const revenueElement = this.shadowRoot.querySelector('.stat-card:nth-child(4) .stat-number');

        if (activeElement) activeElement.textContent = activeProducts;
        if (soldElement) soldElement.textContent = soldProducts;
        if (pendingElement) pendingElement.textContent = pendingProducts;
        if (revenueElement) revenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
    }

    showNoProductsMessage() {
        console.log('BusinessProducts: Showing no products message');
        const productsList = this.shadowRoot.getElementById('productsList');
        if (productsList) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No products yet</h3>
                    <p>Start by adding your first product to sell in the marketplace</p>
                    <button class="add-product-btn" onclick="this.dispatchEvent(new CustomEvent('navigateToAddProduct'))">
                        <i class="fas fa-plus"></i>
                        Add Product
                    </button>
                </div>
            `;
            console.log('BusinessProducts: No products message displayed successfully');
        } else {
            console.log('BusinessProducts: Products list container not found for no products message');
            console.log('BusinessProducts: Available elements in shadowRoot:', this.shadowRoot.querySelectorAll('*'));
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Date not available';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date not available';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

customElements.define('business-products', BusinessProducts); 