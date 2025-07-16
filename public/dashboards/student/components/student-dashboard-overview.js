// Student Dashboard Overview Component
class StudentDashboardOverview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadDashboardData();
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

                .dashboard-overview {
                    padding: 0;
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

                /* Stats Cards */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
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

                .stat-icon.purchases {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .stat-icon.products {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .stat-icon.balance {
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
                }

                .chart-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
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
                    height: 300px;
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

                .activity-icon.purchase {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .activity-icon.product {
                    background: linear-gradient(135deg, #10b981, #059669);
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
                @media (max-width: 1024px) {
                    .charts-section {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .section-header h1 {
                        font-size: 1.5rem;
                    }
                }
            </style>

            <div class="dashboard-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with your account.</p>
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
                            <span>+12.5%</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon purchases">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="totalPurchases">$0</div>
                                <div class="stat-label">Total Purchases</div>
                            </div>
                        </div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+8.3%</span>
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
                            <div class="stat-icon balance">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="stat-value">
                                <div class="stat-number" id="swapcoinBalance">0</div>
                                <div class="stat-label">SWAPPIT Coins</div>
                            </div>
                        </div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+15.2%</span>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">Sales & Purchases Trend</h3>
                            <div class="chart-period">
                                <button class="period-btn active" id="btn7D">7D</button>
                                <button class="period-btn" id="btn30D">30D</button>
                                <button class="period-btn" id="btn90D">90D</button>
                            </div>
                        </div>
                        <div style="height: 300px;">
                            <canvas id="trendChart" width="100%" height="100%"></canvas>
                        </div>
                    </div>
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3 class="activity-title">Recent Activity</h3>
                            <a href="#" class="view-all-btn">View All</a>
                        </div>
                        <div class="activity-list" id="activityList">
                            <!-- Activity items will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadDashboardData() {
        try {
            // Simulate loading dashboard data
            // In a real app, this would fetch from Firebase
            const mockData = {
                totalSales: 1250.00,
                totalPurchases: 890.50,
                activeProducts: 12,
                swapcoinBalance: 1250,
                recentActivity: [
                    {
                        type: 'sale',
                        title: 'Product Sold',
                        description: 'iPhone 12 Pro Max sold to John Doe',
                        price: '$450.00',
                        time: '2 hours ago'
                    },
                    {
                        type: 'purchase',
                        title: 'Product Purchased',
                        description: 'MacBook Air 2020 from TechStore',
                        price: '$850.00',
                        time: '1 day ago'
                    },
                    {
                        type: 'product',
                        title: 'Product Added',
                        description: 'New product "Gaming Laptop" added',
                        price: 'Listed',
                        time: '2 days ago'
                    }
                ]
            };

            this.updateDashboardData(mockData);
            this.renderChart('7D');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateDashboardData(data) {
        // Update stats
        this.shadowRoot.getElementById('totalSales').textContent = `$${data.totalSales.toFixed(2)}`;
        this.shadowRoot.getElementById('totalPurchases').textContent = `$${data.totalPurchases.toFixed(2)}`;
        this.shadowRoot.getElementById('activeProducts').textContent = data.activeProducts;
        this.shadowRoot.getElementById('swapcoinBalance').textContent = data.swapcoinBalance;

        // Update activity list
        const activityList = this.shadowRoot.getElementById('activityList');
        activityList.innerHTML = data.recentActivity.map(activity => `
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
    }

    renderChart(period = '7D') {
        // Cargar Chart.js si no está cargado
        if (!this.shadowRoot.getElementById('chartjs-script')) {
            const script = document.createElement('script');
            script.id = 'chartjs-script';
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this._drawChart(period);
            this.shadowRoot.appendChild(script);
        } else {
            this._drawChart(period);
        }

        // Botones de periodo
        const periods = ['7D', '30D', '90D'];
        periods.forEach(p => {
            const btn = this.shadowRoot.getElementById('btn' + p);
            if (btn) {
                btn.classList.toggle('active', p === period);
                btn.onclick = () => this.renderChart(p);
            }
        });
    }

    _drawChart(period) {
        const ctx = this.shadowRoot.getElementById('trendChart').getContext('2d');
        if (this._chartInstance) {
            this._chartInstance.destroy();
        }
        // Datos de ejemplo para cada periodo
        const dataMap = {
            '7D': {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                sales:   [12, 19, 3, 4, 5, 7, 10],
                purchases: [8, 11, 5, 6, 4, 3, 8]
            },
            '30D': {
                labels: Array.from({length: 30}, (_, i) => `Día ${i+1}`),
                sales: Array.from({length: 30}, () => Math.floor(Math.random()*20)),
                purchases: Array.from({length: 30}, () => Math.floor(Math.random()*15))
            },
            '90D': {
                labels: Array.from({length: 90}, (_, i) => `Día ${i+1}`),
                sales: Array.from({length: 90}, () => Math.floor(Math.random()*20)),
                purchases: Array.from({length: 90}, () => Math.floor(Math.random()*15))
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
                        label: 'Purchases',
                        data: chartData.purchases,
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

        // Animación interactiva al hacer click/tap
        const canvas = this.shadowRoot.getElementById('trendChart');
        if (canvas) {
            canvas.onclick = () => {
                this._chartInstance.options.animation = {
                    duration: 1200,
                    easing: 'easeInOutBounce'
                };
                this._chartInstance.update();
            };
            // Para dispositivos táctiles
            canvas.ontouchstart = () => {
                this._chartInstance.options.animation = {
                    duration: 1200,
                    easing: 'easeInOutBounce'
                };
                this._chartInstance.update();
            };
        }
    }

    getActivityIcon(type) {
        const icons = {
            sale: 'dollar-sign',
            purchase: 'shopping-cart',
            product: 'box'
        };
        return icons[type] || 'info-circle';
    }
}

customElements.define('student-dashboard-overview', StudentDashboardOverview); 