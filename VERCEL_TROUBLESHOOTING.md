# 🚨 Solución: "Vercel - Deployment failed"

## 🔍 Causas Comunes del Error

### 1. **Configuración de vercel.json**
- JSON malformado
- Configuración incompatible
- Headers conflictivos
- Rutas incorrectas

### 2. **Estructura de archivos**
- Archivos faltantes
- Nombres incorrectos
- Permisos de archivos

### 3. **package.json**
- JSON inválido
- Dependencias conflictivas
- Scripts incorrectos

### 4. **Límites de Vercel**
- Tamaño de archivos
- Número de archivos
- Límites de plan

## ✅ Soluciones Paso a Paso

### **Paso 1: Diagnóstico**
```bash
# Ejecutar script de diagnóstico
./vercel-check.sh

# O verificar manualmente
ls -la
cat vercel.json | jq .
cat package.json | jq .
```

### **Paso 2: Configuración Mínima**
Si el error persiste, usa esta configuración mínima:

**vercel.json (Versión Simple):**
```json
{
  "version": 2
}
```

**package.json (Versión Simple):**
```json
{
  "name": "alisha-contact-card",
  "version": "1.0.0",
  "main": "index.html"
}
```

### **Paso 3: Despliegue Alternativo**

#### **Opción A: Vercel CLI con Debug**
```bash
# Limpiar configuración anterior
rm -rf .vercel

# Desplegar con debug
vercel --debug --prod
```

#### **Opción B: Drag & Drop**
1. Comprimir archivos esenciales:
```bash
zip -r contact-card.zip index.html style.css contact-sharer.js imagenpro-2.png package.json vercel.json
```

2. Ir a [vercel.com](https://vercel.com)
3. Arrastrar el ZIP a la página
4. Configurar dominio si es necesario

#### **Opción C: GitHub Integration**
1. Subir código a GitHub
2. Conectar repositorio en Vercel
3. Despliegue automático

### **Paso 4: Verificación de Archivos**

**Archivos Esenciales Mínimos:**
```
proyecto/
├── index.html          # OBLIGATORIO
├── style.css          # OBLIGATORIO  
├── contact-sharer.js  # OBLIGATORIO
├── imagenpro-2.png    # OBLIGATORIO
├── package.json       # RECOMENDADO
└── vercel.json        # OPCIONAL
```

**Validación rápida:**
```bash
# Verificar que todos los archivos existen
for file in index.html style.css contact-sharer.js imagenpro-2.png; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file FALTANTE"
  fi
done
```

## 🔧 Soluciones Específicas

### **Error: "Build failed"**
```bash
# Recrear vercel.json simple
echo '{"version": 2}' > vercel.json

# Desplegar de nuevo
vercel --prod
```

### **Error: "Invalid configuration"**
```bash
# Validar JSON
cat vercel.json | jq .
cat package.json | jq .

# Si falla, usar configuración mínima
cp vercel.json vercel.json.backup
echo '{"version": 2}' > vercel.json
```

### **Error: "File not found"**
```bash
# Verificar estructura
find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.png"

# Verificar permisos
chmod 644 *.html *.css *.js *.png
```

### **Error: "Deployment timeout"**
```bash
# Reducir archivos
rm -rf node_modules .git

# Desplegar solo archivos esenciales
vercel --prod --yes
```

## 🎯 Configuración Vercel Optimizada

### **vercel.json (Recomendado):**
```json
{
  "version": 2,
  "name": "alisha-contact-card",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### **package.json (Recomendado):**
```json
{
  "name": "alisha-contact-card",
  "version": "1.0.0",
  "description": "Tarjeta de contacto digital de Alisha Ibarra Bello",
  "main": "index.html",
  "scripts": {
    "deploy": "vercel --prod"
  },
  "author": "Alisha Ibarra Bello"
}
```

## 🚀 Comandos de Emergencia

### **Reset Completo:**
```bash
# Limpiar configuración Vercel
rm -rf .vercel

# Usar configuración mínima
echo '{"version": 2}' > vercel.json

# Desplegar con debug
vercel --debug --prod
```

### **Despliegue Forzado:**
```bash
# Sin cache
vercel --prod --force

# Con confirmación automática
vercel --prod --yes

# Con configuración específica
vercel --prod --local-config vercel.json
```

## 📞 Si Nada Funciona

### **Plan B: Netlify**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Desplegar
netlify deploy --prod --dir .
```

### **Plan C: GitHub Pages**
1. Subir código a GitHub
2. Settings → Pages → Source: Deploy from branch
3. Seleccionar rama main
4. Sitio disponible en `username.github.io/repo-name`

### **Plan D: Servicio Local**
```bash
# Servidor simple con Python
python3 -m http.server 8000

# O con Node.js
npx serve .
```

## 📊 Checklist Final

- [ ] Todos los archivos esenciales presentes
- [ ] JSON válidos (package.json, vercel.json)
- [ ] Permisos de archivos correctos
- [ ] Estructura de carpetas correcta
- [ ] Sin archivos innecesarios (.git, node_modules)
- [ ] Vercel CLI actualizado: `npm update -g vercel`

## 🎉 Resultado Esperado

Después de aplicar estas soluciones:
- ✅ Despliegue exitoso en Vercel
- ✅ Sitio accesible públicamente
- ✅ Todas las funcionalidades funcionando
- ✅ URLs limpias y optimizadas

**URL Final:** `https://alisha-contact-card.vercel.app`
