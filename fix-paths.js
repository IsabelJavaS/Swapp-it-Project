const fs = require('fs');
const path = require('path');

// Función para encontrar todos los archivos HTML
function findHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...findHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Función para corregir rutas en un archivo HTML
function fixHtmlFile(filePath) {
    console.log(`🔧 Corrigiendo rutas en: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Corregir rutas de CSS que empiecen con /
    content = content.replace(
        /href=["']\/(css\/[^"']+)["']/g,
        (match, cssPath) => {
            modified = true;
            // Calcular la profundidad del archivo
            const relativePath = path.relative('public', filePath);
            const depth = relativePath.split(path.sep).length - 1;
            const prefix = '../'.repeat(depth);
            return `href="${prefix}${cssPath}"`;
        }
    );
    
    // Corregir rutas de imágenes que empiecen con /
    content = content.replace(
        /src=["']\/(assets\/[^"']+)["']/g,
        (match, assetPath) => {
            modified = true;
            const relativePath = path.relative('public', filePath);
            const depth = relativePath.split(path.sep).length - 1;
            const prefix = '../'.repeat(depth);
            return `src="${prefix}${assetPath}"`;
        }
    );
    
    // Corregir rutas de favicon que empiecen con /
    content = content.replace(
        /href=["']\/(assets\/[^"']+)["']/g,
        (match, assetPath) => {
            modified = true;
            const relativePath = path.relative('public', filePath);
            const depth = relativePath.split(path.sep).length - 1;
            const prefix = '../'.repeat(depth);
            return `href="${prefix}${assetPath}"`;
        }
    );
    
    // Agregar el script de CSS Path Fixer si no existe
    if (!content.includes('css-path-fixer.js')) {
        const relativePath = path.relative('public', filePath);
        const depth = relativePath.split(path.sep).length - 1;
        const prefix = '../'.repeat(depth);
        
        // Insertar después del último link de CSS
        const insertAfter = content.lastIndexOf('</head>');
        if (insertAfter !== -1) {
            const scriptTag = `    <!-- CSS Path Fixer - Ajusta rutas automáticamente -->
    <script src="${prefix}js/css-path-fixer.js"></script>
`;
            content = content.slice(0, insertAfter) + scriptTag + content.slice(insertAfter);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Rutas corregidas en: ${filePath}`);
    } else {
        console.log(`ℹ️  No se requirieron cambios en: ${filePath}`);
    }
}

// Función principal
function main() {
    const publicDir = path.join(__dirname, 'public');
    
    if (!fs.existsSync(publicDir)) {
        console.error('❌ No se encontró la carpeta public/');
        return;
    }
    
    console.log('🔍 Buscando archivos HTML...');
    const htmlFiles = findHtmlFiles(publicDir);
    
    console.log(`📁 Encontrados ${htmlFiles.length} archivos HTML`);
    
    for (const file of htmlFiles) {
        fixHtmlFile(file);
    }
    
    console.log('✅ Proceso completado');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { findHtmlFiles, fixHtmlFile }; 