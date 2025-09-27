# 🐳 Despliegue en Portainer

## 🎯 **Opción 1: Con Dockerfile (Recomendado)**

### Archivo: `docker-compose.server.yml`

1. **Crear nuevo Stack** en Portainer
2. **Seleccionar "Repository"**
3. **Configurar repositorio:**
   - URL: `https://github.com/vicvasbob/bblist.git`
   - Reference: `refs/heads/master`
   - Compose file path: `docker-compose.server.yml`
4. **Variables de entorno** (opcionales):
   ```
   POSTGRES_DB=babylist
   POSTGRES_USER=babyuser  
   POSTGRES_PASSWORD=babypass
   NEXT_PUBLIC_API_URL=http://localhost:3000
   GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
   ```
5. **Deploy Stack**

### Ventajas:
- ✅ **Build optimizado** con multi-stage
- ✅ **Imagen final ligera** (solo archivos necesarios)
- ✅ **Seguridad mejorada** (usuario no-root)
- ✅ **Inicio rápido** (todo pre-compilado)

## 🔄 **Opción 2: Fallback (Si falla la primera)**

### Archivo: `docker-compose.fallback.yml`

1. **Crear nuevo Stack** en Portainer
2. **Seleccionar "Web editor"**
3. **Copiar contenido completo** de `docker-compose.fallback.yml`
4. **Deploy Stack**

### Cuándo usar:
- ❌ Si Portainer no puede hacer build desde GitHub
- ❌ Si hay problemas con el contexto de build
- ✅ Como respaldo garantizado

## 🔧 Configuración

### Variables por defecto incluidas:
- `DATABASE_URL`: Se configura automáticamente
- `POSTGRES_DB`: `babylist`
- `POSTGRES_USER`: `babyuser`
- `POSTGRES_PASSWORD`: `babypass`
- `NEXT_PUBLIC_API_URL`: `http://localhost:3000`

### Puertos expuestos:
- **App**: `3000` (Next.js)
- **PostgreSQL**: `5432` (Base de datos)

## 🚀 Proceso de despliegue

1. PostgreSQL se inicia primero
2. Se clona el repositorio desde GitHub
3. Se construye la aplicación usando `Dockerfile.production`
4. Se ejecutan las migraciones de Prisma
5. Se inicia la aplicación Next.js

## ✅ Verificación

- **App**: http://localhost:3000
- **Health check**: PostgreSQL incluye verificación de salud
- **Logs**: Revisar en Portainer para cualquier error

## 🔍 Troubleshooting

Si hay errores de build:
1. Verificar que el repositorio es accesible
2. Revisar logs del contenedor de app
3. Confirmar que las variables de entorno están correctas
4. Verificar conectividad con PostgreSQL