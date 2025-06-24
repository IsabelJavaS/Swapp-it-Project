# SWAPPIT - Marketplace para Estudiantes

## Configuración de Firebase

### Opción 1: Configuración Manual (Recomendado)

1. **Edita `src/firebase/config.js`**:
   - Reemplaza las credenciales de `development` con tu proyecto de prueba
   - Cuando tengas tu proyecto real, agrega las credenciales en `production`

2. **Para cambiar de proyecto**:
   - En `src/firebase/config.js`, cambia la línea:
     ```js
     return 'development'; // Para proyecto de prueba
     // return 'production'; // Para proyecto real
     ```

3. **Obtener credenciales de Firebase**:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto
   - Ve a Configuración del proyecto > General
   - En "Tus apps", crea una app web si no tienes una
   - Copia la configuración

### Opción 2: Firebase CLI (Opcional)

Si quieres usar Firebase CLI:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init hosting
firebase init firestore
firebase init storage
firebase init functions

# Agregar múltiples proyectos
firebase use --add

# Cambiar entre proyectos
firebase use nombre-proyecto-prueba
firebase use nombre-proyecto-real
```

## Estructura del Proyecto

```
Swapp-it-Project/
├── public/                    # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── marketplace/
│   ├── css/
│   ├── js/
│   └── components/
├── src/
│   ├── firebase/             # Configuración de Firebase
│   │   ├── config.js         # Configuración principal
│   │   ├── auth.js           # Funciones de autenticación
│   │   ├── firestore.js      # Funciones de base de datos
│   │   └── storage.js        # Funciones de almacenamiento
│   └── js/                   # Lógica de negocio
│       ├── app.js            # Inicialización de la app
│       └── marketplace.js    # Lógica del marketplace
├── firebase.json             # Configuración de Firebase Hosting
├── firestore.rules           # Reglas de seguridad de Firestore
├── storage.rules             # Reglas de seguridad de Storage
└── README.md
```

## Servicios Firebase Utilizados

- **Firebase Auth**: Autenticación de usuarios
- **Firestore**: Base de datos para productos, usuarios, transacciones
- **Firebase Storage**: Almacenamiento de imágenes
- **Firebase Hosting**: Despliegue del frontend

## Desarrollo

1. **Servir localmente**:
   ```bash
   # Con servidor local simple
   npx http-server public
   
   # O con Firebase CLI
   firebase serve
   ```

2. **Desplegar**:
   ```bash
   # Con Firebase CLI
   firebase deploy
   
   # O manualmente subiendo la carpeta public a tu hosting
   ```

## Características del Marketplace

- ✅ Sistema de autenticación
- ✅ Gestión de productos
- ✅ Sistema de puntos
- ✅ Transacciones
- ✅ Reseñas y calificaciones
- ✅ Dashboard para estudiantes y negocios
- ✅ Responsive design

## Próximos Pasos

1. Configurar credenciales de Firebase en `src/firebase/config.js`
2. Implementar lógica de autenticación
3. Crear funciones de productos y transacciones
4. Implementar sistema de puntos
5. Agregar Cloud Functions para lógica avanzada