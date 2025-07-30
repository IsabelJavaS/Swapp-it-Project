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

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .add-product-container {
                    padding: 0.5rem 3rem 0.5rem 3rem;
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

                .form-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .form-section {
                    margin-bottom: 2rem;
                }

                .form-section:last-child {
                    margin-bottom: 0;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 1rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-title i {
                    color: #3468c0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .form-label.required::after {
                    content: ' *';
                    color: #ef4444;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    background: white;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #3468c0;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 120px;
                }

                .form-input.error,
                .form-select.error,
                .form-textarea.error {
                    border-color: #ef4444;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }

                /* Product Type Selection */
                .product-type {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .type-option {
                    position: relative;
                    cursor: pointer;
                }

                .type-option input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                }

                .type-card {
                    padding: 1.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.2s ease;
                    background: white;
                }

                .type-option input[type="radio"]:checked + .type-card {
                    border-color: #3468c0;
                    background: linear-gradient(135deg, rgba(52, 104, 192, 0.05), rgba(52, 104, 192, 0.1));
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.15);
                }

                .type-card:hover {
                    border-color: #3468c0;
                    transform: translateY(-2px);
                }

                .type-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                    margin: 0 auto 1rem;
                }

                .type-icon.physical {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .type-icon.digital {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .type-icon.service {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .type-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .type-description {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                }

                /* Image Upload */
                .image-upload {
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                    cursor: pointer;
                }

                .image-upload:hover {
                    border-color: #3468c0;
                    background: rgba(52, 104, 192, 0.05);
                }

                .image-upload.dragover {
                    border-color: #3468c0;
                    background: rgba(52, 104, 192, 0.1);
                }

                .upload-icon {
                    font-size: 2rem;
                    color: #9ca3af;
                    margin-bottom: 1rem;
                }

                .upload-text {
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }

                .upload-hint {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }

                .image-preview {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .preview-item {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    aspect-ratio: 1;
                }

                .preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .remove-image {
                    position: absolute;
                    top: 0.25rem;
                    right: 0.25rem;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                }

                /* Submit Button */
                .submit-section {
                    text-align: center;
                    margin-top: 2rem;
                }

                .submit-btn {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(52, 104, 192, 0.3);
                }

                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .add-product-container {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .product-type {
                        grid-template-columns: 1fr;
                    }

                    .form-card {
                        padding: 1.5rem;
                    }
                }
            </style>

            <div class="add-product-container">
                <div class="section-header">
                    <h1>Add New Product</h1>
                    <p>Create a new product listing for your business</p>
                </div>

                <form class="form-card" id="addProductForm">
                    <!-- Product Type Selection -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-tag"></i>
                            Product Type
                        </h3>
                        <div class="product-type">
                            <label class="type-option">
                                <input type="radio" name="productType" value="physical" required>
                                <div class="type-card">
                                    <div class="type-icon physical">
                                        <i class="fas fa-box"></i>
                                    </div>
                                    <div class="type-title">Physical Product</div>
                                    <div class="type-description">Tangible items that can be shipped</div>
                                </div>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="productType" value="digital" required>
                                <div class="type-card">
                                    <div class="type-icon digital">
                                        <i class="fas fa-download"></i>
                                    </div>
                                    <div class="type-title">Digital Product</div>
                                    <div class="type-description">Software, ebooks, or digital files</div>
                                </div>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="productType" value="service" required>
                                <div class="type-card">
                                    <div class="type-icon service">
                                        <i class="fas fa-cogs"></i>
                                    </div>
                                    <div class="type-title">Service</div>
                                    <div class="type-description">Professional services or consulting</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Basic Information -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-info-circle"></i>
                            Basic Information
                        </h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label required">Product Name</label>
                                <input type="text" class="form-input" name="productName" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label required">Category</label>
                                        <select class="form-select" name="category" required>
            <option value="">Select Category</option>
            <option value="accessories">Accessories</option>
            <option value="books">Books</option>
            <option value="category-art">Art</option>
            <option value="electronics">Electronics</option>
            <option value="notebooks">Notebooks</option>
            <option value="school-bags">School Bags</option>
            <option value="shoes">Shoes</option>
            <option value="sports">Sports</option>
            <option value="stationery">Stationery</option>
            <option value="uniforms">Uniforms</option>
        </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label required">Price</label>
                                <input type="number" class="form-input" name="price" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Stock Quantity</label>
                                <input type="number" class="form-input" name="stock" min="0" value="1">
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label class="form-label required">Description</label>
                            <textarea class="form-textarea" name="description" required placeholder="Describe your product in detail..."></textarea>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-images"></i>
                            Product Images
                        </h3>
                        <div class="image-upload" id="imageUpload">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div class="upload-text">Drag and drop images here or click to browse</div>
                            <div class="upload-hint">Maximum 5 images, 5MB each</div>
                            <input type="file" id="imageInput" multiple accept="image/*" style="display: none;">
                        </div>
                        <div class="image-preview" id="imagePreview"></div>
                    </div>

                    <!-- Submit -->
                    <div class="submit-section">
                        <button type="submit" class="submit-btn" id="submitBtn">
                            <i class="fas fa-plus"></i>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.shadowRoot.getElementById('addProductForm');
        const imageUpload = this.shadowRoot.getElementById('imageUpload');
        const imageInput = this.shadowRoot.getElementById('imageInput');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        imageUpload.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            this.handleImageFiles(e.target.files);
        });

        // Drag and drop functionality
        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('dragover');
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('dragover');
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('dragover');
            this.handleImageFiles(e.dataTransfer.files);
        });
    }

    handleImageFiles(files) {
        const preview = this.shadowRoot.getElementById('imagePreview');
        const maxFiles = 5;
        const maxSize = 5 * 1024 * 1024; // 5MB

        Array.from(files).slice(0, maxFiles).forEach(file => {
            if (file.size > maxSize) {
                alert('File too large. Maximum size is 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" class="preview-image" alt="Preview">
                    <button type="button" class="remove-image">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                previewItem.querySelector('.remove-image').addEventListener('click', () => {
                    previewItem.remove();
                });

                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    async handleFormSubmission() {
        const submitBtn = this.shadowRoot.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Product...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            alert('Product added successfully!');
            
            // Reset form
            this.shadowRoot.getElementById('addProductForm').reset();
            this.shadowRoot.getElementById('imagePreview').innerHTML = '';
            
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
        }
    }
}

customElements.define('business-add-product', BusinessAddProduct); 