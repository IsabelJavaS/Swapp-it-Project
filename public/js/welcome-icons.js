// Welcome Icons System for Dashboards
class WelcomeIcons {
    constructor() {
        // Prevent multiple instances
        if (window.welcomeIconsInstance) {
            return window.welcomeIconsInstance;
        }
        window.welcomeIconsInstance = this;
        
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        this.checkForWelcomeDisplay();
    }

    checkForWelcomeDisplay() {
        // Check if user just logged in (using sessionStorage)
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        
        console.log('WelcomeIcons: Checking for welcome display');
        console.log('justLoggedIn:', justLoggedIn);
        console.log('userRole:', userRole);
        
        if (justLoggedIn === 'true' && userRole) {
            // Verify we're on the correct dashboard
            const currentPath = window.location.pathname;
            const isCorrectDashboard = (userRole === 'personal' && currentPath.includes('student')) ||
                                    (userRole === 'business' && currentPath.includes('business'));
            
            console.log('currentPath:', currentPath);
            console.log('isCorrectDashboard:', isCorrectDashboard);
            
            if (isCorrectDashboard) {
                console.log('WelcomeIcons: Correct dashboard detected, waiting for load...');
                // Wait for dashboard to be fully loaded
                this.waitForDashboardLoad(() => {
                    console.log('WelcomeIcons: Dashboard loaded, showing welcome icon');
                    this.showWelcomeIcon(userRole);
                    // Clear the flag
                    sessionStorage.removeItem('justLoggedIn');
                });
            } else {
                console.log('WelcomeIcons: Not on correct dashboard, clearing flag');
                // Clear the flag if we're not on the correct dashboard
                sessionStorage.removeItem('justLoggedIn');
            }
        } else {
            console.log('WelcomeIcons: No login detected or missing role');
        }
    }

    waitForDashboardLoad(callback) {
        // Simplified dashboard detection - just wait for page to be fully loaded
        const checkDashboard = () => {
            // Check if the page is fully loaded
            const isPageLoaded = document.readyState === 'complete';
            
            // Also check if we're on a dashboard page by URL
            const currentPath = window.location.pathname;
            const isDashboardPage = currentPath.includes('dashboard');
            
            console.log('WelcomeIcons: Checking dashboard load...');
            console.log('isPageLoaded:', isPageLoaded);
            console.log('isDashboardPage:', isDashboardPage);
            console.log('currentPath:', currentPath);
            
            if (isPageLoaded && isDashboardPage) {
                console.log('WelcomeIcons: Dashboard ready, calling callback');
                // Dashboard is loaded, show welcome icon
                setTimeout(() => {
                    callback();
                }, 1000); // Delay to ensure everything is rendered
            } else {
                console.log('WelcomeIcons: Dashboard not ready, retrying...');
                // Try again after a short delay
                setTimeout(checkDashboard, 500);
            }
        };
        
        // Start checking after initial delay
        setTimeout(checkDashboard, 500);
    }

    showWelcomeIcon(userRole) {
        console.log('WelcomeIcons: showWelcomeIcon called with role:', userRole);
        
        // Double check that we're not in a loading state
        if (document.querySelector('.loading, .spinner, [data-loading="true"]')) {
            console.log('WelcomeIcons: Page still loading, retrying...');
            setTimeout(() => this.showWelcomeIcon(userRole), 500);
            return;
        }
        
        console.log('WelcomeIcons: Creating welcome overlay...');
        
        // Check if there's already a welcome overlay
        const existingOverlay = document.querySelector('.welcome-overlay');
        if (existingOverlay) {
            console.log('WelcomeIcons: Removing existing overlay');
            existingOverlay.remove();
        }
        
        // Create welcome overlay
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'welcome-icon-container';
        iconContainer.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            min-width: 320px;
            min-height: 320px;
        `;

        // Create role-specific icon
        if (userRole === 'personal') {
            iconContainer.innerHTML = `
                <div class="welcome-icon student-welcome-icon" style="width: 140px; height: 140px; margin-bottom: 18px; position: relative; display: block;">
                    <div class="welcome-glow" style="position: absolute; inset: 0; width: 140px; height: 140px;"></div>
                    <div class="welcome-particles" style="position: absolute; inset: 0; width: 140px; height: 140px; pointer-events: none;"></div>
                    <svg id="swap-arrows-svg" width="115" height="115" viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: block;">
                        <!-- Flecha hacia arriba (izquierda) -->
                        <g>
                            <path d="M25 65 V25" class="arrow-up"/>
                            <path d="M25 25 L17 33" class="arrow-up"/>
                            <path d="M25 25 L33 33" class="arrow-up"/>
                        </g>
                        <!-- Flecha hacia abajo (derecha) -->
                        <g>
                            <path d="M65 25 V65" class="arrow-down"/>
                            <path d="M65 65 L57 57" class="arrow-down"/>
                            <path d="M65 65 L73 57" class="arrow-down"/>
                        </g>
                    </svg>
                </div>
                <h2 class="welcome-title" style="margin-top: 10px; margin-bottom: 6px;">Welcome Student!</h2>
                <p class="welcome-subtitle" style="margin-top: 0;">Your swap space is ready</p>
            `;
        }
        if (userRole === 'business') {
            iconContainer.innerHTML = `
                <div class="welcome-icon business-welcome-icon" style="width: 140px; height: 140px; margin-bottom: 18px; position: relative; display: block;">
                    <div class="welcome-glow" style="position: absolute; inset: 0; width: 140px; height: 140px;"></div>
                    <svg id="business-briefcase-svg" width="120" height="120" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: block; opacity: 0;">
                        <!-- Maletín cuerpo -->
                        <rect x="14" y="24" width="36" height="24" rx="5"/>
                        <!-- Manija -->
                        <rect x="26" y="14" width="12" height="10" rx="3"/>
                        <!-- Línea divisoria -->
                        <line x1="14" y1="36" x2="50" y2="36"/>
                    </svg>
                </div>
                <h2 class="welcome-title" style="margin-top: 10px; margin-bottom: 6px;">Welcome Business!</h2>
                <p class="welcome-subtitle" style="margin-top: 0;">Your portfolio is ready</p>
            `;
        }

        overlay.appendChild(iconContainer);
        document.body.appendChild(overlay);

        // Animate the welcome icon
        this.animateWelcomeIcon(iconContainer, userRole);

        // Auto-remove after animation
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 500);
        }, 4000);
    }

    animateWelcomeIcon(iconContainer, userRole) {
        const welcomeIcon = iconContainer.querySelector('.welcome-icon');
        const welcomeParticles = iconContainer.querySelector('.welcome-particles');
        const welcomeGlow = iconContainer.querySelector('.welcome-glow');
        const welcomeTitle = iconContainer.querySelector('.welcome-title');
        const welcomeSubtitle = iconContainer.querySelector('.welcome-subtitle');

        if (!welcomeIcon) return;

        // Initial state
        welcomeIcon.style.opacity = '0';
        welcomeIcon.style.transform = 'scale(0) rotate(180deg)';
        welcomeIcon.style.filter = 'blur(20px)';
        welcomeTitle.style.opacity = '0';
        welcomeTitle.style.transform = 'translateY(30px)';
        welcomeSubtitle.style.opacity = '0';
        welcomeSubtitle.style.transform = 'translateY(30px)';

        // Animate icon entrance
        setTimeout(() => {
            welcomeIcon.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            welcomeIcon.style.opacity = '1';
            welcomeIcon.style.transform = 'scale(1.3) rotate(0deg)';
            welcomeIcon.style.filter = 'blur(0px)';
        }, 300);

        // Scale back to normal size
        setTimeout(() => {
            welcomeIcon.style.transition = 'all 0.4s ease-out';
            welcomeIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 1500);

        // Animate text
        setTimeout(() => {
            welcomeTitle.style.transition = 'all 0.8s ease-out';
            welcomeTitle.style.opacity = '1';
            welcomeTitle.style.transform = 'translateY(0px)';
            welcomeTitle.classList.add('pop-animate');
        }, 600);

        setTimeout(() => {
            welcomeSubtitle.style.transition = 'all 0.8s ease-out';
            welcomeSubtitle.style.opacity = '1';
            welcomeSubtitle.style.transform = 'translateY(0px)';
            welcomeSubtitle.classList.add('pop-animate');
        }, 750);

        // Create particles
        if (userRole === 'personal') {
            setTimeout(() => {
                this.createWelcomeParticles(welcomeParticles, userRole);
            }, 800);
        }

        // Create glow effect
        if (welcomeGlow) {
            setTimeout(() => {
                this.createWelcomeGlow(welcomeGlow, userRole);
            }, 1000);
        }

        // Add floating animation
        setTimeout(() => {
            welcomeIcon.style.animation = 'welcomeIconFloat 3s ease-in-out infinite';
        }, 2500);

        // Add pulse effect
        setTimeout(() => {
            welcomeIcon.style.animation = 'welcomeIconFloat 3s ease-in-out infinite, welcomeIconPulse 2s ease-in-out infinite';
        }, 3000);

        // En animateWelcomeIcon, aplicar animación pop al SVG del maletín
        if (userRole === 'business') {
            setTimeout(() => {
                const briefcaseSvg = iconContainer.querySelector('#business-briefcase-svg');
                if (briefcaseSvg) {
                    briefcaseSvg.style.opacity = '1';
                    briefcaseSvg.classList.add('pop-animate');
                }
            }, 300);
        }
    }

    // Ajuste visual extremo: círculo de partículas centrado en (70,70) en 140x140
    createWelcomeParticles(particlesContainer, userRole) {
        const particleCount = 18;
        const colors = userRole === 'personal' 
            ? ['#ffa424', '#3468c0', '#48bb78', '#f59e0b'] 
            : ['#3468c0', '#8b5cf6', '#06b6d4', '#3b82f6'];
        const centerX = 70;
        const centerY = 70;
        const radius = 52;
        particlesContainer.style.left = '0';
        particlesContainer.style.top = '0';
        particlesContainer.style.width = '140px';
        particlesContainer.style.height = '140px';
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 5px;
                height: 5px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: welcomeParticleFloat 3s ease-out ${i * 0.08}s forwards;
            `;
            // Círculo centrado en (centerX, centerY) relativo al contenedor de 140x140
            const angle = (i / particleCount) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            particle.style.left = `calc(${x}px - 2.5px)`;
            particle.style.top = `calc(${y}px - 2.5px)`;
            particlesContainer.appendChild(particle);
        }
    }

    createWelcomeGlow(glowContainer, userRole) {
        const gradient = userRole === 'personal' 
            ? 'radial-gradient(circle, rgba(255, 164, 36, 0.35) 0%, rgba(52, 104, 192, 0.18) 60%, transparent 90%)'
            : 'radial-gradient(circle, rgba(52, 104, 192, 0.35) 0%, rgba(139, 92, 246, 0.18) 60%, transparent 90%)';
        glowContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 160px;
            height: 160px;
            background: ${gradient};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            animation: welcomeGlowPulse 3s ease-in-out infinite;
            z-index: 0;
        `;
    }
}

// Initialize welcome icons when DOM is loaded (only once)
if (!window.welcomeIconsInitialized) {
    window.welcomeIconsInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        new WelcomeIcons();
    });
}

// Add CSS animations for welcome icons (only once)
if (!document.querySelector('#welcome-icons-styles')) {
    const welcomeStyle = document.createElement('style');
    welcomeStyle.id = 'welcome-icons-styles';
    welcomeStyle.textContent = `
    .welcome-icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
    }

    .student-welcome-icon {
        color: #ffa424;
    }

    .business-welcome-icon {
        color: #3468c0;
    }

    .welcome-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 20px 0 10px 0;
        background: linear-gradient(135deg, #ffa424, #3468c0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .welcome-subtitle {
        font-size: 1.2rem;
        color: #cbd5e0;
        margin: 0;
    }

    @keyframes welcomeIconFloat {
        0%, 100% { 
            transform: translateY(0px) scale(1);
        }
        50% { 
            transform: translateY(-15px) scale(1.05);
        }
    }

    @keyframes welcomeIconPulse {
        0%, 100% { 
            filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
        }
        50% { 
            filter: drop-shadow(0 0 50px rgba(255, 255, 255, 1));
        }
    }

    @keyframes welcomeParticleFloat {
        0% {
            opacity: 0;
            transform: scale(0) translate(0, 0);
        }
        50% {
            opacity: 1;
            transform: scale(1) translate(var(--x, 30px), var(--y, -30px));
        }
        100% {
            opacity: 0;
            transform: scale(0) translate(var(--x, 60px), var(--y, -60px));
        }
    }

    @keyframes welcomeGlowPulse {
        0%, 100% { 
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
        }
        50% { 
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.3);
        }
    }

    /* SVG Element Animations for Welcome Icons */
    .student-welcome-icon .arrow-up {
        animation: welcomeArrowUpDown 2.5s ease-in-out infinite;
    }

    .student-welcome-icon .arrow-down {
        animation: welcomeArrowDownUp 2.5s ease-in-out infinite;
    }

    .student-welcome-icon .center-line {
        animation: welcomeCenterLinePulse 2s ease-in-out infinite;
    }

    .student-welcome-icon .center-dot {
        animation: welcomeCenterDotPulse 1.5s ease-in-out infinite;
    }

    .business-welcome-icon .briefcase-body {
        animation: welcomeBriefcaseBody 2.5s ease-in-out infinite;
    }

    .business-welcome-icon .briefcase-handle {
        animation: welcomeBriefcaseHandle 2.5s ease-in-out infinite;
    }

    .business-welcome-icon .divider {
        animation: welcomeDividerPulse 2s ease-in-out infinite;
    }

    .business-welcome-icon .detail-dot {
        animation: welcomeDetailDotPulse 1.5s ease-in-out infinite;
    }

    @keyframes welcomeArrowUpDown {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }

    @keyframes welcomeArrowDownUp {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(5px); }
    }

    @keyframes welcomeCenterLinePulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }

    @keyframes welcomeCenterDotPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }

    @keyframes welcomeBriefcaseBody {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
    }

    @keyframes welcomeBriefcaseHandle {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
    }

    @keyframes welcomeDividerPulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }

    @keyframes welcomeDetailDotPulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.4); opacity: 1; }
    }
`;
    document.head.appendChild(welcomeStyle);
}

if (!document.querySelector('#welcome-icons-popout-styles')) {
    const popoutStyle = document.createElement('style');
    popoutStyle.id = 'welcome-icons-popout-styles';
    popoutStyle.textContent = `
    @keyframes popOut {
        0% {
            opacity: 0;
            transform: scale(0.7);
        }
        60% {
            opacity: 1;
            transform: scale(1.3);
        }
        80% {
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    .welcome-title.pop-animate {
        animation: popOut 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both;
    }
    .welcome-subtitle.pop-animate {
        animation: popOut 0.7s 0.18s cubic-bezier(0.68,-0.55,0.27,1.55) both;
    }
    #briefcase-svg.pop-animate {
        animation: popOut 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both;
    }
    `;
    document.head.appendChild(popoutStyle);
}

// Cambiar el color y la fuente del subtítulo para que use la misma fuente que el título grande
if (!document.querySelector('#welcome-icons-subtitle-black')) {
    const subtitleStyle = document.createElement('style');
    subtitleStyle.id = 'welcome-icons-subtitle-black';
    subtitleStyle.textContent = `
    .welcome-subtitle {
        color: #111 !important;
        font-weight: normal;
        text-shadow: none;
        font-family: 'Poppins', sans-serif !important;
    }
    `;
    document.head.appendChild(subtitleStyle);
}

// Mejorar el subtítulo: degradado con los colores principales de la web (#3468c0 y #ffa424)
if (!document.querySelector('#welcome-icons-subtitle-beauty')) {
    const subtitleStyle = document.createElement('style');
    subtitleStyle.id = 'welcome-icons-subtitle-beauty';
    subtitleStyle.textContent = `
    .welcome-subtitle {
        font-family: 'Poppins', sans-serif !important;
        font-size: 1.25rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        background: linear-gradient(90deg, #3468c0 0%, #ffa424 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        position: relative;
        margin-bottom: 0.5rem;
        transition: background 0.5s;
    }
    .welcome-subtitle::after {
        content: '';
        display: block;
        margin: 0.3em auto 0 auto;
        width: 60%;
        height: 3px;
        border-radius: 2px;
        background: linear-gradient(90deg, #3468c0 0%, #ffa424 100%);
        opacity: 0.7;
        animation: subtitle-underline 1s 0.5s cubic-bezier(0.68,-0.55,0.27,1.55) both;
    }
    @keyframes subtitle-underline {
        0% { width: 0; opacity: 0; }
        60% { width: 80%; opacity: 1; }
        100% { width: 60%; opacity: 0.7; }
    }
    `;
    document.head.appendChild(subtitleStyle);
}

// Agregar animación de trazo y glow pulsante para business
if (!document.querySelector('#welcome-business-anim-styles')) {
    const businessAnimStyle = document.createElement('style');
    businessAnimStyle.id = 'welcome-business-anim-styles';
    businessAnimStyle.textContent = `
    .business-welcome-icon .animated-stroke {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: briefcaseStroke 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) forwards;
    }
    .business-welcome-icon .briefcase-body {
        filter: drop-shadow(0 0 30px #3468c0aa);
        animation: briefcaseGlow 1.2s 0.2s cubic-bezier(0.68,-0.55,0.27,1.55) both;
    }
    @keyframes briefcaseStroke {
        to { stroke-dashoffset: 0; }
    }
    @keyframes briefcaseGlow {
        0% { filter: drop-shadow(0 0 0px #3468c0aa); }
        60% { filter: drop-shadow(0 0 40px #3468c0ff); }
        100% { filter: drop-shadow(0 0 20px #3468c0aa); }
    }
    `;
    document.head.appendChild(businessAnimStyle);
}