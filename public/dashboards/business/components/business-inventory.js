// Componente web para inventario de empresa
class BusinessInventory extends HTMLElement {
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
                .inventory-container { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 2rem; max-width: 900px; margin: 2rem auto; }
                .inventory-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #764ba2; }
                .product-list { display: grid; gap: 1.5rem; }
                .product-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1.5rem; }
                .product-img { width: 80px; height: 80px; border-radius: 12px; background: #e2e8f0; object-fit: cover; }
                .product-info { flex: 1; }
                .product-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .product-meta { color: #718096; font-size: 0.95rem; }
                .btn { padding: 0.5rem 1.25rem; border-radius: 8px; border: none; background: #764ba2; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-left: 1rem; }
                .btn:hover { background: #667eea; }
            </style>
            <div class="inventory-container">
                <div class="inventory-header">Inventario de Productos</div>
                <div class="product-list">
                    <div class="product-card">
                        <img class="product-img" src="https://via.placeholder.com/80" alt="Producto" />
                        <div class="product-info">
                            <div class="product-title">Pack de Cuadernos</div>
                            <div class="product-meta">Stock: 120 | Precio: $5.00</div>
                        </div>
                        <button class="btn">Editar</button>
                        <button class="btn">Eliminar</button>
                    </div>
                    <div class="product-card">
                        <img class="product-img" src="https://via.placeholder.com/80" alt="Producto" />
                        <div class="product-info">
                            <div class="product-title">Caja de Lápices</div>
                            <div class="product-meta">Stock: 200 | Precio: $2.50</div>
                        </div>
                        <button class="btn">Editar</button>
                        <button class="btn">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('business-inventory', BusinessInventory); 