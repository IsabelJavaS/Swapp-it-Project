// Header SwapCoin Balance Management
document.addEventListener('DOMContentLoaded', function() {
    // Update SwapCoin balance in header
    updateHeaderSwapCoinBalance();
});

// Function to get user SwapCoins from localStorage
function getUserSwapCoins() {
    return parseInt(localStorage.getItem('swapcoin-balance') || 120);
}

// Update SwapCoin balance display in header
function updateHeaderSwapCoinBalance() {
    const swapcoinAmount = document.getElementById('swapcoin-amount');
    if (swapcoinAmount) {
        const balance = getUserSwapCoins();
        swapcoinAmount.textContent = balance;
        
        // Add a subtle animation when balance updates
        swapcoinAmount.style.transition = 'all 0.3s ease';
        swapcoinAmount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            swapcoinAmount.style.transform = 'scale(1)';
        }, 300);
    }
}

// Function to update balance (can be called from other scripts)
function updateSwapCoinBalance(newBalance) {
    localStorage.setItem('swapcoin-balance', newBalance);
    updateHeaderSwapCoinBalance();
}

// Function to add coins to balance
function addSwapCoins(amount) {
    const currentBalance = getUserSwapCoins();
    const newBalance = currentBalance + amount;
    updateSwapCoinBalance(newBalance);
    return newBalance;
}

// Function to subtract coins from balance
function subtractSwapCoins(amount) {
    const currentBalance = getUserSwapCoins();
    const newBalance = Math.max(0, currentBalance - amount); // Prevent negative balance
    updateSwapCoinBalance(newBalance);
    return newBalance;
} 