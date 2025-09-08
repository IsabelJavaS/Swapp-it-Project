// Team Carousel JavaScript - Premium Version
class TeamCarousel {
    constructor() {
        this.carousel = document.querySelector('.team-cards');
        this.cards = document.querySelectorAll('.team-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        this.init();
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.startAutoPlay();
        this.checkImages();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 2;
        if (width < 1024) return 3;
        return 4;
    }

    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(this.cards.length / this.cardsPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Touch/swipe support
        if (this.carousel) {
            let startX = 0;
            let isDragging = false;

            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            this.carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });

            this.carousel.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                isDragging = false;
            });

            // Mouse drag support
            let mouseStartX = 0;
            let isMouseDragging = false;

            this.carousel.addEventListener('mousedown', (e) => {
                mouseStartX = e.clientX;
                isMouseDragging = true;
                this.carousel.style.cursor = 'grabbing';
            });

            this.carousel.addEventListener('mousemove', (e) => {
                if (!isMouseDragging) return;
                e.preventDefault();
            });

            this.carousel.addEventListener('mouseup', (e) => {
                if (!isMouseDragging) return;
                
                const mouseEndX = e.clientX;
                const diff = mouseStartX - mouseEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                isMouseDragging = false;
                this.carousel.style.cursor = 'grab';
            });

            this.carousel.addEventListener('mouseleave', () => {
                isMouseDragging = false;
                this.carousel.style.cursor = 'grab';
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.cardsPerView = this.getCardsPerView();
            this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.createDots();
            this.updateCarousel();
        });
    }

    prevSlide() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateCarousel();
        this.resetAutoPlay();
    }

    nextSlide() {
        this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = Math.min(this.maxIndex, Math.max(0, index));
        this.updateCarousel();
        this.resetAutoPlay();
    }

    updateCarousel() {
        if (!this.carousel) return;

        const cardWidth = this.cards[0]?.offsetWidth || 250;
        const gap = 24; // 1.5rem gap
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        this.carousel.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        this.updateDots();
        
        // Update button states
        this.updateButtons();
    }

    updateDots() {
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        if (!dots) return;

        const activeDotIndex = Math.floor(this.currentIndex / this.cardsPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
            this.nextBtn.style.pointerEvents = this.currentIndex >= this.maxIndex ? 'none' : 'auto';
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateCarousel();
        }, 5000); // Auto-advance every 5 seconds
    }

    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.startAutoPlay();
        }
    }

    checkImages() {
        const images = document.querySelectorAll('.team-card img, .member-image img, .team-photo');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.classList.remove('loading');
            });
            
            img.addEventListener('error', () => {
                img.style.opacity = '0.5';
                img.classList.add('image-error');
                
                // Create fallback content
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '👤';
                fallback.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #3468c0 0%, #ffa424 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    color: white;
                    border-radius: inherit;
                `;
                
                img.parentNode.appendChild(fallback);
            });
            
            // Add loading state
            img.style.opacity = '0.7';
            img.classList.add('loading');
        });
    }

    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TeamCarousel();
});

// Add smooth scroll behavior for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Add hover effects for team cards
document.addEventListener('DOMContentLoaded', () => {
    const teamCards = document.querySelectorAll('.team-card, .team-member');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});