// Función para cargar componentes HTML
async function loadComponent(url, targetId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
        
        // Si es el header, inicializamos sus funcionalidades específicas
        if (targetId === 'header-container') {
            initializeHeaderFunctions();
        }
    } catch (error) {
        console.error('Error:', error);
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
    // Cargar header
    await loadComponent('../public/components/html/header.html', 'header-container');
    // Cargar footer
    await loadComponent('../public/components/html/footer.html', 'footer-container');
});
