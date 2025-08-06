// Web component for student notifications
class StudentNotifications extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.loadNotifications();
    }

    async loadNotifications() {
        try {
            // Get real user data
            const { getCurrentUser } = await import('/firebase/auth.js');
            const { getProducts } = await import('/firebase/firestore.js');
            
            const currentUser = getCurrentUser();
            if (!currentUser) {
                this.showNoNotificationsMessage();
                return;
            }

            // Get user products to generate notifications based on activity
            const productsResult = await getProducts({ sellerId: currentUser.uid });
            const userProducts = productsResult.success ? productsResult.products : [];

            // Generate notifications based on real products
            const notifications = [];
            
            // Sold products notifications
            const soldProducts = userProducts.filter(p => p.status === 'sold');
            soldProducts.slice(0, 2).forEach((product, index) => {
                notifications.push({
                    id: `sale_${index}`,
                    type: 'sale',
                    title: 'New Sale!',
                    message: `Your product "${product.productName}" was sold`,
                    time: this.formatTimeAgo(product.updatedAt || product.createdAt),
                    read: false,
                    icon: 'fas fa-dollar-sign',
                    color: '#10b981'
                });
            });

            // Popular products notifications
            const popularProducts = userProducts
                .filter(p => p.views > 10 && p.status === 'active')
                .slice(0, 1);
            
            popularProducts.forEach((product, index) => {
                notifications.push({
                    id: `popular_${index}`,
                    type: 'view',
                    title: 'Popular Product',
                    message: `"${product.productName}" has ${product.views} views`,
                    time: this.formatTimeAgo(product.createdAt),
                    read: false,
                    icon: 'fas fa-eye',
                    color: '#3468c0'
                });
            });

            // Recent products notifications
            const recentProducts = userProducts
                .filter(p => p.status === 'active')
                .slice(0, 1);
            
            recentProducts.forEach((product, index) => {
                notifications.push({
                    id: `recent_${index}`,
                    type: 'product',
                    title: 'Product Added',
                    message: `"${product.productName}" was added successfully`,
                    time: this.formatTimeAgo(product.createdAt),
                    read: true,
                    icon: 'fas fa-plus',
                    color: '#10b981'
                });
            });

            // If no notifications, show message
            if (notifications.length === 0) {
                this.showNoNotificationsMessage();
                return;
            }

            this.updateNotificationsList(notifications);
            this.updateStats(notifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.showNoNotificationsMessage();
        }
    }

    showNoNotificationsMessage() {
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (notificationsList) {
            notificationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No notifications</h3>
                    <p>When you have activity in your account, you'll see notifications here.</p>
                </div>
            `;
        }
    }

    updateStats(notifications) {
        const unreadCount = notifications.filter(n => !n.read).length;
        const readCount = notifications.filter(n => n.read).length;
        const totalCount = notifications.length;

        // Actualizar estadísticas
        const unreadElement = this.shadowRoot.querySelector('.stat-card:nth-child(1) .stat-number');
        const readElement = this.shadowRoot.querySelector('.stat-card:nth-child(2) .stat-number');
        const totalElement = this.shadowRoot.querySelector('.stat-card:nth-child(3) .stat-number');

        if (unreadElement) unreadElement.textContent = unreadCount;
        if (readElement) readElement.textContent = readCount;
        if (totalElement) totalElement.textContent = totalCount;
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

    updateNotificationsList(notifications) {
        const notificationsList = this.shadowRoot.getElementById('notificationsList');
        if (!notificationsList) return;

        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-card ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon" style="background: ${notification.color}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h4 class="notification-title">${notification.title}</h4>
                        <span class="notification-time">${notification.time}</span>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
                </div>
                <div class="notification-actions">
                    <button class="btn btn-icon mark-read-btn" data-id="${notification.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-icon delete-btn" data-id="${notification.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        this.shadowRoot.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.markAsRead(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteNotification(e.target.dataset.id));
        });

        this.shadowRoot.querySelectorAll('.notification-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-actions')) {
                    this.markAsRead(card.dataset.id);
                }
            });
        });
    }

    markAsRead(notificationId) {
        console.log('Mark as read:', notificationId);
        const card = this.shadowRoot.querySelector(`[data-id="${notificationId}"]`);
        if (card) {
            card.classList.remove('unread');
            card.classList.add('read');
            const indicator = card.querySelector('.unread-indicator');
            if (indicator) indicator.remove();
        }
    }

    deleteNotification(notificationId) {
        if (confirm('Delete this notification?')) {
            console.log('Delete notification:', notificationId);
            const card = this.shadowRoot.querySelector(`[data-id="${notificationId}"]`);
            if (card) {
                card.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => card.remove(), 300);
            }
        }
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

                .stat-icon.read {
                    background: linear-gradient(135deg, #10b981, #059669);
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

                .notifications-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .notifications-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .notifications-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-icon {
                    padding: 0.5rem;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-icon:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .notifications-grid {
                    display: grid;
                    gap: 1rem;
                }

                .notification-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    gap: 1rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }

                .notification-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .notification-card.unread {
                    border-left: 4px solid #3468c0;
                    background: linear-gradient(135deg, rgba(52, 104, 192, 0.02), rgba(52, 104, 192, 0.05));
                }

                .notification-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    color: white;
                    flex-shrink: 0;
                }

                .notification-content {
                    flex: 1;
                    position: relative;
                }

                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }

                .notification-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .notification-time {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .notification-message {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                    line-height: 1.5;
                }

                .unread-indicator {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #3468c0;
                }

                .notification-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-self: flex-start;
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

                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .notifications-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .notification-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .notification-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .notification-actions {
                        flex-direction: row;
                        justify-content: center;
                        align-self: center;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .notifications-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }
                }
            </style>

            <div class="notifications-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Notifications</h1>
                    <p>Stay updated with your latest activities and messages</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon unread">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="stat-number">3</div>
                        <div class="stat-label">Unread</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon read">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-number">12</div>
                        <div class="stat-label">Read</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon total">
                            <i class="fas fa-list"></i>
                        </div>
                        <div class="stat-number">15</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>

                <!-- Notifications Header -->
                <div class="notifications-header">
                    <h3 class="notifications-title">Recent Notifications</h3>
                    <div class="notifications-actions">
                        <button class="btn btn-primary">
                            <i class="fas fa-check-double"></i>
                            Mark All Read
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-cog"></i>
                            Settings
                        </button>
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

customElements.define('student-notifications', StudentNotifications); 