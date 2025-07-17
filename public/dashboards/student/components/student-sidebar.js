// Student Sidebar Component
class StudentSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isCollapsed = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
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

                .sidebar {
                    width: 280px;
                    background: white;
                    border-right: 1px solid #e5e7eb;
                    height: calc(100vh - 80px);
                    position: fixed;
                    top: 80px;
                    left: 0;
                    overflow-y: auto;
                    overflow-x: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                    z-index: 100;
                }

                .sidebar.collapsed {
                    width: 70px;
                    overflow-x: hidden;
                }

                /* Scrollbar */
                .sidebar::-webkit-scrollbar {
                    width: 6px;
                }

                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .sidebar::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .sidebar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 0, 0, 0.3);
                }

                /* User Profile Section */
                .user-profile {
                    padding: 1.5rem;
                    border-bottom: 1px solid #f3f4f6;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .sidebar.collapsed .user-profile {
                    padding: 1rem 0.5rem;
                }

                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .sidebar.collapsed .user-avatar {
                    width: 36px;
                    height: 36px;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }

                .user-info {
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .sidebar.collapsed .user-info {
                    opacity: 0;
                    height: 0;
                    margin: 0;
                }

                .user-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .user-role {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin: 0;
                }

                /* Navigation */
                .nav-section {
                    padding: 1rem 0;
                }

                .nav-title {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 0 1.5rem 0.75rem;
                    margin: 0;
                    transition: all 0.3s ease;
                }

                .sidebar.collapsed .nav-title {
                    opacity: 0;
                    height: 0;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }

                .nav-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .nav-item {
                    margin: 0;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    position: relative;
                    border-left: 3px solid transparent;
                }

                .sidebar.collapsed .nav-link {
                    display: flex !important;
                    flex-direction: row;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    padding: 0.75rem 0 !important;
                    margin: 0 !important;
                    gap: 0 !important;
                    text-align: center !important;
                }

                .nav-link:hover {
                    background: #f8fafc;
                    color: #3468c0;
                    border-left-color: #3468c0;
                }

                .nav-link.active {
                    background: linear-gradient(135deg, rgba(52, 104, 192, 0.1), rgba(52, 104, 192, 0.05));
                    color: #3468c0;
                    border-left-color: #3468c0;
                    font-weight: 600;
                }

                .nav-link i {
                    width: 20px;
                    text-align: center;
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .sidebar.collapsed .nav-link i {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    width: 100% !important;
                    margin: 0 !important;
                    text-align: center !important;
                    font-size: 1.25rem !important;
                }

                .nav-text {
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .sidebar.collapsed .nav-text {
                    display: none !important;
                }

                .nav-badge {
                    background: #ef4444;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.125rem 0.5rem;
                    border-radius: 10px;
                    margin-left: auto;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                .sidebar.collapsed .nav-badge {
                    display: none !important;
                }

                /* Collapse Button como nav-link */
                .collapse-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .collapse-btn.nav-link {
                    width: 100%;
                    border: none;
                    background: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    font-size: 1.25rem;
                    padding: 0.75rem 0;
                    transition: background 0.2s, color 0.2s;
                }
                .collapse-btn.nav-link:hover {
                    background: #f8fafc;
                    color: #3468c0;
                }
                .sidebar.collapsed .collapse-btn.nav-link {
                    transform: rotate(180deg);
                }

                /* Tooltip for collapsed state */
                .nav-link {
                    position: relative;
                }

                .sidebar.collapsed .nav-link::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #1e293b;
                    color: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    z-index: 1000;
                    margin-left: 0.5rem;
                    pointer-events: none;
                }

                .sidebar.collapsed .nav-link::before {
                    content: '';
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 4px solid transparent;
                    border-right-color: #1e293b;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    z-index: 1000;
                    margin-left: -0.25rem;
                    pointer-events: none;
                }

                .sidebar.collapsed .nav-link:hover::after,
                .sidebar.collapsed .nav-link:hover::before {
                    opacity: 1;
                    visibility: visible;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }

                    .sidebar.show {
                        transform: translateX(0);
                    }
                }

                .collapse-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #f3f4f6;
                    border: none;
                    color: #3468c0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    box-shadow: 0 1px 4px rgba(52,104,192,0.08);
                    z-index: 10;
                    transition: background 0.2s, color 0.2s, right 0.3s;
                }
                .collapse-btn:hover {
                    background: #3468c0;
                    color: #fff;
                }
                .sidebar.collapsed .collapse-btn {
                    position: static;
                    margin: 1rem auto 0.5rem auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    right: unset;
                    left: unset;
                    background: #f3f4f6;
                    color: #3468c0;
                }
                .sidebar.collapsed .collapse-btn:hover {
                    background: #3468c0;
                    color: #fff;
                }
            </style>

            <div class="sidebar" id="sidebar">
                <button class="collapse-btn" id="collapseBtn" data-tooltip="Collapse/Expand Sidebar">
                    <i class="fas fa-arrow-left" id="collapseIcon"></i>
                </button>
                <ul class="nav-list collapse-list" id="collapseList" style="display: none;"></ul>
                <!-- User Profile -->
                <div class="user-profile">
                    <div class="user-avatar" id="userAvatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name" id="userName">Loading...</div>
                        <div class="user-role">Student</div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="nav-section">
                    <h3 class="nav-title">Main</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link active" data-section="dashboard" data-tooltip="Dashboard">
                                <i class="fas fa-tachometer-alt"></i>
                                <span class="nav-text">Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="profile" data-tooltip="Profile">
                                <i class="fas fa-user"></i>
                                <span class="nav-text">Profile</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <nav class="nav-section">
                    <h3 class="nav-title">Products</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="add-product" data-tooltip="Add Product">
                                <i class="fas fa-plus"></i>
                                <span class="nav-text">Add Product</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="my-products" data-tooltip="My Products">
                                <i class="fas fa-box"></i>
                                <span class="nav-text">My Products</span>
                                <span class="nav-badge">12</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <nav class="nav-section">
                    <h3 class="nav-title">Transactions</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="purchases" data-tooltip="Purchases">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="nav-text">Purchases</span>
                                <span class="nav-badge">5</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="sales" data-tooltip="Sales">
                                <i class="fas fa-dollar-sign"></i>
                                <span class="nav-text">Sales</span>
                                <span class="nav-badge">8</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <nav class="nav-section">
                    <h3 class="nav-title">Communication</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="notifications" data-tooltip="Notifications">
                                <i class="fas fa-bell"></i>
                                <span class="nav-text">Notifications</span>
                                <span class="nav-badge">3</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <nav class="nav-section">
                    <h3 class="nav-title">Settings</h3>
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-section="settings" data-tooltip="Settings">
                                <i class="fas fa-cog"></i>
                                <span class="nav-text">Settings</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        `;
    }

    attachEventListeners() {
        const sidebar = this.shadowRoot.getElementById('sidebar');
        const collapseBtn = this.shadowRoot.getElementById('collapseBtn');
        const collapseIcon = this.shadowRoot.getElementById('collapseIcon');
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');

        // Collapse/Expand functionality
        collapseBtn.addEventListener('click', () => {
            this.toggleCollapse();
            // Cambia el icono según el estado
            if (this.isCollapsed) {
                collapseIcon.classList.remove('fa-arrow-left');
                collapseIcon.classList.add('fa-arrow-right');
            } else {
                collapseIcon.classList.remove('fa-arrow-right');
                collapseIcon.classList.add('fa-arrow-left');
            }
        });

        // Navigation functionality
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Load user data
        this.loadUserData();
    }

    toggleCollapse() {
        const sidebar = this.shadowRoot.getElementById('sidebar');
        const collapseList = this.shadowRoot.getElementById('collapseList');
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            sidebar.classList.add('collapsed');
            collapseList.style.display = 'block';
        } else {
            sidebar.classList.remove('collapsed');
            collapseList.style.display = 'none';
        }

        // Dispatch event to parent component
        this.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    handleNavigation(clickedLink) {
        // Remove active class from all links
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to clicked link
        clickedLink.classList.add('active');

        // Get section name
        const section = clickedLink.dataset.section;

        // Dispatch event to parent component
        this.dispatchEvent(new CustomEvent('sectionChange', {
            detail: { section: section }
        }));
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
                this.updateUserInterface({ name: 'Guest', email: '', role: 'Guest', avatar: null });
                return;
            }

            console.log('Current user found:', currentUser.email);

            // Get user profile from Firestore
            const profileResult = await getUserProfile(currentUser.uid);
            if (!profileResult.success) {
                console.error('Failed to get user profile:', profileResult.error);
                // Use basic user info if profile not found
                const userData = {
                    name: currentUser.displayName || currentUser.email.split('@')[0],
                    email: currentUser.email,
                    role: 'User',
                    avatar: null
                };
                this.updateUserInterface(userData);
                return;
            }

            const userProfile = profileResult.data;
            let displayName = 'User';
            let role = 'Student';

            // Extract name based on role
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

            const userData = {
                name: displayName,
                email: userProfile.email,
                role: role,
                avatar: null
            };

            console.log('User data loaded:', userData);
            this.updateUserInterface(userData);
        } catch (error) {
            console.error('Error loading user data:', error);
            // Show guest user if there's an error
            this.updateUserInterface({ name: 'Guest', email: '', role: 'Guest', avatar: null });
        }
    }

    updateUserInterface(userData) {
        const userName = this.shadowRoot.getElementById('userName');
        const userAvatar = this.shadowRoot.getElementById('userAvatar');

        userName.textContent = userData.name;

        if (userData.avatar) {
            userAvatar.innerHTML = `<img src="${userData.avatar}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            // Generate initials from name
            const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.innerHTML = `<span>${initials}</span>`;
        }
    }

    setActiveSection(section) {
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });
    }
}

customElements.define('student-sidebar', StudentSidebar); 