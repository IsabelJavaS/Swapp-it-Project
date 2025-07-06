// Footer Web Component
// La ruta del logo se ajusta automáticamente según el entorno (local o Firebase Hosting)
class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    // Sistema mejorado de rutas dinámicas
    getBaseUrl() {
        // Detectar si estamos en Firebase Hosting o local
        const isFirebase = window.location.hostname.includes('firebaseapp.com') || 
                          window.location.hostname.includes('web.app') ||
                          window.location.hostname === 'localhost' && window.location.port === '5000';
        
        if (isFirebase) {
            return ''; // Firebase Hosting sirve desde la raíz
        } else {
            // Local development - detectar profundidad
            const path = window.location.pathname;
            const segments = path.split('/').filter(s => s);
            
            // Si estamos en la raíz o en /public
            if (segments.length === 0 || segments[0] === 'public') {
                return '/public';
            }
            
            // Si estamos en subdirectorios
            return '/public';
        }
    }

    getLogoPath() {
        const base = this.getBaseUrl();
        return `${base}/assets/logos/LogoSinFondo.png`;
    }

    // Método para cargar CSS de forma más robusta
    async loadStylesheets() {
        const stylesheets = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        const stylePromises = stylesheets.map(href => {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                
                link.onload = () => resolve();
                link.onerror = () => {
                    console.warn(`Failed to load stylesheet: ${href}`);
                    resolve(); // Continuar aunque falle
                };
                
                this.shadowRoot.appendChild(link);
            });
        });

        await Promise.all(stylePromises);
    }

    async render() {
        // Primero renderizar el HTML con estilos críticos inline
        this.shadowRoot.innerHTML = `
            <style>
                /* CSS Variables */
                :host {
                    --swappit-blue: #2563eb;
                    --swappit-blue-hover: #1d4ed8;
                    --swappit-orange: #f97316;
                    --bg-primary: #ffffff;
                    --text-primary: #1f2937;
                    --border-color: #e5e7eb;
                    --neutral-light: #f3f4f6;
                    --neutral-dark: #111827;
                    --font-primary: 'Inter', sans-serif;
                }

                /* Host styles */
                :host {
                    display: block;
                    width: 100%;
                }

                /* Footer Container */
                .marketplace-footer {
                    background: var(--neutral-dark);
                    color: white;
                    padding: 2rem 0 0;
                    margin-top: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .footer-main {
                    padding: 2rem 0 2rem;
                    position: relative;
                }

                /* Container */
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                /* Footer Grid - Single Row with 4 Columns */
                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    width: 100%;
                }

                /* Footer Column */
                .footer-column {
                    display: flex;
                    flex-direction: column;
                }

                /* Footer Brand */
                .footer-brand img {
                    width: 180px;
                    height: auto;
                    display: block;
                    margin-bottom: 1rem;
                }

                .footer-description {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                /* Social Links */
                .footer-social {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: auto;
                }

                .social-link {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .social-link:hover {
                    background: var(--swappit-blue);
                    transform: translateY(-2px);
                    color: white;
                }

                /* Footer Titles */
                .footer-title {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 1.25rem;
                    font-family: var(--font-primary);
                }

                /* Footer Links */
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 0.75rem;
                }

                .footer-links a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 0.9rem;
                }

                .footer-links a:hover {
                    color: var(--swappit-orange);
                }

                /* Footer Contact */
                .footer-contact {
                    margin-top: 1rem;
                }

                .footer-contact p {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                /* Footer Bottom */
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 1.5rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 2rem;
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.6);
                    text-align: center;
                    margin: 0;
                    font-size: 0.9rem;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .footer-main {
                        padding: 1.5rem 0;
                    }

                    .footer-bottom {
                        padding: 1rem 0;
                    }
                }
            </style>
            
            <footer class="marketplace-footer">
                <div class="footer-main">
                    <div class="container">
                        <div class="footer-grid">
                            <!-- Brand Column -->
                            <div class="footer-column">
                                <div class="footer-brand">
                                    <img src="${this.getLogoPath()}" alt="SWAPPIT Logo">
                                </div>
                                <p class="footer-description">
                                    Join the sustainable student community where you can buy, sell, or exchange school supplies. Save money and help the environment!
                                </p>
                                <div class="footer-social">
                                    <a href="#" class="social-link" title="Facebook">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" class="social-link" title="Twitter">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" class="social-link" title="LinkedIn">
                                        <i class="fab fa-linkedin-in"></i>
                                    </a>
                                    <a href="#" class="social-link" title="Instagram">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div>

                            <!-- Quick Links -->
                            <div class="footer-column">
                                <h3 class="footer-title">Quick Links</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getBaseUrl()}/index.html">Home</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/marketplace-page.html">Marketplace</a></li>
                                    <li><a href="${this.getBaseUrl()}/index.html#about">About Us</a></li>
                                    <li><a href="${this.getBaseUrl()}/index.html#contact">Contact</a></li>
                                </ul>
                            </div>

                            <!-- Services -->
                            <div class="footer-column">
                                <h3 class="footer-title">Services</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getBaseUrl()}/pages/auth/register.html">Student Registration</a></li>
                                    <li><a href="#">Business Portal</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/swapcoin/info.html">SwapCoin Info</a></li>
                                    <li><a href="#">Help Center</a></li>
                                </ul>
                            </div>

                            <!-- Contact Info -->
                            <div class="footer-column">
                                <h3 class="footer-title">Contact Us</h3>
                                <div class="footer-contact">
                                    <p><i class="fas fa-envelope me-2"></i>support@swappit.com</p>
                                    <p><i class="fas fa-phone me-2"></i>+1 (555) 123-4567</p>
                                    <p><i class="fas fa-location-dot me-2"></i>123 Education Street, ST 12345</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <div class="container">
                        <p class="copyright">
                            © 2024 SWAPPIT. All rights reserved. | 
                            <a href="#" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">Privacy Policy</a> | 
                            <a href="#" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </footer>
        `;

        // Luego cargar los estilos externos
        await this.loadStylesheets();
    }

    attachEventListeners() {
        // Event listeners específicos del footer
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Social link clicked:', link.title);
                // Implementar lógica para redes sociales
            });
        });
    }
}

// Registrar el componente
customElements.define('app-footer', FooterComponent); 