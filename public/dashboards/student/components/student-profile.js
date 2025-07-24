// Componente web para el perfil de estudiante
class StudentProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.loadUserData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const editButtons = this.shadowRoot.querySelectorAll('.edit-btn');
        const saveButtons = this.shadowRoot.querySelectorAll('.save-btn');
        const cancelButtons = this.shadowRoot.querySelectorAll('.cancel-btn');

        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                this.toggleEditMode(section, true);
            });
        });

        saveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                this.saveChanges(section);
            });
        });

        cancelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                this.toggleEditMode(section, false);
            });
        });

        // Avatar upload
        const avatarUpload = this.shadowRoot.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }
        // Fondo de perfil personalizado
        const bgUpload = this.shadowRoot.getElementById('bgUpload');
        if (bgUpload) {
            bgUpload.addEventListener('change', (e) => {
                this.handleBgUpload(e);
            });
        }
    }

    toggleEditMode(section, isEditing) {
        const inputs = section.querySelectorAll('input, textarea');
        const editBtn = section.querySelector('.edit-btn');
        const saveBtn = section.querySelector('.save-btn');
        const cancelBtn = section.querySelector('.cancel-btn');

        inputs.forEach(input => {
            input.disabled = !isEditing;
            if (isEditing) {
                input.classList.add('editing');
            } else {
                input.classList.remove('editing');
            }
        });

        if (isEditing) {
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-flex';
            cancelBtn.style.display = 'inline-flex';
        } else {
            editBtn.style.display = 'inline-flex';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }
    }

    async saveChanges(section) {
        // Here you would save to Firebase
        console.log('Saving changes...');
        this.toggleEditMode(section, false);
        
        // Show success message
        this.showNotification('Changes saved successfully!', 'success');
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatar = this.shadowRoot.getElementById('profileAvatar');
                avatar.style.backgroundImage = `url(${e.target.result})`;
                avatar.textContent = '';
            };
            reader.readAsDataURL(file);
        }
    }

    handleBgUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Guardar en localStorage
                localStorage.setItem('studentProfileBg', e.target.result);
                // Forzar re-render
                this.render();
                this.setupEventListeners();
            };
            reader.readAsDataURL(file);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        this.shadowRoot.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
        const bioInput = this.shadowRoot.getElementById('bio');
        const schoolInput = this.shadowRoot.getElementById('school');
        const levelInput = this.shadowRoot.getElementById('level');
        const majorInput = this.shadowRoot.getElementById('major');
        const countryInput = this.shadowRoot.getElementById('country');

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

        // Set default values for new fields
        if (bioInput) bioInput.value = userProfile.personal?.bio || 'Passionate student interested in technology and innovation.';
        if (schoolInput) {
            const schoolValue = userProfile.personal?.school || '';
            schoolInput.value = schoolValue;
            if (!schoolValue) {
                schoolInput.classList.add('empty-placeholder');
                schoolInput.value = '';
                schoolInput.placeholder = 'No information provided';
            } else {
                schoolInput.classList.remove('empty-placeholder');
                schoolInput.placeholder = 'Your school or university';
            }
        }
        if (levelInput) levelInput.value = userProfile.personal?.level || 'Undergraduate';
        if (majorInput) majorInput.value = userProfile.personal?.major || 'Computer Science';
        if (countryInput) {
            const countryValue = userProfile.personal?.country || '';
            countryInput.value = countryValue;
            if (!countryValue) {
                countryInput.classList.add('empty-placeholder');
                countryInput.value = '';
                countryInput.placeholder = 'No information provided';
            } else {
                countryInput.classList.remove('empty-placeholder');
                countryInput.placeholder = 'Country';
            }
        }
    }

    render() {
        // Leer imagen de fondo personalizada de localStorage
        const customBg = localStorage.getItem('studentProfileBg');
        const bgStyle = customBg
            ? `background-image: url('${customBg}');`
            : `background-image: url('../../assets/utiles-escolares.jpg');`;
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .profile-overview {
                    padding: 0.5rem 3rem 0.5rem 3rem;
                }

                .profile-header {
                    ${bgStyle}
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                 
                    border-radius: 20px;
                    padding: 3rem 2rem;
                    text-align: center;
                    color: white;
                    margin-bottom: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .profile-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    pointer-events: none;
                }
                .profile-header .bg-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.45); /* Opacidad ajustable */
                    z-index: 1;
                    pointer-events: none;
                }
                .profile-header-content {
                    position: relative;
                    z-index: 2;
                }
                .bg-upload {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 3;
                    background: rgba(255,255,255,0.8);
                    border-radius: 8px;
                    padding: 0.3rem 0.7rem;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .bg-upload input {
                    display: none;
                }
                .bg-upload i {
                    color: #3468c0;
                }

                .avatar-container {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 1.5rem;
                }

                .profile-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 700;
                    margin: 0 auto;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .avatar-upload {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid #3468c0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #3468c0;
                }

                .avatar-upload:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .avatar-upload input {
                    display: none;
                }

                .profile-name {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem 0;
                }

                .profile-role {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin: 0 0 1rem 0;
                }

                .profile-stats {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 1.5rem;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    display: block;
                }

                .stat-label {
                    font-size: 0.875rem;
                    opacity: 0.8;
                }

                .profile-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .profile-section {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-icon {
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 0.75rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 1rem;
                    background: #f9fafb;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #3468c0;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                .form-input:disabled {
                    background: #f3f4f6;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .form-input.editing {
                    background: white;
                    color: #1f2937;
                }

                .form-input.empty-placeholder {
                    color: #bdbdbd !important;
                }

                .form-textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 1rem;
                    background: #f9fafb;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    resize: vertical;
                    min-height: 100px;
                    font-family: inherit;
                }

                .form-textarea:focus {
                    outline: none;
                    border-color: #3468c0;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                .form-textarea:disabled {
                    background: #f3f4f6;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .form-textarea.editing {
                    background: white;
                    color: #1f2937;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
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
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(52, 104, 192, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                }

                .btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }

                .edit-btn {
                    display: inline-flex;
                }

                .save-btn, .cancel-btn {
                    display: none;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }

                .notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .profile-content {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .profile-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .profile-header {
                        padding: 2rem 1rem;
                    }

                    .profile-name {
                        font-size: 1.5rem;
                    }

                    .profile-stats {
                        gap: 1rem;
                    }

                    .profile-section {
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .profile-avatar {
                        width: 100px;
                        height: 100px;
                        font-size: 2.5rem;
                    }

                    .avatar-upload {
                        width: 35px;
                        height: 35px;
                    }

                    .profile-stats {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
            </style>

            <div class="profile-overview">
                <!-- Profile Header -->
                <div class="profile-header">
                    <div class="bg-overlay"></div>
                    <!-- Botón de cambio de fondo eliminado -->
                    <div class="profile-header-content">
                        <div class="avatar-container">
                            <div class="profile-avatar" id="profileAvatar">JD</div>
                            <label class="avatar-upload">
                                <i class="fas fa-camera"></i>
                                <input type="file" id="avatarUpload" accept="image/*">
                            </label>
                        </div>
                        <h1 class="profile-name" id="profileName">Loading...</h1>
                        <p class="profile-role" id="profileRole">Student</p>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <span class="stat-number">12</span>
                                <span class="stat-label">Products</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">8</span>
                                <span class="stat-label">Sales</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">15</span>
                                <span class="stat-label">Purchases</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Profile Content -->
                <div class="profile-content">
                    <!-- Personal Information -->
                    <div class="profile-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <div class="section-icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                Personal Information
                            </h3>
                            <button class="btn btn-primary edit-btn">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-success save-btn">
                                <i class="fas fa-save"></i>
                                Save
                            </button>
                            <button class="btn btn-secondary cancel-btn">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input class="form-input" type="text" id="fullName" placeholder="Enter your full name" disabled />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input class="form-input" type="email" id="email" placeholder="your.email@example.com" disabled />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Phone</label>
                            <input class="form-input" type="tel" id="phone" placeholder="+1 (555) 123-4567" disabled />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea class="form-textarea" id="bio" placeholder="Tell us about yourself..." disabled></textarea>
                        </div>
                    </div>

                    <!-- Academic Information -->
                    <div class="profile-section">
                        <div class="section-header">
                            <h3 class="section-title">
                                <div class="section-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                Academic Information
                            </h3>
                            <button class="btn btn-primary edit-btn">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-success save-btn">
                                <i class="fas fa-save"></i>
                                Save
                            </button>
                            <button class="btn btn-secondary cancel-btn">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Country</label>
                            <input class="form-input" type="text" id="country" placeholder="Country" disabled />
                        </div>
                        <div class="form-group">
                            <label class="form-label">School/University</label>
                            <input class="form-input" type="text" id="school" placeholder="Your school or university" disabled />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Level</label>
                            <input class="form-input" type="text" id="level" placeholder="Undergraduate, Graduate, etc." disabled />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Major/Field of Study</label>
                            <input class="form-input" type="text" id="major" placeholder="Your major or field of study" disabled />
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('student-profile', StudentProfile); 