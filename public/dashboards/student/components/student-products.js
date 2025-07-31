// Web component for student products
class StudentProducts extends HTMLElement {
    constructor() {
        super();
        console.log('StudentProducts: Constructor called');
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.currentUser = null;
        console.log('StudentProducts: Constructor completed');
    }
    
    connectedCallback() {
        console.log('StudentProducts: ConnectedCallback called');
        this.render();
        this.loadProducts();
        
        // Add event listener for navigation to add product
        this.addEventListener('navigateToAddProduct', () => {
            console.log('StudentProducts: Navigating to add product section');
            // Dispatch event to parent dashboard to change section
            this.dispatchEvent(new CustomEvent('sectionChange', {
                detail: { section: 'add-product' }
            }));
        });
        
        console.log('StudentProducts: ConnectedCallback completed');
    }

    async loadProducts() {
        console.log('StudentProducts: loadProducts started');
        
        // Obtener usuario actual
        try {
            console.log('StudentProducts: Loading Firebase auth...');
            const { getCurrentUser } = await import('/firebase/auth.js');
            this.currentUser = getCurrentUser();
            console.log('StudentProducts: Current user:', this.currentUser);
        } catch (error) {
            console.error('StudentProducts: Error loading auth:', error);
            this.showErrorNotification('Authentication Error', 'Could not get current user.');
            return;
        }
        
        if (!this.currentUser) {
            console.log('StudentProducts: No current user found');
            this.showErrorNotification('Not Authenticated', 'You must log in to view your products.');
            return;
        }

        // Load user products
        try {
            console.log('StudentProducts: Loading products for user:', this.currentUser.uid);
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: this.currentUser.uid });
            console.log('StudentProducts: Products result:', result);
            
            if (result.success) {
                this.products = result.products;
                console.log('StudentProducts: Products loaded:', this.products.length);
                this.updateProductsList(this.products);
                this.updateStats(this.products);
            } else {
                console.log('StudentProducts: No products found or error:', result.error);
                this.products = [];
                this.updateProductsList([]);
                this.updateStats([]);
            }
        } catch (error) {
            console.error('StudentProducts: Error loading products:', error);
            this.showErrorNotification('Error loading products', error.message);
            this.products = [];
            this.updateProductsList([]);
            this.updateStats([]);
        }
    }

    updateStats(products) {
        console.log('StudentProducts: updateStats called with', products.length, 'products');
        const stats = {
            active: products.filter(p => p.status === 'active').length,
            sold: products.filter(p => p.status === 'sold').length,
            pending: products.filter(p => p.status === 'pending').length,
            totalViews: products.reduce((sum, p) => sum + (p.views !== null && p.views !== undefined ? p.views : 0), 0)
        };
        console.log('StudentProducts: Calculated stats:', stats);

        // Actualizar estadísticas en el DOM
        const activeCount = this.shadowRoot.querySelector('.stat-card:nth-child(1) .stat-number');
        const soldCount = this.shadowRoot.querySelector('.stat-card:nth-child(2) .stat-number');
        const pendingCount = this.shadowRoot.querySelector('.stat-card:nth-child(3) .stat-number');
        const viewsCount = this.shadowRoot.querySelector('.stat-card:nth-child(4) .stat-number');

        if (activeCount) activeCount.textContent = stats.active;
        if (soldCount) soldCount.textContent = stats.sold;
        if (pendingCount) pendingCount.textContent = stats.pending;
        if (viewsCount) viewsCount.textContent = stats.totalViews.toLocaleString();
    }

    updateProductsList(products) {
        console.log('StudentProducts: updateProductsList called with', products.length, 'products');
        console.log('StudentProducts: Products data:', products);
        const productsList = this.shadowRoot.getElementById('productsList');
        if (!productsList) {
            console.error('StudentProducts: productsList element not found');
            return;
        }

        if (products.length === 0) {
            console.log('StudentProducts: No products, showing empty state');
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>You don't have products yet</h3>
                    <p>Start by adding your first product to sell in the marketplace</p>
                    <button class="add-product-btn" onclick="this.dispatchEvent(new CustomEvent('navigateToAddProduct'))">
                        <i class="fas fa-plus"></i>
                        Add Product
                    </button>
                </div>
            `;
            return;
        }

        console.log('StudentProducts: Rendering', products.length, 'products');
        productsList.innerHTML = products.map(product => {
            const validatedProduct = this.validateProduct(product);
            console.log('StudentProducts: Validated product:', validatedProduct);
            return `
            <div class="product-card ${validatedProduct.status}" data-product-id="${validatedProduct.id}">
                <div class="product-image">
                    <img src="${validatedProduct.image}" 
                         alt="${validatedProduct.productName}" 
                         onerror="this.src='/assets/logos/utiles-escolares.jpg'" />
                    <div class="product-status ${validatedProduct.status}">
                        ${validatedProduct.status === 'sold' ? '<i class="fas fa-check"></i>' : 
                            validatedProduct.status === 'pending' ? '<i class="fas fa-clock"></i>' : 
                            '<i class="fas fa-eye"></i>'}
                    </div>
                    ${validatedProduct.status === 'sold' ? '<div class="sold-badge">SOLD</div>' : ''}
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
                    <div class="product-description">
                        ${validatedProduct.description.substring(0, 100)}${validatedProduct.description.length > 100 ? '...' : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary edit-btn" data-id="${validatedProduct.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn btn-secondary preview-btn" data-id="${validatedProduct.id}">
                            <i class="fas fa-eye"></i>
                            Preview
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
            btn.addEventListener('click', (e) => this.editProduct(e.target.closest('.edit-btn').dataset.id));
        });

        this.shadowRoot.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.previewProduct(e.target.closest('.preview-btn').dataset.id));
        });

        this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteProduct(e.target.closest('.delete-btn').dataset.id));
        });
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

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        
        try {
            const { deleteProduct } = await import('/firebase/firestore.js');
            const result = await deleteProduct(productId);
            
            if (result.success) {
                this.showSuccessNotification('Deleted', 'Product deleted successfully.');
                this.loadProducts(); // Reload products
            } else {
                this.showErrorNotification('Error deleting', result.error);
            }
        } catch (error) {
            this.showErrorNotification('Error deleting', error.message);
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showErrorNotification('Error', 'Product not found for editing.');
            return;
        }
        this.showEditModal(product);
    }

    previewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showErrorNotification('Error', 'Product not found for preview.');
            return;
        }
        this.showPreviewModal(product);
    }

    showEditModal(product) {
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Product</h2>
                    <button class="close-btn" id="closeEditModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editName">Product Name *</label>
                        <input type="text" id="editName" value="${product.productName || product.name || ''}" required />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editPrice">Price *</label>
                            <input type="number" id="editPrice" value="${product.price || 0}" min="0" step="0.01" required />
                        </div>
                        <div class="form-group">
                            <label for="editCategory">Category</label>
                                                                     <select id="editCategory">
                <option value="accessories" ${(product.category === 'accessories') ? 'selected' : ''}>Accessories</option>
                <option value="books" ${(product.category === 'books') ? 'selected' : ''}>Books</option>
                <option value="category-art" ${(product.category === 'category-art') ? 'selected' : ''}>Art</option>
                <option value="electronics" ${(product.category === 'electronics') ? 'selected' : ''}>Electronics</option>
                <option value="notebooks" ${(product.category === 'notebooks') ? 'selected' : ''}>Notebooks</option>
                <option value="school-bags" ${(product.category === 'school-bags') ? 'selected' : ''}>School Bags</option>
                <option value="shoes" ${(product.category === 'shoes') ? 'selected' : ''}>Shoes</option>
                <option value="sports" ${(product.category === 'sports') ? 'selected' : ''}>Sports</option>
                <option value="stationery" ${(product.category === 'stationery') ? 'selected' : ''}>Stationery</option>
                <option value="uniforms" ${(product.category === 'uniforms') ? 'selected' : ''}>Uniforms</option>
            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editCondition">Condition</label>
                        <select id="editCondition">
                            <option value="new" ${(product.condition === 'new') ? 'selected' : ''}>New</option>
                            <option value="like-new" ${(product.condition === 'like-new') ? 'selected' : ''}>Like New</option>
                            <option value="good" ${(product.condition === 'good') ? 'selected' : ''}>Good</option>
                            <option value="fair" ${(product.condition === 'fair') ? 'selected' : ''}>Fair</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editDescription">Description</label>
                        <textarea id="editDescription" rows="4">${product.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Status</label>
                        <select id="editStatus">
                            <option value="active" ${(product.status === 'active') ? 'selected' : ''}>Active</option>
                                                    <option value="pending" ${(product.status === 'pending') ? 'selected' : ''}>Pending</option>
                        <option value="sold" ${(product.status === 'sold') ? 'selected' : ''}>Sold</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
                    <button class="btn btn-primary" id="saveEditBtn">Save Changes</button>
                </div>
            </div>
            <style>
                .edit-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 1.5rem;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .close-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #374151;
                }
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    transition: border-color 0.2s;
                }
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3468c0;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                }
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
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
            </style>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('#closeEditModal').onclick = () => modal.remove();
        modal.querySelector('#cancelEditBtn').onclick = () => modal.remove();
        
        modal.querySelector('#saveEditBtn').onclick = async () => {
            const newName = modal.querySelector('#editName').value.trim();
            const newPrice = parseFloat(modal.querySelector('#editPrice').value);
            const newCategory = modal.querySelector('#editCategory').value;
            const newCondition = modal.querySelector('#editCondition').value;
            const newDescription = modal.querySelector('#editDescription').value.trim();
            const newStatus = modal.querySelector('#editStatus').value;

            if (!newName || isNaN(newPrice) || newPrice < 0) {
                this.showErrorNotification('Error', 'Name and price are required and price must be valid.');
                return;
            }

            try {
                const { updateProduct } = await import('/firebase/firestore.js');
                const result = await updateProduct(product.id, {
                    productName: newName,
                    price: newPrice,
                    category: newCategory,
                    condition: newCondition,
                    description: newDescription,
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                });

                if (result.success) {
                    this.showSuccessNotification('Updated', 'Product updated successfully.');
                    modal.remove();
                    this.loadProducts(); // Reload products
                } else {
                    this.showErrorNotification('Error updating', result.error);
                }
            } catch (error) {
                this.showErrorNotification('Error updating', error.message);
            }
        };
    }

    showPreviewModal(product) {
        const validatedProduct = this.validateProduct(product);
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Vista Previa del Marketplace</h2>
                    <button class="close-btn" id="closePreviewModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="marketplace-preview">
                        <div class="product-preview-card">
                            <div class="preview-image">
                                ${validatedProduct.images && validatedProduct.images.length > 0 ? 
                                    `<div class="image-gallery">
                                        ${validatedProduct.images.map((img, index) => {
                                            const imgUrl = typeof img === 'string' ? img : img.url;
                                            return `<img src="${imgUrl}" 
                                                         alt="${validatedProduct.productName} - Imagen ${index + 1}"
                                                         onerror="this.src='/assets/logos/utiles-escolares.jpg'"
                                                         class="${index === 0 ? 'active' : ''}" />`;
                                        }).join('')}
                                        ${validatedProduct.images.length > 1 ? 
                                            `<div class="image-nav">
                                                <button class="nav-btn prev" onclick="this.parentElement.parentElement.querySelector('.active').previousElementSibling?.classList.add('active') || this.parentElement.parentElement.querySelector('img:last-child').classList.add('active'); this.parentElement.parentElement.querySelector('.active').classList.remove('active');">‹</button>
                                                <button class="nav-btn next" onclick="this.parentElement.parentElement.querySelector('.active').nextElementSibling?.classList.add('active') || this.parentElement.parentElement.querySelector('img:first-child').classList.add('active'); this.parentElement.parentElement.querySelector('.active').classList.remove('active');">›</button>
                                            </div>` : ''
                                        }
                                    </div>` :
                                    `<img src="${validatedProduct.image}" 
                                          alt="${validatedProduct.productName}"
                                          onerror="this.src='/assets/logos/utiles-escolares.jpg'" />`
                                }
                                            <div class="preview-status ${validatedProduct.status}">
                ${validatedProduct.status === 'sold' ? 'SOLD' : 
                    validatedProduct.status === 'pending' ? 'PENDING' : 'AVAILABLE'}
            </div>
                            </div>
                            <div class="preview-info">
                                <h3 class="preview-title">${validatedProduct.productName}</h3>
                                <div class="preview-price">$${validatedProduct.price.toFixed(2)}</div>
                                <div class="preview-meta">
                                    <span class="preview-category">${validatedProduct.category}</span>
                                    <span class="preview-condition">${validatedProduct.condition}</span>
                                </div>
                                <p class="preview-description">${validatedProduct.description}</p>
                                <div class="preview-stats">
                                    <span><i class="fas fa-eye"></i> ${validatedProduct.views} vistas</span>
                                    <span><i class="fas fa-calendar"></i> ${this.formatDate(validatedProduct.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="closePreviewBtn">Cerrar</button>
                </div>
            </div>
            <style>
                .preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 1.5rem;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .close-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .marketplace-preview {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 1rem;
                }
                .product-preview-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .preview-image {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                .preview-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .image-gallery {
                    position: relative;
                    height: 100%;
                }
                .image-gallery img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .image-gallery img.active {
                    opacity: 1;
                }
                .image-nav {
                    position: absolute;
                    bottom: 1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.5rem;
                    z-index: 10;
                }
                .nav-btn {
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }
                .nav-btn:hover {
                    background: rgba(0, 0, 0, 0.9);
                }
                .preview-status {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: white;
                }
                .preview-status.active {
                    background: #3468c0;
                }
                .preview-status.sold {
                    background: #10b981;
                }
                .preview-status.pending {
                    background: #ffa424;
                }
                .preview-info {
                    padding: 1.5rem;
                }
                .preview-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }
                .preview-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #3468c0;
                    margin-bottom: 1rem;
                }
                .preview-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .preview-category,
                .preview-condition {
                    background: #f3f4f6;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    color: #64748b;
                }
                .preview-description {
                    color: #64748b;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                }
                .preview-stats {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: #64748b;
                }
                .preview-stats span {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                }
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                .btn-secondary:hover {
                    background: #e5e7eb;
                }
            </style>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('#closePreviewModal').onclick = () => modal.remove();
        modal.querySelector('#closePreviewBtn').onclick = () => modal.remove();
    }

    showSuccessNotification(title, message) {
        // Crear notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div class="notification-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <style>
                .success-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: #10b981;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-content i {
                    font-size: 1.5rem;
                }
                .notification-text h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1rem;
                }
                .notification-text p {
                    margin: 0;
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showErrorNotification(title, message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <div class="notification-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <style>
                .error-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: #ef4444;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-content i {
                    font-size: 1.5rem;
                }
                .notification-text h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1rem;
                }
                .notification-text p {
                    margin: 0;
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    render() {
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

                .sold-badge {
                    position: absolute;
                    bottom: 0.5rem;
                    left: 0.5rem;
                    background: #10b981;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
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

                .product-description {
                    color: #64748b;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin-bottom: 1rem;
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
                    background: linear-gradient(135deg, #3468c0, #1d4ed8) !important;
                    color: white !important;
                    border: none !important;
                    padding: 0.5rem 1rem !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                    font-size: 0.875rem !important;
                }

                .add-product-btn:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3) !important;
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
                    <p>Manage your products and track their performance</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Active Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon sold">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Sold Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Total Views</div>
                    </div>
                </div>

                <!-- Products List -->
                <div class="products-grid" id="productsList">
                    <!-- Products will be loaded here -->
                </div>
            </div>
        `;
    }
}

customElements.define('student-products', StudentProducts);
console.log('✅ StudentProducts component registered successfully'); 