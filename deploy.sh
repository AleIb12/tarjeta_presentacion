#!/bin/bash

# Script de despliegue para Alisha Contact Card
# Este script automatiza el proceso de despliegue a Vercel

echo "🚀 Iniciando despliegue de Alisha Contact Card..."

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Error: No se pudo instalar Vercel CLI"
        exit 1
    fi
fi

# Verificar archivos necesarios
echo "🔍 Verificando archivos necesarios..."
required_files=("index.html" "style.css" "contact-sharer.js" "package.json" "vercel.json")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: No se encontró $file"
        exit 1
    fi
    echo "✅ $file encontrado"
done

echo "✅ Todos los archivos necesarios están presentes"

# Verificar configuración de Vercel
echo "🔧 Verificando configuración de Vercel..."
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: No se encontró vercel.json"
    exit 1
fi

# Desplegar a Vercel
echo "🚀 Desplegando a Vercel..."
vercel --prod

echo "✅ Despliegue completado!"
echo "🌐 Tu tarjeta de contacto está disponible en: https://alisha-contact-card.vercel.app"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verificar que el sitio funciona correctamente"
echo "2. Probar todas las funcionalidades (NFC, QR, vCard, WhatsApp, Telegram)"
echo "3. Compartir tu nueva tarjeta digital"
echo ""
echo "🎉 ¡Felicitaciones! Tu tarjeta de contacto está online."
