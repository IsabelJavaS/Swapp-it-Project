// Business Sidebar Component (clonado y adaptado del student-sidebar)
class BusinessSidebar extends HTMLElement {
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
                :host { display: block; font-family: 'Inter', sans-serif; }
                .sidebar { width: 280px; background: white; border-right: 1px solid #e5e7eb; height: calc(100vh - 80px); position: fixed; top: 80px; left: 0; overflow-y: auto; overflow-x: hidden; transition: all 0.3s ease; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 100; }
                .sidebar.collapsed { width: 70px; overflow-x: hidden; }
                .sidebar::-webkit-scrollbar { width: 6px; }
                .sidebar::-webkit-scrollbar-track { background: transparent; }
                .sidebar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); border-radius: 3px; }
                .sidebar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.3); }
                .user-profile { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; text-align: center; transition: all 0.3s ease; }
                .sidebar.collapsed .user-profile { padding: 1rem 0.5rem; }
                .user-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #764ba2, #667eea); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 1.25rem; font-weight: 600; transition: all 0.3s ease; }
                .sidebar.collapsed .user-avatar { width: 36px; height: 36px; font-size: 1rem; margin-bottom: 0.5rem; }
                .user-info { transition: all 0.3s ease; overflow: hidden; }
                .sidebar.collapsed .user-info { opacity: 0; height: 0; margin: 0; }
                .user-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.25rem 0; }
                .user-role { font-size: 0.75rem; color: #64748b; margin: 0; }
                .nav-section { padding: 1rem 0; }
                .nav-title { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 1.5rem 0.75rem; margin: 0; transition: all 0.3s ease; }
                .sidebar.collapsed .nav-title { opacity: 0; height: 0; padding: 0; margin: 0; overflow: hidden; }
                .nav-list { list-style: none; padding: 0; margin: 0; }
                .nav-item { margin: 0; }
                .nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: #64748b; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: all 0.2s ease; position: relative; border-left: 3px solid transparent; }
                .sidebar.collapsed .nav-link { display: flex !important; flex-direction: row; justify-content: center !important; align-items: center !important; width: 100% !important; padding: 0.75rem 0 !important; margin: 0 !important; gap: 0 !important; text-align: center !important; }
                .nav-link:hover { background: #f8fafc; color: #764ba2; border-left-color: #764ba2; }
                .nav-link.active { background: linear-gradient(135deg, rgba(118,75,162,0.1), rgba(102,126,234,0.05)); color: #764ba2; border-left-color: #764ba2; font-weight: 600; }
                .nav-link i { width: 20px; text-align: center; font-size: 1rem; flex-shrink: 0; }
                .sidebar.collapsed .nav-link i { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; margin: 0 !important; text-align: center !important; font-size: 1.25rem !important; }
                .nav-text { transition: all 0.3s ease; white-space: nowrap; }
                .sidebar.collapsed .nav-text { display: none !important; }
                .nav-badge { background: #ef4444; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 10px; margin-left: auto; transition: all 0.3s ease; flex-shrink: 0; }
                .sidebar.collapsed .nav-badge { display: none !important; }
                .collapse-list { list-style: none; padding: 0; margin: 0; }
                .collapse-btn.nav-link { width: 100%; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #764ba2; font-size: 1.25rem; padding: 0.75rem 0; transition: background 0.2s, color 0.2s; }
                .collapse-btn.nav-link:hover { background: #f8fafc; color: #667eea; }
                .sidebar.collapsed .collapse-btn.nav-link { transform: rotate(180deg); margin: 1rem auto 0.5rem auto; }
            </style>
            <div class="sidebar" id="sidebar">
                <ul class="nav-list collapse-list">
                    <li class="nav-item">
                        <button class="collapse-btn nav-link" id="collapseBtn" data-tooltip="Collapse/Expand Sidebar">
                            <i class="fas fa-arrow-left" id="collapseIcon"></i>
                        </button>
                    </li>
                </ul>
                <div class="user-profile">
                    <div class="user-avatar" id="userAvatar">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name" id="userName">Business Corp</div>
                        <div class="user-role">Business</div>
                    </div>
                </div>
                <nav class="nav-section">
                    <h3 class="nav-title">Main</h3>
                    <ul class="nav-list">
                        <li class="nav-item"><a href="#" class="nav-link active" data-section="overview" data-tooltip="Overview"><i class="fas fa-chart-pie"></i><span class="nav-text">Overview</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="add-product" data-tooltip="Add Product"><i class="fas fa-plus"></i><span class="nav-text">Add Product</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="inventory" data-tooltip="Inventory"><i class="fas fa-boxes"></i><span class="nav-text">Inventory</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="orders" data-tooltip="Orders"><i class="fas fa-shopping-cart"></i><span class="nav-text">Orders</span></a></li>
                    </ul>
                </nav>
                <nav class="nav-section">
                    <h3 class="nav-title">Analytics</h3>
                    <ul class="nav-list">
                        <li class="nav-item"><a href="#" class="nav-link" data-section="analytics" data-tooltip="Analytics"><i class="fas fa-chart-line"></i><span class="nav-text">Analytics</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="customers" data-tooltip="Customers"><i class="fas fa-users"></i><span class="nav-text">Customers</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="notifications" data-tooltip="Notifications"><i class="fas fa-bell"></i><span class="nav-text">Notifications</span></a></li>
                    </ul>
                </nav>
                <nav class="nav-section">
                    <h3 class="nav-title">Account</h3>
                    <ul class="nav-list">
                        <li class="nav-item"><a href="#" class="nav-link" data-section="profile" data-tooltip="Profile"><i class="fas fa-building"></i><span class="nav-text">Profile</span></a></li>
                        <li class="nav-item"><a href="#" class="nav-link" data-section="settings" data-tooltip="Settings"><i class="fas fa-cog"></i><span class="nav-text">Settings</span></a></li>
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

        // Load user data (puedes personalizar para empresa)
        this.loadUserData();
    }

    toggleCollapse() {
        const sidebar = this.shadowRoot.getElementById('sidebar');
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
        this.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: this.isCollapsed } }));
    }

    handleNavigation(clickedLink) {
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
        const section = clickedLink.dataset.section;
        this.dispatchEvent(new CustomEvent('sectionChange', { detail: { section: section } }));
    }

    async loadUserData() {
        // Aquí puedes cargar datos reales de la empresa si lo deseas
        const mockUserData = { name: 'Business Corp', avatar: null };
        this.updateUserInterface(mockUserData);
    }

    updateUserInterface(userData) {
        const userName = this.shadowRoot.getElementById('userName');
        const userAvatar = this.shadowRoot.getElementById('userAvatar');
        userName.textContent = userData.name;
        if (userData.avatar) {
            userAvatar.innerHTML = `<img src="${userData.avatar}" alt="Business Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            userAvatar.innerHTML = `<span><i class="fas fa-briefcase"></i></span>`;
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
customElements.define('business-sidebar', BusinessSidebar); 