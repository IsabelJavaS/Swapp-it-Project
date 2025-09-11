// Search Autocomplete System
class SearchAutocomplete {
    constructor() {
        this.searchInput = null;
        this.autocompleteContainer = null;
        this.products = [];
        this.filteredProducts = [];
        this.selectedIndex = -1;
        this.isVisible = false;
        this.debounceTimer = null;
        this.init();
    }

    async init() {
        // Wait for header to be loaded
        await this.waitForHeader();
        this.setupSearchInput();
        this.loadProducts();
    }

    async waitForHeader() {
        return new Promise((resolve) => {
            const checkHeader = () => {
                const searchInput = document.querySelector('header-auth-component')?.shadowRoot?.getElementById('searchInput') ||
                                 document.querySelector('header-component')?.shadowRoot?.getElementById('searchInput');
                if (searchInput) {
                    this.searchInput = searchInput;
                    resolve();
                } else {
                    setTimeout(checkHeader, 100);
                }
            };
            checkHeader();
        });
    }

    setupSearchInput() {
        if (!this.searchInput) return;

        // Create autocomplete container
        this.createAutocompleteContainer();

        // Add event listeners
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.showAutocomplete();
            }
        });

        // Hide autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container') && !e.target.closest('.autocomplete-container')) {
                this.hideAutocomplete();
            }
        });
    }

    createAutocompleteContainer() {
        // Find the search container
        const searchContainer = this.searchInput.closest('.search-container');
        if (!searchContainer) return;

        // Create autocomplete container
        this.autocompleteContainer = document.createElement('div');
        this.autocompleteContainer.className = 'autocomplete-container';
        this.autocompleteContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 400px;
            overflow: hidden;
            display: none;
        `;

        // Insert after search container
        searchContainer.parentNode.insertBefore(this.autocompleteContainer, searchContainer.nextSibling);
    }

    async loadProducts() {
        try {
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ limit: 100 });
            if (result.success) {
                this.products = result.products;
            }
        } catch (error) {
            console.error('Error loading products for autocomplete:', error);
        }
    }

    handleInput(value) {
        // Clear previous debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce the search
        this.debounceTimer = setTimeout(() => {
            this.search(value);
        }, 150);
    }

    search(query) {
        if (!query.trim()) {
            this.hideAutocomplete();
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredProducts = this.products.filter(product => {
            const searchableText = `${product.productName || product.title || ''} ${product.description || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
            return searchableText.includes(searchTerm);
        }).slice(0, 4); // Limit to 4 results

        if (this.filteredProducts.length > 0) {
            this.showAutocomplete();
            this.renderSuggestions();
        } else {
            this.hideAutocomplete();
        }
    }

    renderSuggestions() {
        if (!this.autocompleteContainer) return;

        this.autocompleteContainer.innerHTML = '';

        this.filteredProducts.forEach((product, index) => {
            const suggestion = document.createElement('div');
            suggestion.className = 'autocomplete-item';
            suggestion.style.cssText = `
                padding: 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 16px;
                transition: background-color 0.2s;
                min-height: 80px;
            `;

            if (index === this.selectedIndex) {
                suggestion.style.backgroundColor = '#f5f5f5';
            }

            // Product image
            const img = document.createElement('img');
            img.src = product.images?.[0] || product.imageUrl || '/assets/logos/LogoSinFondo.png';
            img.style.cssText = 'width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e0e0e0;';
            img.onerror = () => {
                img.src = '/assets/logos/LogoSinFondo.png';
            };

            // Product info
            const info = document.createElement('div');
            info.style.cssText = 'flex: 1; min-width: 0;';
            
            const title = document.createElement('div');
            title.textContent = product.productName || product.title || 'Untitled Product';
            title.style.cssText = 'font-weight: 600; color: #1e293b; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;';

            const category = document.createElement('div');
            category.textContent = product.category || 'Uncategorized';
            category.style.cssText = 'font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 12px; display: inline-block;';

            info.appendChild(title);
            info.appendChild(category);

            // Price
            const price = document.createElement('div');
            if (product.price) {
                price.textContent = `$${product.price}`;
                price.style.cssText = 'font-weight: 700; color: #059669; font-size: 16px; background: #ecfdf5; padding: 4px 8px; border-radius: 6px;';
            }

            suggestion.appendChild(img);
            suggestion.appendChild(info);
            if (product.price) {
                suggestion.appendChild(price);
            }

            // Click handler
            suggestion.addEventListener('click', () => {
                this.selectProduct(product);
            });

            // Hover effects
            suggestion.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });

            this.autocompleteContainer.appendChild(suggestion);
        });

        // Add "View all results" option
        if (this.filteredProducts.length > 0) {
            const viewAll = document.createElement('div');
            viewAll.className = 'autocomplete-item view-all';
            viewAll.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                background: #f8f9fa;
                border-top: 1px solid #e0e0e0;
                text-align: center;
                font-weight: 500;
                color: #3468c0;
                transition: background-color 0.2s;
            `;
            viewAll.textContent = `View all results for "${this.searchInput.value}"`;
            
            viewAll.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });

            this.autocompleteContainer.appendChild(viewAll);
        }
    }

    updateSelection() {
        const items = this.autocompleteContainer.querySelectorAll('.autocomplete-item:not(.view-all)');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.backgroundColor = '#f5f5f5';
            } else {
                item.style.backgroundColor = 'transparent';
            }
        });
    }

    handleKeydown(e) {
        if (!this.isVisible) return;

        const items = this.autocompleteContainer.querySelectorAll('.autocomplete-item:not(.view-all)');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
                    this.selectProduct(this.filteredProducts[this.selectedIndex]);
                } else {
                    this.performSearch(this.searchInput.value);
                }
                break;
            case 'Escape':
                this.hideAutocomplete();
                this.searchInput.blur();
                break;
        }
    }

    selectProduct(product) {
        this.searchInput.value = product.productName || product.title || '';
        this.hideAutocomplete();
        
        // Navigate to product detail or search results
        if (product.id) {
            window.location.href = `/pages/marketplace/product-detail.html?id=${product.id}`;
        } else {
            this.performSearch(this.searchInput.value);
        }
    }

    performSearch(query) {
        if (query.trim()) {
            window.location.href = `/pages/marketplace/all-products.html?search=${encodeURIComponent(query)}`;
        }
    }

    showAutocomplete() {
        if (this.autocompleteContainer) {
            this.autocompleteContainer.style.display = 'block';
            this.isVisible = true;
            this.selectedIndex = -1;
        }
    }

    hideAutocomplete() {
        if (this.autocompleteContainer) {
            this.autocompleteContainer.style.display = 'none';
            this.isVisible = false;
            this.selectedIndex = -1;
        }
    }
}

// Initialize autocomplete when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchAutocomplete();
});

// Export for use in other modules
window.SearchAutocomplete = SearchAutocomplete;
