// Componente web para compras del estudiante
class StudentPurchases extends HTMLElement {
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
                :host { display: block; font-family: var(--font-family, 'Inter', sans-serif); }
                .purchases-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 800px; margin: 2rem auto; }
                .purchases-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #667eea; }
                .purchase-list { display: grid; gap: 1.5rem; }
                .purchase-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1)); display: flex; align-items: center; gap: 1.5rem; }
                .purchase-img { width: 60px; height: 60px; border-radius: 12px; background: #e2e8f0; object-fit: cover; }
                .purchase-info { flex: 1; }
                .purchase-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .purchase-meta { color: #718096; font-size: 0.95rem; }
                .purchase-date { color: #764ba2; font-size: 0.9rem; }
            </style>
            <div class="purchases-container">
                <div class="purchases-header">Mis Compras</div>
                <div class="purchase-list">
                    <div class="purchase-card">
                        <img class="purchase-img" src="https://via.placeholder.com/60" alt="Compra" />
                        <div class="purchase-info">
                            <div class="purchase-title">Cuaderno Universitario</div>
                            <div class="purchase-meta">Vendedor: Juan Pérez</div>
                            <div class="purchase-date">Comprado: 2024-06-01</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('student-purchases', StudentPurchases); 