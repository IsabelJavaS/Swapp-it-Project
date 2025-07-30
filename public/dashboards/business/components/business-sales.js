// Business Sales Component
class BusinessSales extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadSalesData();
    }

    async loadSalesData() {
        try {
            console.log('BusinessSales: Loading sales data...');
            
            // Get current user
            const { getCurrentUser } = await import('/firebase/auth.js');
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('BusinessSales: No current user found');
                this.showNoSalesMessage();
                return;
            }

            // Get business products that are sold
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: currentUser.uid });
            
            if (result.success) {
                const soldProducts = result.products.filter(p => p.status === 'sold');
                console.log('BusinessSales: Found', soldProducts.length, 'sold products');
                this.updateSalesList(soldProducts);
                this.updateStats(soldProducts);
            } else {
                console.log('BusinessSales: No products found or error:', result.error);
                this.showNoSalesMessage();
            }
        } catch (error) {
            console.error('BusinessSales: Error loading sales data:', error);
            this.showNoSalesMessage();
        }
    }

    updateStats(sales) {
        const totalSales = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
        const totalItems = sales.length;
        const avgPrice = totalItems > 0 ? totalSales / totalItems : 0;

        // Update stats in the DOM
        const totalSalesElement = this.shadowRoot.querySelector('.stat-card:nth-child(1) .stat-number');
        const totalItemsElement = this.shadowRoot.querySelector('.stat-card:nth-child(2) .stat-number');
        const avgPriceElement = this.shadowRoot.querySelector('.stat-card:nth-child(3) .stat-number');

        if (totalSalesElement) totalSalesElement.textContent = `$${totalSales.toFixed(2)}`;
        if (totalItemsElement) totalItemsElement.textContent = totalItems;
        if (avgPriceElement) avgPriceElement.textContent = `$${avgPrice.toFixed(2)}`;
    }

    updateSalesList(sales) {
        const salesList = this.shadowRoot.getElementById('salesList');
        if (!salesList) return;

        if (sales.length === 0) {
            this.showNoSalesMessage();
            return;
        }

        salesList.innerHTML = sales.map(sale => {
            const saleDate = this.formatDate(sale.updatedAt || sale.createdAt);
            return `
                <div class="sale-card">
                    <div class="sale-image">
                        <img src="${sale.image || '/assets/logos/utiles-escolares.jpg'}" 
                             alt="${sale.productName}" 
                             onerror="this.src='/assets/logos/utiles-escolares.jpg'" />
                    </div>
                    <div class="sale-info">
                        <div class="sale-header">
                            <h3 class="sale-title">${sale.productName}</h3>
                            <div class="sale-price">$${sale.price.toFixed(2)}</div>
                        </div>
                        <div class="sale-meta">
                            <span class="meta-item">
                                <i class="fas fa-calendar"></i>
                                ${saleDate}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-tag"></i>
                                ${sale.category || 'No Category'}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-check-circle"></i>
                                Completed
                            </span>
                        </div>
                        <div class="sale-description">
                            ${sale.description || 'No description available'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showNoSalesMessage() {
        const salesList = this.shadowRoot.getElementById('salesList');
        if (salesList) {
            salesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No sales yet</h3>
                    <p>Start selling products to see your sales history here</p>
                    <button class="add-product-btn" onclick="this.dispatchEvent(new CustomEvent('navigateToAddProduct'))">
                        <i class="fas fa-plus"></i>
                        Add Product
                    </button>
                </div>
            `;
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

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .sales-overview {
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

                .stat-icon.sales {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .stat-icon.items {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.avg {
                    background: linear-gradient(135deg, #10b981, #059669);
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

                .sales-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                .sale-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    gap: 1.5rem;
                    transition: all 0.3s ease;
                }

                .sale-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .sale-image {
                    flex-shrink: 0;
                }

                .sale-image img {
                    width: 120px;
                    height: 120px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .sale-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .sale-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .sale-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .sale-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #10b981;
                }

                .sale-meta {
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

                .sale-description {
                    color: #64748b;
                    font-size: 0.875rem;
                    line-height: 1.5;
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

                @media (max-width: 768px) {
                    .sales-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .sale-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .sale-image img {
                        width: 100px;
                        height: 100px;
                    }

                    .sale-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="sales-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Sales History</h1>
                    <p>Track your business sales and revenue performance</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon sales">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-number">$0</div>
                        <div class="stat-label">Total Sales</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon items">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Items Sold</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon avg">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-number">$0</div>
                        <div class="stat-label">Average Price</div>
                    </div>
                </div>

                <!-- Sales List -->
                <div class="sales-grid" id="salesList">
                    <!-- Sales will be loaded here -->
                </div>
            </div>
        `;
    }
}

customElements.define('business-sales', BusinessSales); 