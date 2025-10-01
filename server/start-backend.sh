#!/bin/bash

# Script para iniciar el backend del sistema de facturación
# Perimetros Maitenrehue

echo "🚀 Iniciando servidor backend..."
echo "📍 Puerto: 5004"
echo "📊 Base de datos: MongoDB (localhost:27017)"
echo "🔐 Autenticación: JWT"
echo ""

# Verificar que MongoDB esté corriendo
if ! docker ps | grep -q mongodb; then
    echo "⚠️  MongoDB no está corriendo. Iniciando contenedor..."
    docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo
    sleep 3
fi

# Cambiar al directorio del servidor
cd "$(dirname "$0")"

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el servidor
echo "🎯 Iniciando servidor..."
node server.js