// Componente web para perfil de empresa
class BusinessProfile extends HTMLElement {
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
                .profile-container { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 2rem; max-width: 700px; margin: 2rem auto; }
                .profile-header { text-align: center; margin-bottom: 2rem; }
                .profile-avatar { width: 100px; height: 100px; border-radius: 50%; background: #764ba2; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1rem; }
                .profile-name { font-size: 1.5rem; font-weight: 700; margin: 0; }
                .profile-role { color: #667eea; font-size: 1rem; margin-bottom: 1rem; }
                .profile-form { display: grid; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-label { font-weight: 500; margin-bottom: 0.5rem; color: #4a5568; }
                .form-input { padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; background: #f8fafc; }
                .form-input:focus { border-color: #764ba2; background: white; outline: none; }
                .btn { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn:hover { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            </style>
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">BC</div>
                    <div class="profile-name">Business Corp</div>
                    <div class="profile-role">Empresa</div>
                </div>
                <form class="profile-form">
                    <div class="form-group">
                        <label class="form-label">Nombre de la Empresa</label>
                        <input class="form-input" type="text" value="Business Corp" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input class="form-input" type="email" value="empresa@email.com" disabled />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input class="form-input" type="tel" value="+1 (555) 987-6543" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dirección</label>
                        <input class="form-input" type="text" value="Av. Principal 123, Ciudad" />
                    </div>
                    <button class="btn" type="submit">Guardar Cambios</button>
                </form>
            </div>
        `;
    }
}
customElements.define('business-profile', BusinessProfile); 