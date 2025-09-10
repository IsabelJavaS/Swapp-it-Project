// Badge Manager - Manages dynamic badge counts for dashboard sidebars
class BadgeManager {
    constructor() {
        this.badges = {
            cart: 0,
            myProducts: 0,
            purchases: 0,
            sales: 0,
            notifications: 0
        };
        this.listeners = [];
        this.isInitialized = false;
    }

    // Initialize the badge manager
    async init() {
        if (this.isInitialized) return;
        
        console.log('BadgeManager: Initializing...');
        
        try {
            // Wait for Firebase to be ready
            await this.waitForFirebase();
            
            // Load initial badge counts
            await this.loadAllBadgeCounts();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
            this.isInitialized = true;
            console.log('BadgeManager: Initialized successfully');
        } catch (error) {
            console.error('BadgeManager: Initialization failed:', error);
        }
    }

    // Wait for Firebase to be ready
    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebase && window.firebase.auth && window.firebase.firestore) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    // Load all badge counts from Firebase
    async loadAllBadgeCounts() {
        try {
            const { getCurrentUser } = await import('/firebase/auth.js');
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('BadgeManager: No user logged in, setting all badges to 0');
                this.updateAllBadges(0, 0, 0, 0, 0);
                return;
            }

            console.log('BadgeManager: Loading badge counts for user:', currentUser.uid);

            // Load cart count from localStorage
            this.loadCartCount();

            // Load other counts from Firebase
            await Promise.all([
                this.loadMyProductsCount(currentUser.uid),
                this.loadPurchasesCount(currentUser.uid),
                this.loadSalesCount(currentUser.uid),
                this.loadNotificationsCount(currentUser.uid)
            ]);

        } catch (error) {
            console.error('BadgeManager: Error loading badge counts:', error);
            this.updateAllBadges(0, 0, 0, 0, 0);
        }
    }

    // Load cart count from localStorage
    loadCartCount() {
        try {
            const cartData = localStorage.getItem('swappit_cart');
            if (cartData) {
                const cart = JSON.parse(cartData);
                this.badges.cart = cart.length || 0;
            } else {
                this.badges.cart = 0;
            }
            console.log('BadgeManager: Cart count loaded:', this.badges.cart);
        } catch (error) {
            console.error('BadgeManager: Error loading cart count:', error);
            this.badges.cart = 0;
        }
    }

    // Load my products count
    async loadMyProductsCount(userId) {
        try {
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: userId });
            
            if (result.success) {
                this.badges.myProducts = result.products.length || 0;
            } else {
                this.badges.myProducts = 0;
            }
            console.log('BadgeManager: My products count loaded:', this.badges.myProducts);
        } catch (error) {
            console.error('BadgeManager: Error loading my products count:', error);
            this.badges.myProducts = 0;
        }
    }

    // Load purchases count
    async loadPurchasesCount(userId) {
        try {
            const { getTransactions } = await import('/firebase/firestore.js');
            const result = await getTransactions({ buyerId: userId });
            
            if (result.success) {
                this.badges.purchases = result.transactions.length || 0;
            } else {
                this.badges.purchases = 0;
            }
            console.log('BadgeManager: Purchases count loaded:', this.badges.purchases);
        } catch (error) {
            console.error('BadgeManager: Error loading purchases count:', error);
            this.badges.purchases = 0;
        }
    }

    // Load sales count
    async loadSalesCount(userId) {
        try {
            const { getTransactions } = await import('/firebase/firestore.js');
            const result = await getTransactions({ sellerId: userId });
            
            if (result.success) {
                this.badges.sales = result.transactions.length || 0;
            } else {
                this.badges.sales = 0;
            }
            console.log('BadgeManager: Sales count loaded:', this.badges.sales);
        } catch (error) {
            console.error('BadgeManager: Error loading sales count:', error);
            this.badges.sales = 0;
        }
    }

    // Load notifications count
    async loadNotificationsCount(userId) {
        try {
            const { getNotifications } = await import('/firebase/firestore.js');
            const result = await getNotifications({ userId: userId, unread: true });
            
            if (result.success) {
                this.badges.notifications = result.notifications.length || 0;
            } else {
                this.badges.notifications = 0;
            }
            console.log('BadgeManager: Notifications count loaded:', this.badges.notifications);
        } catch (error) {
            console.error('BadgeManager: Error loading notifications count:', error);
            this.badges.notifications = 0;
        }
    }

    // Set up real-time listeners for dynamic updates
    setupRealtimeListeners() {
        // Listen for cart changes
        this.setupCartListener();
        
        // Listen for product changes
        this.setupProductListener();
        
        // Listen for transaction changes
        this.setupTransactionListener();
        
        // Listen for notification changes
        this.setupNotificationListener();
    }

    // Set up cart listener
    setupCartListener() {
        // Listen for storage changes (cart updates)
        window.addEventListener('storage', (e) => {
            if (e.key === 'swappit_cart') {
                this.loadCartCount();
                this.notifyListeners();
            }
        });

        // Also listen for custom cart events
        document.addEventListener('cartUpdated', () => {
            this.loadCartCount();
            this.notifyListeners();
        });
    }

    // Set up product listener
    setupProductListener() {
        // Listen for product changes
        document.addEventListener('productAdded', async () => {
            const userId = await this.getCurrentUserId();
            this.loadMyProductsCount(userId);
        });
        
        document.addEventListener('productDeleted', async () => {
            const userId = await this.getCurrentUserId();
            this.loadMyProductsCount(userId);
        });
    }

    // Set up transaction listener
    setupTransactionListener() {
        // Listen for transaction changes
        document.addEventListener('transactionCreated', async () => {
            const userId = await this.getCurrentUserId();
            this.loadPurchasesCount(userId);
            this.loadSalesCount(userId);
        });
    }

    // Set up notification listener
    setupNotificationListener() {
        // Listen for notification changes
        document.addEventListener('notificationReceived', async () => {
            const userId = await this.getCurrentUserId();
            this.loadNotificationsCount(userId);
        });
    }

    // Get current user ID
    async getCurrentUserId() {
        try {
            const { getCurrentUser } = await import('/firebase/auth.js');
            const user = getCurrentUser();
            return user ? user.uid : null;
        } catch (error) {
            return null;
        }
    }

    // Update all badges at once
    updateAllBadges(cart, myProducts, purchases, sales, notifications) {
        this.badges.cart = cart;
        this.badges.myProducts = myProducts;
        this.badges.purchases = purchases;
        this.badges.sales = sales;
        this.badges.notifications = notifications;
        
        this.notifyListeners();
    }

    // Update specific badge
    updateBadge(type, count) {
        if (this.badges.hasOwnProperty(type)) {
            this.badges[type] = count;
            this.notifyListeners();
        }
    }

    // Get badge count
    getBadgeCount(type) {
        return this.badges[type] || 0;
    }

    // Get all badges
    getAllBadges() {
        return { ...this.badges };
    }

    // Add listener for badge updates
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remove listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.getAllBadges());
            } catch (error) {
                console.error('BadgeManager: Error in listener callback:', error);
            }
        });
    }

    // Refresh all badges
    async refresh() {
        await this.loadAllBadgeCounts();
    }
}

// Create global instance
window.BadgeManager = new BadgeManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.BadgeManager.init();
});

// Export for module usage
export default BadgeManager;
