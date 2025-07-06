// Configuración centralizada para rutas y entorno
export class AppConfig {
    static getBaseUrl() {
        // Detectar si estamos en Firebase Hosting o local
        const isFirebase = window.location.hostname.includes('firebaseapp.com') || 
                          window.location.hostname.includes('web.app') ||
                          window.location.hostname === 'localhost' && window.location.port === '5000';
        
        if (isFirebase) {
            return ''; // Firebase Hosting sirve desde la raíz
        } else {
            // Local development - siempre usar /public para consistencia
            return '/public';
        }
    }

    static getAssetPath(assetPath) {
        const base = this.getBaseUrl();
        return `${base}${assetPath.startsWith('/') ? assetPath : '/' + assetPath}`;
    }

    static getPagePath(pagePath) {
        const base = this.getBaseUrl();
        return `${base}${pagePath.startsWith('/') ? pagePath : '/' + pagePath}`;
    }

    // Rutas de assets comunes
    static getLogoPath() {
        return this.getAssetPath('/assets/logos/LogoSinFondo.png');
    }

    static getCssPath() {
        return this.getAssetPath('/components/components.css');
    }

    static getStylePath() {
        return this.getAssetPath('/css/style.css');
    }

    // Rutas de páginas comunes
    static getHomePath() {
        return this.getPagePath('/index.html');
    }

    static getMarketplacePath() {
        return this.getPagePath('/pages/marketplace/marketplace-page.html');
    }

    static getLoginPath() {
        return this.getPagePath('/pages/auth/login.html');
    }

    static getRegisterPath() {
        return this.getPagePath('/pages/auth/register.html');
    }

    static getSwapcoinInfoPath() {
        return this.getPagePath('/pages/swapcoin/info.html');
    }

    // Detectar entorno
    static isDevelopment() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    static isProduction() {
        return window.location.hostname.includes('firebaseapp.com') || 
               window.location.hostname.includes('web.app');
    }

    // Configuración de debug
    static isDebugMode() {
        return this.isDevelopment() || window.location.search.includes('debug=true');
    }
}

// Función helper para cargar estilos de forma robusta
export async function loadStylesheets(shadowRoot, stylesheets) {
    const stylePromises = stylesheets.map(href => {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => {
                if (AppConfig.isDebugMode()) {
                    console.log(`✅ Stylesheet loaded: ${href}`);
                }
                resolve();
            };
            
            link.onerror = () => {
                console.warn(`⚠️ Failed to load stylesheet: ${href}`);
                resolve(); // Continuar aunque falle
            };
            
            shadowRoot.appendChild(link);
        });
    });

    await Promise.all(stylePromises);
}

// Función helper para crear estilos críticos inline
export function createCriticalStyles() {
    return `
        /* Estilos críticos para evitar FOUC */
        :host {
            display: block;
            width: 100%;
        }
        
        /* Variables CSS por defecto */
        :host {
            --swappit-blue: #2563eb;
            --swappit-blue-hover: #1d4ed8;
            --swappit-orange: #f97316;
            --bg-primary: #ffffff;
            --text-primary: #1f2937;
            --border-color: #e5e7eb;
            --neutral-light: #f3f4f6;
            --neutral-dark: #111827;
            --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
    `;
} 