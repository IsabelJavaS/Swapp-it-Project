// Business Dashboard Overview Component
class BusinessDashboardOverview extends HTMLElement {
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
                :host { display: block; font-family: 'Inter', sans-serif; }
                .dashboard-overview { padding: 0; }
                .section-header { margin-bottom: 2rem; }
                .section-header h1 { font-size: 2rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
                .section-header p { color: #64748b; font-size: 1rem; margin: 0; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .stat-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); transition: all 0.3s ease; position: relative; overflow: hidden; }
                .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3468c0, #ffa424); border-radius: 16px 16px 0 0; }
                .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
                .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
                .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: white; }
                .stat-icon.sales { background: linear-gradient(135deg, #3468c0, #1d4ed8); }
                .stat-icon.income { background: linear-gradient(135deg, #ffa424, #ff8c00); }
                .stat-icon.products { background: linear-gradient(135deg, #10b981, #059669); }
                .stat-icon.visits { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
                .stat-value { text-align: right; }
                .stat-number { font-size: 2rem; font-weight: 700; color: #1e293b; line-height: 1; margin-bottom: 0.25rem; }
                .stat-label { font-size: 0.875rem; color: #64748b; font-weight: 500; }
                .stat-change { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 600; margin-top: 0.5rem; }
                .stat-change.positive { color: #10b981; }
                .stat-change.negative { color: #ef4444; }
                .stat-change.neutral { color: #64748b; }
                .charts-section { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                .chart-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); }
                .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
                .chart-title { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin: 0; }
                .chart-period { display: flex; gap: 0.5rem; }
                .period-btn { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; background: white; border-radius: 8px; font-size: 0.875rem; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s ease; }
                .period-btn.active { background: #3468c0; color: white; border-color: #3468c0; }
            </style>
            <div class="dashboard-overview">
                <div class="section-header">
                    <h1>Business Overview</h1>
                    <p>Monitor your store's performance, sales, and analytics at a glance.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon sales"><i class="fas fa-shopping-cart"></i></div>
                            <div class="stat-value">
                                <div class="stat-number" id="salesCount">0</div>
                                <div class="stat-label">Sales</div>
                            </div>
                        </div>
                        <div class="stat-change positive"><i class="fas fa-arrow-up"></i> +12% this month</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon income"><i class="fas fa-dollar-sign"></i></div>
                            <div class="stat-value">
                                <div class="stat-number" id="income">$0</div>
                                <div class="stat-label">Income</div>
                            </div>
                        </div>
                        <div class="stat-change positive"><i class="fas fa-arrow-up"></i> +8% this month</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon products"><i class="fas fa-box"></i></div>
                            <div class="stat-value">
                                <div class="stat-number" id="productsCount">0</div>
                                <div class="stat-label">Products</div>
                            </div>
                        </div>
                        <div class="stat-change neutral"><i class="fas fa-minus"></i> Stable</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon visits"><i class="fas fa-chart-line"></i></div>
                            <div class="stat-value">
                                <div class="stat-number" id="visits">0</div>
                                <div class="stat-label">Visits</div>
                            </div>
                        </div>
                        <div class="stat-change positive"><i class="fas fa-arrow-up"></i> +20% this month</div>
                    </div>
                </div>
                <div class="charts-section">
                    <div class="chart-card">
                        <div class="chart-header">
                            <div class="chart-title">Sales Trend</div>
                            <div class="chart-period">
                                <button class="period-btn active">Month</button>
                                <button class="period-btn">Week</button>
                                <button class="period-btn">Day</button>
                            </div>
                        </div>
                        <div style="height: 180px; display: flex; align-items: center; justify-content: center; color: #64748b;">[Sales Chart Placeholder]</div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-header">
                            <div class="chart-title">Top Products</div>
                        </div>
                        <div style="height: 180px; display: flex; align-items: center; justify-content: center; color: #64748b;">[Top Products Chart Placeholder]</div>
                    </div>
                </div>
            </div>
        `;
    }

    loadDashboardData() {
        // Placeholder: Aquí iría la lógica para cargar datos reales
    }
}
customElements.define('business-dashboard-overview', BusinessDashboardOverview); 