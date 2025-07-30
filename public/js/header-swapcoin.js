// Header Swappit Coins Balance Management
document.addEventListener('DOMContentLoaded', function() {
    // Update SwapCoin balance in header
    updateHeaderSwapCoinBalance();
});

    // Function to get user Swappit Coins from localStorage
    function getUserSwappitCoins() {
        return parseInt(localStorage.getItem('swapcoin-balance') || 120);
    }

    // Update Swappit Coins balance display in header
    function updateHeaderSwappitCoinsBalance() {
        const swapcoinAmount = document.getElementById('swapcoin-amount');
        if (swapcoinAmount) {
            const balance = getUserSwappitCoins();
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
    function updateSwappitCoinsBalance(newBalance) {
        localStorage.setItem('swapcoin-balance', newBalance);
        updateHeaderSwappitCoinsBalance();
    }

// Function to add coins to balance
    function addSwappitCoins(amount) {
        const currentBalance = getUserSwappitCoins();
        const newBalance = currentBalance + amount;
        updateSwappitCoinsBalance(newBalance);
        return newBalance;
    }

// Function to subtract coins from balance
function subtractSwappitCoins(amount) {
    const currentBalance = getUserSwappitCoins();
    const newBalance = Math.max(0, currentBalance - amount); // Prevent negative balance
    updateSwappitCoinsBalance(newBalance);
    return newBalance;
} 