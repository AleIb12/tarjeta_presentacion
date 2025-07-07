# 🔐 Configuración de GitHub Actions + Vercel

## 🚀 Configuración de Secrets

Para que el workflow de GitHub Actions funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio:

### 1. **Obtener Token de Vercel**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Obtener token
vercel tokens create
```

### 2. **Obtener IDs del Proyecto**
```bash
# En el directorio del proyecto
vercel link

# Esto creará .vercel/project.json con los IDs necesarios
cat .vercel/project.json
```

### 3. **Configurar Secrets en GitHub**

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

Añade los siguientes secrets:

- **VERCEL_TOKEN**: El token generado en el paso 1
- **ORG_ID**: El `orgId` del archivo `.vercel/project.json`
- **PROJECT_ID**: El `projectId` del archivo `.vercel/project.json`
- **VERCEL_ORG_ID**: El mismo valor que `ORG_ID`

### 4. **Estructura del archivo .vercel/project.json**
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

## 🔧 Funcionalidades del Workflow

### **Triggers**
- ✅ **Push a main/master**: Despliegue automático a producción
- ✅ **Pull Request**: Despliegue a preview para testing
- ✅ **Validación automática**: Verifica archivos antes del despliegue

### **Validaciones**
- ✅ **Archivos principales**: index.html, style.css, contact-sharer.js
- ✅ **Configuración Vercel**: vercel.json
- ✅ **Estructura del proyecto**: Validación completa
- ✅ **Node.js setup**: Preparación del entorno

### **Despliegues**
- 🚀 **Preview**: Para Pull Requests (testing)
- 🎯 **Production**: Para pushes a main/master
- 💬 **Comentarios**: Notificaciones automáticas en PRs

## 🐛 Troubleshooting

### **Error: "secrets.VERCEL_TOKEN not found"**
1. Verifica que el secret esté configurado correctamente
2. Asegúrate de que el nombre sea exactamente `VERCEL_TOKEN`
3. Regenera el token si es necesario

### **Error: "Project not found"**
1. Ejecuta `vercel link` en el directorio del proyecto
2. Verifica que los IDs en `.vercel/project.json` sean correctos
3. Copia los IDs exactos a los secrets de GitHub

### **Error: "Insufficient permissions"**
1. Asegúrate de que el token tenga permisos de deployment
2. Verifica que seas owner o tengas permisos en el equipo de Vercel

## 📋 Checklist de Configuración

- [ ] Vercel CLI instalado
- [ ] Token generado con `vercel tokens create`
- [ ] Proyecto linkado con `vercel link`
- [ ] Secrets configurados en GitHub:
  - [ ] VERCEL_TOKEN
  - [ ] ORG_ID
  - [ ] PROJECT_ID
  - [ ] VERCEL_ORG_ID
- [ ] Workflow file existe en `.github/workflows/deploy.yml`
- [ ] Push a main/master para probar

## 🎯 Workflow Alternativo (Sin Secrets)

Si prefieres no usar secrets, puedes usar el script manual:

```bash
# Despliegue manual
./deploy.sh

# O directamente
vercel --prod
```

## 🚀 Resultado Final

Una vez configurado, cada push a main/master desplegará automáticamente tu tarjeta de contacto a Vercel, y cada Pull Request creará un preview para testing.

¡Tu tarjeta estará siempre actualizada y desplegada automáticamente! 🎉
