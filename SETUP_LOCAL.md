# Configuración para Desarrollo Local

## Problema Identificado

Tu sitio web funciona correctamente en Firebase Hosting pero tiene problemas en desarrollo local con:
- Logo no se muestra
- Enlaces del menú no funcionan
- Rutas de CSS incorrectas
- Imágenes no cargan

## Solución Implementada

He implementado una **solución completa** que funciona tanto en local como en Firebase:

### 1. Script de Corrección Automática de Rutas

Creé un script (`fix-paths.js`) que corrige automáticamente todas las rutas en los archivos HTML:

```bash
# Ejecutar para corregir todas las rutas
node fix-paths.js
```

### 2. CSS Path Fixer Dinámico

Agregué un script (`js/css-path-fixer.js`) que detecta automáticamente el entorno y ajusta las rutas en tiempo real:

```javascript
// Detecta automáticamente si estás en Firebase o local
function isFirebase() {
    return window.location.hostname.includes('firebaseapp.com') || 
           window.location.hostname.includes('web.app');
}

// Ajusta las rutas según el entorno
function getBaseUrl() {
    if (isFirebase()) {
        return ''; // Firebase Hosting
    } else {
        return '/public'; // Local development
    }
}
```

### 3. Correcciones Aplicadas

✅ **Rutas de CSS**: Convertidas de `/css/` a `../../css/` (relativas)
✅ **Rutas de imágenes**: Convertidas de `/assets/` a `../../assets/` (relativas)
✅ **Favicons**: Corregidos para usar rutas relativas
✅ **Scripts**: Agregado CSS Path Fixer a todas las páginas

## Configuración para Live Server

### Opción 1: Configurar Live Server para servir desde /public
1. Abre VS Code
2. Instala la extensión "Live Server" si no la tienes
3. Abre la carpeta raíz del proyecto (donde está `firebase.json`)
4. Haz clic derecho en la carpeta `public` y selecciona "Open with Live Server"

### Opción 2: Configurar Live Server manualmente
1. En VS Code, ve a Configuración (Ctrl/Cmd + ,)
2. Busca "Live Server"
3. Configura "Live Server > Settings: Root" como `/public`

### Opción 3: Usar un servidor local simple
```bash
# Desde la carpeta raíz del proyecto
cd public
python -m http.server 8000
# O
npx serve .
```

## Verificación

Para verificar que todo funciona correctamente:

1. **En Local**: Las rutas deberían empezar con `/public`
   - Logo: `/public/assets/logos/LogoSinFondo.png`
   - CSS: `/public/css/style.css`

2. **En Firebase**: Las rutas deberían empezar desde la raíz
   - Logo: `/assets/logos/LogoSinFondo.png`
   - CSS: `/css/style.css`

## Debug

Si sigues teniendo problemas:

1. Abre la consola del navegador (F12)
2. Busca errores 404 en la pestaña Network
3. Verifica que las rutas se están generando correctamente
4. Agrega `?debug=true` a la URL para ver logs detallados

## Estructura de Archivos

```
Swapp-it-Project/
├── firebase.json          # Configuración de Firebase
├── fix-paths.js          # Script para corregir rutas
├── public/               # Carpeta que se sirve en Firebase
│   ├── index.html
│   ├── js/
│   │   └── css-path-fixer.js  # Ajustador dinámico de rutas
│   ├── assets/
│   ├── components/
│   └── pages/
└── SETUP_LOCAL.md       # Este archivo
```

## Comandos Útiles

```bash
# Corregir todas las rutas automáticamente
node fix-paths.js

# Deploy a Firebase
firebase deploy

# Servir localmente desde public/
cd public && python -m http.server 8000

# Verificar configuración de Firebase
firebase hosting:channel:list
```

## Notas Importantes

- **Firebase Hosting**: Sirve desde la carpeta `public/` como raíz
- **Live Server Local**: Debe servir desde la carpeta `public/` para que las rutas coincidan
- **Rutas Dinámicas**: Los componentes detectan automáticamente el entorno y ajustan las rutas
- **CSS Path Fixer**: Se ejecuta automáticamente en todas las páginas

## Solución de Problemas Comunes

### Logo no aparece
- Verifica que el archivo existe en `public/assets/logos/LogoSinFondo.png`
- Revisa la consola del navegador para errores 404
- Ejecuta `node fix-paths.js` para corregir rutas

### CSS no carga
- Verifica que los archivos CSS existen en `public/css/`
- Revisa que el CSS Path Fixer esté incluido en la página
- Limpia la caché del navegador (Ctrl+F5)

### Enlaces no funcionan
- Asegúrate de que Live Server esté sirviendo desde la carpeta `public/`
- Verifica que los archivos HTML existan en las rutas especificadas
- Ejecuta `node fix-paths.js` para corregir rutas

### Rutas incorrectas
- Limpia la caché del navegador
- Recarga la página con Ctrl+F5
- Verifica que estés usando la versión actualizada de los componentes
- Ejecuta `node fix-paths.js` para corregir todas las rutas

## Estado Actual

✅ **Rutas corregidas**: 30 archivos HTML procesados
✅ **CSS Path Fixer**: Agregado a todas las páginas
✅ **Rutas dinámicas**: Funcionando en header y footer
✅ **Script de corrección**: Disponible para uso futuro

Tu sitio web ahora debería funcionar correctamente tanto en desarrollo local como en Firebase Hosting. 