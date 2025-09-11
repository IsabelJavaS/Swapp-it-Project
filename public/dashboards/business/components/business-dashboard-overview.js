// Business Dashboard Overview Component
class BusinessDashboardOverview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('BusinessDashboardOverview: Component connected');
        this.render();
        // Use setTimeout to ensure the component is fully rendered before loading data
        setTimeout(() => {
            console.log('BusinessDashboardOverview: Starting to load dashboard data');
            this.loadDashboardData();
        }, 100);
    }

    render() {
        console.log('BusinessDashboardOverview: Rendering component');
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/css/icon_S/icon_S.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .dashboard-overview {
                    padding: 1rem;
                }

                @media (min-width: 768px) {
                    .dashboard-overview {
                        padding: 0.5rem 3rem 0.5rem 3rem;
                    }
                }

                .section-header {
                    margin-top: 0;
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

                /* Stats Cards */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                @media (min-width: 640px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                }

                @media (min-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                @media (min-width: 640px) {
                    .stat-card {
                        padding: 1.5rem;
                    }
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #3468c0, #ffa424);
                    border-radius: 16px 16px 0 0;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .stat-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
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
                }

                .stat-icon.sales {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .stat-icon.orders {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.products {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .stat-icon.revenue {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                }

                .stat-value {
                    text-align: right;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .stat-change {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                }

                .stat-change.positive {
                    color: #10b981;
                }

                .stat-change.negative {
                    color: #ef4444;
                }

                .stat-change.neutral {
                    color: #64748b;
                }

                /* Charts Section */
                .charts-section {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    align-items: start;
                }

                .chart-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                }

                .chart-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .chart-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .chart-period {
                    display: flex;
                    gap: 0.5rem;
                }

                .period-btn {
                    padding: 0.5rem 1rem;
                    border: 1px solid #e2e8f0;
                    background: white;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .period-btn.active {
                    background: #3468c0;
                    color: white;
                    border-color: #3468c0;
                }

                .period-btn:hover:not(.active) {
                    background: #f8fafc;
                    border-color: #3468c0;
                    color: #3468c0;
                }

                .chart-placeholder {
                    flex: 1;
                    min-height: 250px;
                    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    font-size: 1rem;
                    font-weight: 500;
                }

                /* Recent Activity */
                .activity-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .activity-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .activity-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .view-all-btn {
                    color: #3468c0;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }

                .view-all-btn:hover {
                    color: #1d4ed8;
                }

                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    flex: 1;
                }
                .activity-list::-webkit-scrollbar {
                    width: 7px;
                }
                .activity-list::-webkit-scrollbar-thumb {
                    background: #8b5cf6;
                    border-radius: 6px;
                }
                .activity-list::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }

                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: 12px;
                    background: #f8fafc;
                    transition: all 0.2s ease;
                }

                .activity-item:hover {
                    background: #f1f5f9;
                    transform: translateX(4px);
                }

                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: white;
                }

                .activity-icon.sale {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .activity-icon.order {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .activity-icon.product {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .activity-icon.revenue {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                }

                .activity-details {
                    flex: 1;
                }

                .activity-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .activity-desc {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin: 0;
                }

                .activity-meta {
                    text-align: right;
                }

                .activity-price {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .activity-time {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin: 0;
                }

                /* Responsive */
                @media (max-width: 1200px) {
                    .charts-section {
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                }

                @media (max-width: 1024px) {
                    .charts-section {
                        grid-template-columns: 1fr;
                        min-height: auto;
                    }
                    
                    .chart-card,
                    .activity-card {
                        height: auto;
                    }
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .section-header h1 {
                        font-size: 1.5rem;
                    }
                    
                    .charts-section {
                        gap: 1rem;
                    }
                    
                    .chart-placeholder {
                        min-height: 200px;
                    }
                }

                @media (max-width: 480px) {
                    .chart-placeholder {
                        min-height: 150px;
                        font-size: 0.875rem;
                    }
                    
                    .activity-item {
                        padding: 0.75rem;
                        gap: 0.75rem;
                    }
                    
                    .activity-icon {
                        width: 35px;
                        height: 35px;
                        font-size: 0.875rem;
                    }
                }
            </style>

            <div class="dashboard-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Business Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with your business.</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon sales">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="totalSales">$0</div>
                                <div class="stat-label">Total Sales</div>
                            </div>
                        </div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+15.2%</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon orders">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="totalOrders">0</div>
                                <div class="stat-label">Total Orders</div>
                            </div>
                        </div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+8.7%</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon products">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="activeProducts">0</div>
                                <div class="stat-label">Active Products</div>
                            </div>
                        </div>
                        <div class="stat-change neutral">
                            <i class="fas fa-minus"></i>
                            <span>No change</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon revenue">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="monthlyRevenue">$0</div>
                                <div class="stat-label">Monthly Revenue</div>
                            </div>
                        </div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+12.3%</span>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">Sales & Revenue Trend</h3>
                            <div class="chart-period">
                                <button class="period-btn active" id="btn7D">7D</button>
                                <button class="period-btn" id="btn30D">30D</button>
                                <button class="period-btn" id="btn90D">90D</button>
                            </div>
                        </div>
                        <div style="height: 280px;">
                            <canvas id="trendChart" width="100%" height="100%"></canvas>
                        </div>
                    </div>
                    <div>
                        <div class="activity-card">
                            <div class="activity-header">
                                <h3 class="activity-title">Recent Activity</h3>
                                <a href="#" class="view-all-btn">View All</a>
                            </div>
                            <div class="activity-list" id="activityList">
                                <!-- Activity items will be loaded here -->
                            </div>
                            <div class="activity-summary" style="margin-top: 1rem; text-align: center; color: #64748b; font-size: 1rem;">
                                <span id="activityCount"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadDashboardData() {
        try {
            console.log('BusinessDashboardOverview: Starting to load dashboard data...');
            
            // Get real user data
            const { getCurrentUser, onAuthStateChange } = await import('/firebase/auth.js');
            const { getProducts, getUserProfile } = await import('/firebase/firestore.js');
            
            console.log('BusinessDashboardOverview: Firebase modules imported successfully');
            
            // Wait for authentication to be established
            const currentUser = getCurrentUser();
            console.log('BusinessDashboardOverview: Current user check:', currentUser ? 'User found' : 'No user');
            
            if (!currentUser) {
                // If no user immediately available, wait for auth state change with shorter timeout
                console.log('BusinessDashboardOverview: No current user, waiting for auth state...');
                return new Promise((resolve) => {
                    const unsubscribe = onAuthStateChange((user) => {
                        console.log('BusinessDashboardOverview: Auth state changed:', user ? 'User authenticated' : 'No user');
                        unsubscribe(); // Stop listening after first change
                        if (user) {
                            this.loadUserData(user);
                        } else {
                            this.showDefaultDashboard();
                        }
                        resolve();
                    });
                    
                    // Shorter timeout - 3 seconds instead of 5
                    setTimeout(() => {
                        console.log('BusinessDashboardOverview: Auth state timeout, showing default dashboard');
                        unsubscribe();
                        this.showDefaultDashboard();
                        resolve();
                    }, 3000);
                });
            }
            
            // User is available, load data
            console.log('BusinessDashboardOverview: User available, loading user data...');
            await this.loadUserData(currentUser);
            
        } catch (error) {
            console.error('BusinessDashboardOverview: Error loading dashboard data:', error);
            this.showDefaultDashboard();
        }
    }
    
    async loadUserData(user) {
        try {
            console.log('BusinessDashboardOverview: Loading user data for user:', user.uid);
            
            // Get user profile
            const { getUserProfile } = await import('/firebase/firestore.js');
            const profileResult = await getUserProfile(user.uid);
            const userProfile = profileResult.success ? profileResult.data : null;
            console.log('BusinessDashboardOverview: User profile loaded:', userProfile ? 'Success' : 'No profile');

            // Get business products
            const { getProducts } = await import('/firebase/firestore.js');
            const productsResult = await getProducts({ sellerId: user.uid });
            const businessProducts = productsResult.success ? productsResult.products : [];
            console.log('BusinessDashboardOverview: Business products loaded:', businessProducts.length, 'products');

            // Calculate real business statistics
            const soldProducts = businessProducts.filter(p => p.status === 'sold');
            const totalSales = soldProducts.reduce((sum, p) => sum + (p.price || 0), 0);
            const totalOrders = soldProducts.length;
            const activeProducts = businessProducts.filter(p => p.status === 'active').length;
            const monthlyRevenue = this.calculateMonthlyRevenue(soldProducts);
            
            console.log('BusinessDashboardOverview: Calculated stats - Sales:', totalSales, 'Orders:', totalOrders, 'Active:', activeProducts, 'Monthly Revenue:', monthlyRevenue);

            // Generate recent activity based on real business data
            const recentActivity = [];
            
            // Add recent sales
            soldProducts.slice(0, 3).forEach(product => {
                recentActivity.push({
                    type: 'sale',
                    title: 'Product Sold',
                    description: product.productName,
                    price: `$${product.price.toFixed(2)}`,
                    time: this.formatTimeAgo(product.updatedAt || product.createdAt)
                });
            });

            // Add recent product additions
            businessProducts.slice(0, 2).forEach(product => {
                recentActivity.push({
                    type: 'product',
                    title: 'Product Added',
                    description: product.productName,
                    price: product.price ? `$${product.price.toFixed(2)}` : 'Listed',
                    time: this.formatTimeAgo(product.createdAt)
                });
            });

            // Sort by date and take the most recent
            recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
            recentActivity.splice(4); // Keep only 4 activities
            
            console.log('BusinessDashboardOverview: Generated', recentActivity.length, 'recent activities');

            const realData = {
                totalSales,
                totalOrders,
                activeProducts,
                monthlyRevenue,
                recentActivity
            };

            console.log('BusinessDashboardOverview: Updating dashboard with real data');
            this.updateDashboardData(realData);
            this.renderChart('7D');
            console.log('BusinessDashboardOverview: Dashboard data loaded successfully');
            
        } catch (error) {
            console.error('BusinessDashboardOverview: Error loading user data:', error);
            // Even if there's an error, show the dashboard with default data
            this.showDefaultDashboard();
        }
    }
    
    calculateMonthlyRevenue(soldProducts) {
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        
        return soldProducts
            .filter(product => {
                const soldDate = new Date(product.updatedAt || product.createdAt);
                return soldDate >= oneMonthAgo;
            })
            .reduce((sum, product) => sum + (product.price || 0), 0);
    }
    
    showLoadingState() {
        const content = this.shadowRoot.querySelector('.dashboard-overview');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem; color: #3468c0;"></i>
                    <h2>Loading Business Dashboard...</h2>
                    <p>Please wait while we load your business data.</p>
                </div>
            `;
        }
    }

    showDefaultDashboard() {
        console.log('BusinessDashboardOverview: Showing default dashboard with charts and structure');
        // Re-render the full dashboard structure
        this.render();
        
        // Longer delay to ensure DOM is ready
        setTimeout(() => {
            console.log('BusinessDashboardOverview: DOM ready, updating with default data');
            // Update with default data
            const defaultData = {
                totalSales: 0,
                totalOrders: 0,
                activeProducts: 0,
                monthlyRevenue: 0,
                recentActivity: [
                    {
                        type: 'revenue',
                        title: 'Business Revenue',
                        description: 'Track your business performance.',
                        price: 0,
                        time: 'Available'
                    }
                ]
            };
            
            this.updateDashboardData(defaultData);
            
            // Additional delay for chart rendering
            setTimeout(() => {
                console.log('BusinessDashboardOverview: Attempting to render chart');
                this.renderChart('7D');
                console.log('BusinessDashboardOverview: Default dashboard setup completed');
            }, 200);
        }, 300);
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'A while ago';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Less than 1 hour ago';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
        
        return date.toLocaleDateString('en-US');
    }

    updateDashboardData(data) {
        try {
            console.log('BusinessDashboardOverview: Updating dashboard data with:', data);
            
            // Update stats with null checks
            const totalSalesElement = this.shadowRoot.getElementById('totalSales');
            const totalOrdersElement = this.shadowRoot.getElementById('totalOrders');
            const activeProductsElement = this.shadowRoot.getElementById('activeProducts');
            const monthlyRevenueElement = this.shadowRoot.getElementById('monthlyRevenue');
            
            if (totalSalesElement) {
                totalSalesElement.textContent = `$${data.totalSales.toFixed(2)}`;
                console.log('BusinessDashboardOverview: Updated total sales');
            } else {
                console.log('BusinessDashboardOverview: Total sales element not found');
            }
            
            if (totalOrdersElement) {
                totalOrdersElement.textContent = data.totalOrders;
                console.log('BusinessDashboardOverview: Updated total orders');
            } else {
                console.log('BusinessDashboardOverview: Total orders element not found');
            }
            
            if (activeProductsElement) {
                activeProductsElement.textContent = data.activeProducts;
                console.log('BusinessDashboardOverview: Updated active products');
            } else {
                console.log('BusinessDashboardOverview: Active products element not found');
            }
            
            if (monthlyRevenueElement) {
                monthlyRevenueElement.textContent = `$${data.monthlyRevenue.toFixed(2)}`;
                console.log('BusinessDashboardOverview: Updated monthly revenue');
            } else {
                console.log('BusinessDashboardOverview: Monthly revenue element not found');
            }

            // Add Business Revenue to the activity list
            const activityWithRevenue = [
                {
                    type: 'revenue',
                    title: 'Business Revenue',
                    description: 'Track your business performance.',
                    price: data.monthlyRevenue,
                    time: 'Available'
                },
                ...data.recentActivity
            ];

            // Update activity list
            const activityList = this.shadowRoot.getElementById('activityList');
            if (activityList) {
                activityList.innerHTML = activityWithRevenue.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon ${activity.type}">
                            <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-desc">${activity.description}</div>
                        </div>
                        <div class="activity-meta">
                            <div class="activity-price">${activity.price}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    </div>
                `).join('');
                console.log('BusinessDashboardOverview: Updated activity list');
            } else {
                console.log('BusinessDashboardOverview: Activity list element not found');
            }
            
            // Update activity summary
            const activityCountElement = this.shadowRoot.getElementById('activityCount');
            if (activityCountElement) {
                activityCountElement.textContent = `Showing latest ${data.recentActivity.length} activities`;
                console.log('BusinessDashboardOverview: Updated activity count');
            } else {
                console.log('BusinessDashboardOverview: Activity count element not found');
            }
            
            console.log('BusinessDashboardOverview: Dashboard data update completed');
        } catch (error) {
            console.error('BusinessDashboardOverview: Error updating dashboard data:', error);
        }
    }

    renderChart(period = '7D') {
        try {
            console.log('BusinessDashboardOverview: Rendering chart for period:', period);
            
            // Load Chart.js if not loaded
            if (!this.shadowRoot.getElementById('chartjs-script')) {
                console.log('BusinessDashboardOverview: Loading Chart.js script');
                const script = document.createElement('script');
                script.id = 'chartjs-script';
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.onload = () => {
                    console.log('BusinessDashboardOverview: Chart.js loaded, drawing chart');
                    setTimeout(() => this._drawChart(period), 100);
                };
                this.shadowRoot.appendChild(script);
            } else {
                console.log('BusinessDashboardOverview: Chart.js already loaded, drawing chart');
                setTimeout(() => this._drawChart(period), 100);
            }

            // Period buttons
            const periods = ['7D', '30D', '90D'];
            periods.forEach(p => {
                const btn = this.shadowRoot.getElementById('btn' + p);
                if (btn) {
                    btn.classList.toggle('active', p === period);
                    btn.onclick = () => this.renderChart(p);
                }
            });
        } catch (error) {
            console.error('BusinessDashboardOverview: Error rendering chart:', error);
        }
    }

    _drawChart(period) {
        try {
            console.log('BusinessDashboardOverview: Attempting to draw chart for period:', period);
            const canvas = this.shadowRoot.getElementById('trendChart');
            if (!canvas) {
                console.error('BusinessDashboardOverview: Canvas element not found');
                console.log('BusinessDashboardOverview: Available elements in shadowRoot:', this.shadowRoot.querySelectorAll('*'));
                
                // Retry after a short delay
                setTimeout(() => {
                    console.log('BusinessDashboardOverview: Retrying chart creation...');
                    this._drawChart(period);
                }, 200);
                return;
            }
            console.log('BusinessDashboardOverview: Canvas element found, proceeding with chart creation');
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('BusinessDashboardOverview: Could not get canvas context');
                return;
            }
            
            if (this._chartInstance) {
                this._chartInstance.destroy();
            }
            
            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.error('BusinessDashboardOverview: Chart.js not available');
                return;
            }
            
            // Sample data for each period
            const dataMap = {
                '7D': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    sales: [1200, 1900, 3000, 4000, 5000, 7000, 6000],
                    revenue: [800, 1100, 2500, 3000, 4000, 5500, 4500]
                },
                '30D': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    sales: Array.from({length: 30}, () => Math.floor(Math.random()*5000 + 1000)),
                    revenue: Array.from({length: 30}, () => Math.floor(Math.random()*4000 + 800))
                },
                '90D': {
                    labels: Array.from({length: 90}, (_, i) => `Day ${i+1}`),
                    sales: Array.from({length: 90}, () => Math.floor(Math.random()*5000 + 1000)),
                    revenue: Array.from({length: 90}, () => Math.floor(Math.random()*4000 + 800))
                }
            };
            const chartData = dataMap[period];
            this._chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Sales',
                            data: chartData.sales,
                            borderColor: '#3468c0',
                            backgroundColor: 'rgba(52,104,192,0.08)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#3468c0',
                            pointRadius: 5,
                            borderWidth: 3
                        },
                        {
                            label: 'Revenue',
                            data: chartData.revenue,
                            borderColor: '#ffa424',
                            backgroundColor: 'rgba(255,164,36,0.08)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#ffa424',
                            pointRadius: 5,
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#1e293b',
                                font: { size: 14, weight: 'bold' }
                            }
                        },
                        tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false,
                        axis: 'x'
                    },
                    scales: {
                        x: {
                            ticks: { color: '#64748b', font: { size: 13 } },
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#64748b', font: { size: 13 } },
                            grid: { color: '#e2e8f0' }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutElastic'
                    }
                }
            });

            // Interactive animation on click/tap
            if (canvas) {
                canvas.onclick = () => {
                    this._chartInstance.options.animation = {
                        duration: 1200,
                        easing: 'easeInOutBounce'
                    };
                    this._chartInstance.update();
                };
                // For touch devices
                canvas.ontouchstart = () => {
                    this._chartInstance.options.animation = {
                        duration: 1200,
                        easing: 'easeInOutBounce'
                    };
                    this._chartInstance.update();
                };
            }
        } catch (error) {
            console.error('BusinessDashboardOverview: Error drawing chart:', error);
        }
    }

    getActivityIcon(type) {
        const icons = {
            sale: 'dollar-sign',
            order: 'shopping-bag',
            product: 'box',
            revenue: 'chart-line'
        };
        return icons[type] || 'info-circle';
    }
}

customElements.define('business-dashboard-overview', BusinessDashboardOverview); 