// Componente web para ventas del estudiante
class StudentSales extends HTMLElement {
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
                .sales-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 800px; margin: 2rem auto; }
                .sales-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #3468c0; }
                .sales-list { display: grid; gap: 1.5rem; }
                .sale-card { background: #f8fafc; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1)); display: flex; align-items: center; gap: 1.5rem; }
                .sale-img { width: 60px; height: 60px; border-radius: 12px; background: #e2e8f0; object-fit: cover; }
                .sale-info { flex: 1; }
                .sale-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
                .sale-meta { color: #718096; font-size: 0.95rem; }
                .sale-date { color: #3468c0; font-size: 0.9rem; }
            </style>
            <div class="sales-container">
                <div class="sales-header">My Sales</div>
                <div class="sales-list">
                    <div class="sale-card">
                        <img class="sale-img" src="https://via.placeholder.com/60" alt="Sale" />
                        <div class="sale-info">
                            <div class="sale-title">Physics Book</div>
                            <div class="sale-meta">Buyer: Ana Lopez</div>
                            <div class="sale-date">Sold: 2024-06-02</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('student-sales', StudentSales); 