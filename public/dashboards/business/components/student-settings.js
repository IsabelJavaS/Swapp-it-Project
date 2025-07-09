// Componente web para configuración del estudiante
class StudentSettings extends HTMLElement {
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
                .settings-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 600px; margin: 2rem auto; }
                .settings-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #3468c0; }
                .form-group { margin-bottom: 1.5rem; }
                .form-label { font-weight: 500; margin-bottom: 0.5rem; color: #4a5568; display: block; }
                .form-input { padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; background: #f8fafc; width: 100%; }
                .form-input:focus { border-color: #2563eb; background: white; outline: none; }
                .btn { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: #3468c0; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn:hover { background: #1d4ed8; }
            </style>
            <div class="settings-container">
                <div class="settings-header">Settings</div>
                <form>
                    <div class="form-group">
                        <label class="form-label">Language</label>
                        <select class="form-input">
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notifications</label>
                        <select class="form-input">
                            <option>Enabled</option>
                            <option>Disabled</option>
                        </select>
                    </div>
                    <button class="btn" type="submit">Save Changes</button>
                </form>
            </div>
        `;
    }
}
customElements.define('student-settings', StudentSettings); 