# SWAPPIT - School Supplies Marketplace

Una plataforma de intercambio de útiles escolares construida con Express.js, Firebase y Bootstrap.

## 🏗️ Arquitectura

- **Frontend**: HTML, CSS, JavaScript, Bootstrap (carpeta `public`)
- **Backend**: Express.js + Firebase (carpeta `backend`)

## 📁 Estructura del Proyecto

```
Swapp-it-Project/
├── backend/
│   ├── index.js          # Servidor Express + Firebase
│   ├── package.json      # Dependencias del backend
│   ├── env.example       # Ejemplo de variables de entorno
│   ├── .env              # Variables de entorno (crear manualmente)
│   └── node_modules/
├── public/
│   ├── index.html        # Página principal
│   ├── login.html        # Página de login
│   ├── register.html     # Página de registro
│   ├── productsPage.html # Página de productos
│   ├── productDetail.html # Detalle de producto
│   ├── js/
│   │   ├── main.js       # JavaScript principal
│   │   ├── api.js        # Módulo de comunicación con API
│   │   └── marketplace.js
│   ├── css/
│   │   └── style.css     # Estilos principales
│   └── assets/           # Imágenes y recursos
└── package.json          # Scripts de desarrollo
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
# Instalar dependencias del backend
npm run install-deps

# Instalar nodemon para desarrollo (opcional)
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp backend/env.example backend/.env

# Editar el archivo .env con tus credenciales de Firebase
```

**Contenido del archivo `.env`:**
```env
# Firebase Configuration
FIREBASE_API_KEY=tu_api_key_aqui
FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Iniciar el Servidor

**Para desarrollo (con auto-restart):**
```bash
npm run dev
```

**Para producción:**
```bash
npm start
```

### 4. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **Firebase Test**: http://localhost:3000/api/firebase-test

## 🔧 Funcionalidades

### Backend (Express + Firebase)
- ✅ Servidor Express configurado
- ✅ Firebase Authentication
- ✅ Firebase Firestore
- ✅ Firebase Storage
- ✅ CORS habilitado
- ✅ Servir archivos estáticos
- ✅ Rutas API básicas
- ✅ Variables de entorno seguras

### Frontend (HTML + CSS + JS + Bootstrap)
- ✅ Diseño responsive con Bootstrap
- ✅ Navegación suave
- ✅ Animaciones CSS
- ✅ Comunicación con API
- ✅ Testing de conexiones
- ✅ Botones CTA funcionales

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del backend |
| GET | `/api/firebase-test` | Verificar conexión Firebase |
| GET | `/` | Página principal |
| GET | `/login` | Página de login |
| GET | `/register` | Página de registro |
| GET | `/products` | Página de productos |
| GET | `/product/:id` | Detalle de producto |

## 🛠️ Desarrollo

### Agregar Nuevas Rutas API
Edita `backend/index.js`:
```javascript
// Ejemplo de nueva ruta
app.get('/api/products', (req, res) => {
  // Tu lógica aquí
  res.json({ products: [] });
});
```

### Comunicación Frontend-Backend
Usa el módulo API en el frontend:
```javascript
// GET request
const data = await window.api.get('/products');

// POST request
const result = await window.api.post('/products', { name: 'Product' });
```

## 🔥 Firebase

El proyecto está configurado con:
- **Authentication**: Login/Register de usuarios
- **Firestore**: Base de datos para productos y usuarios
- **Storage**: Almacenamiento de imágenes

### Configuración Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Configura Storage
5. Copia las credenciales al archivo `.env`

## 🔐 Seguridad

- ✅ **Variables de entorno** para credenciales sensibles
- ✅ **Archivo .env** excluido del control de versiones
- ✅ **Validación** de variables de entorno requeridas
- ✅ **Configuración separada** para desarrollo y producción

## 📱 Responsive Design

El proyecto es completamente responsive y funciona en:
- 📱 Móviles
- 📱 Tablets
- 💻 Desktop

## 🎨 Tecnologías Utilizadas

- **Backend**: Express.js, Firebase, dotenv
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- **Herramientas**: Node.js, npm

## 📝 Próximos Pasos

1. Implementar autenticación completa
2. Agregar CRUD de productos
3. Implementar sistema de búsqueda
4. Agregar carrito de compras
5. Implementar sistema de pagos
6. Agregar notificaciones
7. Optimizar rendimiento

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Configura las variables de entorno
4. Commit tus cambios
5. Push a la rama
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.