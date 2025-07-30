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

                /* Newsletter Section - Professional */
                .newsletter-section {
                    background: var(--gradient-primary);
                    padding: 3rem 0;
                    text-align: center;
                    position: relative;
                }

                .newsletter-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                    z-index: 1;
                }

                .newsletter-content {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    position: relative;
                    z-index: 2;
                }

                .newsletter-title {
                    font-family: var(--font-primary);
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: white;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .newsletter-subtitle {
                    color: rgba(255, 255, 255, 0.95);
                    margin-bottom: 2rem;
                    font-size: 1rem;
                    font-family: var(--font-secondary);
                    line-height: 1.6;
                }

                .newsletter-form {
                    display: flex;
                    gap: 0.75rem;
                    max-width: 450px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem;
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                }

                .newsletter-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: rgba(255, 255, 255, 0.95);
                    color: var(--neutral-dark);
                    font-family: var(--font-secondary);
                    transition: all 0.3s ease;
                }

                .newsletter-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
                    background: white;
                }

                .newsletter-button {
                    padding: 0.75rem 1.5rem;
                    background: var(--gradient-secondary);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    font-family: var(--font-primary);
                    font-size: 0.9rem;
                    box-shadow: 0 4px 12px rgba(255, 164, 36, 0.3);
                }

                .newsletter-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 164, 36, 0.4);
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

                    .newsletter-form {
                        flex-direction: column;
                        padding: 0.75rem;
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

                    .newsletter-title {
                        font-size: 1.5rem;
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

                    .newsletter-section {
                        padding: 2rem 0;
                    }

                    .newsletter-title {
                        font-size: 1.25rem;
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
                <!-- Newsletter Section -->
                <div class="newsletter-section">
                    <div class="container">
                        <div class="newsletter-content">
                            <h2 class="newsletter-title">Join the SWAPPIT Community</h2>
                            <p class="newsletter-subtitle">Get exclusive access to student deals, sustainability tips, and community updates.</p>
                            <form class="newsletter-form" id="newsletterForm">
                                <input type="email" class="newsletter-input" placeholder="Enter your student email" required>
                                <button type="submit" class="newsletter-button">
                                    <i class="fas fa-paper-plane me-2"></i>Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

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
                                    <li><a href="${this.getBaseUrl()}/pages/swapcoin/info.html">SwapCoin</a></li>
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
        // Newsletter form submission
        const newsletterForm = this.shadowRoot.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                this.handleNewsletterSubscription(email);
            });
        }



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

    handleNewsletterSubscription(email) {
        // Simular envío de newsletter con mejor UX
        const form = this.shadowRoot.getElementById('newsletterForm');
        const button = form.querySelector('button');
        const input = form.querySelector('input[type="email"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
        button.disabled = true;
        input.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
            button.style.background = 'var(--success-green)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                input.value = '';
                input.disabled = false;
            }, 2000);
        }, 1500);

        console.log('Newsletter subscription:', email);
        // Aquí se implementaría la lógica real de suscripción
    }
}

// Registrar el componente
customElements.define('app-footer', FooterComponent); 