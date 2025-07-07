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
                .notifications-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #667eea; }
                .notification-list { display: grid; gap: 1rem; }
                .notification-item { background: #f8fafc; border-radius: 12px; padding: 1rem 1.5rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1)); color: #4a5568; }
                .notification-title { font-weight: 600; color: #764ba2; }
                .notification-date { font-size: 0.85rem; color: #718096; float: right; }
            </style>
            <div class="notifications-container">
                <div class="notifications-header">Notificaciones</div>
                <div class="notification-list">
                    <div class="notification-item">
                        <span class="notification-title">¡Producto vendido!</span>
                        <span class="notification-date">Hoy</span>
                        <div>Has vendido "Libro de Matemáticas".</div>
                    </div>
                    <div class="notification-item">
                        <span class="notification-title">Nueva oferta recibida</span>
                        <span class="notification-date">Ayer</span>
                        <div>Recibiste una oferta por "Mochila Escolar".</div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('student-notifications', StudentNotifications); 