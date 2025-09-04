import { AppConfig } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Test backend and Firebase connections
    testConnections();

    // CTA Box close functionality
    initCtaCloseFunctionality();

    // 360° drag functionality for Swapp Zone image
    init360DragFunctionality();

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

// Función para inicializar la funcionalidad de arrastre 360°
function init360DragFunctionality() {
    const zoneSection = document.querySelector('.swappit-zone-section');
    const zoneBg = document.querySelector('.swappit-zone-bg');
    if (!zoneSection || !zoneBg) {
        console.log('❌ No se encontró la sección Swapp Zone');
        return;
    }

    console.log('✅ Inicializando funcionalidad de arrastre 360°');
    
    // Inicializar zonas de productos
    initProductZones();

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let backgroundX = 50; // Porcentaje inicial
    let backgroundY = 50; // Porcentaje inicial

    // Event listeners para mouse
    zoneSection.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Event listeners para touch (móviles)
    zoneSection.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        // Solo arrastrar si no se está haciendo clic en un elemento interactivo
        if (e.target.closest('a, button, input, select, textarea, .product-zone, .swappit-zone-content')) {
            console.log('🚫 Arrastre bloqueado por elemento interactivo');
            return;
        }
        
        console.log('🖱️ Iniciando arrastre');
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        zoneSection.classList.add('dragging');
        e.preventDefault();
    }

    function startDragTouch(e) {
        // Solo arrastrar si no se está tocando un elemento interactivo
        if (e.target.closest('a, button, input, select, textarea, .product-zone, .swappit-zone-content')) return;
        
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        zoneSection.classList.add('dragging');
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        currentX = e.clientX;
        currentY = e.clientY;
        updateBackgroundPosition();
    }

    function dragTouch(e) {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        updateBackgroundPosition();
    }

    function endDrag() {
        isDragging = false;
        zoneSection.classList.remove('dragging');
    }

    function updateBackgroundPosition() {
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        // Calcular el factor de movimiento (ajustable)
        const sensitivity = 0.5;
        
        // Actualizar posición del background
        backgroundX = Math.max(0, Math.min(100, 50 + (deltaX * sensitivity)));
        backgroundY = Math.max(0, Math.min(100, 50 + (deltaY * sensitivity)));
        
        // Aplicar la nueva posición
        zoneBg.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
        
        console.log(`📍 Posición: ${backgroundX}%, ${backgroundY}%`);
    }

    // Reset al hacer doble clic
    zoneSection.addEventListener('dblclick', function(e) {
        // Solo reset si no se está haciendo doble clic en un elemento interactivo
        if (e.target.closest('a, button, input, select, textarea, .product-zone, .swappit-zone-content')) return;
        
        backgroundX = 50;
        backgroundY = 50;
        zoneBg.style.backgroundPosition = 'center center';
        zoneBg.style.backgroundSize = '120% 120%';
    });

    // Efecto de zoom al hacer scroll
    zoneSection.addEventListener('wheel', function(e) {
        // Solo zoom si no se está haciendo scroll en un elemento interactivo
        if (e.target.closest('a, button, input, select, textarea, .product-zone, .swappit-zone-content')) return;
        
        e.preventDefault();
        
        const currentSize = parseInt(zoneBg.style.backgroundSize) || 120;
        const delta = e.deltaY > 0 ? -5 : 5;
        const newSize = Math.max(100, Math.min(200, currentSize + delta));
        
        zoneBg.style.backgroundSize = `${newSize}% ${newSize}%`;
    });

    // Indicador visual de que se puede arrastrar
    zoneSection.addEventListener('mouseenter', function() {
        if (!isDragging) {
            zoneBg.style.transform = 'scale(1.02)';
        }
    });

    zoneSection.addEventListener('mouseleave', function() {
        if (!isDragging) {
            zoneBg.style.transform = 'scale(1)';
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