// Función para cargar componentes HTML desde la raíz
async function loadComponent(url, targetId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.statusText}`);
        }
        let html = await response.text();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = html;
        }
        // Si es el header, inicializamos sus funcionalidades específicas
        if (targetId === 'header-container') {
            initializeHeaderFunctions();
            // Load SwapCoin balance management
            loadSwapCoinScript();
            // Initialize Bootstrap dropdowns after header is loaded
            initializeDropdowns();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Funciones específicas del header
function initializeHeaderFunctions() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Recuperar el tema guardado o usar el predeterminado
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.btn-search');

    searchButton.addEventListener('click', () => {
        handleSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchInput.value);
        }
    });

    // Search functionality will be initialized separately
}

// Función auxiliar para actualizar el icono del tema
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Función para manejar la búsqueda
function handleSearch(searchTerm) {
    if (searchTerm.trim()) {
        console.log('Searching for:', searchTerm);
        // Aquí puedes implementar la lógica de búsqueda
        // Por ejemplo, redirigir a una página de resultados:
        // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
}

// Función para cargar el script de SwapCoin
function loadSwapCoinScript() {
    // Check if script is already loaded
    if (document.querySelector('script[src*="header-swapcoin.js"]')) {
        return;
    }
    
    const script = document.createElement('script');
    script.src = '../../../js/header-swapcoin.js';
    script.async = true;
    document.head.appendChild(script);
}

// Función para inicializar dropdowns de Bootstrap
function initializeDropdowns() {
    console.log('Initializing Bootstrap dropdowns...');
    
    // Wait for Bootstrap to be available
    const waitForBootstrap = () => {
        if (typeof bootstrap !== 'undefined') {
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            console.log('Found dropdown elements:', dropdownElementList.length);
            
            const dropdownList = [...dropdownElementList].map(dropdownToggleEl => {
                console.log('Initializing dropdown for:', dropdownToggleEl.id);
                return new bootstrap.Dropdown(dropdownToggleEl);
            });
            
            console.log('Initialized dropdowns:', dropdownList.length);
            
            // Add click event listeners as backup
            dropdownElementList.forEach(dropdownToggleEl => {
                dropdownToggleEl.addEventListener('click', function(e) {
                    console.log('Dropdown clicked:', this.id);
                });
            });
        } else {
            console.log('Bootstrap not ready, retrying in 100ms...');
            setTimeout(waitForBootstrap, 100);
        }
    };
    
    waitForBootstrap();
}

// Cargar los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Loading components...');
    
    // Verificar si estamos en la página principal (index.html)
    const path = window.location.pathname;
    const isMainPage = path.endsWith('index.html') || path === '/' || path === '/index.html';

    console.log('Current path:', path);
    console.log('Is main page:', isMainPage);

    if (isMainPage) {
        console.log('Loading footer only for main page');
        await loadComponent('components/footer.html', 'footer-container');
    } else {
        console.log('Loading header and footer for other pages');
        await loadComponent('../../../components/header.html', 'header-container');
        await loadComponent('../../../components/footer.html', 'footer-container');
    }
});
