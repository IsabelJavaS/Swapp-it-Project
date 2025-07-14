// Componente web para el perfil de estudiante
class StudentProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.loadUserData();
    }

    async loadUserData() {
        try {
            // Wait a bit for Firebase to initialize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get current user from Firebase Auth
            const { getCurrentUser, onAuthStateChange } = await import('/public/firebase/auth.js');
            const { getUserProfile } = await import('/public/firebase/firestore.js');
            
            // First try to get current user
            let currentUser = getCurrentUser();
            
            // If no current user, wait for auth state change
            if (!currentUser) {
                console.log('No current user, waiting for auth state...');
                await new Promise((resolve, reject) => {
                    const unsubscribe = onAuthStateChange((user) => {
                        unsubscribe();
                        if (user) {
                            currentUser = user;
                            resolve();
                        } else {
                            reject(new Error('No authenticated user found'));
                        }
                    });
                    
                    // Timeout after 5 seconds
                    setTimeout(() => {
                        unsubscribe();
                        reject(new Error('Auth state timeout'));
                    }, 5000);
                });
            }

            if (!currentUser) {
                console.error('No authenticated user found after waiting');
                return;
            }

            console.log('Current user found:', currentUser.email);

            // Get user profile from Firestore
            const profileResult = await getUserProfile(currentUser.uid);
            if (!profileResult.success) {
                console.error('Failed to get user profile:', profileResult.error);
                // Use basic user info if profile not found
                const userProfile = {
                    email: currentUser.email,
                    role: 'personal',
                    personal: {
                        nombre: currentUser.displayName || currentUser.email.split('@')[0]
                    }
                };
                this.updateProfileInterface(userProfile);
                return;
            }

            const userProfile = profileResult.data;
            this.updateProfileInterface(userProfile);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    updateProfileInterface(userProfile) {
        const profileAvatar = this.shadowRoot.getElementById('profileAvatar');
        const profileName = this.shadowRoot.getElementById('profileName');
        const profileRole = this.shadowRoot.getElementById('profileRole');
        const fullNameInput = this.shadowRoot.getElementById('fullName');
        const emailInput = this.shadowRoot.getElementById('email');
        const phoneInput = this.shadowRoot.getElementById('phone');
        const addressInput = this.shadowRoot.getElementById('address');

        let displayName = 'User';
        let role = 'Student';

        // Extract name and role based on user profile
        if (userProfile.role === 'business' && userProfile.business) {
            displayName = userProfile.business.nombreNegocio || userProfile.email.split('@')[0];
            role = 'Business';
        } else if (userProfile.role === 'personal' && userProfile.personal) {
            displayName = userProfile.personal.nombre || userProfile.email.split('@')[0];
            role = 'Student';
        } else {
            displayName = userProfile.email.split('@')[0];
            role = userProfile.role === 'business' ? 'Business' : 'Student';
        }

        // Update profile header
        if (profileName) profileName.textContent = displayName;
        if (profileRole) profileRole.textContent = role;
        
        // Generate initials for avatar
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
        if (profileAvatar) profileAvatar.textContent = initials;

        // Update form fields
        if (fullNameInput) {
            if (userProfile.role === 'personal' && userProfile.personal) {
                fullNameInput.value = userProfile.personal.nombre || '';
            } else if (userProfile.role === 'business' && userProfile.business) {
                fullNameInput.value = userProfile.business.nombreNegocio || '';
            } else {
                fullNameInput.value = displayName;
            }
        }

        if (emailInput) emailInput.value = userProfile.email || '';

        if (phoneInput) {
            if (userProfile.role === 'personal' && userProfile.personal) {
                phoneInput.value = userProfile.personal.telefono || '';
            } else if (userProfile.role === 'business' && userProfile.business) {
                phoneInput.value = userProfile.business.telefonoNegocio || '';
            }
        }

        if (addressInput) {
            if (userProfile.role === 'personal' && userProfile.personal) {
                addressInput.value = userProfile.personal.direccion || '';
            } else if (userProfile.role === 'business' && userProfile.business) {
                addressInput.value = userProfile.business.direccionNegocio || '';
            }
        }
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
                    <div class="profile-avatar" id="profileAvatar">JD</div>
                    <div class="profile-name text-primary" id="profileName">Loading...</div>
                    <div class="profile-role" id="profileRole">Student</div>
                </div>
                <form class="profile-form" id="profileForm">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input class="form-input" type="text" id="fullName" placeholder="Full Name" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input class="form-input" type="email" id="email" disabled placeholder="Email" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input class="form-input" type="tel" id="phone" placeholder="Phone" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <input class="form-input" type="text" id="address" placeholder="Address" />
                    </div>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </form>
            </div>
        `;
    }
}
customElements.define('student-profile', StudentProfile); 