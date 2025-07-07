// Componente web para notificaciones del estudiante
class StudentNotifications extends HTMLElement {
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
                :host { display: block; font-family: var(--font-family, 'Inter', sans-serif); }
                .notifications-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 700px; margin: 2rem auto; }
                .notifications-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #3468c0; }
                .notification-list { display: grid; gap: 1rem; }
                .notification-item { background: #f8fafc; border-radius: 12px; padding: 1rem 1.5rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1)); color: #4a5568; }
                .notification-title { font-weight: 600; color: #3468c0; }
                .notification-date { font-size: 0.85rem; color: #718096; float: right; }
            </style>
            <div class="notifications-container">
                <div class="notifications-header">Notifications</div>
                <div class="notification-list">
                    <div class="notification-item">
                        <span class="notification-title">Product Sold!</span>
                        <span class="notification-date">Today</span>
                        <div>You have sold "Math Book".</div>
                    </div>
                    <div class="notification-item">
                        <span class="notification-title">New Offer Received</span>
                        <span class="notification-date">Yesterday</span>
                        <div>You received an offer for "School Backpack".</div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('student-notifications', StudentNotifications); 