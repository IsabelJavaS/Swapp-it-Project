// =========================================
// SWAPPIT View Details JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeViewDetails();
});

function initializeViewDetails() {
    // Initialize all components
    initializeThumbnailGallery();
    initializeQuantitySelector();
    initializeCountdownTimer();
    initializeActionButtons();
    initializeImageGallery();
    initializeProductTags();
    initializeReviews();
}

// =========================================
// Thumbnail Gallery
// =========================================
function initializeThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.querySelector('.main-image');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const thumbnailImg = this.querySelector('img');
            if (thumbnailImg && mainImage) {
                mainImage.src = thumbnailImg.src;
                mainImage.alt = thumbnailImg.alt;
                
                // Add a subtle animation
                mainImage.style.opacity = '0.8';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
    });
}

// =========================================
// Quantity Selector
// =========================================
function initializeQuantitySelector() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateQuantityDisplay();
            }
        });

        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            const maxValue = parseInt(quantityInput.getAttribute('max')) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
                updateQuantityDisplay();
            }
        });

        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 1;
            const minValue = parseInt(this.getAttribute('min')) || 1;
            const maxValue = parseInt(this.getAttribute('max')) || 10;
            
            if (value < minValue) value = minValue;
            if (value > maxValue) value = maxValue;
            
            this.value = value;
            updateQuantityDisplay();
        });
    }
}

function updateQuantityDisplay() {
    const quantityInput = document.querySelector('.quantity-input');
    const currentQuantity = parseInt(quantityInput.value) || 1;
    
    // Update any quantity-dependent displays
    const quantityDisplays = document.querySelectorAll('.quantity-display');
    quantityDisplays.forEach(display => {
        display.textContent = currentQuantity;
    });
}

// =========================================
// Countdown Timer
// =========================================
function initializeCountdownTimer() {
    const timerElement = document.querySelector('.timer');
    if (!timerElement) return;

    // Set initial time (28 hours, 51 minutes, 40 seconds)
    let totalSeconds = 28 * 3600 + 51 * 60 + 40;

    function updateTimer() {
        if (totalSeconds <= 0) {
            timerElement.textContent = "00:00:00:00";
            return;
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(Math.random() * 100); // Simulate milliseconds

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
        timerElement.textContent = timeString;

        totalSeconds--;
    }

    // Update timer immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// =========================================
// Action Buttons
// =========================================
function initializeActionButtons() {
    // Add to Cart Button
    const addToCartBtn = document.querySelector('.btn-add-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart();
        });
    }

    // Play Button for Main Image
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            showProductVideo();
        });
    }
}

function addToCart() {
    const quantityInput = document.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value) || 1;
    const productTitle = document.querySelector('.product-title').textContent;
    const currentPrice = document.querySelector('.current-price').textContent;

    // Show success message
    showNotification(`¡Agregado al carrito! ${quantity} x ${productTitle}`, 'success');

    // Optional: Update cart counter
    updateCartCounter(quantity);
}

function showProductVideo() {
    // This would typically open a modal with the product video
    showNotification('Funcionalidad de video próximamente', 'info');
}

// =========================================
// Image Gallery
// =========================================
function initializeImageGallery() {
    const mainImage = document.querySelector('.main-image');
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    }
}

function openImageModal(imageSrc, imageAlt) {
    // Create modal for full-size image view
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${imageSrc}" alt="${imageAlt}" class="modal-image">
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .modal-content {
            position: relative;
        }
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 10000;
        }
        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
        }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Close modal functionality
    const closeModal = () => {
        document.body.removeChild(modal);
        document.head.removeChild(modalStyles);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// =========================================
// Product Tags
// =========================================
function initializeProductTags() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            // This would typically filter products or show related items
            showNotification(`Buscando productos con: ${tagText}`, 'info');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// =========================================
// Reviews
// =========================================
function initializeReviews() {
    // Add click handlers for review interactions
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(review => {
        review.addEventListener('click', function() {
            // This could expand the review or show full review
            const reviewerName = this.querySelector('.reviewer-name').textContent;
            showNotification(`Ver reseña completa de ${reviewerName}`, 'info');
        });
    });
}

// =========================================
// Utility Functions
// =========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;

    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 100px;
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
                border-left: 4px solid var(--swappit-blue);
                min-width: 300px;
                max-width: 400px;
            }
            .notification-toast.show {
                transform: translateX(0);
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            .toast-content i {
                font-size: 1.25rem;
                color: var(--swappit-blue);
            }
            .toast-message {
                font-weight: 500;
                color: var(--neutral-dark);
                font-size: 0.95rem;
                line-height: 1.4;
            }
            .toast-close {
                background: none;
                border: none;
                color: var(--neutral-medium);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: var(--transition);
                font-size: 1rem;
            }
            .toast-close:hover {
                color: var(--neutral-dark);
                background: var(--neutral-light);
            }
            .notification-toast.success {
                border-left-color: #10b981;
            }
            .notification-toast.success .toast-content i {
                color: #10b981;
            }
            .notification-toast.error {
                border-left-color: #ef4444;
            }
            .notification-toast.error .toast-content i {
                color: #ef4444;
            }
            .notification-toast.info {
                border-left-color: var(--swappit-orange);
            }
            .notification-toast.info .toast-content i {
                color: var(--swappit-orange);
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);

    // Close button functionality
    notification.querySelector('.toast-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

function updateCartCounter(quantity = 1) {
    // Update cart counter in header if it exists
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const currentCount = parseInt(cartCounter.textContent) || 0;
        cartCounter.textContent = currentCount + quantity;
        
        // Add animation
        cartCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCounter.style.transform = 'scale(1)';
        }, 200);
    }
}

// =========================================
// Smooth Scrolling for Related Products
// =========================================
function smoothScrollToRelatedProducts() {
    const relatedSection = document.querySelector('.related-products');
    if (relatedSection) {
        relatedSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// =========================================
// Product Sharing
// =========================================
function shareProduct() {
    const productTitle = document.querySelector('.product-title').textContent;
    const currentUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: productTitle,
            url: currentUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(currentUrl);
        });
    } else {
        copyToClipboard(currentUrl);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Enlace copiado al portapapeles', 'success');
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        showNotification('Error al copiar enlace', 'error');
    });
}

// =========================================
// Initialize additional features when page loads
// =========================================
window.addEventListener('load', function() {
    // Add loading animation completion
    const mainContainer = document.querySelector('.product-detail-main');
    if (mainContainer) {
        mainContainer.style.opacity = '1';
    }

    // Initialize any additional features
    initializeAdditionalFeatures();
});

function initializeAdditionalFeatures() {
    // Add hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add smooth transitions for price changes
    const priceElements = document.querySelectorAll('.current-price, .original-price');
    priceElements.forEach(price => {
        price.style.transition = 'color 0.3s ease, transform 0.3s ease';
    });
}
