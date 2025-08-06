# Script para iniciar el servidor de desarrollo
Write-Host "🚀 Iniciando servidor de desarrollo para Swapp-it..." -ForegroundColor Green

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor
Write-Host "🌐 Iniciando servidor en http://localhost:8080" -ForegroundColor Cyan
Write-Host "📁 Sirviendo archivos desde la carpeta 'public'" -ForegroundColor Cyan
Write-Host "🔄 Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev 