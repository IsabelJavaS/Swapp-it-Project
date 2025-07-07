// Componente web para pedidos de empresa
class BusinessOrders extends HTMLElement {
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
                .orders-container { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 2rem; max-width: 900px; margin: 2rem auto; }
                .orders-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #764ba2; }
                .order-list { display: grid; gap: 1.5rem; }
                .order-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1.5rem; }
                .order-info { flex: 1; }
                .order-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .order-meta { color: #718096; font-size: 0.95rem; }
                .order-date { color: #667eea; font-size: 0.9rem; }
                .btn { padding: 0.5rem 1.25rem; border-radius: 8px; border: none; background: #764ba2; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-left: 1rem; }
                .btn:hover { background: #667eea; }
            </style>
            <div class="orders-container">
                <div class="orders-header">Pedidos Recibidos</div>
                <div class="order-list">
                    <div class="order-card">
                        <div class="order-info">
                            <div class="order-title">Pedido #1234</div>
                            <div class="order-meta">Cliente: Juan Pérez | Total: $50.00</div>
                            <div class="order-date">Fecha: 2024-06-01</div>
                        </div>
                        <button class="btn">Ver Detalle</button>
                        <button class="btn">Marcar como Enviado</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('business-orders', BusinessOrders); 