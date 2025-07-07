// Componente principal del dashboard de negocios
class BusinessDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSection = 'profile';
        this.isSidebarCollapsed = false;
    }
    connectedCallback() {
        this.render();
        this.setupListeners();
        this.loadSection(this.currentSection);
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    min-height: 100vh; 
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
                    font-family: var(--font-family, 'Inter', sans-serif); 
                    padding-top: 80px; /* Espacio para el header fijo */
                    box-sizing: border-box;
                }
                .dashboard-layout {
                    display: flex;
                    min-height: calc(100vh - 80px);
                    transition: all 0.3s ease;
                }
                .sidebar-area {
                    flex: 0 0 280px;
                    transition: all 0.3s ease;
                }
                .sidebar-area.collapsed {
                    flex: 0 0 70px;
                }
                .content-area {
                    flex: 1;
                    padding: 2rem;
                    min-width: 0;
                    transition: all 0.3s ease;
                }
                .content-area.expanded {
                    padding-left: 1rem;
                }
                @media (max-width: 900px) {
                    .dashboard-layout { flex-direction: column; gap: 0; }
                    .sidebar-area { flex: none; align-items: stretch; }
                    .content-area { padding: 1rem; }
                }
            </style>
            <div class="dashboard-layout">
                <div class="sidebar-area" id="sidebarArea">
                    <business-sidebar></business-sidebar>
                </div>
                <div class="content-area" id="contentArea">
                    <div id="section-content"></div>
                </div>
            </div>
            <dashboard-footer></dashboard-footer>
        `;
    }
    setupListeners() {
        const sidebar = this.shadowRoot.querySelector('business-sidebar');
        const sidebarArea = this.shadowRoot.getElementById('sidebarArea');
        const contentArea = this.shadowRoot.getElementById('contentArea');

        // Listen for section changes
        sidebar.addEventListener('sectionChange', (e) => {
            this.loadSection(e.detail.section);
        });

        // Listen for sidebar toggle
        sidebar.addEventListener('sidebarToggle', (e) => {
            this.isSidebarCollapsed = e.detail.collapsed;
            if (this.isSidebarCollapsed) {
                sidebarArea.classList.add('collapsed');
                contentArea.classList.add('expanded');
            } else {
                sidebarArea.classList.remove('collapsed');
                contentArea.classList.remove('expanded');
            }
            // Dispatch global event for footer
            document.dispatchEvent(new CustomEvent('sidebarToggle', {
                detail: { collapsed: this.isSidebarCollapsed }
            }));
        });
    }
    loadSection(section) {
        this.currentSection = section;
        const content = this.shadowRoot.getElementById('section-content');
        switch (section) {
            case 'overview':
                content.innerHTML = '<business-dashboard-overview></business-dashboard-overview>';
                break;
            case 'add-product':
                content.innerHTML = '<business-add-product></business-add-product>';
                break;
            case 'inventory':
                content.innerHTML = '<business-inventory></business-inventory>';
                break;
            case 'orders':
                content.innerHTML = '<business-orders></business-orders>';
                break;
            case 'analytics':
                content.innerHTML = '<business-analytics></business-analytics>';
                break;
            case 'customers':
                content.innerHTML = '<business-customers></business-customers>';
                break;
            case 'notifications':
                content.innerHTML = '<business-notifications></business-notifications>';
                break;
            case 'profile':
                content.innerHTML = '<business-profile></business-profile>';
                break;
            case 'settings':
                content.innerHTML = '<business-settings></business-settings>';
                break;
            default:
                content.innerHTML = '<business-dashboard-overview></business-dashboard-overview>';
        }
    }
}
customElements.define('business-dashboard', BusinessDashboard); 