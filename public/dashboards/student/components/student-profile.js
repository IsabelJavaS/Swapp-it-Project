// Componente web para el perfil de estudiante
class StudentProfile extends HTMLElement {
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
                .profile-container { background: white; border-radius: 20px; box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.1)); padding: 2rem; max-width: 700px; margin: 2rem auto; }
                .profile-header { text-align: center; margin-bottom: 2rem; }
                .profile-avatar { width: 100px; height: 100px; border-radius: 50%; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1rem; }
                .profile-name { font-size: 1.5rem; font-weight: 700; margin: 0; }
                .profile-role { color: var(--swappit-secondary, #764ba2); font-size: 1rem; margin-bottom: 1rem; }
                .profile-form { display: grid; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-label { font-weight: 500; margin-bottom: 0.5rem; color: #4a5568; }
                .form-input { padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; background: #f8fafc; }
                .form-input:focus { border-color: #667eea; background: white; outline: none; }
                .btn { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn:hover { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); }
            </style>
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">JD</div>
                    <div class="profile-name">John Doe</div>
                    <div class="profile-role">Estudiante</div>
                </div>
                <form class="profile-form">
                    <div class="form-group">
                        <label class="form-label">Nombre Completo</label>
                        <input class="form-input" type="text" value="John Doe" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input class="form-input" type="email" value="john.doe@email.com" disabled />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input class="form-input" type="tel" value="+1 (555) 123-4567" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dirección</label>
                        <input class="form-input" type="text" value="123 Main St, City, State" />
                    </div>
                    <button class="btn" type="submit">Guardar Cambios</button>
                </form>
            </div>
        `;
    }
}
customElements.define('student-profile', StudentProfile); 