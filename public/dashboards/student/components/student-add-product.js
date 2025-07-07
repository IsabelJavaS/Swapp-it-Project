// Student Add Product Component
class StudentAddProduct extends HTMLElement {
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
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0;
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

                /* Transaction Type Selection */
                .transaction-type {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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

                .type-icon.sale {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .type-icon.trade {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
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
                    cursor: pointer;
                    background: #f9fafb;
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
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                    margin: 0 auto 1rem;
                }

                .upload-text {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .upload-hint {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
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

                .preview-item img {
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
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    transition: all 0.2s ease;
                }

                .remove-image:hover {
                    background: rgba(239, 68, 68, 0.9);
                }

                /* Form Actions */
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #e5e7eb;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading {
                    display: none;
                }

                .loading.show {
                    display: inline-block;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .transaction-type {
                        grid-template-columns: 1fr;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .section-header h1 {
                        font-size: 1.5rem;
                    }
                }
            </style>

            <div class="add-product-container">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Add New Product</h1>
                    <p>List your product for sale or trade with other students.</p>
                </div>

                <!-- Form Card -->
                <div class="form-card">
                    <form id="addProductForm">
                        <!-- Transaction Type -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <i class="fas fa-exchange-alt"></i>
                                Transaction Type
                            </h3>
                            <div class="transaction-type">
                                <label class="type-option">
                                    <input type="radio" name="transactionType" value="sale" checked>
                                    <div class="type-card">
                                        <div class="type-icon sale">
                                            <i class="fas fa-dollar-sign"></i>
                                        </div>
                                        <div class="type-title">For Sale</div>
                                        <div class="type-description">Sell your product for money</div>
                                    </div>
                                </label>
                                <label class="type-option">
                                    <input type="radio" name="transactionType" value="trade">
                                    <div class="type-card">
                                        <div class="type-icon trade">
                                            <i class="fas fa-exchange-alt"></i>
                                        </div>
                                        <div class="type-title">For Trade</div>
                                        <div class="type-description">Exchange for another product</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Product Information -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <i class="fas fa-box"></i>
                                Product Information
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
                                        <option value="electronics">Electronics</option>
                                        <option value="books">Books</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="sports">Sports & Fitness</option>
                                        <option value="beauty">Beauty & Health</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Condition</label>
                                    <select class="form-select" name="condition" required>
                                        <option value="">Select Condition</option>
                                        <option value="new">New</option>
                                        <option value="like-new">Like New</option>
                                        <option value="excellent">Excellent</option>
                                        <option value="good">Good</option>
                                        <option value="fair">Fair</option>
                                        <option value="poor">Poor</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Brand</label>
                                    <input type="text" class="form-input" name="brand" required>
                                </div>
                                <div class="form-group full-width">
                                    <label class="form-label required">Description</label>
                                    <textarea class="form-textarea" name="description" placeholder="Describe your product in detail..." required></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Pricing -->
                        <div class="form-section" id="pricingSection">
                            <h3 class="section-title">
                                <i class="fas fa-tag"></i>
                                Pricing
                            </h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">Price ($)</label>
                                    <input type="number" class="form-input" name="price" min="0" step="0.01" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Original Price ($)</label>
                                    <input type="number" class="form-input" name="originalPrice" min="0" step="0.01">
                                </div>
                            </div>
                        </div>

                        <!-- Trade Preferences -->
                        <div class="form-section" id="tradeSection" style="display: none;">
                            <h3 class="section-title">
                                <i class="fas fa-handshake"></i>
                                Trade Preferences
                            </h3>
                            <div class="form-group full-width">
                                <label class="form-label">What would you like to trade for?</label>
                                <textarea class="form-textarea" name="tradePreferences" placeholder="Describe what you're looking for in exchange..."></textarea>
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
                                <div class="upload-text">Upload Product Images</div>
                                <div class="upload-hint">Drag and drop images here or click to browse</div>
                                <input type="file" id="imageInput" multiple accept="image/*" style="display: none;">
                            </div>
                            <div class="image-preview" id="imagePreview"></div>
                        </div>

                        <!-- Contact Information -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <i class="fas fa-phone"></i>
                                Contact Information
                            </h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">Phone Number</label>
                                    <input type="tel" class="form-input" name="phone" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Location</label>
                                    <input type="text" class="form-input" name="location" placeholder="Campus or area">
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" id="cancelBtn">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">
                                <i class="fas fa-plus"></i>
                                <span>Add Product</span>
                                <i class="fas fa-spinner fa-spin loading" id="loadingIcon"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.shadowRoot.getElementById('addProductForm');
        const transactionTypeInputs = this.shadowRoot.querySelectorAll('input[name="transactionType"]');
        const pricingSection = this.shadowRoot.getElementById('pricingSection');
        const tradeSection = this.shadowRoot.getElementById('tradeSection');
        const imageUpload = this.shadowRoot.getElementById('imageUpload');
        const imageInput = this.shadowRoot.getElementById('imageInput');
        const imagePreview = this.shadowRoot.getElementById('imagePreview');
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn');

        // Transaction type change
        transactionTypeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.value === 'sale') {
                    pricingSection.style.display = 'block';
                    tradeSection.style.display = 'none';
                } else {
                    pricingSection.style.display = 'none';
                    tradeSection.style.display = 'block';
                }
            });
        });

        // Image upload
        imageUpload.addEventListener('click', () => {
            imageInput.click();
        });

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
            const files = e.dataTransfer.files;
            this.handleImageFiles(files);
        });

        imageInput.addEventListener('change', (e) => {
            this.handleImageFiles(e.target.files);
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? All data will be lost.')) {
                form.reset();
                imagePreview.innerHTML = '';
            }
        });
    }

    handleImageFiles(files) {
        const imagePreview = this.shadowRoot.getElementById('imagePreview');
        
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    imagePreview.appendChild(previewItem);

                    // Remove image functionality
                    previewItem.querySelector('.remove-image').addEventListener('click', () => {
                        previewItem.remove();
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async handleFormSubmission() {
        const submitBtn = this.shadowRoot.getElementById('submitBtn');
        const loadingIcon = this.shadowRoot.getElementById('loadingIcon');
        const form = this.shadowRoot.getElementById('addProductForm');

        try {
            // Show loading state
            submitBtn.disabled = true;
            loadingIcon.classList.add('show');

            // Collect form data
            const formData = new FormData(form);
            const productData = {
                transactionType: formData.get('transactionType'),
                productName: formData.get('productName'),
                category: formData.get('category'),
                condition: formData.get('condition'),
                brand: formData.get('brand'),
                description: formData.get('description'),
                price: formData.get('transactionType') === 'sale' ? parseFloat(formData.get('price')) : null,
                originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                tradePreferences: formData.get('transactionType') === 'trade' ? formData.get('tradePreferences') : null,
                phone: formData.get('phone'),
                location: formData.get('location'),
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success
            alert('Product added successfully!');
            form.reset();
            this.shadowRoot.getElementById('imagePreview').innerHTML = '';

        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            loadingIcon.classList.remove('show');
        }
    }
}

customElements.define('student-add-product', StudentAddProduct); 