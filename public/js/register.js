// Obtener referencias a los elementos del DOM
const roleButtons = document.querySelectorAll('.role-btn');
const personalFields = document.getElementById('personalFields');
const businessFields = document.getElementById('businessFields');
const registerForm = document.getElementById('registerForm');

// Función para manejar el cambio de rol
function handleRoleChange(event) {
    const selectedRole = event.target.dataset.role;
    
    // Actualizar botones
    roleButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Mostrar/ocultar campos según el rol
    if (selectedRole === 'personal') {
        personalFields.classList.remove('hidden');
        businessFields.classList.add('hidden');
        
        // Habilitar/deshabilitar campos required
        toggleRequiredFields(personalFields, true);
        toggleRequiredFields(businessFields, false);
    } else {
        personalFields.classList.add('hidden');
        businessFields.classList.remove('hidden');
        
        // Habilitar/deshabilitar campos required
        toggleRequiredFields(personalFields, false);
        toggleRequiredFields(businessFields, true);
    }
}

// Función para alternar los atributos required
function toggleRequiredFields(container, required) {
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (required) {
            input.setAttribute('required', '');
        } else {
            input.removeAttribute('required');
        }
    });
}

// Agregar event listeners a los botones de rol
roleButtons.forEach(button => {
    button.addEventListener('click', handleRoleChange);
});

// Configuración inicial
document.querySelector('.role-btn.active').click(); 