// Business Add Product Component
class BusinessAddProduct extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.imageFiles = []; // Store image files for upload
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

        // Clear previous files
        this.imageFiles = [];

        Array.from(files).slice(0, maxFiles).forEach(file => {
            if (file.size > maxSize) {
                alert('File too large. Maximum size is 5MB.');
                return;
            }

            // Store file for later upload
            this.imageFiles.push(file);

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
                    // Remove file from array
                    const index = this.imageFiles.indexOf(file);
                    if (index > -1) {
                        this.imageFiles.splice(index, 1);
                    }
                });

                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    async handleFormSubmission() {
        const submitBtn = this.shadowRoot.getElementById('submitBtn');
        const form = this.shadowRoot.getElementById('addProductForm');
        const imagePreview = this.shadowRoot.getElementById('imagePreview');

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Product...';

            // Get current user
            let currentUser;
            try {
                const { getCurrentUser } = await import('/firebase/auth.js');
                currentUser = getCurrentUser();
            } catch (error) {
                this.showErrorNotification('Authentication error', 'Could not verify user. Please log in again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            if (!currentUser) {
                this.showErrorNotification('Not authenticated', 'You must be logged in to add a product.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            // Collect form data
            const formData = new FormData(form);
            const productType = formData.get('productType');
            if (!productType) {
                this.showErrorNotification('Missing type', 'Please select a product type.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            // Validate required fields
            const requiredFields = ['productName', 'category', 'price', 'description'];
            for (const field of requiredFields) {
                if (!formData.get(field)?.trim()) {
                    this.showErrorNotification('Missing field', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                    return;
                }
            }

            // Get image files from preview
            const imageFiles = this.imageFiles;
            if (imageFiles.length === 0) {
                this.showErrorNotification('No images', 'Please upload at least one product image.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            // Prepare product data
            const productData = {
                sellerId: currentUser.uid,
                sellerEmail: currentUser.email,
                sellerDisplayName: currentUser.displayName || currentUser.email,
                sellerType: 'business',
                transactionType: 'sale', // Business products are always for sale
                productType: productType,
                productName: formData.get('productName').trim(),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')) || 1,
                description: formData.get('description').trim(),
                images: [],
                imageCount: 0,
                status: 'active',
                views: 0,
                favorites: 0,
                rating: 0,
                reviewCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Import Firebase functions
            let addProduct, uploadProductImages, updateProduct;
            try {
                ({ addProduct } = await import('/firebase/firestore.js'));
                ({ uploadProductImages } = await import('/firebase/storage.js'));
                ({ updateProduct } = await import('/firebase/firestore.js'));
            } catch (error) {
                this.showErrorNotification('Firebase error', 'Could not load Firebase functions.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            // First, create the product document to get the product ID
            const productResult = await addProduct(productData);
            if (!productResult.success) {
                this.showErrorNotification('Error creating product', productResult.error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                return;
            }

            const productId = productResult.productId;

            // Upload images if we have them
            let imageUploadResult = { success: false, images: [] };
            if (imageFiles.length > 0) {
                imageUploadResult = await uploadProductImages(
                    imageFiles,
                    productId,
                    'sale', // Business products are always for sale
                    formData.get('category')
                );
                if (!imageUploadResult.success) {
                    this.showErrorNotification('Image upload failed', imageUploadResult.error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                    return;
                }

                // Update product with image URLs
                const updateResult = await updateProduct(productId, {
                    images: imageUploadResult.images,
                    imageCount: imageUploadResult.images.length,
                    updatedAt: new Date().toISOString()
                });
                if (!updateResult.success) {
                    this.showErrorNotification('Product created but image URLs could not be updated', updateResult.error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
                    return;
                }
            }

            // Show success notification
            this.showSuccessNotification('Product added successfully!', 'Your product has been uploaded and is now available in the marketplace.');

            // Reset form and preview
            form.reset();
            imagePreview.innerHTML = '';
            this.imageFiles = [];

        } catch (error) {
            this.showErrorNotification('Error', error.message || 'An error occurred while adding the product.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
        }
    }

    showSuccessNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast success';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    showErrorNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast error';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-exclamation-circle"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

customElements.define('business-add-product', BusinessAddProduct); 