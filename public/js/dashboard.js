// DOM Elements
const sidebar = document.querySelector('.dashboard-sidebar');
const mainContent = document.querySelector('.dashboard-main');
const footer = document.querySelector('.dashboard-footer');
const collapseButton = document.querySelector('.collapse-button');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const mobileToggle = document.querySelector('.sidebar-toggle');

// Sidebar Collapse Handler
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    footer.classList.toggle('expanded');
}

// Mobile Sidebar Handler
function toggleMobileSidebar() {
    sidebar.classList.toggle('show');
    sidebarOverlay.classList.toggle('show');
}

// Event Listeners
collapseButton?.addEventListener('click', toggleSidebar);
mobileToggle?.addEventListener('click', toggleMobileSidebar);
sidebarOverlay?.addEventListener('click', toggleMobileSidebar);

// Close sidebar on navigation item click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
            toggleMobileSidebar();
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
    }
});

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Sales Chart
    const salesChartOptions = {
        series: [{
            name: 'Ventas',
            data: [30, 40, 35, 50, 49, 60, 70]
        }, {
            name: 'Compras',
            data: [20, 35, 40, 45, 39, 52, 58]
        }],
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        }
    };

    const salesChart = new ApexCharts(document.querySelector("#salesChart"), salesChartOptions);
    salesChart.render();

    // Categories Chart
    const categoriesChartOptions = {
        series: [44, 55, 13, 43],
        chart: {
            type: 'donut',
            height: 350
        },
        labels: ['Libros', 'Útiles', 'Electrónicos', 'Otros'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const categoriesChart = new ApexCharts(document.querySelector("#categoriesChart"), categoriesChartOptions);
    categoriesChart.render();
});

// Función para cambiar el período de tiempo
document.querySelector('.date-filter select')?.addEventListener('change', function(e) {
    // Aquí se implementaría la lógica para actualizar los datos según el período seleccionado
    console.log('Período seleccionado:', e.target.value);
});

// Manejar clicks en botones de exportar
document.querySelectorAll('.btn-export')?.forEach(btn => {
    btn.addEventListener('click', function() {
        // Aquí se implementaría la lógica de exportación
        console.log('Exportar datos');
    });
}); 