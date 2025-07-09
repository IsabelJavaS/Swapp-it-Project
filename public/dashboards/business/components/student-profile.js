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
                .profile-avatar { width: 100px; height: 100px; border-radius: 50%; background: #3468c0; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1rem; }
                .profile-name { font-size: 1.5rem; font-weight: 700; margin: 0; }
                .profile-role { color: #4a5568; font-size: 1rem; margin-bottom: 1rem; }
                .profile-form { display: grid; gap: 1.5rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-label { font-weight: 500; margin-bottom: 0.5rem; color: #4a5568; }
                .form-input { padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; background: #f8fafc; }
                .form-input:focus { border-color: #667eea; background: white; outline: none; }
                .btn { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: #3468c0; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn:hover { background: #2563eb; filter: brightness(0.92); }
                a { color: #2563eb; text-decoration: none; transition: color 0.2s; }
                a:hover { color: #2563eb; text-decoration: underline; filter: brightness(0.92); }
            </style>
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">JD</div>
                    <div class="profile-name text-primary">John Doe</div>
                    <div class="profile-role">Student</div>
                </div>
                <form class="profile-form">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input class="form-input" type="text" value="John Doe" placeholder="Full Name" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input class="form-input" type="email" value="john.doe@email.com" disabled placeholder="Email" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input class="form-input" type="tel" value="+1 (555) 123-4567" placeholder="Phone" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <input class="form-input" type="text" value="123 Main St, City, State" placeholder="Address" />
                    </div>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </form>
            </div>
        `;
    }
}
customElements.define('student-profile', StudentProfile); 