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
                    --swappit-orange-hover: #ea580c;
                    --bg-primary: #ffffff;
                    --text-primary: #1f2937;
                    --border-color: #e5e7eb;
                    --neutral-light: #f3f4f6;
                    --neutral-dark: #111827;
                    --neutral-darker: #0f172a;
                    --font-primary: 'Inter', sans-serif;
                    --success-green: #10b981;
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

                /* Newsletter Section */
                .newsletter-section {
                    background: linear-gradient(135deg, var(--swappit-blue), var(--swappit-blue-hover));
                    padding: 3rem 0;
                    text-align: center;
                }

                .newsletter-content {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .newsletter-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: white;
                }

                .newsletter-subtitle {
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }

                .newsletter-form {
                    display: flex;
                    gap: 1rem;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .newsletter-input {
                    flex: 1;
                    padding: 0.875rem 1rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    background: rgba(255, 255, 255, 0.95);
                    color: var(--text-primary);
                }

                .newsletter-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
                }

                .newsletter-button {
                    padding: 0.875rem 1.5rem;
                    background: var(--swappit-orange);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .newsletter-button:hover {
                    background: var(--swappit-orange-hover);
                    transform: translateY(-1px);
                }

                /* Main Footer Content */
                .footer-main {
                    padding: 3rem 0 2rem;
                    position: relative;
                }

                /* Container */
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                /* Footer Grid - 5 Columns */
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
                    gap: 2rem;
                    width: 100%;
                }

                /* Footer Column */
                .footer-column {
                    display: flex;
                    flex-direction: column;
                }

                /* Footer Brand */
                .footer-brand {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .footer-brand img {
                    width: 120px;
                    height: auto;
                    display: block;
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
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--swappit-orange);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .social-link:hover {
                    background: var(--swappit-orange);
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
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }

                .footer-contact p i {
                    margin-right: 0.75rem;
                    width: 16px;
                    text-align: center;
                    color: var(--swappit-orange);
                }

                /* Footer Bottom */
                .footer-bottom {
                    background: var(--neutral-darker);
                    padding: 1.5rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .footer-bottom-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                    font-size: 0.9rem;
                }

                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .footer-legal a {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.3s ease;
                }

                .footer-legal a:hover {
                    color: var(--swappit-orange);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: repeat(3, 1fr);
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
                    }

                    .footer-bottom-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .footer-legal {
                        justify-content: center;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .footer-main {
                        padding: 2rem 0 1.5rem;
                    }

                    .newsletter-section {
                        padding: 2rem 0;
                    }

                    .newsletter-title {
                        font-size: 1.5rem;
                    }

                    .footer-bottom {
                        padding: 1rem 0;
                    }
                }
            </style>
            
            <footer class="marketplace-footer">
                <!-- Newsletter Section -->
                <div class="newsletter-section">
                    <div class="container">
                        <div class="newsletter-content">
                            <h2 class="newsletter-title">Stay Updated with SWAPPIT</h2>
                            <p class="newsletter-subtitle">Get the latest updates on new features, student deals, and sustainability tips delivered to your inbox.</p>
                            <form class="newsletter-form" id="newsletterForm">
                                <input type="email" class="newsletter-input" placeholder="Enter your email address" required>
                                <button type="submit" class="newsletter-button">Subscribe</button>
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
                                    Join the sustainable student community where you can buy, sell, or exchange school supplies. Save money and help the environment while building lasting connections.
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
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/marketplace.html">Marketplace</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/about/about.html">About Us</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/support/support.html">Support</a></li>
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

                            <!-- Categories -->
                            <div class="footer-column">
                                <h3 class="footer-title">Categories</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/books.html">Books</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/electronics.html">Electronics</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/stationery.html">Stationery</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/categories/uniforms.html">Uniforms</a></li>
                                </ul>
                            </div>

                            <!-- Contact Info -->
                            <div class="footer-column">
                                <h3 class="footer-title">Contact Us</h3>
                                <div class="footer-contact">
                                    <p><i class="fas fa-envelope"></i>support@swappit.com</p>
                                    <p><i class="fas fa-phone"></i>+1 (555) 123-4567</p>
                                    <p><i class="fas fa-location-dot"></i>123 Education Street, ST 12345</p>
                                    <p><i class="fas fa-clock"></i>Mon-Fri: 9AM-6PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <div class="container">
                        <div class="footer-bottom-content">
                            <p class="copyright">
                                © 2024 SWAPPIT. All rights reserved.
                            </p>
                            <div class="footer-legal">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Cookie Policy</a>
                                <a href="#">Data Protection</a>
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
        // Simular envío de newsletter
        const button = this.shadowRoot.querySelector('.newsletter-button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Subscribed!';
            button.style.background = 'var(--success-green)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                this.shadowRoot.querySelector('.newsletter-input').value = '';
            }, 2000);
        }, 1000);

        console.log('Newsletter subscription:', email);
        // Aquí se implementaría la lógica real de suscripción
    }
}

// Registrar el componente
customElements.define('app-footer', FooterComponent); 