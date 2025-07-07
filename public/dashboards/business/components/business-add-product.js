// Business Add Product Component
class BusinessAddProduct extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.formData = new FormData();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                :host { display: block; font-family: 'Inter', sans-serif; }
                .add-product-container { max-width: 800px; margin: 0 auto; padding: 0; }
                .section-header { margin-bottom: 2rem; }
                .section-header h1 { font-size: 2rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
                .section-header p { color: #64748b; font-size: 1rem; margin: 0; }
                .form-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); }
                .form-section { margin-bottom: 2rem; }
                .form-section:last-child { margin-bottom: 0; }
                .section-title { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; }
                .section-title i { color: #3468c0; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-label { font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
                .form-label.required::after { content: ' *'; color: #ef4444; }
                .form-input, .form-select, .form-textarea { padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: inherit; transition: all 0.2s ease; background: white; }
                .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #3468c0; box-shadow: 0 0 0 3px rgba(52,104,192,0.1); }
                .form-textarea { resize: vertical; min-height: 120px; }
                .form-input.error, .form-select.error, .form-textarea.error { border-color: #ef4444; }
                .error-message { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
                .form-actions { display: flex; justify-content: flex-end; gap: 1rem; }
                .submit-btn { background: linear-gradient(90deg, #3468c0, #ffa424); color: white; border: none; border-radius: 8px; padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .submit-btn:hover { background: linear-gradient(90deg, #1d4ed8, #ffa424); }
            </style>
            <div class="add-product-container">
                <div class="section-header">
                    <h1>Add Product</h1>
                    <p>Add a new product to your business store. Fill in the details below.</p>
                </div>
                <div class="form-card">
                    <form id="addProductForm">
                        <div class="form-section">
                            <div class="section-title"><i class="fas fa-box"></i> Product Details</div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">Product Name</label>
                                    <input type="text" class="form-input" name="name" required />
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Category</label>
                                    <input type="text" class="form-input" name="category" required />
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Price</label>
                                    <input type="number" class="form-input" name="price" min="0" step="0.01" required />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Stock</label>
                                    <input type="number" class="form-input" name="stock" min="0" />
                                </div>
                                <div class="form-group full-width">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-textarea" name="description"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="section-title"><i class="fas fa-image"></i> Product Images</div>
                            <input type="file" name="images" accept="image/*" multiple />
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">Add Product</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.shadowRoot.getElementById('addProductForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Aquí iría la lógica para enviar el producto a la base de datos
                alert('Product added! (demo)');
            });
        }
    }
}
customElements.define('business-add-product', BusinessAddProduct); 