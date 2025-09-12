import { AppConfig } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Test backend and Firebase connections
    testConnections();

    // CTA Box close functionality
    initCtaCloseFunctionality();

    // Simple background effect for Swapp Zone image
    initSimpleBackgroundEffect();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get header height for offset (Web Component compatible)
                const appHeader = document.querySelector('app-header');
                const shadowHeader = appHeader?.shadowRoot?.querySelector('.marketplace-header');
                const headerHeight = shadowHeader ? shadowHeader.offsetHeight : 0;
                
                // Calculate scroll position
                const scrollPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        // Get header height for offset (Web Component compatible)
        const appHeader = document.querySelector('app-header');
        const shadowHeader = appHeader?.shadowRoot?.querySelector('.marketplace-header');
        const headerHeight = shadowHeader ? shadowHeader.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Section animations with Intersection Observer
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add click handlers for CTA buttons
    setupCTAButtons();
});

// Test backend and Firebase connections
async function testConnections() {
    if (AppConfig.isDebugMode()) {
        console.log('🔧 Testing connections...');
        console.log('📍 Environment:', AppConfig.isDevelopment() ? 'Development' : 'Production');
        console.log('🌐 Base URL:', AppConfig.getBaseUrl());
    }
    
    // Test backend
    if (window.api) {
        try {
            const backendTest = await window.api.testBackend();
            if (AppConfig.isDebugMode()) {
                console.log('✅ Backend test:', backendTest);
            }
        } catch (error) {
            console.warn('⚠️ Backend test failed:', error);
        }
        
        try {
            const firebaseTest = await window.api.testFirebase();
            if (AppConfig.isDebugMode()) {
                console.log('✅ Firebase test:', firebaseTest);
            }
        } catch (error) {
            console.warn('⚠️ Firebase test failed:', error);
        }
    } else {
        if (AppConfig.isDebugMode()) {
            console.log('ℹ️ API module not loaded');
        }
    }
}

// Setup CTA button handlers
function setupCTAButtons() {
    // Start Selling button
    const startSellingBtn = document.querySelector('.btn-primary-large');
    if (startSellingBtn) {
        startSellingBtn.addEventListener('click', function() {
            // Check if user is logged in
            if (isUserLoggedIn()) {
                window.location.href = AppConfig.getMarketplacePath();
            } else {
                window.location.href = AppConfig.getRegisterPath();
            }
        });
    }

    // Browse Items button
    const browseItemsBtn = document.querySelector('.btn-secondary-large');
    if (browseItemsBtn) {
        browseItemsBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getMarketplacePath();
        });
    }

    // Register as Business button
    const businessBtn = document.querySelector('.cta-buttons .btn-primary-large');
    if (businessBtn) {
        businessBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getRegisterPath();
        });
    }

    // Log In button
    const loginBtn = document.querySelector('.btn-secondary-large');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = AppConfig.getLoginPath();
        });
    }
}

// Check if user is logged in (you can implement this based on your auth system)
function isUserLoggedIn() {
    // For now, return false - you can implement this with your auth system
    return false;
}

// Función helper para obtener la altura del header (compatible con Web Components)
export function getHeaderHeight() {
    const appHeader = document.querySelector('app-header');
    if (!appHeader) return 0;
    
    const shadowHeader = appHeader.shadowRoot?.querySelector('.marketplace-header');
    return shadowHeader ? shadowHeader.offsetHeight : 0;
}

// Función helper para scroll suave a una sección
export function smoothScrollToSection(sectionId, offset = 0) {
    const targetSection = document.querySelector(sectionId);
    if (!targetSection) return;
    
    const headerHeight = getHeaderHeight();
    const scrollPosition = targetSection.offsetTop - headerHeight - offset;
    
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

// Función para inicializar la funcionalidad de cerrar el CTA
function initCtaCloseFunctionality() {
    const ctaBox = document.getElementById('zoneCtaBox');
    const closeBtn = document.getElementById('ctaCloseBtn');
    
    if (!ctaBox || !closeBtn) return;
    
    // Verificar si ya fue cerrado anteriormente
    const wasClosed = localStorage.getItem('swappZoneCtaClosed');
    if (wasClosed === 'true') {
        ctaBox.classList.add('hidden');
        
        // Agregar clase a la sección para expandir la imagen
        const section = document.querySelector('.swappit-zone-section');
        if (section) {
            section.classList.add('cta-closed');
        }
        return;
    }
    
    // Event listener para cerrar
    closeBtn.addEventListener('click', function() {
        ctaBox.classList.add('hidden');
        
        // Agregar clase a la sección para expandir la imagen
        const section = document.querySelector('.swappit-zone-section');
        if (section) {
            section.classList.add('cta-closed');
        }
        
        // Guardar en localStorage que fue cerrado
        localStorage.setItem('swappZoneCtaClosed', 'true');
        
        // Opcional: mostrar un mensaje de confirmación
        console.log('CTA box closed and section expanded');
    });
    
    // Opcional: agregar funcionalidad para reabrir (por ejemplo, con un botón en otra parte)
    window.reopenSwappZoneCta = function() {
        ctaBox.classList.remove('hidden');
        
        // Quitar clase de la sección para contraer la imagen
        const section = document.querySelector('.swappit-zone-section');
        if (section) {
            section.classList.remove('cta-closed');
        }
        
        localStorage.removeItem('swappZoneCtaClosed');
    };
}

// Función para inicializar el efecto de fondo con parallax
function initSimpleBackgroundEffect() {
    const zoneSection = document.querySelector('.swappit-zone-section');
    
    if (!zoneSection) {
        console.log('❌ No se encontró la sección Swapp Zone');
        return;
    }

    console.log('✅ Inicializando efecto de fondo con parallax');
    console.log('📍 Sección encontrada:', zoneSection);
    console.log('🎨 Estilos del fondo:', window.getComputedStyle(zoneSection).backgroundImage);
    
    // Verificar que la imagen se está cargando
    const bgImage = window.getComputedStyle(zoneSection).backgroundImage;
    if (bgImage && bgImage !== 'none') {
        console.log('✅ Imagen de fondo detectada:', bgImage);
    } else {
        console.log('❌ No se detectó imagen de fondo');
    }
    
    // Detectar si es móvil o tablet
    const isMobile = window.innerWidth <= 991;
    console.log(`📱 Ancho de ventana: ${window.innerWidth}px, es móvil: ${isMobile}`);
    
    if (isMobile) {
        console.log('📱 Detectado dispositivo móvil/tablet - Activando parallax manual');
        zoneSection.style.transform = ''; // Limpiar transform inicial
        zoneSection.classList.add('mobile-parallax');
        console.log('🎨 Clase mobile-parallax agregada:', zoneSection.classList.contains('mobile-parallax'));
        console.log('🎨 Estilos aplicados:', {
            backgroundAttachment: window.getComputedStyle(zoneSection).backgroundAttachment,
            backgroundPosition: window.getComputedStyle(zoneSection).backgroundPosition,
            transform: window.getComputedStyle(zoneSection).transform
        });
        initMobileParallax(zoneSection);
    } else {
        console.log('🖥️ Detectado dispositivo desktop - Usando parallax CSS');
        zoneSection.classList.remove('mobile-parallax');
    }
}

// Función para parallax manual en móviles
function initMobileParallax(zoneSection) {
    console.log('🚀 Iniciando parallax móvil para:', zoneSection);
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const sectionTop = zoneSection.offsetTop;
        const sectionHeight = zoneSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calcular si la sección está visible
        const sectionBottom = sectionTop + sectionHeight;
        const isVisible = scrolled + windowHeight > sectionTop && scrolled < sectionBottom;
        
        if (isVisible) {
            // Parallax solo en el background, no en la sección completa
            const sectionStart = sectionTop - windowHeight;
            const sectionEnd = sectionTop + sectionHeight;
            const totalSectionHeight = sectionEnd - sectionStart;
            
            // Calcular el progreso del scroll a través de la sección
            const scrollProgress = Math.max(0, Math.min(1, (scrolled - sectionStart) / totalSectionHeight));
            
            // Solo mover el background, no la sección completa
            const bgYPos = 33 + (scrollProgress * 20); // Mover background suavemente
            zoneSection.style.backgroundPosition = `center ${bgYPos}%`;
            
            console.log(`📱 Parallax móvil: scroll=${scrolled}, progress=${scrollProgress.toFixed(2)}, bgPos=${bgYPos.toFixed(1)}%`);
        }
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', updateParallax);
    
    // Actualizar posición inicial
    updateParallax();
    
    // Recalcular en resize
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 991;
        const hasMobileClass = zoneSection.classList.contains('mobile-parallax');
        
        if (!isMobile && hasMobileClass) {
            // Si cambió a desktop, restaurar parallax CSS
            zoneSection.style.backgroundPosition = '';
            zoneSection.style.transform = '';
            zoneSection.classList.remove('mobile-parallax');
            window.removeEventListener('scroll', updateParallax);
            console.log('🖥️ Cambió a desktop - Restaurando parallax CSS');
        } else if (isMobile && !hasMobileClass) {
            // Si cambió a móvil, activar parallax manual
            zoneSection.style.transform = ''; // Limpiar transform inicial
            zoneSection.classList.add('mobile-parallax');
            initMobileParallax(zoneSection);
            console.log('📱 Cambió a móvil - Activando parallax manual');
        }
    });
}

// Función para inicializar las zonas de productos interactivas
function initProductZones() {
    const zoneBg = document.querySelector('.swappit-zone-bg');
    if (!zoneBg) {
        console.log('❌ No se encontró la zona de fondo');
        return;
    }
    
    console.log('✅ Inicializando zonas de productos');

    // Crear tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'product-tooltip';
    tooltip.id = 'product-tooltip';
    document.body.appendChild(tooltip);

    // Posicionar las zonas de productos (ajustar según la imagen real)
    const productZones = [
        {
            id: 'laptop-zone',
            top: '25%',
            left: '15%',
            width: '120px',
            height: '80px'
        },
        {
            id: 'books-zone',
            top: '40%',
            left: '25%',
            width: '100px',
            height: '60px'
        },
        {
            id: 'calculator-zone',
            top: '60%',
            left: '20%',
            width: '60px',
            height: '40px'
        },
        {
            id: 'backpack-zone',
            top: '30%',
            left: '70%',
            width: '100px',
            height: '120px'
        },
        {
            id: 'pens-zone',
            top: '50%',
            left: '75%',
            width: '80px',
            height: '50px'
        }
    ];

    // Aplicar posiciones a las zonas
    productZones.forEach(zone => {
        const element = document.getElementById(zone.id);
        if (element) {
            element.style.top = zone.top;
            element.style.left = zone.left;
            element.style.width = zone.width;
            element.style.height = zone.height;
            console.log(`✅ Zona ${zone.id} posicionada`);
        } else {
            console.log(`❌ No se encontró la zona ${zone.id}`);
        }
    });

    // Agregar event listeners a las zonas
    document.querySelectorAll('.product-zone').forEach(zone => {
        zone.addEventListener('mouseenter', function(e) {
            const product = this.dataset.product;
            const price = this.dataset.price;
            const description = this.dataset.description;
            
            tooltip.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${product}</div>
                <div style="color: #60a5fa; margin-bottom: 4px;">${price}</div>
                <div style="font-size: 12px; opacity: 0.8;">${description}</div>
            `;
            
            tooltip.classList.add('show');
            updateTooltipPosition(e, tooltip);
        });

        zone.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e, tooltip);
        });

        zone.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show');
        });

        zone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Redirigir al marketplace
            window.location.href = 'pages/marketplace.html';
        });
    });

    function updateTooltipPosition(e, tooltip) {
        const rect = e.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Ajustar si se sale de la pantalla
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
}