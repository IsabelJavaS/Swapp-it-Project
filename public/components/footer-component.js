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
                /* Import Google Fonts */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

                /* CSS Variables - Consistent with main site */
                :host {
                    --swappit-blue: #3468c0;
                    --swappit-orange: #ffa424;
                    --swappit-blue-hover: #1d4ed8;
                    --swappit-orange-hover: #ff5722;
                    --neutral-dark: #1e293b;
                    --neutral-medium: #64748b;
                    --neutral-light: #f1f5f9;
                    --bg-primary: #ffffff;
                    --text-primary: #1e293b;
                    --border-color: #e2e8f0;
                    --font-primary: 'Poppins', sans-serif;
                    --font-secondary: 'Inter', sans-serif;
                    --shadow-color: rgba(37, 99, 235, 0.1);
                }

                /* Host styles */
                :host {
                    display: block;
                    width: 100%;
                }

                /* Footer Container */
                .marketplace-footer {
                    background: linear-gradient(135deg, var(--neutral-dark) 0%, #0f172a 100%);
                    color: white;
                    padding: 0;
                    margin-top: 4rem;
                    position: relative;
                    overflow: hidden;
                }

                /* Decorative background elements */
                .marketplace-footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                    opacity: 0.3;
                }

                .footer-main {
                    padding: 4rem 0 2rem;
                    position: relative;
                    z-index: 2;
                }

                /* Container */
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                /* Footer Grid - Modern 4 Column Layout */
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 3rem;
                    width: 100%;
                }

                /* Footer Column */
                .footer-column {
                    display: flex;
                    flex-direction: column;
                }

                /* Footer Brand */
                .footer-brand {
                    margin-bottom: 1.5rem;
                }

                .footer-brand img {
                    width: 180px;
                    height: auto;
                    display: block;
                    transition: transform 0.3s ease;
                }

                .footer-brand img:hover {
                    transform: scale(1.05);
                }

                .footer-description {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.7;
                    margin-bottom: 2rem;
                    font-size: 1rem;
                    font-family: var(--font-secondary);
                }

                /* Social Links */
                .footer-social {
                    display: flex;
                    gap: 1rem;
                    margin-top: auto;
                }

                .social-link {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 1.1rem;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    z-index: 1;
                }

                .social-link i {
                    position: relative;
                    z-index: 2;
                }

                /* SWAPPIT tricolor effect for all social links - same as newsletter button */
                .social-link {
                    background: linear-gradient(135deg, var(--swappit-orange) 0%, var(--swappit-orange-hover) 100%);
                    position: relative;
                }

                .social-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, var(--swappit-orange) 0%, var(--swappit-orange-hover) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    border-radius: 12px;
                }



                .social-link:hover::before {
                    opacity: 0.3;
                }

                .social-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .social-link:hover {
                    transform: translateY(-3px) scale(1.1);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
                    filter: brightness(1.1);
                }

                .social-link:hover::before {
                    left: 100%;
                }

                /* Footer Titles */
                .footer-title {
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    font-family: var(--font-primary);
                    position: relative;
                    padding-bottom: 0.75rem;
                }

                .footer-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 40px;
                    height: 3px;
                    background: linear-gradient(90deg, var(--swappit-orange), var(--swappit-blue));
                    border-radius: 2px;
                }

                /* Footer Links */
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 1rem;
                }

                .footer-links a {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                    font-family: var(--font-secondary);
                    display: flex;
                    align-items: center;
                    position: relative;
                    padding-left: 0;
                }

                .footer-links a::before {
                    content: '→';
                    margin-right: 0.5rem;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                    color: var(--swappit-orange);
                }

                .footer-links a:hover {
                    color: var(--swappit-orange);
                    padding-left: 0.5rem;
                }

                .footer-links a:hover::before {
                    opacity: 1;
                    transform: translateX(0);
                }

                /* Footer Contact */
                .footer-contact {
                    margin-top: 1rem;
                }

                .footer-contact p {
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                    font-family: var(--font-secondary);
                    display: flex;
                    align-items: center;
                    transition: color 0.3s ease;
                }

                .footer-contact p:hover {
                    color: var(--swappit-orange);
                }

                .footer-contact i {
                    margin-right: 0.75rem;
                    width: 16px;
                    color: var(--swappit-orange);
                }

                /* Newsletter Section */
                .footer-newsletter {
                    margin-top: 1.5rem;
                }

                .newsletter-input {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .newsletter-input input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    font-family: var(--font-secondary);
                    transition: all 0.3s ease;
                }

                .newsletter-input input:focus {
                    outline: none;
                    border-color: var(--swappit-orange);
                    background: rgba(255, 255, 255, 0.1);
                }

                .newsletter-input input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .newsletter-btn {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, var(--swappit-orange) 0%, var(--swappit-orange-hover) 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: var(--font-secondary);
                }

                .newsletter-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 164, 36, 0.3);
                }

                /* Footer Bottom */
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 2rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 3rem;
                    position: relative;
                    z-index: 2;
                }

                .footer-bottom-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    font-size: 0.9rem;
                    font-family: var(--font-secondary);
                }

                .footer-bottom-links {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .footer-bottom-links a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-family: var(--font-secondary);
                    transition: color 0.3s ease;
                }

                .footer-bottom-links a:hover {
                    color: var(--swappit-orange);
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                    }

                    .footer-bottom-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .footer-bottom-links {
                        justify-content: center;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .footer-main {
                        padding: 2rem 0 1rem;
                    }

                    .footer-bottom {
                        padding: 1.5rem 0;
                    }

                    .newsletter-input {
                        flex-direction: column;
                    }

                    .social-link {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }
                }

                /* Animation for newsletter input */
                @keyframes newsletterGlow {
                    0%, 100% { box-shadow: 0 0 5px rgba(255, 164, 36, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(255, 164, 36, 0.6); }
                }

                .newsletter-input input:focus {
                    animation: newsletterGlow 2s ease-in-out infinite;
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
                                    Join the sustainable student community where you can buy, sell, or exchange school supplies. Save money and help the environment while building lasting connections!
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
                                    <li><a href="${this.getBaseUrl()}/pages/marketplace/marketplace-page.html">Marketplace</a></li>
                                    <li><a href="${this.getBaseUrl()}/index.html#about">About Us</a></li>
                                    <li><a href="${this.getBaseUrl()}/index.html#contact">Contact</a></li>
                                    <li><a href="${this.getBaseUrl()}/pages/about/about.html">Our Story</a></li>
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
                                    <li><a href="#">Safety Guidelines</a></li>
                                </ul>
                            </div>

                            <!-- Contact & Newsletter -->
                            <div class="footer-column">
                                <h3 class="footer-title">Stay Connected</h3>
                                <div class="footer-contact">
                                    <p><i class="fas fa-envelope"></i>support@swappit.com</p>
                                    <p><i class="fas fa-phone"></i>+1 (555) 123-4567</p>
                                    <p><i class="fas fa-location-dot"></i>123 Education Street, ST 12345</p>
                                </div>
                                
                                <div class="footer-newsletter">
                                    <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1rem; font-size: 0.9rem;">
                                        Subscribe to our newsletter for updates and exclusive offers!
                                    </p>
                                    <div class="newsletter-input">
                                        <input type="email" placeholder="Enter your email" id="newsletter-email">
                                        <button class="newsletter-btn" id="newsletter-submit">
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
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
                                © 2024 SWAPPIT. All rights reserved. | Made in 
                            </p>
                            <div class="footer-bottom-links">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Cookie Policy</a>
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
        // Event listeners específicos del footer
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Social link clicked:', link.title);
                // Implementar lógica para redes sociales
            });
        });

        // Newsletter subscription
        const newsletterSubmit = this.shadowRoot.querySelector('#newsletter-submit');
        const newsletterEmail = this.shadowRoot.querySelector('#newsletter-email');
        
        if (newsletterSubmit && newsletterEmail) {
            newsletterSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                const email = newsletterEmail.value.trim();
                if (email && this.isValidEmail(email)) {
                    console.log('Newsletter subscription:', email);
                    // Implementar lógica de suscripción
                    newsletterEmail.value = '';
                    this.showNotification('Thank you for subscribing!', 'success');
                } else {
                    this.showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-family: var(--font-secondary);
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Registrar el componente
customElements.define('app-footer', FooterComponent); 