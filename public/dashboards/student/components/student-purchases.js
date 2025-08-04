// Web component for student purchases
class StudentPurchases extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.loadPurchases();
    }

    async loadPurchases() {
        try {
            // Get real user data
            const { getCurrentUser } = await import('/firebase/auth.js');
            const { getProducts } = await import('/firebase/firestore.js');
            
            const currentUser = getCurrentUser();
            if (!currentUser) {
                this.showNoPurchasesMessage();
                return;
            }

            // For now, since there's no purchase system implemented,
            // we'll show an informative message
            this.showNoPurchasesMessage();
            
            // In the future, real user purchases would be loaded here
            // const purchasesResult = await getPurchases({ buyerId: currentUser.uid });
            // const userPurchases = purchasesResult.success ? purchasesResult.purchases : [];
            
        } catch (error) {
            console.error('Error loading purchases:', error);
            this.showNoPurchasesMessage();
        }
    }

    showNoPurchasesMessage() {
        const purchasesList = this.shadowRoot.getElementById('purchasesList');
        if (purchasesList) {
            purchasesList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                    <h2>No purchases recorded</h2>
                    <p>When you make purchases in the marketplace, they will appear here.</p>
                    <button class="btn btn-primary" onclick="window.location.href='/pages/marketplace/marketplace.html'" style="margin-top: 1rem;">
                        <i class="fas fa-shopping-bag"></i>
                        Explore Marketplace
                    </button>
                </div>
            `;
        }

        // Actualizar estadísticas a 0
        const statsElements = this.shadowRoot.querySelectorAll('.stat-number');
        if (statsElements.length >= 4) {
            statsElements[0].textContent = '0'; // Completed
            statsElements[1].textContent = '0'; // In Progress
            statsElements[2].textContent = '0'; // Cancelled
            statsElements[3].textContent = '$0'; // Total Spent
        }
    }

    updatePurchasesList(purchases) {
        const purchasesList = this.shadowRoot.getElementById('purchasesList');
        if (!purchasesList) return;

        purchasesList.innerHTML = purchases.map(purchase => `
            <div class="purchase-card ${purchase.status}">
                <div class="purchase-image">
                    <img src="${purchase.image}" alt="${purchase.productName}" />
                    <div class="purchase-status ${purchase.status}">
                        ${purchase.status === 'completed' ? '<i class="fas fa-check"></i>' : 
                            purchase.status === 'in_progress' ? '<i class="fas fa-clock"></i>' : 
                            purchase.status === 'cancelled' ? '<i class="fas fa-times"></i>' : 
                            '<i class="fas fa-shipping-fast"></i>'}
                    </div>
                </div>
                <div class="purchase-info">
                    <div class="purchase-header">
                        <h3 class="purchase-title">${purchase.productName}</h3>
                        <div class="purchase-price">
                            <span class="icon-logo_S"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>${purchase.price.toFixed(2)}
                        </div>
                    </div>
                    <div class="purchase-meta">
                        <span class="meta-item">
                            <i class="fas fa-user"></i>
                            ${purchase.seller}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${new Date(purchase.date).toLocaleDateString()}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-tag"></i>
                            ${purchase.status.replace('_', ' ')}
                        </span>
                    </div>
                    ${purchase.rating ? `
                        <div class="purchase-review">
                            <div class="rating">
                                ${Array.from({length: 5}, (_, i) => 
                                    `<i class="fas fa-star ${i < purchase.rating ? 'filled' : ''}"></i>`
                                ).join('')}
                            </div>
                            <p class="review-text">"${purchase.review}"</p>
                        </div>
                    ` : ''}
                    <div class="purchase-actions">
                        <button class="btn btn-primary view-btn" data-id="${purchase.id}">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        ${purchase.status === 'completed' && !purchase.rating ? `
                            <button class="btn btn-secondary review-btn" data-id="${purchase.id}">
                                <i class="fas fa-star"></i>
                                Leave Review
                            </button>
                        ` : ''}
                        ${purchase.status === 'in_progress' ? `
                            <button class="btn btn-success track-btn" data-id="${purchase.id}">
                                <i class="fas fa-shipping-fast"></i>
                                Track Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.viewPurchase(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.leaveReview(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.track-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.trackOrder(e.target.dataset.id));
        });
    }

    viewPurchase(purchaseId) {
        console.log('View purchase:', purchaseId);
        // Navigate to purchase detail page
    }

    leaveReview(purchaseId) {
        console.log('Leave review for purchase:', purchaseId);
        // Open review modal
    }

    trackOrder(purchaseId) {
        console.log('Track order:', purchaseId);
        // Open tracking modal
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

                .purchases-overview {
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

                .stat-icon.completed {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .stat-icon.in_progress {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.cancelled {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                .stat-icon.total {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
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

                .purchases-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                .purchase-card {
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

                .purchase-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .purchase-card.cancelled {
                    opacity: 0.7;
                }

                .purchase-image {
                    position: relative;
                    flex-shrink: 0;
                }

                .purchase-image img {
                    width: 120px;
                    height: 120px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .purchase-status {
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

                .purchase-status.completed {
                    background: #10b981;
                }

                .purchase-status.in_progress {
                    background: #ffa424;
                }

                .purchase-status.cancelled {
                    background: #ef4444;
                }

                .purchase-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .purchase-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .purchase-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .purchase-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #3468c0;
                }

                .purchase-meta {
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

                .purchase-review {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 8px;
                }

                .rating {
                    display: flex;
                    gap: 0.25rem;
                    margin-bottom: 0.5rem;
                }

                .rating .fa-star {
                    color: #d1d5db;
                    font-size: 0.875rem;
                }

                .rating .fa-star.filled {
                    color: #fbbf24;
                }

                .review-text {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                    font-style: italic;
                }

                .purchase-actions {
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

                .btn-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                }

                .btn-success:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .purchases-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .purchase-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .purchase-image img {
                        width: 100px;
                        height: 100px;
                    }

                    .purchase-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .purchase-actions {
                        justify-content: center;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="purchases-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>My Purchases</h1>
                    <p>Track your purchase history and order status</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon completed">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">15</div>
                        <div class="stat-label">Completed Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon in_progress">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-number">3</div>
                        <div class="stat-label">In Progress</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon cancelled">
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="stat-number">1</div>
                        <div class="stat-label">Cancelled</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-number">$2,450</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                </div>

                <!-- Purchases List -->
                <div class="purchases-grid" id="purchasesList">
                    <!-- Purchases will be loaded here -->
                </div>
            </div>
        `;
    }
}

customElements.define('student-purchases', StudentPurchases); 