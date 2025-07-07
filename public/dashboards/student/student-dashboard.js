// Componente principal del dashboard de estudiante
class StudentDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSection = 'dashboard';
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
                    min-height: calc(100vh - 80px); /* Ajustar altura considerando el header */
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
                    .dashboard-layout { 
                        flex-direction: column; 
                        gap: 0; 
                    }
                    .sidebar-area { 
                        flex: none; 
                        align-items: stretch; 
                    }
                    .content-area { 
                        padding: 1rem; 
                    }
                }
            </style>
            <div class="dashboard-layout">
                <div class="sidebar-area" id="sidebarArea">
                    <student-sidebar></student-sidebar>
                </div>
                <div class="content-area" id="contentArea">
                    <div id="section-content"></div>
                </div>
            </div>
            <dashboard-footer></dashboard-footer>
        `;
    }
    setupListeners() {
        const sidebar = this.shadowRoot.querySelector('student-sidebar');
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
        
        // Update sidebar active state
        const sidebar = this.shadowRoot.querySelector('student-sidebar');
        if (sidebar.setActiveSection) {
            sidebar.setActiveSection(section);
        }

        // Dispatch global event for footer
        document.dispatchEvent(new CustomEvent('sectionChange', {
            detail: { section: section }
        }));

        switch (section) {
            case 'dashboard':
                content.innerHTML = '<student-dashboard-overview></student-dashboard-overview>';
                break;
            case 'profile':
                content.innerHTML = '<student-profile></student-profile>';
                break;
            case 'add-product':
                content.innerHTML = '<student-add-product></student-add-product>';
                break;
            case 'my-products':
                content.innerHTML = '<student-products></student-products>';
                break;
            case 'purchases':
                content.innerHTML = '<student-purchases></student-purchases>';
                break;
            case 'sales':
                content.innerHTML = '<student-sales></student-sales>';
                break;
            case 'notifications':
                content.innerHTML = '<student-notifications></student-notifications>';
                break;
            case 'settings':
                content.innerHTML = '<student-settings></student-settings>';
                break;
            default:
                content.innerHTML = '<student-dashboard-overview></student-dashboard-overview>';
        }
    }
}
customElements.define('student-dashboard', StudentDashboard); 