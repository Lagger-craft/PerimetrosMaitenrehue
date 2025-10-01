#!/bin/bash

# Script para iniciar todo el sistema de Perimetros Maitenrehue
# Backend + Frontend

echo "🏗️  Iniciando Perimetros Maitenrehue - Sistema completo"
echo "=================================================="
echo ""

# Verificar que MongoDB esté corriendo
echo "🔍 Verificando MongoDB..."
if ! docker ps | grep -q mongodb; then
    echo "⚠️  MongoDB no está corriendo. Iniciando contenedor..."
    docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo
    sleep 3
    echo "✅ MongoDB iniciado"
else
    echo "✅ MongoDB ya está corriendo"
fi

echo ""
echo "🚀 Iniciando Backend (Puerto 5004)..."
cd server
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

# Iniciar backend en segundo plano
node server.js &
BACKEND_PID=$!

# Esperar a que el backend esté listo
sleep 3

echo "✅ Backend iniciado (PID: $BACKEND_PID)"
echo ""

echo "🌐 Iniciando Frontend..."
cd ..

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

echo "🎯 Abriendo aplicación..."
echo ""
echo "📋 URLs disponibles:"
echo "   Frontend: http://localhost:5173/PerimetrosMaitenrehue/"
echo "   Backend API: http://localhost:5004/"
echo "   Admin Login: http://localhost:5173/PerimetrosMaitenrehue/administracion"
echo ""
echo "🔧 Para detener los servicios:"
echo "   Ctrl+C en esta terminal"
echo "   O ejecutar: kill $BACKEND_PID"
echo ""

# Iniciar frontend (esto mantendrá el script corriendo)
npm run dev

# Si el frontend se cierra, también cerrar el backend
kill $BACKEND_PID 2>/dev/null