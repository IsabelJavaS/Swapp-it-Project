// CSS Path Fixer - Ajusta rutas de CSS automáticamente según el entorno
(function() {
    'use strict';

    // Detectar si estamos en Firebase Hosting o local
    function isFirebase() {
        return window.location.hostname.includes('firebaseapp.com') || 
               window.location.hostname.includes('web.app') ||
               window.location.hostname === 'localhost' && window.location.port === '5000';
    }

    // Obtener la ruta base según el entorno
    function getBaseUrl() {
        if (isFirebase()) {
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

    // Función para ajustar rutas de CSS
    function fixCssPaths() {
        const base = getBaseUrl();
        
        // Ajustar todos los enlaces de CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('//')) {
                // Si la ruta no empieza con /, agregar /
                if (!href.startsWith('/')) {
                    link.href = `${base}/${href}`;
                } else {
                    // Si empieza con /, agregar el base
                    link.href = `${base}${href}`;
                }
            }
        });

        // Ajustar rutas de imágenes en CSS
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.style && rule.style.backgroundImage) {
                            const bgImage = rule.style.backgroundImage;
                            if (bgImage.includes('url(') && !bgImage.includes('http')) {
                                // Ajustar rutas en background-image
                                const newBgImage = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
                                    if (!url.startsWith('http') && !url.startsWith('data:')) {
                                        if (!url.startsWith('/')) {
                                            return `url('${base}/${url}')`;
                                        } else {
                                            return `url('${base}${url}')`;
                                        }
                                    }
                                    return match;
                                });
                                rule.style.backgroundImage = newBgImage;
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignorar errores de CORS en hojas de estilo externas
                console.warn('No se pudo acceder a la hoja de estilos:', e);
            }
        }
    }

    // Función para ajustar rutas de imágenes
    function fixImagePaths() {
        const base = getBaseUrl();
        
        // Ajustar todas las imágenes
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
                if (!src.startsWith('/')) {
                    img.src = `${base}/${src}`;
                } else {
                    img.src = `${base}${src}`;
                }
            }
        });

        // Ajustar favicon
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            const href = favicon.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                if (!href.startsWith('/')) {
                    favicon.href = `${base}/${href}`;
                } else {
                    favicon.href = `${base}${href}`;
                }
            }
        }
    }

    // Función para ajustar rutas de enlaces
    function fixLinkPaths() {
        const base = getBaseUrl();
        
        // Ajustar enlaces internos: solo tocar rutas absolutas que empiezan con '/'
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) {
                return; // externos o anclas
            }
            if (href.startsWith('/')) {
                // Si ya empieza con el base, no volver a prefijar
                if (base && href.startsWith(base + '/')) {
                    return;
                }
                link.href = `${base}${href}`;
            } else {
                // Mantener rutas relativas (./, ../ o archivo en el mismo directorio) sin cambios
            }
        });
    }

    // Función principal que ejecuta todas las correcciones
    function fixAllPaths() {
        console.log('🔧 Ajustando rutas para entorno:', isFirebase() ? 'Firebase' : 'Local');
        console.log('📍 Base URL:', getBaseUrl());
        
        fixCssPaths();
        fixImagePaths();
        fixLinkPaths();
        
        console.log('✅ Rutas ajustadas correctamente');
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixAllPaths);
    } else {
        fixAllPaths();
    }

    // También ejecutar cuando se carguen recursos dinámicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                fixImagePaths();
                fixLinkPaths();
            }
        });
    });

    // Observar cambios en el DOM (esperar a que body exista)
    function startObserving() {
        if (!document.body) return;
        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.warn('MutationObserver no pudo iniciarse:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

    // Hacer disponible globalmente para uso manual
    window.PathFixer = {
        fixAllPaths,
        fixCssPaths,
        fixImagePaths,
        fixLinkPaths,
        getBaseUrl,
        isFirebase
    };

})(); 