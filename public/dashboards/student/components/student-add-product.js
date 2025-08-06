// Student Add Product Component
console.log('=== STUDENT ADD PRODUCT SCRIPT LOADED ===');
console.log('Loading Loading StudentAddProduct component...');
console.log('File File: student-add-product.js loaded');

class StudentAddProduct extends HTMLElement {
    constructor() {
        super();
        console.log('Constructor  StudentAddProduct constructor called');
        this.attachShadow({ mode: 'open' });
        this.imageFiles = []; // Store image files for upload
        console.log('Success StudentAddProduct constructor completed');
    }

    connectedCallback() {
        console.log('Connected StudentAddProduct connectedCallback called');
        this.render();
        this.attachEventListeners();
        console.log('Success StudentAddProduct component loaded successfully');
    }

    render() {
        console.log('Render StudentAddProduct render called');
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                :host {
                    display: block;
                    font-family: var(--font-primary, 'Poppins', sans-serif);
                    background: var(--neutral-light, #f1f5f9);
                }
                .add-product-container {
                    max-width: 700px;
                    margin: 2rem auto 2rem auto;
                    padding: 2rem 1.5rem 2rem 1.5rem;
                    background: var(--background-white, #fff);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(52,104,192,0.10);
                    border: 1.5px solid #e5e7eb;
                    position: relative;
                }
                .section-header {
                    margin-bottom: 2.5rem;
                    text-align: center;
                }
                .section-header h1 {
                    font-size: 2.3rem;
                    font-weight: 800;
                    color: var(--swappit-blue, #3468c0);
                    margin: 0 0 0.5rem 0;
                    letter-spacing: -1px;
                }
                .section-header p {
                    color: var(--neutral-medium, #64748b);
                    font-size: 1.1rem;
                    margin: 0;
                }
                .form-card {
                    background: transparent;
                    border-radius: 18px;
                    padding: 0;
                    box-shadow: none;
                    border: none;
                }
                .form-section {
                    margin-bottom: 2.2rem;
                }
                .form-section:last-child {
                    margin-bottom: 0;
                }
                .section-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--swappit-blue, #3468c0);
                    margin: 0 0 1.2rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    letter-spacing: -0.5px;
                }
                .section-title i {
                    color: var(--swappit-orange, #ffa424);
                    font-size: 1.2em;
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
                    font-size: 0.97rem;
                    font-weight: 600;
                    color: var(--neutral-dark, #1e293b);
                    margin-bottom: 0.5rem;
                }
                .form-label.required::after {
                    content: ' *';
                    color: #ef4444;
                }
                .form-input,
                .form-select,
                .form-textarea {
                    padding: 0.7rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-family: inherit;
                    transition: all 0.2s;
                    background: #f9fafb;
                }
                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: var(--swappit-blue, #3468c0);
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.10);
                    background: #fff;
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 110px;
                }
                .transaction-type {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
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
                    padding: 1.2rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 14px;
                    text-align: center;
                    transition: all 0.2s;
                    background: #f9fafb;
                    box-shadow: 0 2px 8px rgba(52,104,192,0.04);
                }
                .type-option input[type="radio"]:checked + .type-card {
                    border-color: var(--swappit-blue, #3468c0);
                    background: linear-gradient(135deg, rgba(52, 104, 192, 0.07), rgba(52, 104, 192, 0.13));
                    box-shadow: 0 4px 16px rgba(52, 104, 192, 0.10);
                }
                .type-card:hover {
                    border-color: var(--swappit-blue, #3468c0);
                    transform: translateY(-2px) scale(1.03);
                }
                .type-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    color: white;
                    margin: 0 auto 0.7rem auto;
                }
                .type-icon.sale {
                    background: linear-gradient(135deg, var(--swappit-blue, #3468c0), var(--swappit-blue-hover, #1d4ed8));
                }
                .type-icon.trade {
                    background: linear-gradient(135deg, var(--swappit-orange, #ffa424), var(--swappit-orange-hover, #ff5722));
                }
                .type-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--neutral-dark, #1e293b);
                    margin: 0 0 0.3rem 0;
                }
                .type-description {
                    font-size: 0.93rem;
                    color: var(--neutral-medium, #64748b);
                    margin: 0;
                }
                .image-upload {
                    border: 2px dashed #d1d5db;
                    border-radius: 14px;
                    padding: 2.2rem 1rem;
                    text-align: center;
                    transition: all 0.2s;
                    cursor: pointer;
                    background: #f9fafb;
                }
                .image-upload:hover, .image-upload.dragover {
                    border-color: var(--swappit-blue, #3468c0);
                    background: rgba(52, 104, 192, 0.07);
                }
                .upload-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--swappit-blue, #3468c0), var(--swappit-blue-hover, #1d4ed8));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                    margin: 0 auto 1rem auto;
                }
                .upload-text {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--neutral-dark, #1e293b);
                    margin: 0 0 0.3rem 0;
                }
                .upload-hint {
                    font-size: 0.93rem;
                    color: var(--neutral-medium, #64748b);
                    margin: 0;
                }
                .image-preview {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 1rem;
                    margin-top: 1.2rem;
                }
                .preview-item {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    aspect-ratio: 1;
                    box-shadow: 0 2px 8px rgba(52,104,192,0.07);
                    background: #fff;
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
                    background: var(--swappit-blue, #3468c0);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .remove-image:hover {
                    background: #ef4444;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2.2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #e5e7eb;
                }
                .btn {
                    padding: 0.8rem 1.7rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }
                .btn-secondary:hover {
                    background: #e5e7eb;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--swappit-blue, #3468c0), var(--swappit-blue-hover, #1d4ed8));
                    color: white;
                    box-shadow: 0 2px 8px rgba(52,104,192,0.10);
                }
                .btn-primary:hover {
                    transform: translateY(-1px) scale(1.03);
                    box-shadow: 0 4px 16px rgba(52,104,192,0.18);
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
                @media (max-width: 768px) {
                    .add-product-container {
                        padding: 1rem 0.2rem 1rem 0.2rem;
                    }
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
                                                <p>List your product for sale or swapp with other students.</p>
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
                                    <input type="radio" name="transactionType" value="swapp">
                                    <div class="type-card">
                                        <div class="type-icon trade">
                                            <i class="fas fa-exchange-alt"></i>
                                        </div>
                                        <div class="type-title">For Swapp</div>
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
                                    Swapp Preferences
                                </h3>
                            <div class="form-group full-width">
                                <label class="form-label">What would you like to swapp for?</label>
                                <textarea class="form-textarea" name="swappPreferences" placeholder="Describe what you're looking for in exchange..."></textarea>
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
        console.log('Connected StudentAddProduct attachEventListeners called');
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
                const priceInput = this.shadowRoot.querySelector('input[name="price"]');
                const originalPriceInput = this.shadowRoot.querySelector('input[name="originalPrice"]');
                
                if (e.target.value === 'sale') {
                    pricingSection.style.display = 'block';
                    tradeSection.style.display = 'none';
                    // Make price required for sale
                    priceInput.required = true;
                    originalPriceInput.required = false;
                } else {
                    pricingSection.style.display = 'none';
                    tradeSection.style.display = 'block';
                    // Remove required from price for swapp
                    priceInput.required = false;
                    originalPriceInput.required = false;
                    // Clear price values when switching to swapp
                    priceInput.value = '';
                    originalPriceInput.value = '';
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
                this.imageFiles = [];
                this.initializeFormState();
            }
        });
        
        // Initialize form state
        this.initializeFormState();
    }

    initializeFormState() {
        const priceInput = this.shadowRoot.querySelector('input[name="price"]');
        const originalPriceInput = this.shadowRoot.querySelector('input[name="originalPrice"]');
        const pricingSection = this.shadowRoot.getElementById('pricingSection');
        const tradeSection = this.shadowRoot.getElementById('tradeSection');
        
        // Set initial state based on default selection (sale is checked by default)
        priceInput.required = true; // Price is required for sale
        originalPriceInput.required = false;
        pricingSection.style.display = 'block'; // Show pricing for sale
        tradeSection.style.display = 'none';
    }

    handleImageFiles(files) {
        const imagePreview = this.shadowRoot.getElementById('imagePreview');
        let errorShown = false;
        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                if (!errorShown) {
                    this.showErrorNotification('Invalid file', 'Only image files are allowed.');
                    errorShown = true;
                }
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                if (!errorShown) {
                    this.showErrorNotification('File too large', 'Each image must be less than 5MB.');
                    errorShown = true;
                }
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" data-index="${this.imageFiles.length}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagePreview.appendChild(previewItem);
                // Remove image functionality
                previewItem.querySelector('.remove-image').addEventListener('click', () => {
                    const fileIndex = parseInt(previewItem.querySelector('.remove-image').dataset.index);
                    this.imageFiles.splice(fileIndex, 1);
                    previewItem.remove();
                    // Update remaining indices
                    const remainingButtons = imagePreview.querySelectorAll('.remove-image');
                    remainingButtons.forEach((btn, idx) => {
                        btn.dataset.index = idx;
                    });
                });
            };
            reader.readAsDataURL(file);
            this.imageFiles.push(file); // Store the file
        });
    }

    async handleFormSubmission() {
        const submitBtn = this.shadowRoot.getElementById('submitBtn');
        const loadingIcon = this.shadowRoot.getElementById('loadingIcon');
        const form = this.shadowRoot.getElementById('addProductForm');
        const imagePreview = this.shadowRoot.getElementById('imagePreview');
                    let currentUser; // Declare here so it's available throughout the function
        try {
            // Show loading state
            submitBtn.disabled = true;
            loadingIcon.classList.add('show');
            // Get current user
            let currentUser;
            try {
                const { getCurrentUser } = await import('/firebase/auth.js');
                currentUser = getCurrentUser();
            } catch (error) {
                this.showErrorNotification('Authentication error', 'Could not verify user. Please log in again.');
                submitBtn.disabled = false;
                loadingIcon.classList.remove('show');
                return;
            }
            if (!currentUser) {
                this.showErrorNotification('Not authenticated', 'You must be logged in to add a product.');
                submitBtn.disabled = false;
                loadingIcon.classList.remove('show');
                return;
            }
            // Collect form data
            const formData = new FormData(form);
            const transactionType = formData.get('transactionType');
            if (!transactionType) {
                this.showErrorNotification('Missing type', 'Please select a transaction type (Sale or Swapp).');
                submitBtn.disabled = false;
                loadingIcon.classList.remove('show');
                return;
            }
            // Validate required fields
            const requiredFields = ['productName', 'category', 'condition', 'brand', 'description'];
            for (const field of requiredFields) {
                if (!formData.get(field)?.trim()) {
                    this.showErrorNotification('Missing field', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                    submitBtn.disabled = false;
                    loadingIcon.classList.remove('show');
                    return;
                }
            }

            // Validate price for sale transactions
            if (transactionType === 'sale') {
                const price = formData.get('price');
                if (!price || parseFloat(price) <= 0) {
                    this.showErrorNotification('Invalid price', 'Please enter a valid price for sale items.');
                    submitBtn.disabled = false;
                    loadingIcon.classList.remove('show');
                    return;
                }
            }
            // Get image files from preview
            const imageFiles = this.imageFiles;
            if (imageFiles.length === 0) {
                this.showErrorNotification('No images', 'Please upload at least one product image.');
                submitBtn.disabled = false;
                loadingIcon.classList.remove('show');
                return;
            }
            // Prepare product data
            const productData = {
                sellerId: currentUser.uid,
                sellerEmail: currentUser.email,
                sellerDisplayName: currentUser.displayName || currentUser.email,
                transactionType: transactionType,
                productName: formData.get('productName').trim(),
                category: formData.get('category'),
                condition: formData.get('condition'),
                brand: formData.get('brand').trim(),
                description: formData.get('description').trim(),
                price: transactionType === 'sale' ? parseFloat(formData.get('price')) : null,
                originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                swappPreferences: transactionType === 'swapp' ? formData.get('swappPreferences') : null,
                phone: formData.get('phone')?.trim() || null,
                location: formData.get('location')?.trim() || null,
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
                loadingIcon.classList.remove('show');
                return;
            }
            // First, create the product document to get the product ID
            const productResult = await addProduct(productData);
            if (!productResult.success) {
                this.showErrorNotification('Error creating product', productResult.error);
                submitBtn.disabled = false;
                loadingIcon.classList.remove('show');
                return;
            }
            const productId = productResult.productId;
            // Upload images if we have them
            let imageUploadResult = { success: false, images: [] };
            if (imageFiles.length > 0) {
                imageUploadResult = await uploadProductImages(
                    imageFiles,
                    productId,
                    transactionType,
                    formData.get('category')
                );
                if (!imageUploadResult.success) {
                    this.showErrorNotification('Image upload failed', imageUploadResult.error);
                    submitBtn.disabled = false;
                    loadingIcon.classList.remove('show');
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
                    loadingIcon.classList.remove('show');
                    return;
                }
            }
            // Show success notification
            this.showSuccessNotification('Product added successfully!', 'Your product has been uploaded and is now available in the marketplace.');
            // Reset form and preview
            form.reset();
            imagePreview.innerHTML = '';
            this.imageFiles = [];
            this.initializeFormState();
        } catch (error) {
            this.showErrorNotification('Error', error.message || 'An error occurred while adding the product.');
        } finally {
            submitBtn.disabled = false;
            loadingIcon.classList.remove('show');
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
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles consistent with marketplace
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-left: 4px solid #10b981;
            min-width: 300px;
            max-width: 400px;
        `;

        // Add content styles
        const toastContent = notification.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        `;

        const icon = notification.querySelector('.toast-content i');
        icon.style.cssText = `
            font-size: 1.25rem;
            color: #10b981;
        `;

        const messageElement = notification.querySelector('.toast-message');
        messageElement.style.cssText = `
            font-weight: 500;
            color: #1e293b;
            font-size: 0.95rem;
            line-height: 1.4;
        `;

        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.3s ease;
            font-size: 1rem;
        `;

        // Add to shadow root
        this.shadowRoot.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Add close functionality
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, 4000);
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
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles consistent with marketplace
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-left: 4px solid #ef4444;
            min-width: 300px;
            max-width: 400px;
        `;

        // Add content styles
        const toastContent = notification.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        `;

        const icon = notification.querySelector('.toast-content i');
        icon.style.cssText = `
            font-size: 1.25rem;
            color: #ef4444;
        `;

        const messageElement = notification.querySelector('.toast-message');
        messageElement.style.cssText = `
            font-weight: 500;
            color: #1e293b;
            font-size: 0.95rem;
            line-height: 1.4;
        `;

        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.3s ease;
            font-size: 1rem;
        `;

        // Add to shadow root
        this.shadowRoot.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Add close functionality
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        });

        // Auto remove after 6 seconds for errors
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, 6000);
    }
}

try {
    customElements.define('student-add-product', StudentAddProduct);
    console.log('Registered StudentAddProduct component registered successfully');
} catch (error) {
    console.error('Error Error registering StudentAddProduct component:', error);
} 