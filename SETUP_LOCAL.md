# Configuración para Desarrollo Local

## 🚀 Inicio Rápido

### Opción 1: Usando PowerShell (Recomendado)
```powershell
.\start-dev-server.ps1
```

### Opción 2: Usando npm directamente
```bash
npm install
npm run dev
```

### Opción 3: Usando npx directamente
```bash
npx http-server public -p 8080 -c-1
```

## 🌐 Acceso al Proyecto

Una vez que el servidor esté corriendo, accede a:
- **Página principal**: http://localhost:8080
- **Dashboard de estudiante**: http://localhost:8080/dashboards/student/student-dashboard.html
- **Página de prueba**: http://localhost:8080/test-products-loading.html

## 🔧 Requisitos

- **Node.js**: Descarga desde https://nodejs.org/ (versión 14 o superior)
- **Navegador moderno**: Chrome, Firefox, Safari, Edge

## ❓ ¿Por qué necesito un servidor local?

Los módulos ES6 (`type="module"`) y los Web Components requieren un servidor web para funcionar correctamente. No puedes abrir los archivos directamente desde el explorador de archivos.

## 🛠️ Solución de Problemas

### Error: "Failed to fetch dynamically imported module"
- **Causa**: Archivos abiertos directamente desde el sistema de archivos
- **Solución**: Usar el servidor local como se describe arriba

### Error: "npm no se reconoce"
- **Causa**: Node.js no está instalado
- **Solución**: Instalar Node.js desde https://nodejs.org/

### Error: "Puerto 8080 en uso"
- **Solución**: Cambiar el puerto en el comando:
  ```bash
  npx http-server public -p 3000 -c-1
  ```

## 📁 Estructura del Proyecto

```
public/
├── index.html                    # Página principal
├── dashboards/
│   └── student/
│       ├── student-dashboard.html
│       └── components/
│           └── student-products.js  # Componente "Mis Productos"
├── firebase/
│   ├── auth.js
│   ├── firestore.js
│   └── config.js
└── test-products-loading.html    # Página de prueba
```

## 🔍 Debugging

Si tienes problemas con el componente "Mis Productos":

1. Abre http://localhost:8080/test-products-loading.html
2. Revisa la consola del navegador (F12)
3. Verifica que todos los componentes se registren correctamente
4. Confirma que Firebase Auth y Firestore funcionen

## 🚀 Despliegue en Firebase

Para desplegar en Firebase:
```bash
firebase deploy
```

**Nota**: El desarrollo local es independiente del despliegue en Firebase. Puedes trabajar localmente y luego desplegar cuando esté listo. 