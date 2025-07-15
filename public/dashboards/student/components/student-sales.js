// Componente web para ventas del estudiante
class StudentSales extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.loadSales();
    }

    loadSales() {
        // Simulate loading sales from Firebase
        const mockSales = [
            {
                id: 1,
                productName: 'Calculus Textbook',
                buyer: 'Maria Garcia',
                price: 45.00,
                status: 'completed',
                date: '2024-01-15',
                image: 'https://via.placeholder.com/120x120/3468c0/ffffff?text=C',
                rating: 5,
                review: 'Excellent condition, very helpful!'
            },
            {
                id: 2,
                productName: 'Nike Running Shoes',
                buyer: 'Alex Johnson',
                price: 75.00,
                status: 'completed',
                date: '2024-01-10',
                image: 'https://via.placeholder.com/120x120/10b981/ffffff?text=N',
                rating: 4,
                review: 'Great shoes, exactly as described'
            },
            {
                id: 3,
                productName: 'MacBook Air 2020',
                buyer: 'TechStore',
                price: 850.00,
                status: 'pending',
                date: '2024-01-08',
                image: 'https://via.placeholder.com/120x120/ffa424/ffffff?text=M',
                rating: null,
                review: null
            }
        ];

        this.updateSalesList(mockSales);
    }

    updateSalesList(sales) {
        const salesList = this.shadowRoot.getElementById('salesList');
        if (!salesList) return;

        salesList.innerHTML = sales.map(sale => `
            <div class="sale-card ${sale.status}">
                <div class="sale-image">
                    <img src="${sale.image}" alt="${sale.productName}" />
                    <div class="sale-status ${sale.status}">
                        ${sale.status === 'completed' ? '<i class="fas fa-check"></i>' : 
                          sale.status === 'pending' ? '<i class="fas fa-clock"></i>' : 
                          sale.status === 'cancelled' ? '<i class="fas fa-times"></i>' : 
                          '<i class="fas fa-shipping-fast"></i>'}
                    </div>
                </div>
                <div class="sale-info">
                    <div class="sale-header">
                        <h3 class="sale-title">${sale.productName}</h3>
                        <div class="sale-price">$${sale.price.toFixed(2)}</div>
                    </div>
                    <div class="sale-meta">
                        <span class="meta-item">
                            <i class="fas fa-user"></i>
                            ${sale.buyer}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${new Date(sale.date).toLocaleDateString()}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-tag"></i>
                            ${sale.status}
                        </span>
                    </div>
                    ${sale.rating ? `
                        <div class="sale-review">
                            <div class="rating">
                                ${Array.from({length: 5}, (_, i) => 
                                    `<i class="fas fa-star ${i < sale.rating ? 'filled' : ''}"></i>`
                                ).join('')}
                            </div>
                            <p class="review-text">"${sale.review}"</p>
                        </div>
                    ` : ''}
                    <div class="sale-actions">
                        <button class="btn btn-primary view-btn" data-id="${sale.id}">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        ${sale.status === 'pending' ? `
                            <button class="btn btn-success ship-btn" data-id="${sale.id}">
                                <i class="fas fa-shipping-fast"></i>
                                Mark Shipped
                            </button>
                        ` : ''}
                        ${sale.status === 'completed' ? `
                            <button class="btn btn-secondary message-btn" data-id="${sale.id}">
                                <i class="fas fa-comment"></i>
                                Message Buyer
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.viewSale(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.ship-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.markShipped(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.message-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.messageBuyer(e.target.dataset.id));
        });
    }

    viewSale(saleId) {
        console.log('View sale:', saleId);
        // Navigate to sale detail page
    }

    markShipped(saleId) {
        if (confirm('Mark this item as shipped?')) {
            console.log('Mark shipped:', saleId);
            // Update sale status in Firebase
        }
    }

    messageBuyer(saleId) {
        console.log('Message buyer for sale:', saleId);
        // Open messaging interface
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

                .stat-icon.completed {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .stat-icon.pending {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.cancelled {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                .stat-icon.revenue {
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
                    position: relative;
                }

                .sale-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .sale-card.cancelled {
                    opacity: 0.7;
                }

                .sale-image {
                    position: relative;
                    flex-shrink: 0;
                }

                .sale-image img {
                    width: 120px;
                    height: 120px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .sale-status {
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

                .sale-status.completed {
                    background: #10b981;
                }

                .sale-status.pending {
                    background: #ffa424;
                }

                .sale-status.cancelled {
                    background: #ef4444;
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
                    color: #3468c0;
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

                .sale-review {
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

                .sale-actions {
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

                    .sale-actions {
                        justify-content: center;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="sales-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>My Sales</h1>
                    <p>Track your sales performance and manage orders</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon completed">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">23</div>
                        <div class="stat-label">Completed Sales</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-number">5</div>
                        <div class="stat-label">Pending Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon cancelled">
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="stat-number">2</div>
                        <div class="stat-label">Cancelled</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon revenue">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-number">$3,250</div>
                        <div class="stat-label">Total Revenue</div>
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

customElements.define('student-sales', StudentSales); 