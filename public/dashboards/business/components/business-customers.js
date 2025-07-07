// Componente web para clientes de empresa
class BusinessCustomers extends HTMLElement {
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
                .customers-container { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 2rem; max-width: 900px; margin: 2rem auto; }
                .customers-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #764ba2; }
                .customer-list { display: grid; gap: 1.5rem; }
                .customer-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1.5rem; }
                .customer-avatar { width: 48px; height: 48px; border-radius: 50%; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
                .customer-info { flex: 1; }
                .customer-name { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .customer-meta { color: #718096; font-size: 0.95rem; }
                .btn { padding: 0.5rem 1.25rem; border-radius: 8px; border: none; background: #764ba2; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-left: 1rem; }
                .btn:hover { background: #667eea; }
            </style>
            <div class="customers-container">
                <div class="customers-header">Clientes</div>
                <div class="customer-list">
                    <div class="customer-card">
                        <div class="customer-avatar">JP</div>
                        <div class="customer-info">
                            <div class="customer-name">Juan Pérez</div>
                            <div class="customer-meta">Compras: 5 | Total gastado: $250.00</div>
                        </div>
                        <button class="btn">Ver Perfil</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('business-customers', BusinessCustomers); 