// Overview para negocios
class BusinessDashboardOverview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                    padding: 0.5rem 3rem 0.5rem 3rem;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 16px rgba(52,104,192,0.07);
                    max-width: 1100px;
                    margin: 2rem auto;
                }
                h2 {
                    color: #3468c0;
                    margin-top: 0;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                }
                .stats {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 1.5rem 2rem;
                    flex: 1 1 220px;
                    min-width: 200px;
                    box-shadow: 0 1px 6px rgba(52,104,192,0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .stat-title {
                    color: #64748b;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                .stat-value {
                    color: #1e293b;
                    font-size: 2rem;
                    font-weight: 700;
                }
                .recent-section {
                    margin-top: 2rem;
                }
                .recent-title {
                    color: #3468c0;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                }
                .recent-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .recent-item {
                    background: #f3f4f6;
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #1e293b;
                    font-size: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .recent-item .label {
                    font-weight: 600;
                    color: #3468c0;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .stats {
                        gap: 1rem;
                    }
                    
                    .stat-card {
                        flex: 1 1 180px;
                        min-width: 150px;
                        padding: 1rem 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .stats {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .stat-card {
                        flex: none;
                        min-width: auto;
                    }
                    
                    h2 {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }
                    
                    .stat-card {
                        padding: 1rem;
                    }
                    
                    .recent-item {
                        padding: 0.75rem 1rem;
                        font-size: 0.875rem;
                    }
                }
            </style>
            <h2>Resumen de Negocio</h2>
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-title">Ventas Totales</div>
                    <div class="stat-value">$12,500</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Productos Activos</div>
                    <div class="stat-value">34</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Compras Recientes</div>
                    <div class="stat-value">7</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Notificaciones</div>
                    <div class="stat-value">3</div>
                </div>
            </div>
            <div class="recent-section">
                <div class="recent-title">Últimas Ventas</div>
                <ul class="recent-list">
                    <li class="recent-item"><span class="label">Orden #1023</span>  -  $250  -  12/06/2024</li>
                    <li class="recent-item"><span class="label">Orden #1022</span>  -  $120  -  11/06/2024</li>
                    <li class="recent-item"><span class="label">Orden #1021</span>  -  $480  -  10/06/2024</li>
                </ul>
            </div>
            <div class="recent-section">
                <div class="recent-title">Productos Destacados</div>
                <ul class="recent-list">
                    <li class="recent-item">Camiseta Swappit - Stock: 20</li>
                    <li class="recent-item">Taza Personalizada - Stock: 15</li>
                    <li class="recent-item">Bolígrafo Promocional - Stock: 50</li>
                </ul>
            </div>
        `;
    }
}
customElements.define('business-dashboard-overview', BusinessDashboardOverview); 