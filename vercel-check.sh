#!/bin/bash

# Script de diagnóstico y solución para errores de Vercel
echo "🔍 Diagnóstico de Vercel - Alisha Contact Card"
echo "=============================================="

# Verificar estructura del proyecto
echo "📁 Verificando estructura del proyecto..."
ERRORS=0

# Archivos esenciales
FILES=("index.html" "style.css" "contact-sharer.js" "package.json" "vercel.json")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
        echo "✅ $file ($SIZE bytes)"
    else
        echo "❌ $file faltante"
        ERRORS=$((ERRORS + 1))
    fi
done

# Verificar package.json
echo ""
echo "📦 Verificando package.json..."
if [ -f "package.json" ]; then
    if jq empty package.json 2>/dev/null; then
        echo "✅ package.json válido"
    else
        echo "❌ package.json inválido - JSON malformado"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "❌ package.json faltante"
    ERRORS=$((ERRORS + 1))
fi

# Verificar vercel.json
echo ""
echo "⚙️ Verificando vercel.json..."
if [ -f "vercel.json" ]; then
    if jq empty vercel.json 2>/dev/null; then
        echo "✅ vercel.json válido"
    else
        echo "❌ vercel.json inválido - JSON malformado"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "❌ vercel.json faltante"
    ERRORS=$((ERRORS + 1))
fi

# Verificar HTML
echo ""
echo "🌐 Verificando HTML..."
if [ -f "index.html" ]; then
    if grep -q "<!DOCTYPE html>" index.html; then
        echo "✅ DOCTYPE válido"
    else
        echo "⚠️ DOCTYPE faltante"
    fi
    
    if grep -q "<title>" index.html; then
        echo "✅ Título encontrado"
    else
        echo "⚠️ Título faltante"
    fi
else
    echo "❌ index.html faltante"
    ERRORS=$((ERRORS + 1))
fi

# Verificar CSS
echo ""
echo "🎨 Verificando CSS..."
if [ -f "style.css" ]; then
    if [ -s "style.css" ]; then
        echo "✅ CSS tiene contenido"
    else
        echo "⚠️ CSS está vacío"
    fi
else
    echo "❌ style.css faltante"
    ERRORS=$((ERRORS + 1))
fi

# Verificar JavaScript
echo ""
echo "⚡ Verificando JavaScript..."
if [ -f "contact-sharer.js" ]; then
    if [ -s "contact-sharer.js" ]; then
        echo "✅ JavaScript tiene contenido"
    else
        echo "⚠️ JavaScript está vacío"
    fi
else
    echo "❌ contact-sharer.js faltante"
    ERRORS=$((ERRORS + 1))
fi

# Resumen
echo ""
echo "📊 RESUMEN DEL DIAGNÓSTICO"
echo "=========================="
echo "Errores críticos: $ERRORS"

if [ $ERRORS -eq 0 ]; then
    echo "🎉 ¡Proyecto listo para desplegar!"
    echo ""
    echo "🚀 Opciones de despliegue:"
    echo "1. vercel --prod (recomendado)"
    echo "2. ./deploy.sh"
    echo "3. Arrastrar carpeta a vercel.com"
else
    echo "❌ Se encontraron $ERRORS errores críticos"
    echo ""
    echo "🔧 SOLUCIONES SUGERIDAS:"
    
    if [ ! -f "package.json" ]; then
        echo "• Crear package.json: npm init -y"
    fi
    
    if [ ! -f "vercel.json" ]; then
        echo "• Verificar vercel.json"
    fi
    
    if [ ! -f "index.html" ]; then
        echo "• Verificar que index.html existe"
    fi
fi

echo ""
echo "🔍 Para más información:"
echo "• vercel logs (ver logs de error)"
echo "• vercel --debug (modo debug)"
echo "• Consultar VERCEL_TROUBLESHOOTING.md"
