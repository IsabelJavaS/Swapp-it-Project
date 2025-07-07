// Business Notifications Component
class BusinessNotifications extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                :host { display: block; font-family: 'Inter', sans-serif; }
                .notifications-container { max-width: 800px; margin: 0 auto; padding: 0; }
                .section-header { margin-bottom: 2rem; }
                .section-header h1 { font-size: 2rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
                .section-header p { color: #64748b; font-size: 1rem; margin: 0; }
                .notification-list { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); padding: 2rem; }
                .notification-item { padding: 1rem 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 1rem; }
                .notification-item:last-child { border-bottom: none; }
                .notification-icon { color: #3468c0; font-size: 1.5rem; }
                .notification-content { flex: 1; }
                .notification-title { font-weight: 600; color: #1e293b; font-size: 1rem; }
                .notification-time { color: #64748b; font-size: 0.85rem; }
            </style>
            <div class="notifications-container">
                <div class="section-header">
                    <h1>Notifications</h1>
                    <p>Stay up to date with your business alerts and messages.</p>
                </div>
                <div class="notification-list">
                    <div class="notification-item">
                        <span class="notification-icon"><i class="fas fa-bell"></i></span>
                        <div class="notification-content">
                            <div class="notification-title">New Order Received</div>
                            <div class="notification-time">2 hours ago</div>
                        </div>
                    </div>
                    <div class="notification-item">
                        <span class="notification-icon"><i class="fas fa-bell"></i></span>
                        <div class="notification-content">
                            <div class="notification-title">Product Stock Low</div>
                            <div class="notification-time">Yesterday</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('business-notifications', BusinessNotifications); 