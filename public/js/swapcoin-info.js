// Swappit Coins Info Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize SwapCoin functionality
    initializeSwapCoin();
    
    // Setup purchase buttons
    setupPurchaseButtons();
    
    // Load user balance
    loadUserBalance();
    
    // Update header balance if on SwapCoin page
    updateHeaderBalance();
});

    // Function to get user Swappit Coins (local fallback)
    function getUserSwappitCoins() {
        return parseInt(localStorage.getItem('swapcoin-balance') || 120);
    }

// Update header balance display
function updateHeaderBalance() {
    // Use the global function if available, otherwise use local
    if (typeof updateHeaderSwapCoinBalance === 'function') {
        updateHeaderSwapCoinBalance();
    } else {
        const headerBalance = document.getElementById('swapcoin-amount');
        if (headerBalance) {
            headerBalance.textContent = getUserSwappitCoins();
        }
    }
}

    // Initialize Swappit Coins page
    function initializeSwappitCoins() {
        console.log('Swappit Coins page initialized');
    
    // Add loading animation to balance
    const balanceElement = document.getElementById('swapcoin-balance');
    if (balanceElement) {
        balanceElement.textContent = getUserSwappitCoins();
        balanceElement.style.opacity = '0.7';
        setTimeout(() => {
            balanceElement.style.opacity = '1';
        }, 500);
    }
}

// Setup purchase buttons functionality
function setupPurchaseButtons() {
    const buyButtons = document.querySelectorAll('.buy-button');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.purchase-card');
            const coinAmount = card.querySelector('.coin-amount').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Show purchase confirmation
            showPurchaseModal(coinAmount, price);
        });
    });
}

// Show purchase confirmation modal
function showPurchaseModal(coinAmount, price) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="purchaseModal" tabindex="-1" aria-labelledby="purchaseModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="purchaseModalLabel">
                            <i class="fas fa-coins text-warning me-2"></i>
                            Confirm Purchase
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <div class="h3 text-warning mb-2">${coinAmount} Swappit Coins</div>
                            <div class="h4 text-muted">for ${price}</div>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            This is a demo purchase. In a real application, this would redirect to a payment gateway.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="processPurchase('${coinAmount}', '${price}')">
                            <i class="fas fa-credit-card me-2"></i>Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('purchaseModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('purchaseModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Process purchase (demo function)
function processPurchase(coinAmount, price) {
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('purchaseModal'));
    modal.hide();
    
    // Show success message
    showNotification(`Successfully purchased ${coinAmount} Swappit Coins!`, 'success');
    
    // Update balance (demo)
    updateBalance(parseInt(coinAmount));
}

// Load user balance from storage/backend
function loadUserBalance() {
    // In a real app, this would fetch from backend
    const currentBalance = getUserSwappitCoins();
    updateBalanceDisplay(currentBalance);
}

// Update balance display
function updateBalanceDisplay(newBalance) {
    const balanceElement = document.getElementById('swapcoin-balance');
    if (balanceElement) {
        // Animate balance update
        const currentBalance = parseInt(balanceElement.textContent);
        animateBalanceChange(currentBalance, newBalance);
    }
}

// Animate balance change
function animateBalanceChange(from, to) {
    const balanceElement = document.getElementById('swapcoin-balance');
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = (to - from) / steps;
    let current = from;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            current = to;
            clearInterval(timer);
        }
        
        balanceElement.textContent = Math.floor(current);
    }, duration / steps);
}

// Update balance (add coins)
function updateBalance(coinsToAdd) {
    // Use global function if available
    if (typeof addSwapCoins === 'function') {
        const newBalance = addSwapCoins(coinsToAdd);
        updateBalanceDisplay(newBalance);
    } else {
        const currentBalance = getUserSwappitCoins();
        const newBalance = currentBalance + coinsToAdd;
        localStorage.setItem('swapcoin-balance', newBalance);
        updateBalanceDisplay(newBalance);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add hover effects to purchase cards
document.addEventListener('DOMContentLoaded', function() {
    const purchaseCards = document.querySelectorAll('.purchase-card');
    
    purchaseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}); 