// Footer Web Component - Professional Design
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
        return `${base}/assets/logos/logolargo.png`;
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
                /* CSS Variables - Consistent with main site */
                :host {
                    --swappit-blue: #3468c0;
                    --swappit-orange: #ffa424;
                    --swappit-blue-hover: #1d4ed8;
                    --swappit-orange-hover: #ff5722;
                    --neutral-dark: #1e293b;
                    --neutral-medium: #64748b;
                    --neutral-light: #f1f5f9;
                    --background-white: #ffffff;
                    --shadow-color: rgba(37, 99, 235, 0.1);
                    --font-primary: 'Poppins', sans-serif;
                    --font-secondary: 'Inter', sans-serif;
                    --success-green: #10b981;
                    --gradient-primary: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    --gradient-secondary: linear-gradient(135deg, var(--swappit-orange), var(--swappit-orange-hover));
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
                    position: relative;
                    overflow: hidden;
                }



                /* Main Footer Content */
                .footer-main {
                    padding: 3rem 0 1.5rem;
                    position: relative;
                }

                /* Container */
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                /* Footer Grid - Professional Layout */
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    gap: 2rem;
                    width: 100%;
                    align-items: start;
                }

                /* Footer Column */
                .footer-column {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    justify-content: flex-start;
                }

                /* Ajuste específico para la primera columna */
                .footer-column:first-child {
                    align-items: flex-start;
                }

                /* Ajuste para que el logo esté al mismo nivel que los títulos */
                .footer-column:first-child .footer-brand {
                    margin-top: 0;
                    padding-top: 0;
                    margin-bottom: 0.5rem;
                }

                .footer-column:first-child .footer-description {
                    margin-top: 0;
                    padding-top: 0;
                }

                /* Footer Brand - Professional */
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    margin-bottom: 1.5rem;
                }

                .footer-brand img {
                    width: 120px;
                    height: auto;
                    display: block;
                    margin-bottom: 1rem;
                    transition: transform 0.3s ease;
                }

                .footer-brand:hover img {
                    transform: translateY(-2px);
                }

                /* Ajuste para alinear el logo con los títulos */
                .footer-column:first-child .footer-brand {
                    margin-top: 0;
                    padding-top: 0;
                }

                .footer-description {
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    font-family: var(--font-secondary);
                    text-align: left;
                    max-width: 280px;
                }

                /* Social Links - Professional */
                .footer-social {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: auto;
                    justify-content: flex-start;
                }

                .social-link {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--swappit-orange);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .social-link:hover {
                    background: var(--gradient-secondary);
                    transform: translateY(-3px);
                    color: white;
                    box-shadow: 0 8px 25px rgba(255, 164, 36, 0.4);
                }

                /* Footer Titles - Professional */
                .footer-title {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 1.25rem;
                    font-family: var(--font-primary);
                    position: relative;
                    margin-top: 0;
                }

                .footer-title::after {
                    content: '';
                    position: absolute;
                    bottom: -0.5rem;
                    left: 0;
                    width: 25px;
                    height: 2px;
                    background: var(--gradient-secondary);
                    border-radius: 1px;
                }

                /* Footer Links - Professional */
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    margin-top: 0;
                }

                .footer-links li {
                    margin-bottom: 0.4rem;
                    line-height: 1.4;
                    min-height: 1.4em;
                }

                .footer-links li:first-child {
                    margin-top: 0;
                }

                .footer-links a {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    font-family: var(--font-secondary);
                    display: flex;
                    align-items: center;
                    padding: 0.4rem 0;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    line-height: 1.4;
                    min-height: 1.4em;
                }

                .footer-links a:hover {
                    color: var(--swappit-orange);
                    transform: translateX(3px);
                    background: rgba(255, 255, 255, 0.05);
                    padding-left: 0.5rem;
                }

                /* Footer Contact - Professional */
                .footer-contact {
                    margin-top: 0;
                    padding-top: 0;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }

                .footer-contact p {
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 0.4rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    font-family: var(--font-secondary);
                    padding: 0.4rem 0;
                    transition: all 0.3s ease;
                    line-height: 1.4;
                    min-height: 1.4em;
                    margin-top: 0;
                }

                .footer-contact p:hover {
                    color: var(--swappit-orange);
                    transform: translateX(3px);
                }

                .footer-contact p:first-child {
                    margin-top: 0;
                }

                .footer-contact p i {
                    margin-right: 0.75rem;
                    width: 16px;
                    text-align: center;
                    color: var(--swappit-orange);
                    font-size: 0.9rem;
                }



                /* Footer Bottom - Professional */
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1.5rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 2rem;
                }

                .footer-bottom-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .footer-bottom-left {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    font-size: 0.85rem;
                    font-family: var(--font-secondary);
                }

                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .footer-legal a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                    font-family: var(--font-secondary);
                    padding: 0.25rem 0;
                }

                .footer-legal a:hover {
                    color: var(--swappit-orange);
                    transform: translateY(-1px);
                }

                /* Responsive - Professional */
                @media (max-width: 1200px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }

                    .footer-bottom-content {
                        flex-direction: column;
                        text-align: center;
                        gap: 1rem;
                    }

                    .footer-legal {
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .footer-main {
                        padding: 2rem 0 1rem;
                    }

                    .footer-bottom {
                        padding: 1rem 0;
                    }

                    .footer-legal {
                        gap: 1rem;
                    }
                }
            </style>
            
            <footer class="marketplace-footer">
                <!-- Main Footer Content -->
                <div class="footer-main">
                    <div class="container">
                        <div class="footer-grid">
                            <!-- Brand Column -->
                            <div class="footer-column">
                                <div class="footer-brand">
                                    <img src="${this.getLogoPath()}" alt="SWAPPIT Logo">
                                </div>
                                <p class="footer-description">
                                    SWAPPIT is revolutionizing how students access educational resources. We create a sustainable ecosystem where unused supplies find new homes.
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
                                    <a href="#" class="social-link" title="YouTube">
                                        <i class="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>

                            <!-- Quick Links -->
                            <div class="footer-column">
                                <h3 class="footer-title">Quick Links</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getBaseUrl()}/index.html">Home</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/marketplace.html">Marketplace</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/about/about.html">About Us</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/support/support.html">Support Center</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/swapcoin/buy-coins.html">Swappit Coins</a></li>
                                    <li><a href="#">Student Portal</a></li>
                                </ul>
                            </div>



                            <!-- Categories -->
                            <div class="footer-column">
                                <h3 class="footer-title">Categories</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/books.html">Textbooks & Books</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/uniforms.html">Uniforms</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/accessories.html">Accessories</a></li>
                                </ul>
                            </div>

                            <!-- Contact Info -->
                            <div class="footer-column">
                                <h3 class="footer-title">Contact Us</h3>
                                <div class="footer-contact">
                                    <p><i class="fas fa-envelope"></i>hello@swappit.com</p>
                                    <p><i class="fas fa-phone"></i>+1 (555) 123-4567</p>
                                    <p><i class="fas fa-location-dot"></i>123 Education Street, ST 12345</p>
                                    <p><i class="fas fa-clock"></i>Mon-Fri: 9AM-6PM EST</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Bottom - Professional -->
                <div class="footer-bottom">
                    <div class="container">
                        <div class="footer-bottom-content">
                            <div class="footer-bottom-left">
                                <p class="copyright">
                                    © 2024 SWAPPIT. All rights reserved. | Making education sustainable, one exchange at a time.
                                </p>
                            </div>
                            <div class="footer-legal">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Cookie Policy</a>
                                <a href="#">Data Protection</a>
                                <a href="#">Accessibility</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        // Luego cargar los estilos externos
        await this.loadStylesheets();
    }

    attachEventListeners() {
        // Social links
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Social link clicked:', link.title);
                // Implementar lógica para redes sociales
            });
        });

        // Footer links
        const footerLinks = this.shadowRoot.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Permitir navegación normal para enlaces internos
                if (link.href && !link.href.includes('#')) {
                    return; // Permitir navegación normal
                }
                e.preventDefault();
                console.log('Footer link clicked:', link.textContent.trim());
            });
        });
    }
}

// Registrar el componente
customElements.define('app-footer', FooterComponent); 