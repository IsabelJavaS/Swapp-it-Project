// Función para cargar componentes HTML
async function loadComponent(url, targetId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.statusText}`);
        }
        let html = await response.text();
        
        // Ajustar rutas de imágenes si es el footer y estamos en marketplace
        if (targetId === 'footer-container' && window.location.pathname.includes('/marketplace/')) {
            html = html.replace(/src="assets\//g, 'src="../assets/');
        }
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = html;
        }
        
        // Si es el header, inicializamos sus funcionalidades específicas
        if (targetId === 'header-container') {
            initializeHeaderFunctions();
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

    // Initialize Bootstrap dropdowns
    if (typeof bootstrap !== 'undefined') {
        const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
        const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
    }
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

// Cargar los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si estamos en la página principal (index.html)
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    // Determinar la ruta base para los componentes
    let basePath = './components/';
    if (window.location.pathname.includes('/marketplace/')) {
        basePath = '../components/';
    }
    
    if (isMainPage) {
        // En la página principal solo cargar el footer
        await loadComponent(basePath + 'footer.html', 'footer-container');
    } else {
        // En otras páginas cargar header y footer
        await loadComponent(basePath + 'header.html', 'header-container');
        await loadComponent(basePath + 'footer.html', 'footer-container');
    }
});
