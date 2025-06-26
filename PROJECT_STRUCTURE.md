# 📁 Estructura del Proyecto Swapp-it

## 🎯 Descripción General

Swapp-it es una plataforma de marketplace para estudiantes y negocios que intercambian útiles escolares. El proyecto utiliza Firebase como backend y está estructurado de manera modular y escalable.

## 📂 Estructura de Directorios

```
Swapp-it-Project/
├── 📁 public/                    # Frontend - Archivos públicos
│   ├── 📁 assets/               # Recursos estáticos
│   │   └── 📁 logos/           # Logos de la aplicación
│   ├── 📁 components/           # Componentes reutilizables
│   ├── 📁 css/                  # Hojas de estilo
│   ├── 📁 js/                   # JavaScript del frontend
│   ├── 📁 marketplace/          # Páginas del marketplace
│   ├── 📁 pages/                # Páginas de autenticación
│   └── 📄 index.html            # Página principal
├── 📁 src/                      # Backend - Lógica de aplicación
│   ├── 📁 firebase/            # Configuración y funciones de Firebase
│   └── 📁 js/                  # Lógica de negocio
├── 📄 firebase.json            # Configuración de Firebase
├── 📄 firestore.rules          # Reglas de seguridad de Firestore
├── 📄 storage.rules            # Reglas de seguridad de Storage
├── 📄 package.json             # Dependencias del proyecto
├── 📄 README.md                # Documentación principal
├── 📄 AUTHENTICATION.md        # Documentación del sistema de auth
└── 📄 .gitignore               # Archivos a ignorar en Git
```

## 📋 Descripción de Archivos

### 🔧 Configuración

#### **firebase.json**
- Configuración principal de Firebase
- Define hosting, firestore y storage
- Configuración de reglas de seguridad

#### **firestore.rules**
- Reglas de seguridad para la base de datos
- Controla acceso a colecciones y documentos
- Protege datos de usuarios

#### **storage.rules**
- Reglas de seguridad para Firebase Storage
- Controla subida y acceso a archivos
- Protege archivos de usuarios

#### **package.json**
- Dependencias del proyecto
- Scripts de desarrollo y producción
- Metadatos del proyecto

### 🌐 Frontend (public/)

#### **📄 index.html**
- Página principal de la aplicación
- Landing page con información del proyecto
- Navegación a funcionalidades principales

#### **📁 pages/**
- **login.html** - Página de inicio de sesión
- **register.html** - Página de registro de usuarios
- **forgot-password.html** - Recuperación de contraseña
- **change-password.html** - Cambio de contraseña (dual-mode)

#### **📁 marketplace/**
- **dashboardStudent.html** - Dashboard para estudiantes
- **dashboardBusiness.html** - Dashboard para negocios
- **productsPage.html** - Lista de productos
- **productDetail.html** - Detalle de producto

#### **📁 components/**
- **header.html** - Encabezado reutilizable
- **footer.html** - Pie de página reutilizable
- **components.css** - Estilos de componentes
- **components.js** - Lógica de componentes

#### **📁 css/**
- **style.css** - Estilos principales
- **login.css** - Estilos de autenticación
- **register.css** - Estilos de registro
- **dashboard.css** - Estilos de dashboard
- **productPages.css** - Estilos de productos
- **productDetail.css** - Estilos de detalle de producto
- **forgot-password.css** - Estilos de recuperación
- **change-password.css** - Estilos de cambio de contraseña

#### **📁 js/**
- **auth-state.js** - Gestión de estado de autenticación
- **login.js** - Lógica de inicio de sesión
- **register.js** - Lógica de registro
- **forgot-password.js** - Lógica de recuperación
- **change-password.js** - Lógica de cambio de contraseña
- **profile-manager.js** - Gestión de perfiles
- **main.js** - Lógica principal de la aplicación
- **dashboard.js** - Lógica de dashboard

### 🔥 Backend (src/)

#### **📁 firebase/**
- **config.js** - Configuración de Firebase
- **auth.js** - Funciones de autenticación
- **firestore.js** - Operaciones de base de datos
- **storage.js** - Manejo de archivos

#### **📁 js/**
- **app.js** - Lógica principal de la aplicación
- **marketplace.js** - Lógica del marketplace

## 🎨 Arquitectura

### **Patrón MVC (Model-View-Controller)**
- **Model**: `src/firebase/` (Datos y lógica de negocio)
- **View**: `public/` (Interfaz de usuario)
- **Controller**: `src/js/` y `public/js/` (Lógica de control)

### **Separación de Responsabilidades**
- **Frontend**: Interfaz de usuario y validaciones
- **Backend**: Lógica de negocio y acceso a datos
- **Firebase**: Autenticación, base de datos y almacenamiento

### **Modularidad**
- Cada funcionalidad tiene sus propios archivos
- Componentes reutilizables en `components/`
- Estilos organizados por funcionalidad

## 🔐 Seguridad

### **Autenticación**
- Firebase Authentication para usuarios
- JWT tokens automáticos
- Protección de rutas

### **Autorización**
- Reglas de Firestore por usuario
- Reglas de Storage por usuario
- Validación en frontend y backend

### **Validación**
- Validación en tiempo real en frontend
- Validación de servidor en Firebase
- Sanitización de datos

## 🚀 Despliegue

### **Desarrollo Local**
```bash
# Usar Live Server (recomendado)
# Instalar extensión "Live Server" en VS Code
# Click derecho en index.html → "Open with Live Server"

# O usar Python
python -m http.server 8000

# O usar Node.js
npx serve .
```

### **Producción**
```bash
# Desplegar en Firebase Hosting
firebase deploy

# O desplegar en cualquier servidor web
# Copiar contenido de public/ al servidor
```

## 📊 Estado del Proyecto

### ✅ **Completado**
- [x] Sistema de autenticación completo
- [x] Registro de usuarios personales y de negocios
- [x] Login con redirección según tipo
- [x] Recuperación de contraseña
- [x] Cambio de contraseña
- [x] Gestión de perfiles
- [x] Estructura del marketplace
- [x] Componentes reutilizables
- [x] Documentación completa

### 🔄 **En Desarrollo**
- [ ] Funcionalidades del marketplace
- [ ] Sistema de transacciones
- [ ] Gestión de productos
- [ ] Sistema de puntos
- [ ] Notificaciones

### 📋 **Pendiente**
- [ ] Testing automatizado
- [ ] Optimización de rendimiento
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización
- [ ] Analytics y métricas

## 🛠️ Herramientas y Tecnologías

### **Frontend**
- HTML5, CSS3, JavaScript ES6+
- Font Awesome (iconos)
- Swiper.js (carruseles)

### **Backend**
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Firebase Hosting

### **Desarrollo**
- VS Code (recomendado)
- Live Server
- Firebase CLI
- Git

## 📝 Convenciones

### **Nomenclatura**
- **Archivos**: kebab-case (ej: `forgot-password.js`)
- **Funciones**: camelCase (ej: `handlePasswordReset`)
- **Clases**: PascalCase (ej: `ProductCard`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `MAX_FILE_SIZE`)

### **Estructura de Código**
- Comentarios descriptivos
- Funciones pequeñas y específicas
- Manejo de errores consistente
- Validaciones en frontend y backend

### **Organización**
- Un archivo por funcionalidad
- Separación clara de responsabilidades
- Reutilización de componentes
- Estilos modulares

## 🔍 Mantenimiento

### **Archivos a Revisar Regularmente**
- `firebase-debug.log` (eliminar si existe)
- `node_modules/` (no incluir en Git)
- Archivos temporales del sistema

### **Actualizaciones**
- Mantener Firebase SDK actualizado
- Revisar dependencias regularmente
- Actualizar reglas de seguridad según necesidades

### **Backup**
- Código en repositorio Git
- Configuración de Firebase en Firebase Console
- Datos de usuarios en Firestore
- Archivos en Firebase Storage 