document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const featuredSwiper = new Swiper('.featured-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
    });

    function updateThemeIcon(isDark) {
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Category Selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.getAttribute('data-category');
            
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            card.classList.add('active');
            
            // Here you would typically fetch products for the selected category
            // For now, we'll just log the selection
            console.log('Selected category:', category);
            // You can implement the product fetching and updating logic here
        });
    });

    // Quick View and Wishlist Buttons
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Implement quick view modal functionality
            console.log('Quick view clicked');
        });
    });

    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Implement add to cart functionality
            updateCartCount();
            showAddToCartAnimation(button);
        });
    });

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
    }

    function showAddToCartAnimation(button) {
        button.disabled = true;
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Search Functionality
    const searchInput = document.querySelector('.search-container input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 3) {
                // Implement search functionality
                console.log('Searching for:', searchTerm);
                // You can implement the search logic here
            }
        }, 500);
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (mobileMenuButton && navbarCollapse) {
        mobileMenuButton.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Scroll Animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .category-card, .trust-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
}); 