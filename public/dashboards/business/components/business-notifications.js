// Business Notifications Component
class BusinessNotifications extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadNotificationsData();
    }

    async loadNotificationsData() {
        try {
            console.log('BusinessNotifications: Loading notifications data...');
            
            // Get current user
            const { getCurrentUser } = await import('/firebase/auth.js');
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('BusinessNotifications: No current user found');
                this.showNoNotificationsMessage();
                return;
            }

            // Get business products to generate notifications
            const { getProducts } = await import('/firebase/firestore.js');
            const result = await getProducts({ sellerId: currentUser.uid });
            
            if (result.success) {
                const notifications = this.generateNotifications(result.products);
                console.log('BusinessNotifications: Generated', notifications.length, 'notifications');
                this.updateNotificationsList(notifications);
                this.updateStats(notifications);
            } else {
                console.log('BusinessNotifications: No products found or error:', result.error);
                this.showNoNotificationsMessage();
            }
        } catch (error) {
            console.error('BusinessNotifications: Error loading notifications data:', error);
            this.showNoNotificationsMessage();
        }
    }

    generateNotifications(products) {
        const notifications = [];
        
        // Generate notifications based on product status
        products.forEach(product => {
            if (product.status === 'sold') {
                notifications.push({
                    id: `sale-${product.id}`,
                    type: 'sale',
                    title: 'Product Sold',
                    message: `${product.productName} has been sold for $${product.price.toFixed(2)}`,
                    time: this.formatTimeAgo(product.updatedAt || product.createdAt),
                    read: false
                });
            } else if (product.status === 'active' && product.views > 10) {
                notifications.push({
                    id: `popular-${product.id}`,
                    type: 'popular',
                    title: 'High Interest Product',
                    message: `${product.productName} is getting a lot of views (${product.views} views)`,
                    time: this.formatTimeAgo(product.createdAt),
                    read: false
                });
            }
        });

        // Add some system notifications
        notifications.push({
            id: 'welcome',
            type: 'system',
            title: 'Welcome to Business Dashboard',
            message: 'Your business dashboard is ready. Start adding products to see your sales grow!',
            time: 'Just now',
            read: false
        });

        return notifications.slice(0, 10); // Limit to 10 notifications
    }

    updateStats(notifications) {
        const unreadCount = notifications.filter(n => !n.read).length;
        const totalCount = notifications.length;

        // Update stats in the DOM
        const unreadElement = this.shadowRoot.querySelector('.stat-card:nth-child(1) .stat-number');
        const totalElement = this.shadowRoot.querySelector('.stat-card:nth-child(2) .stat-number');

        if (unreadElement) unreadElement.textContent = unreadCount;
        if (totalElement) totalElement.textContent = totalCount;
    }

    updateNotificationsList(notifications) {
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (!notificationsList) return;

        if (notifications.length === 0) {
            this.showNoNotificationsMessage();
            return;
        }

        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h4 class="notification-title">${notification.title}</h4>
                        <span class="notification-time">${notification.time}</span>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                </div>
                ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
            </div>
        `).join('');

        // Add click listeners to mark as read
        this.shadowRoot.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                this.markAsRead(item.dataset.id);
            });
        });
    }

    markAsRead(notificationId) {
        const notificationItem = this.shadowRoot.querySelector(`[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
            const unreadIndicator = notificationItem.querySelector('.unread-indicator');
            if (unreadIndicator) {
                unreadIndicator.remove();
            }
        }
    }

    showNoNotificationsMessage() {
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (notificationsList) {
            notificationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <h3>No notifications yet</h3>
                    <p>You'll receive notifications about sales, product views, and important updates here</p>
                </div>
            `;
        }
    }

    getNotificationIcon(type) {
        const icons = {
            sale: 'dollar-sign',
            popular: 'eye',
            system: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'A while ago';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Less than 1 hour ago';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
        
        return date.toLocaleDateString('en-US');
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

                .notifications-overview {
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    text-align: center;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    color: white;
                    margin: 0 auto 1rem;
                }

                .stat-icon.unread {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                .stat-icon.total {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .notifications-grid {
                    display: grid;
                    gap: 1rem;
                }

                .notification-item {
                    background: white;
                    border-radius: 12px;
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    gap: 1rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }

                .notification-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                }

                .notification-item.unread {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02));
                    border-left: 4px solid #ef4444;
                }

                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: white;
                    flex-shrink: 0;
                }

                .notification-icon.sale {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .notification-icon.popular {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .notification-icon.system {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .notification-content {
                    flex: 1;
                }

                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }

                .notification-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .notification-time {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .notification-message {
                    font-size: 0.875rem;
                    color: #64748b;
                    line-height: 1.4;
                    margin: 0;
                }

                .unread-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ef4444;
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #64748b;
                }

                .empty-state i {
                    font-size: 3rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .notifications-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .notification-item {
                        flex-direction: column;
                        text-align: center;
                    }

                    .notification-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }
                }
            </style>

            <div class="notifications-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Notifications</h1>
                    <p>Stay updated with your business activities and important alerts</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon unread">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Unread</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="fas fa-list"></i>
                        </div>
                        <div class="stat-number">0</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>

                <!-- Notifications List -->
                <div class="notifications-grid" id="notificationsList">
                    <!-- Notifications will be loaded here -->
                </div>
            </div>
        `;
    }
}

customElements.define('business-notifications', BusinessNotifications); 