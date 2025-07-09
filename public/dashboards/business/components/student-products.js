// Componente web para productos del estudiante
class StudentProducts extends HTMLElement {
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
                .products-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 900px; margin: 2rem auto; }
                .products-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #3468c0; }
                .product-list { display: grid; gap: 1.5rem; }
                .product-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1)); display: flex; align-items: center; gap: 1.5rem; }
                .product-img { width: 80px; height: 80px; border-radius: 12px; background: #e2e8f0; object-fit: cover; }
                .product-info { flex: 1; }
                .product-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .product-meta { color: #718096; font-size: 0.95rem; }
                .btn { padding: 0.5rem 1.25rem; border-radius: 8px; border: none; background: #3468c0; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-left: 1rem; }
                .btn:hover { background: #1d4ed8; }
            </style>
            <div class="products-container">
                <div class="products-header">My Products</div>
                <div class="product-list">
                    <div class="product-card">
                        <img class="product-img" src="https://via.placeholder.com/80" alt="Product" />
                        <div class="product-info">
                            <div class="product-title">Math Book</div>
                            <div class="product-meta">Category: Books | Condition: Like new</div>
                        </div>
                        <button class="btn">Edit</button>
                        <button class="btn">Delete</button>
                    </div>
                    <div class="product-card">
                        <img class="product-img" src="https://via.placeholder.com/80" alt="Product" />
                        <div class="product-info">
                            <div class="product-title">School Backpack</div>
                            <div class="product-meta">Category: Backpacks | Condition: Good</div>
                        </div>
                        <button class="btn">Edit</button>
                        <button class="btn">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('student-products', StudentProducts); 