// Spline-style Animations for Login Page (Simplified to avoid conflicts)
class SplineAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupCursorEffects();
        this.setup3DEffects();
        this.setupParticleSystems();
        this.setupInteractiveElements();
        this.setupLogoAnimations();
    }

    // Interactive Cursor Effects
    setupCursorEffects() {
        const cursorFollower = document.getElementById('cursorFollower');
        const cursorTrail = document.getElementById('cursorTrail');
        
        if (!cursorFollower || !cursorTrail) return;

        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        let trailX = 0;
        let trailY = 0;

        // Track mouse position anywhere on the page
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Also track mouse position on window for better coverage
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following animation
        const animateCursor = () => {
            // Follower cursor
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            // Trail cursor
            trailX += (mouseX - trailX) * 0.05;
            trailY += (mouseY - trailY) * 0.05;

            // Use translate3d for better performance and ensure full screen coverage
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll('input, button, a, .logo-container');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '') + ' scale(1.5)';
                cursorFollower.style.background = 'linear-gradient(45deg, #ffa424, #3468c0)';
                cursorFollower.style.width = '30px';
                cursorFollower.style.height = '30px';
            });

            element.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.background = 'linear-gradient(45deg, #ffa424, #3468c0)';
                cursorFollower.style.width = '20px';
                cursorFollower.style.height = '20px';
            });
        });
    }

    // 3D Effects and Transformations
    setup3DEffects() {
        const loginBox = document.getElementById('loginBox');
        const logoContainer = document.getElementById('logoContainer');

        if (!loginBox) return;

        // 3D tilt effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xAxis = (clientY / innerHeight - 0.5) * 2;
            const yAxis = (clientX / innerWidth - 0.5) * 2;

            loginBox.style.transform = `
                perspective(1000px) 
                rotateX(${xAxis * 5}deg) 
                rotateY(${yAxis * 5}deg)
                translateY(-5px) 
                scale(1.02)
            `;
        });

        // Reset transform on mouse leave
        document.addEventListener('mouseleave', () => {
            loginBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-5px) scale(1.02)';
        });

        // Logo 3D effect
        if (logoContainer) {
            logoContainer.addEventListener('mousemove', (e) => {
                const rect = logoContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 10;
                const rotateY = (x - centerX) / centerX * 10;

                logoContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            logoContainer.addEventListener('mouseleave', () => {
                logoContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        }
    }

    // Particle Systems
    setupParticleSystems() {
        this.createFieldParticles();
        this.createLogoParticles();
    }

    createFieldParticles() {
        const fields = document.querySelectorAll('.form-group');
        
        fields.forEach(field => {
            const particlesContainer = field.querySelector('.field-particles');
            if (!particlesContainer) return;

            // Create particles for each field
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'field-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: linear-gradient(45deg, #ffa424, #3468c0);
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: 0;
                    transition: all 0.3s ease;
                `;
                particlesContainer.appendChild(particle);
            }

            // Animate particles on focus
            const input = field.querySelector('input');
            if (input) {
                input.addEventListener('focus', () => {
                    const particles = particlesContainer.querySelectorAll('.field-particle');
                    particles.forEach((particle, index) => {
                        setTimeout(() => {
                            particle.style.opacity = '1';
                            particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
                            particle.style.animation = `particleFloat 2s ease-out forwards`;
                        }, index * 100);
                    });
                });

                input.addEventListener('blur', () => {
                    const particles = particlesContainer.querySelectorAll('.field-particle');
                    particles.forEach(particle => {
                        particle.style.opacity = '0';
                        particle.style.transform = 'translate(0, 0)';
                        particle.style.animation = 'none';
                    });
                });
            }
        });
    }

    createLogoParticles() {
        const logoContainer = document.getElementById('logoContainer');
        const particlesContainer = logoContainer?.querySelector('.logo-particles');
        
        if (!particlesContainer) return;

        // Animate existing logo particles
        const particles = particlesContainer.querySelectorAll('.logo-particle');
        particles.forEach((particle, index) => {
            particle.addEventListener('mouseenter', () => {
                particle.style.transform = 'scale(2)';
                particle.style.filter = 'brightness(1.5)';
            });

            particle.addEventListener('mouseleave', () => {
                particle.style.transform = 'scale(1)';
                particle.style.filter = 'brightness(1)';
            });
        });
    }

    // Interactive Elements
    setupInteractiveElements() {
        this.setupInputAnimations();
        this.setupLinkAnimations();
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Add content detection
            input.addEventListener('input', () => {
                if (input.value.length > 0) {
                    input.classList.add('has-content');
                } else {
                    input.classList.remove('has-content');
                }
            });

            // Focus animations
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                this.animateInputFocus(input);
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    animateInputFocus(input) {
        const wrapper = input.closest('.input-3d-wrapper');
        if (!wrapper) return;

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 164, 36, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 0;
        `;
        wrapper.appendChild(ripple);

        // Animate ripple
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupLinkAnimations() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateLinkHover(link, true);
            });

            link.addEventListener('mouseleave', () => {
                this.animateLinkHover(link, false);
            });
        });
    }

    animateLinkHover(link, isEntering) {
        if (isEntering) {
            link.style.transform = 'translateY(-2px)';
            link.style.filter = 'brightness(1.2)';
        } else {
            link.style.transform = 'translateY(0)';
            link.style.filter = 'brightness(1)';
        }
    }

    // Logo Animations
    setupLogoAnimations() {
        const logo = document.getElementById('logo');
        const logoContainer = document.getElementById('logoContainer');
        
        if (!logo || !logoContainer) return;

        // Logo hover effects
        logoContainer.addEventListener('mouseenter', () => {
            this.animateLogoHover(logo, true);
        });

        logoContainer.addEventListener('mouseleave', () => {
            this.animateLogoHover(logo, false);
        });

        // Logo click effect
        logo.addEventListener('click', () => {
            this.animateLogoClick(logo);
        });
    }

    animateLogoHover(logo, isEntering) {
        if (isEntering) {
            logo.style.transform = 'scale(1.1) rotateY(10deg)';
            logo.style.filter = 'drop-shadow(0 0 30px rgba(255, 164, 36, 0.8))';
        } else {
            logo.style.transform = 'scale(1) rotateY(0deg)';
            logo.style.filter = 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))';
        }
    }

    animateLogoClick(logo) {
        // Create click ripple
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 164, 36, 0.5) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `;
        logo.parentElement.appendChild(ripple);

        // Animate ripple
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SplineAnimations();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translate(var(--x), var(--y)) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0);
        }
    }

    .field-particle {
        animation: particleFloat 2s ease-out forwards;
    }
`;
document.head.appendChild(style); 