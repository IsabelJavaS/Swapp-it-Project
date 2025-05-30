import { app } from './firebaseConfig.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc,
    getDoc
} from 'firebase/firestore';

// Inicializar Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Manejar el registro de usuarios
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener todos los campos del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validar que todos los campos requeridos estén llenos
        const requiredFields = document.querySelectorAll('[required]');
        let allFieldsFilled = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allFieldsFilled = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!allFieldsFilled) {
            alert('Por favor, completa todos los campos requeridos');
            return;
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Verificar que la contraseña tenga al menos 6 caracteres
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            // Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Determinar el rol seleccionado
            const activeRole = document.querySelector('.role-btn.active').dataset.role;
            
            // Preparar datos según el rol
            let userData = {
                email: email,
                role: activeRole,
                createdAt: new Date().toISOString(),
                uid: user.uid
            };

            if (activeRole === 'personal') {
                userData = {
                    ...userData,
                    nombre: document.getElementById('nombre').value,
                    telefono: document.getElementById('telefono').value,
                    direccion: document.getElementById('direccion').value
                };
            } else {
                userData = {
                    ...userData,
                    nombreNegocio: document.getElementById('nombreNegocio').value,
                    ruc: document.getElementById('ruc').value,
                    direccionNegocio: document.getElementById('direccionNegocio').value,
                    telefonoNegocio: document.getElementById('telefonoNegocio').value,
                    tipoNegocio: document.getElementById('tipoNegocio').value,
                    descripcionNegocio: document.getElementById('descripcionNegocio').value
                };
            }

            // Guardar datos en Firestore
            await setDoc(doc(db, 'usuarios', user.uid), userData);
            console.log('Usuario registrado exitosamente');

            // Redirigir al dashboard
            window.location.href = '/dashboardStudent.html';

        } catch (error) {
            console.error('Error en el registro:', error);
            let mensajeError = '';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    mensajeError = 'Este correo electrónico ya está registrado.';
                    break;
                case 'auth/invalid-email':
                    mensajeError = 'Correo electrónico inválido.';
                    break;
                case 'auth/operation-not-allowed':
                    mensajeError = 'El registro de usuarios está deshabilitado.';
                    break;
                case 'auth/weak-password':
                    mensajeError = 'La contraseña es demasiado débil.';
                    break;
                default:
                    mensajeError = error.message;
            }
            alert('Error en el registro: ' + mensajeError);
        }
    });
}

// Manejar el inicio de sesión
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            alert('Por favor, ingresa tu correo y contraseña');
            return;
        }
        
        try {
            // Intentar iniciar sesión
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verificar si el usuario existe en Firestore
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            
            if (!userDoc.exists()) {
                // Si el usuario no existe en Firestore, cerrar sesión
                await auth.signOut();
                alert('Error: Usuario no encontrado en la base de datos');
                return;
            }

            console.log('Inicio de sesión exitoso');
            window.location.href = '/dashboardStudent.html';
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            let mensajeError = '';
            switch (error.code) {
                case 'auth/invalid-email':
                    mensajeError = 'El correo electrónico no es válido.';
                    break;
                case 'auth/user-disabled':
                    mensajeError = 'Esta cuenta ha sido deshabilitada.';
                    break;
                case 'auth/user-not-found':
                    mensajeError = 'No existe una cuenta con este correo electrónico.';
                    break;
                case 'auth/wrong-password':
                    mensajeError = 'Contraseña incorrecta.';
                    break;
                default:
                    mensajeError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
            }
            alert(mensajeError);
        }
    });
}

// Manejar "Olvidé mi contraseña"
const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico');
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Se ha enviado un correo para restablecer tu contraseña');
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            let mensajeError = '';
            switch (error.code) {
                case 'auth/invalid-email':
                    mensajeError = 'El correo electrónico no es válido.';
                    break;
                case 'auth/user-not-found':
                    mensajeError = 'No existe una cuenta con este correo electrónico.';
                    break;
                default:
                    mensajeError = 'Error al enviar el correo de recuperación.';
            }
            alert(mensajeError);
        }
    });
}

// Observador del estado de autenticación
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Verificar si el usuario existe en Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        
        if (!userDoc.exists()) {
            // Si el usuario no existe en Firestore, cerrar sesión
            await auth.signOut();
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/login.html';
            }
            return;
        }

        // Usuario está autenticado y existe en Firestore
        console.log('Usuario autenticado:', user.email);
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            window.location.href = '/dashboardStudent.html';
        }
    } else {
        // Usuario no está autenticado
        console.log('Usuario no autenticado');
        if (window.location.pathname.includes('dashboardStudent.html')) {
            window.location.href = '/login.html';
        }
    }
});
