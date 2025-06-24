# 🎓 Swapp-it - Marketplace de Útiles Escolares

[![Deploy to GitHub Pages](https://github.com/tu-usuario/swapp-it-project/actions/workflows/deploy.yml/badge.svg)](https://github.com/tu-usuario/swapp-it-project/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat&logo=github)](https://tu-usuario.github.io/swapp-it-project/)

## 🌟 Descripción

**Swapp-it** es una plataforma innovadora que conecta estudiantes y negocios para el intercambio de útiles escolares. Los estudiantes pueden vender sus materiales usados y los negocios pueden ofrecer productos nuevos, creando un ecosistema sostenible y económico.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Completo**
- ✅ Registro de usuarios personales y de negocios
- ✅ Login con redirección según tipo de cuenta
- ✅ Recuperación de contraseña personalizada
- ✅ Cambio de contraseña con validación de fortaleza
- ✅ Gestión de perfiles en tiempo real

### 🛒 **Marketplace Inteligente**
- 🎯 Dashboard personalizado para estudiantes y negocios
- 📦 Gestión de productos con imágenes
- 💰 Sistema de puntos integrado
- ⭐ Sistema de reseñas y calificaciones
- 🔍 Búsqueda y filtros avanzados

### 🎨 **Interfaz Moderna**
- 📱 Diseño responsive y accesible
- 🌙 Modo oscuro/claro
- ⚡ Carga rápida y optimizada
- 🎭 Componentes reutilizables

## 🚀 Demo en Vivo

**🌐 [Ver Demo en GitHub Pages](https://tu-usuario.github.io/swapp-it-project/)**

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### **Backend & Base de Datos**
- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
- ![Firestore](https://img.shields.io/badge/Firestore-FF6B6B?style=for-the-badge&logo=firebase&logoColor=white)
- ![Firebase Auth](https://img.shields.io/badge/Firebase%20Auth-4285F4?style=for-the-badge&logo=firebase&logoColor=white)

### **Herramientas de Desarrollo**
- ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
- ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## 📦 Instalación y Configuración

### **Prerrequisitos**
- Node.js (versión 18 o superior)
- Cuenta de Firebase
- Git

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/swapp-it-project.git
cd swapp-it-project
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Crea un nuevo proyecto
   - Habilita Authentication, Firestore y Storage
   - Copia las credenciales a `src/firebase/config.js`

4. **Ejecutar localmente**
```bash
# Usar Live Server (recomendado)
# Instalar extensión "Live Server" en VS Code
# Click derecho en public/index.html → "Open with Live Server"

# O usar Python
python -m http.server 8000

# O usar Node.js
npx serve public
```

## 🌐 Despliegue

### **GitHub Pages (Automático)**
El proyecto se despliega automáticamente en GitHub Pages cuando haces push a la rama `main` o `master`.

**URL del sitio**: `https://tu-usuario.github.io/swapp-it-project/`

### **Firebase Hosting (Alternativo)**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Desplegar
firebase deploy
```

## 📁 Estructura del Proyecto

```
Swapp-it-Project/
├── 📁 public/                    # Frontend - Archivos públicos
│   ├── 📁 assets/logos/         # Logos de la aplicación
│   ├── 📁 components/           # Componentes reutilizables
│   ├── 📁 css/                  # Hojas de estilo
│   ├── 📁 js/                   # JavaScript del frontend
│   ├── 📁 marketplace/          # Páginas del marketplace
│   ├── 📁 pages/                # Páginas de autenticación
│   └── 📄 index.html            # Página principal
├── 📁 src/                      # Backend - Lógica de aplicación
│   ├── 📁 firebase/            # Configuración y funciones de Firebase
│   └── 📁 js/                  # Lógica de negocio
└── 📄 firebase.json            # Configuración de Firebase
```

## 🔐 Configuración de Seguridad

### **Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Storage Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing

### **Páginas de Prueba**
- **Login**: `/public/pages/login.html`
- **Registro**: `/public/pages/register.html`
- **Recuperación**: `/public/pages/forgot-password.html`
- **Cambio de contraseña**: `/public/pages/change-password.html`

### **Funcionalidades Testeadas**
- ✅ Registro de usuarios
- ✅ Login y logout
- ✅ Recuperación de contraseña
- ✅ Cambio de contraseña
- ✅ Gestión de perfiles
- ✅ Navegación entre páginas

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
- [x] Despliegue en GitHub Pages

### 🔄 **En Desarrollo**
- [ ] Funcionalidades del marketplace
- [ ] Sistema de transacciones
- [ ] Gestión de productos
- [ ] Sistema de puntos
- [ ] Notificaciones

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- Firebase por proporcionar una excelente plataforma backend
- Font Awesome por los iconos
- La comunidad de desarrolladores por las herramientas y recursos

## 📞 Contacto

- 📧 Email: tu-email@example.com
- 🌐 Website: [tu-sitio-web.com](https://tu-sitio-web.com)
- 🐦 Twitter: [@tu-twitter](https://twitter.com/tu-twitter)

---

⭐ **Si te gusta este proyecto, ¡dale una estrella en GitHub!**