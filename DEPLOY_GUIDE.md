# 🚀 Guía de Despliegue en Vercel

## Paso a Paso para Desplegar tu Tarjeta de Contacto

### Opción 1: Despliegue Manual (Recomendado)

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Autenticarse con Vercel**
   ```bash
   vercel login
   ```

3. **Desplegar desde el directorio del proyecto**
   ```bash
   cd /Users/alishaibarra/Documents/tarjeta_presentacion
   vercel --prod
   ```

4. **Usar el script automatizado**
   ```bash
   ./deploy.sh
   ```

### Opción 2: Despliegue desde GitHub

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/AleIb12/tarjeta-presentacion.git
   git push -u origin main
   ```

2. **Conecta GitHub con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

### Opción 3: Drag & Drop en Vercel

1. **Comprimir los archivos**
   ```bash
   zip -r tarjeta-contacto.zip . -x "*.git*" "node_modules/*" ".DS_Store"
   ```

2. **Subir a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Arrastra el archivo ZIP a la página
   - Vercel desplegará automáticamente

## 🔧 Configuración Adicional

### Variables de Entorno en Vercel
Si necesitas variables de entorno:
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las variables necesarias

### Dominio Personalizado
1. Ve a Settings → Domains
2. Añade tu dominio personalizado
3. Configura los DNS según las instrucciones

### Analytics
1. Ve a Settings → Analytics
2. Activa Vercel Analytics
3. Opcional: Configura Google Analytics

## 🎯 URLs Finales

- **Producción**: `https://alisha-contact-card.vercel.app`
- **Dashboard**: `https://vercel.com/dashboard`
- **Configuración**: `https://vercel.com/[username]/alisha-contact-card/settings`

## 🚨 Solución de Problemas

### Error: "Command not found: vercel"
```bash
npm install -g vercel
```

### Error: "No se pudo autenticar"
```bash
vercel logout
vercel login
```

### Error: "Archivo no encontrado"
Verifica que estés en el directorio correcto:
```bash
ls -la
# Deberías ver: index.html, style.css, contact-sharer.js, etc.
```

## 📊 Verificación Post-Despliegue

Después del despliegue, verifica:
- [ ] El sitio carga correctamente
- [ ] Todas las funcionalidades funcionan (NFC, QR, vCard, WhatsApp, Telegram)
- [ ] El diseño responsive funciona en móviles
- [ ] Los enlaces sociales están correctos
- [ ] Los botones responden correctamente
- [ ] Los meta tags se muestran correctamente en redes sociales

## 🎉 ¡Listo!

Tu tarjeta de contacto digital está ahora online y lista para compartir. 

**Próximos pasos:**
1. Comparte tu URL en redes sociales
2. Actualiza tu bio de Instagram/LinkedIn con el link
3. Añade el QR code a tu tarjeta de visita física
4. Configura el NFC si tienes dispositivos compatibles

¿Necesitas ayuda? Revisa la documentación en el README.md o contacta con el desarrollador.
