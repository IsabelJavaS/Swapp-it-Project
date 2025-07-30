// Componente web para productos del estudiante
class StudentProducts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.loadProducts();
    }

    async loadProducts() {
        // Obtener usuario actual
        let currentUser;
        try {
            const { getCurrentUser } = await import('/firebase/auth.js');
            currentUser = getCurrentUser();
        } catch (error) {
            this.showErrorNotification('Error de autenticación', 'No se pudo obtener el usuario actual.');
            return;
        }
        if (!currentUser) {
            this.showErrorNotification('No autenticado', 'Debes iniciar sesión para ver tus productos.');
            return;
        }
        // Cargar productos del usuario
        try {
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: currentUser.uid });
            if (result.success) {
                this.updateProductsList(result.products);
            } else {
                this.updateProductsList([]);
            }
        } catch (error) {
            this.showErrorNotification('Error al cargar productos', error.message);
            this.updateProductsList([]);
        }
    }

    updateProductsList(products) {
        const productsList = this.shadowRoot.getElementById('productsList');
        if (!productsList) return;

        productsList.innerHTML = products.map(product => `
            <div class="product-card ${product.status}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-status ${product.status}">
                        ${product.status === 'sold' ? '<i class="fas fa-check"></i>' : 
                            product.status === 'pending' ? '<i class="fas fa-clock"></i>' : 
                            '<i class="fas fa-eye"></i>'}
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="product-meta">
                        <span class="meta-item">
                            <i class="fas fa-tag"></i>
                            ${product.category}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-star"></i>
                            ${product.condition}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${product.views} views
                        </span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary edit-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn btn-secondary view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="btn btn-danger delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

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
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const { deleteProduct } = await import('/firebase/firestore.js');
            const result = await deleteProduct(productId);
            if (result.success) {
                this.showSuccessNotification('Deleted', 'Product deleted successfully.');
                this.loadProducts();
            } else {
                this.showErrorNotification('Error deleting', result.error);
            }
        } catch (error) {
            this.showErrorNotification('Error deleting', error.message);
        }
    }

    editProduct(productId) {
        // Buscar el producto actual en la lista
        const productsList = this.shadowRoot.getElementById('productsList');
        const productCard = productsList.querySelector(`[data-id="${productId}"]`);
        // Buscar el producto en la lista interna (puedes guardar la lista en this.products)
        const product = (this.products || []).find(p => p.id == productId);
        if (!product) {
            this.showErrorNotification('Error', 'No se encontró el producto para editar.');
            return;
        }
        // Crear modal de edición
        this.showEditModal(product);
    }

    viewProduct(productId) {
        console.log('View product:', productId);
        // Navigate to product detail page
    }

    showEditModal(product) {
        // Crear modal básico
        let modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Product</h2>
                <label>Name: <input type="text" id="editName" value="${product.productName || product.name}" /></label><br>
                <label>Price: <input type="number" id="editPrice" value="${product.price}" /></label><br>
                <label>Description: <textarea id="editDesc">${product.description || ''}</textarea></label><br>
                <button id="saveEditBtn">Save</button>
                <button id="cancelEditBtn">Cancel</button>
            </div>
            <style>
                .edit-modal { position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:9999; }
                .modal-content { background:white; padding:2rem; border-radius:12px; min-width:300px; }
                .modal-content h2 { margin-top:0; }
                .modal-content label { display:block; margin-bottom:1rem; }
                .modal-content button { margin-right:1rem; }
            </style>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#cancelEditBtn').onclick = () => modal.remove();
        modal.querySelector('#saveEditBtn').onclick = async () => {
            const newName = modal.querySelector('#editName').value.trim();
            const newPrice = parseFloat(modal.querySelector('#editPrice').value);
            const newDesc = modal.querySelector('#editDesc').value.trim();
            if (!newName || isNaN(newPrice)) {
                alert('Name and price are required.');
                return;
            }
            try {
                const { updateProduct } = await import('/firebase/firestore.js');
                const result = await updateProduct(product.id, {
                    productName: newName,
                    price: newPrice,
                    description: newDesc,
                    updatedAt: new Date().toISOString()
                });
                if (result.success) {
                    this.showSuccessNotification('Updated', 'Product updated successfully.');
                    modal.remove();
                    this.loadProducts();
                } else {
                    alert('Error updating: ' + result.error);
                }
            } catch (error) {
                alert('Error updating: ' + error.message);
            }
        };
    }

    showSuccessNotification(title, message) {
        alert(`${title}\n${message}`);
    }
    showErrorNotification(title, message) {
        alert(`${title}\n${message}`);
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
                    <p>Manage your product listings and track their performance</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-number">8</div>
                        <div class="stat-label">Active Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon sold">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">12</div>
                        <div class="stat-label">Sold Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-number">3</div>
                        <div class="stat-label">Pending Sales</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon active">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="stat-number">1,247</div>
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