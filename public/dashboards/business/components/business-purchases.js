// Business Purchases Component
class BusinessPurchases extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadPurchasesData();
    }

    async loadPurchasesData() {
        try {
            console.log('BusinessPurchases: Loading purchases data...');
            
            // Get current user
            const { getCurrentUser } = await import('/firebase/auth.js');
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('BusinessPurchases: No current user found');
                this.showNoPurchasesMessage();
                return;
            }

            // For now, show a message that purchases are not yet implemented
            // In a real implementation, this would fetch purchase data from Firebase
            this.showNoPurchasesMessage();
            
        } catch (error) {
            console.error('BusinessPurchases: Error loading purchases data:', error);
            this.showNoPurchasesMessage();
        }
    }

    showNoPurchasesMessage() {
        const purchasesList = this.shadowRoot.getElementById('purchasesList');
        if (purchasesList) {
            purchasesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>No purchases yet</h3>
                    <p>Purchase tracking is not yet implemented. This feature will be available soon.</p>
                    <button class="explore-marketplace-btn" onclick="this.dispatchEvent(new CustomEvent('navigateToMarketplace'))">
                        <i class="fas fa-store"></i>
                        Explore Marketplace
                    </button>
                </div>
            `;
        }
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

                .stat-icon.purchases {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .stat-icon.spent {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.items {
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

                .purchases-grid {
                    display: grid;
                    gap: 1.5rem;
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

                .explore-marketplace-btn {
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

                .explore-marketplace-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(52, 104, 192, 0.3);
                }

                @media (max-width: 768px) {
                    .purchases-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="purchases-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Purchase History</h1>
                    <p>Track your business purchases and inventory acquisitions</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon purchases">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Total Purchases</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon spent">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-number">$0</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon items">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Items Purchased</div>
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

customElements.define('business-purchases', BusinessPurchases); 