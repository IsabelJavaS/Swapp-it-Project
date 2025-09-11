/**
 * Dashboard Footer Component
 * Modern footer component for dashboard pages with copyright information
 */
class DashboardFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isSidebarCollapsed = false;
    }

    connectedCallback() {
        this.render();
        this.setupSidebarListener();
    }

    setupSidebarListener() {
        // Listen for sidebar toggle events from the dashboard
        document.addEventListener('sidebarToggle', (e) => {
            this.isSidebarCollapsed = e.detail.collapsed;
            this.updateLayout();
        });

        // Also listen for custom events from the sidebar component
        document.addEventListener('sectionChange', () => {
            // Update layout when section changes
            this.updateLayout();
        });
    }

    updateLayout() {
        const footer = this.shadowRoot.querySelector('.footer-container');
        if (footer) {
            if (this.isSidebarCollapsed) {
                footer.style.marginLeft = '70px';
            } else {
                footer.style.marginLeft = '280px';
            }
        }
    }

    render() {
        const currentYear = new Date().getFullYear();
        
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
                
                :host {
                    display: block;
                    width: 100%;
                    background: #f8fafc;
                    color: #1e293b;
                    font-family: 'Poppins', sans-serif;
                    position: relative;
                    overflow: hidden;
                    margin-top: auto;
                    border-top: 1px solid #e2e8f0;
                }

                .footer-container {
                    padding: 1.5rem 0;
                    position: relative;
                    z-index: 2;
                    transition: margin-left 0.3s ease;
                    margin-left: 280px; /* Default sidebar width */
                }

                .footer-container.collapsed {
                    margin-left: 70px; /* Collapsed sidebar width */
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .footer-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 2rem;
                }

                .footer-copyright {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-family: 'Inter', sans-serif;
                }

                .footer-logo {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .footer-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .footer-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }

                .footer-link {
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.3s ease;
                    position: relative;
                    padding: 0.5rem 0;
                }

                .footer-link:hover {
                    color: #3468c0;
                    transform: translateY(-1px);
                }

                .footer-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #3468c0, #ffa424);
                    transition: width 0.3s ease;
                }

                .footer-link:hover::after {
                    width: 100%;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .footer-container {
                        padding: 1rem 0;
                        margin-left: 0 !important;
                    }

                    .footer-content {
                        padding: 0 1rem;
                    }

                    .footer-row {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .footer-links {
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .footer-links {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                }
            </style>

            <div class="footer-container" id="footerContainer">
                <div class="footer-content">
                    <div class="footer-row">
                        <div class="footer-copyright">
                            <div class="footer-logo">
                                <img src="/assets/logos/letraS.png" alt="SWAPP-IT Logo">
                            </div>
                            <span>© ${currentYear} SWAPP-IT. All rights reserved.</span>
                        </div>
                        
                        <div class="footer-links">
                            <a href="/pages/policy/terms.html" class="footer-link">Privacy Policy</a>
                            <a href="/pages/policy/terms.html" class="footer-link">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Register the custom element
customElements.define('dashboard-footer', DashboardFooter); 