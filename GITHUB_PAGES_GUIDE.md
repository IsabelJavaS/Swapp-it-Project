# 🚀 Guía para Subir Swapp-it a GitHub Pages

## 📋 Prerrequisitos

- ✅ Cuenta de GitHub
- ✅ Git instalado en tu computadora
- ✅ Proyecto Swapp-it listo

## 🔧 Pasos para Subir a GitHub Pages

### **Paso 1: Crear Repositorio en GitHub**

1. **Ve a GitHub.com** y inicia sesión
2. **Click en "New repository"** (botón verde)
3. **Configura el repositorio**:
   - **Repository name**: `swapp-it-project`
   - **Description**: `Marketplace de útiles escolares para estudiantes y negocios`
   - **Visibility**: Public (recomendado) o Private
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
4. **Click "Create repository"**

### **Paso 2: Subir Código a GitHub**

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Swapp-it marketplace project"

# Agregar el repositorio remoto (cambia TU_USUARIO por tu nombre de usuario)
git remote add origin https://github.com/TU_USUARIO/swapp-it-project.git

# Subir a la rama main
git branch -M main
git push -u origin main
```

### **Paso 3: Configurar GitHub Pages**

1. **Ve a tu repositorio** en GitHub
2. **Click en "Settings"** (pestaña)
3. **Scroll hacia abajo** hasta "Pages"
4. **En "Source"**, selecciona:
   - **Deploy from a branch**
   - **Branch**: `gh-pages` (se creará automáticamente)
   - **Folder**: `/ (root)`
5. **Click "Save"**

### **Paso 4: Configurar GitHub Actions (Automático)**

El archivo `.github/workflows/deploy.yml` ya está configurado. GitHub Actions se activará automáticamente cuando hagas push a la rama `main`.

### **Paso 5: Verificar el Despliegue**

1. **Ve a la pestaña "Actions"** en tu repositorio
2. **Verifica que el workflow se ejecute** correctamente
3. **Espera unos minutos** para que se complete el despliegue
4. **Ve a tu sitio**: `https://TU_USUARIO.github.io/swapp-it-project/`

## 🌐 Configuración de Dominio Personalizado (Opcional)

### **Si tienes un dominio personalizado:**

1. **Edita el archivo `CNAME`**:
   ```bash
   # Cambia la línea por tu dominio
   swapp-it.com
   ```

2. **En GitHub Settings > Pages**:
   - Agrega tu dominio en "Custom domain"
   - Marca "Enforce HTTPS"

3. **Configura DNS** en tu proveedor de dominio:
   ```
   Tipo: CNAME
   Nombre: @
   Valor: TU_USUARIO.github.io
   ```

## 🔧 Configuración de Firebase para Producción

### **Importante**: Configurar Firebase para el dominio de GitHub Pages

1. **Ve a Firebase Console** → Tu proyecto → Authentication
2. **Click en "Settings"** → "Authorized domains"
3. **Agrega tu dominio**:
   ```
   TU_USUARIO.github.io
   swapp-it.com (si tienes dominio personalizado)
   ```

### **Actualizar configuración de Firebase**

Edita `src/firebase/config.js`:

```javascript
// Cambia a producción cuando esté listo
return 'production'; // Para proyecto real
```

## 📱 Verificar que Todo Funcione

### **Páginas a Probar**:

1. **Página principal**: `https://TU_USUARIO.github.io/swapp-it-project/`
2. **Login**: `https://TU_USUARIO.github.io/swapp-it-project/pages/login.html`
3. **Registro**: `https://TU_USUARIO.github.io/swapp-it-project/pages/register.html`
4. **Recuperación**: `https://TU_USUARIO.github.io/swapp-it-project/pages/forgot-password.html`

### **Funcionalidades a Verificar**:

- ✅ Página principal carga correctamente
- ✅ Navegación entre páginas funciona
- ✅ Formularios de autenticación funcionan
- ✅ Firebase se conecta correctamente
- ✅ Diseño responsive funciona

## 🔄 Actualizaciones Futuras

### **Para actualizar el sitio**:

```bash
# Hacer cambios en tu código
# Luego:

git add .
git commit -m "Descripción de los cambios"
git push origin main

# GitHub Actions se ejecutará automáticamente
# El sitio se actualizará en unos minutos
```

## 🛠️ Solución de Problemas

### **Problema**: El sitio no carga
**Solución**:
- Verifica que el repositorio sea público
- Revisa la pestaña "Actions" para errores
- Espera 5-10 minutos para el primer despliegue

### **Problema**: Firebase no funciona
**Solución**:
- Verifica que el dominio esté en "Authorized domains" de Firebase
- Revisa la consola del navegador para errores
- Verifica la configuración en `src/firebase/config.js`

### **Problema**: Páginas 404
**Solución**:
- Verifica que las rutas en los enlaces sean correctas
- Asegúrate de que todos los archivos estén en la carpeta `public/`
- Revisa el archivo `404.html` personalizado

## 📊 Monitoreo

### **GitHub Insights**:
- Ve a la pestaña "Insights" en tu repositorio
- Monitorea visitas y popularidad
- Revisa el tráfico del sitio

### **Firebase Analytics** (Opcional):
- Configura Firebase Analytics
- Monitorea uso de la aplicación
- Revisa métricas de usuarios

## 🎉 ¡Listo!

Tu proyecto Swapp-it ahora está:
- ✅ **En GitHub** con control de versiones
- ✅ **Desplegado en GitHub Pages** automáticamente
- ✅ **Accesible públicamente** en la web
- ✅ **Configurado para actualizaciones** automáticas

### **URLs importantes**:
- **Sitio web**: `https://TU_USUARIO.github.io/swapp-it-project/`
- **Repositorio**: `https://github.com/TU_USUARIO/swapp-it-project`
- **Actions**: `https://github.com/TU_USUARIO/swapp-it-project/actions`

¡Felicidades! Tu proyecto está ahora en línea y accesible para todo el mundo! 🌟 