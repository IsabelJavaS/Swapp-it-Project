# 🔐 Sistema de Autenticación - Swapp-it

## 📋 Resumen

El sistema de autenticación de Swapp-it está construido con Firebase Authentication y Firestore, proporcionando un flujo completo y profesional para el manejo de usuarios, incluyendo registro, login, recuperación de contraseña y gestión de perfiles. **Todos los datos del usuario se almacenan en un solo documento en la colección `USERS`**, incluyendo información personal, de negocio, puntos y estadísticas.

## ��️ Arquitectura

### Componentes Principales

1. **Firebase Authentication**: Manejo de autenticación de usuarios
2. **Firestore Database**: Almacenamiento de perfiles de usuario
3. **Frontend Components**: Páginas HTML con JavaScript modular
4. **State Management**: Gestión de estado de autenticación

### Estructura de Archivos

```
src/firebase/
├── config.js          # Configuración de Firebase
├── auth.js            # Funciones de autenticación
├── firestore.js       # Operaciones de base de datos
└── storage.js         # Manejo de archivos

public/
├── pages/
│   ├── login.html              # Página de login
│   ├── register.html           # Página de registro
│   ├── forgot-password.html    # Recuperación de contraseña
│   └── change-password.html    # Cambio de contraseña (dual-mode)
├── js/
│   ├── login.js               # Lógica de login
│   ├── register.js            # Lógica de registro
│   ├── forgot-password.js     # Lógica de recuperación
│   ├── change-password.js     # Lógica de cambio de contraseña
│   └── auth-state.js          # Gestión de estado
└── css/
    ├── login.css
    ├── register.css
    ├── forgot-password.css
    └── change-password.css
```

## 👥 Tipos de Usuario

### 1. Usuario Personal (Student)
- **Campos requeridos**: Email, Password, Nombre, Teléfono, Dirección
- **Dashboard**: `dashboardStudent.html`
- **Rol en Firestore**: `personal`

### 2. Usuario de Negocio (Business)
- **Campos requeridos**: Email, Password, Nombre del Negocio, RUC, Dirección, Teléfono
- **Campos opcionales**: Tipo de Negocio, Descripción
- **Dashboard**: `dashboardBusiness.html`
- **Rol en Firestore**: `business`

## 🔄 Flujo de Registro

1. **Usuario llena formulario** → Selecciona rol (personal/business)
2. **Validación del lado cliente** → Email, password, campos requeridos
3. **Firebase Auth** → Crear cuenta con email/password
4. **Firestore** → Crear perfil de usuario con datos específicos del rol
5. **Redirección** → Dashboard según el rol

### 🗂️ Estructura del Perfil en Firestore (Colección: `users`)

```javascript
{
  // Datos básicos del usuario
  userId: "firebase-auth-uid",
  email: "user@example.com",
  role: "personal" | "business",
  status: "active",
  
  // Sistema de puntos integrado
  points: {
    balance: 0,
    history: [
      {
        amount: 100,
        reason: "Welcome bonus",
        transactionId: "tx123",
        timestamp: timestamp,
        type: "credit",
        previousBalance: 0,
        newBalance: 100
      }
    ]
  },
  
  // Estadísticas del usuario
  stats: {
    totalSales: 0,
    totalPurchases: 0,
    rating: 0,
    reviewCount: 0,
    productsCount: 0
  },
  
  // Datos específicos del rol
  personal: {
    nombre: "Juan Pérez",
    telefono: "123456789",
    direccion: "Calle 123"
  },
  
  // O para usuarios de negocio
  business: {
    nombreNegocio: "Mi Negocio",
    ruc: "12345678901",
    direccionNegocio: "Av. Principal 456",
    telefonoNegocio: "987654321",
    tipoNegocio: "restaurante",
    descripcionNegocio: "Descripción del negocio"
  },
  
  // Metadatos
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

## 🔑 Flujo de Login

1. **Usuario ingresa credenciales** → Email y password
2. **Validación** → Formato de email
3. **Firebase Auth** → Autenticar usuario
4. **Firestore** → Obtener perfil del usuario
5. **Actualizar último login** → Timestamp de último acceso
6. **Redirección** → Dashboard según el rol

## 🔄 Recuperación de Contraseña

### Flujo de "Forgot Password"

1. **Usuario accede** → `pages/forgot-password.html`
2. **Ingresa email** → Validación de formato
3. **Firebase Auth** → Envío de email de recuperación
4. **Usuario recibe email** → Con enlace de reset
5. **Usuario hace click** → Redirige a página de cambio de contraseña

### Características de la Página de Recuperación

- **Diseño moderno** → Interfaz profesional y responsive
- **Validación en tiempo real** → Feedback inmediato del email
- **Estados de carga** → Indicador visual durante el envío
- **Manejo de errores** → Mensajes específicos por tipo de error
- **Instrucciones claras** → Guía al usuario sobre qué hacer

## 🔐 Cambio de Contraseña

### Flujo de "Change Password"

1. **Usuario accede** → `pages/change-password.html` (requiere autenticación)
2. **Ingresa contraseña actual** → Para verificar identidad
3. **Ingresa nueva contraseña** → Con validación de fuerza
4. **Confirma nueva contraseña** → Para evitar errores
5. **Firebase Auth** → Actualización de contraseña
6. **Redirección** → Al login para nueva autenticación

### Características de la Página de Cambio

- **Indicador de fuerza** → Barra visual de seguridad de contraseña
- **Toggle de visibilidad** → Mostrar/ocultar contraseñas
- **Validación robusta** → Múltiples criterios de seguridad
- **Protección de ruta** → Solo usuarios autenticados
- **Feedback detallado** → Mensajes específicos de errores

### Criterios de Fuerza de Contraseña

```javascript
// Puntuación de 0-100 basada en:
- Longitud mínima (8 caracteres): 25 puntos
- Letra minúscula: 25 puntos  
- Letra mayúscula: 25 puntos
- Número: 25 puntos

// Niveles de fuerza:
- 0-49: Débil (rojo)
- 50-74: Regular (amarillo)
- 75-99: Buena (azul)
- 100: Fuerte (verde)
```

## 🛡️ Protección de Rutas

### Funciones de Protección

```javascript
import { requireAuth, requirePersonalUser, requireBusinessUser } from './js/auth-state.js';

// Proteger cualquier ruta que requiera autenticación
requireAuth();

// Proteger rutas solo para usuarios personales
requirePersonalUser();

// Proteger rutas solo para usuarios de negocio
requireBusinessUser();
```

### Uso en Páginas

```javascript
// En dashboardStudent.html
document.addEventListener('DOMContentLoaded', () => {
    requirePersonalUser();
});

// En dashboardBusiness.html
document.addEventListener('DOMContentLoaded', () => {
    requireBusinessUser();
});

// En change-password.html
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
});
```

## 🔄 Estado de Autenticación Global

### Funciones Disponibles

```javascript
import { 
    isAuthenticated, 
    getCurrentUserData, 
    getUserRole,
    handleLogout 
} from './js/auth-state.js';

// Verificar si está autenticado
const isAuth = isAuthenticated();

// Obtener datos del usuario actual
const { user, profile } = getCurrentUserData();

// Obtener rol del usuario
const role = getUserRole();

// Cerrar sesión
await handleLogout();
```

## 👤 Gestión de Perfiles

### Actualizar Información Personal

```javascript
import { updateUserPersonalProfile } from './js/profile-manager.js';

const personalData = {
    nombre: "Nuevo Nombre",
    telefono: "987654321",
    direccion: "Nueva Dirección"
};

const result = await updateUserPersonalProfile(personalData);
if (result.success) {
    console.log('Perfil actualizado exitosamente');
}
```

### Actualizar Información de Negocio

```javascript
import { updateUserBusinessProfile } from './js/profile-manager.js';

const businessData = {
    nombreNegocio: "Nuevo Nombre del Negocio",
    ruc: "12345678901",
    direccionNegocio: "Nueva Dirección del Negocio",
    telefonoNegocio: "987654321",
    tipoNegocio: "restaurante",
    descripcionNegocio: "Nueva descripción"
};

const result = await updateUserBusinessProfile(businessData);
if (result.success) {
    console.log('Información de negocio actualizada');
}
```

### Cambiar Email

```javascript
import { updateUserEmailAddress } from './js/profile-manager.js';

const result = await updateUserEmailAddress("nuevo@email.com", "password-actual");
if (result.success) {
    console.log('Email actualizado exitosamente');
}
```

### Cargar Perfil del Usuario

```javascript
import { loadUserProfile, formatUserProfile } from './js/profile-manager.js';

const result = await loadUserProfile();
if (result.success) {
    const formattedProfile = formatUserProfile(result.data);
    console.log('Perfil del usuario:', formattedProfile);
}
```

## 🎯 Sistema de Puntos Integrado

### Obtener Puntos del Usuario

```javascript
import { getUserPoints } from '../../src/firebase/firestore.js';

const result = await getUserPoints(userId);
if (result.success) {
    console.log('Balance:', result.data.balance);
    console.log('Historial:', result.data.history);
}
```

### Agregar Puntos

```javascript
import { addPoints } from '../../src/firebase/firestore.js';

const result = await addPoints(userId, 100, "Compra realizada", "tx123");
if (result.success) {
    console.log('Puntos agregados exitosamente');
}
```

### Descontar Puntos

```javascript
import { deductPoints } from '../../src/firebase/firestore.js';

const result = await deductPoints(userId, 50, "Pago de producto", "tx456");
if (result.success) {
    console.log('Puntos descontados exitosamente');
}
```

## 🧪 Sistema de Pruebas

### Página de Pruebas
- **URL**: `public/test-auth.html`
- **Funcionalidades**:
  - Probar registro de usuarios
  - Probar login
  - Verificar estado de autenticación
  - Enlaces rápidos a todas las páginas

### Funciones de Prueba

```javascript
import { 
    testRegistration, 
    testLogin, 
    testAuthState, 
    runAllTests 
} from './js/test-auth.js';

// Ejecutar todas las pruebas
await runAllTests();
```

## 🎨 Interfaz de Usuario

### Características UX

- **Validación en tiempo real** → Mensajes de error inmediatos
- **Estados de carga** → Botones deshabilitados durante operaciones
- **Mensajes de feedback** → Éxito y error claros
- **Redirección automática** → Basada en el rol del usuario
- **Recuperación de contraseña** → Envío de email de reset
- **Cambio de contraseña** → Con indicador de fuerza
- **Toggle de visibilidad** → Mostrar/ocultar contraseñas
- **Notificaciones de perfil** → Actualizaciones exitosas/fallidas

### Mensajes de Error

- **Email inválido** → "Please enter a valid email address"
- **Contraseña débil** → "Password must be at least 6 characters long"
- **Contraseñas no coinciden** → "Passwords do not match"
- **Usuario no encontrado** → "No account found with this email address"
- **Contraseña incorrecta** → "Incorrect password. Please try again"
- **Puntos insuficientes** → "Insufficient points"
- **Contraseña actual incorrecta** → "La contraseña actual es incorrecta"
- **Contraseña nueva débil** → "La nueva contraseña debe ser más segura"

## 🔧 Configuración

### Firebase Config

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Reglas de Firestore

```javascript
// Permitir lectura/escritura para usuarios autenticados
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Uso Rápido

### 1. Registrar un Usuario

```javascript
// El formulario de registro maneja todo automáticamente
// Solo necesitas llenar los campos y enviar
```

### 2. Hacer Login

```javascript
// El formulario de login maneja todo automáticamente
// Solo necesitas email y password
```

### 3. Recuperar Contraseña

```javascript
// Acceder a pages/forgot-password.html
// Ingresar email y recibir enlace de recuperación
```

### 4. Cambiar Contraseña

```javascript
// Acceder a pages/change-password.html (requiere autenticación)
// Ingresar contraseña actual y nueva contraseña
```

### 5. Verificar Autenticación

```javascript
import { isAuthenticated } from './js/auth-state.js';

if (isAuthenticated()) {
    console.log('Usuario autenticado');
} else {
    console.log('Usuario no autenticado');
}
```

### 6. Cerrar Sesión

```javascript
import { handleLogout } from './js/auth-state.js';

await handleLogout();
```

### 7. Actualizar Perfil

```javascript
import { updateUserPersonalProfile } from './js/profile-manager.js';

const result = await updateUserPersonalProfile({
    nombre: "Nuevo Nombre",
    telefono: "123456789",
    direccion: "Nueva Dirección"
});
```

## 📝 Ventajas de la Nueva Estructura

### ✅ **Beneficios:**

1. **Datos Consolidados** → Todo en un solo documento
2. **Consultas Más Rápidas** → Una sola lectura para obtener todo
3. **Menos Complejidad** → No hay que sincronizar múltiples documentos
4. **Mejor Rendimiento** → Menos operaciones de lectura/escritura
5. **Más Fácil de Mantener** → Estructura más clara y organizada
6. **Escalabilidad** → Fácil agregar nuevos campos
7. **Seguridad Mejorada** → Validación robusta de contraseñas
8. **UX Profesional** → Interfaz moderna y intuitiva

### 🔄 **Estructura Anterior vs Nueva:**

**❌ Anterior (Separado):**
```
users/{userId} → Datos básicos
points/{userId} → Sistema de puntos
```

**✅ Nueva (Integrado):**
```
users/{userId} → Todo en un documento
```

## 🔗 Enlaces Útiles

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Página de Pruebas](./public/test-auth.html)
- [Login](./public/pages/login.html)
- [Registro](./public/pages/register.html)
- [Recuperar Contraseña](./public/pages/forgot-password.html)
- [Cambiar Contraseña](./public/pages/change-password.html)

## 🎯 Sistema de Recuperación de Contraseña Personalizado

### Descripción General

El sistema de autenticación de Swapp-it está construido con Firebase Authentication y Firestore, proporcionando un flujo completo y profesional para el manejo de usuarios, incluyendo registro, login, recuperación de contraseña y gestión de perfiles.

### Flujos de Autenticación

#### 1. Registro de Usuario

**Página**: `public/pages/register.html`

**Proceso**:
1. Usuario llena formulario con datos personales o de negocio
2. Validación en tiempo real de campos
3. Creación de cuenta en Firebase Auth
4. Creación de perfil en Firestore
5. Redirección según tipo de cuenta

**Validaciones**:
- Email válido y único
- Contraseña segura (mínimo 8 caracteres, mayúsculas, minúsculas, números)
- Campos obligatorios según tipo de cuenta
- Verificación de términos y condiciones

**Estructura de Perfil en Firestore**:
```javascript
{
  uid: "user_id_from_firebase",
  email: "user@example.com",
  displayName: "Nombre del Usuario",
  accountType: "personal" | "business",
  createdAt: timestamp,
  lastLogin: timestamp,
  points: 0,
  
  // Datos personales
  personal: {
    firstName: "Nombre",
    lastName: "Apellido",
    phone: "+1234567890",
    studentId: "12345",
    institution: "Universidad XYZ"
  },
  
  // Datos de negocio (solo si accountType === "business")
  business: {
    businessName: "Nombre del Negocio",
    businessType: "Papelería",
    address: "Dirección del negocio",
    phone: "+1234567890",
    taxId: "123456789"
  }
}
```

#### 2. Login de Usuario

**Página**: `public/pages/login.html`

**Proceso**:
1. Usuario ingresa email y contraseña
2. Autenticación con Firebase
3. Actualización de último login en Firestore
4. Redirección según tipo de cuenta

**Redirecciones**:
- Usuarios personales → `marketplace/dashboardStudent.html`
- Usuarios de negocio → `marketplace/dashboardBusiness.html`

#### 3. Recuperación de Contraseña

**Página**: `public/pages/forgot-password.html`

**Proceso**:
1. Usuario ingresa email
2. Envío de email de recuperación con enlace personalizado
3. Enlace redirige a página de cambio de contraseña personalizada

**Características**:
- Validación de email en tiempo real
- Estados de carga y feedback
- Enlace personalizado que redirige a nuestra página (no modal de Firebase)

#### 4. Cambio de Contraseña (Dual-Mode)

**Página**: `public/pages/change-password.html`

**Modos de Operación**:

##### Modo Normal (Usuario Autenticado)
- Requiere contraseña actual
- Usuario debe estar logueado
- Cambio de contraseña para cuenta activa

##### Modo Reset (Desde Email)
- Detecta automáticamente código de acción en URL
- No requiere autenticación previa
- Restablecimiento de contraseña olvidada

**Detección Automática**:
```javascript
// Detecta parámetros en URL
const actionCode = getUrlParameter('oobCode') || getUrlParameter('actionCode');
if (actionCode) {
    // Modo reset desde email
    showResetForm();
} else {
    // Modo cambio normal
    requireAuthentication();
    showChangeForm();
}
```

**Características**:
- Validación de fortaleza de contraseña en tiempo real
- Toggle de visibilidad de contraseñas
- Feedback visual y mensajes de error específicos
- Redirección automática al login después del cambio

## Funciones de Autenticación

### Registro
```javascript
import { registerUser } from '../../src/firebase/auth.js';

const result = await registerUser(email, password, userData);
if (result.success) {
    // Redirigir según tipo de cuenta
    navigateToDashboard(result.user.accountType);
}
```

### Login
```javascript
import { loginUser } from '../../src/firebase/auth.js';

const result = await loginUser(email, password);
if (result.success) {
    // Redirigir según tipo de cuenta
    navigateToDashboard(result.user.accountType);
}
```

### Recuperación de Contraseña
```javascript
import { resetPassword } from '../../src/firebase/auth.js';

const result = await resetPassword(email);
if (result.success) {
    // Email enviado con enlace personalizado
    showSuccessMessage('Email enviado exitosamente');
}
```

### Cambio de Contraseña
```javascript
// Modo normal
import { updatePassword } from '../../src/firebase/auth.js';
const result = await updatePassword(newPassword);

// Modo reset
import { confirmPasswordReset } from '../../src/firebase/auth.js';
const result = await confirmPasswordReset(actionCode, newPassword);
```

## Gestión de Estado

### Auth State Management
```javascript
import { isAuthenticated, getCurrentUser, navigateToDashboard } from './auth-state.js';

// Verificar si usuario está autenticado
if (isAuthenticated()) {
    const user = getCurrentUser();
    // Mostrar contenido protegido
}

// Redirección automática
navigateToDashboard(accountType);
```

### Protección de Rutas
```javascript
// En páginas protegidas
document.addEventListener('DOMContentLoaded', () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    // Cargar contenido de la página
});
```

## Validaciones y UX

### Validación de Contraseña
- **Mínimo 8 caracteres**
- **Al menos una mayúscula**
- **Al menos una minúscula**
- **Al menos un número**
- **Indicador visual de fortaleza**

### Feedback de Usuario
- **Estados de carga** con spinners
- **Mensajes de error específicos** por tipo de error
- **Validación en tiempo real** de campos
- **Confirmación visual** de acciones exitosas

### Manejo de Errores
```javascript
// Errores específicos de Firebase Auth
switch (error.code) {
    case 'auth/user-not-found':
        return 'No existe una cuenta con este email';
    case 'auth/wrong-password':
        return 'Contraseña incorrecta';
    case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
    case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/expired-action-code':
        return 'El enlace de restablecimiento ha expirado';
    case 'auth/invalid-action-code':
        return 'El enlace de restablecimiento no es válido';
    default:
        return 'Error inesperado. Por favor intenta de nuevo';
}
```

## Seguridad

### Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/escribir solo su propio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Reglas de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Usuarios pueden subir archivos a su carpeta personal
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

### Página de Pruebas
**Archivo**: `public/test-password-reset.html`

**Funcionalidades**:
- Prueba de envío de email de recuperación
- Simulación de click en enlace de email
- Prueba de cambio de contraseña normal
- Links rápidos a todas las páginas
- URLs de prueba para diferentes escenarios

### URLs de Prueba
```
# Cambio normal (requiere autenticación)
pages/change-password.html

# Reset desde email (con action code)
pages/change-password.html?oobCode=test-action-code-123
pages/change-password.html?actionCode=test-action-code-456
```

## Configuración de Firebase

### Action Code Settings
```javascript
const actionCodeSettings = {
    url: `${window.location.origin}/public/pages/change-password.html`,
    handleCodeInApp: true
};
```

### Dominios Autorizados
- Configurar dominio en Firebase Console
- Agregar dominio a lista blanca de redirección
- Configurar plantillas de email personalizadas

## Flujo Completo de Recuperación

1. **Usuario solicita recuperación** → `forgot-password.html`
2. **Sistema envía email** → Con enlace personalizado
3. **Usuario hace click** → Redirige a `change-password.html?oobCode=xxx`
4. **Página detecta modo** → Muestra formulario de reset
5. **Usuario cambia contraseña** → Confirmación con action code
6. **Redirección automática** → `login.html`

## Consideraciones de Producción

### Configuración de Email
- Personalizar plantillas de email en Firebase Console
- Configurar dominio de envío
- Ajustar configuración de SPF/DKIM

### Monitoreo
- Configurar alertas de errores de autenticación
- Monitorear intentos fallidos de login
- Tracking de conversión de recuperación de contraseña

### Optimizaciones
- Lazy loading de componentes
- Caching de estado de autenticación
- Compresión de assets CSS/JS 