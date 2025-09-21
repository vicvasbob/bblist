# 🐳 Despliegue en Portainer

## ⚠️ Problema con Git en Portainer

Si ves el error `git: executable file not found in $PATH`, es porque Portainer no tiene git instalado en su entorno de build. Usa estas alternativas:

## Opción 1: Stack Simple (Recomendado para Portainer)

1. **Crear nuevo Stack** en Portainer
2. **Seleccionar "Web editor"**
3. **Copiar contenido** de `docker-compose.simple.yml`
4. **Variables de entorno** (opcionales):
   ```
   POSTGRES_DB=babylist
   POSTGRES_USER=babyuser  
   POSTGRES_PASSWORD=babypass
   NEXT_PUBLIC_API_URL=http://localhost:3000
   GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
   ```
5. **Deploy Stack**

## Opción 2: Stack con Persistencia

1. **Crear nuevo Stack** en Portainer  
2. **Seleccionar "Web editor"**
3. **Copiar contenido** de `docker-compose.portainer.yml`
4. **Configurar variables** si es necesario
5. **Deploy Stack**

## Opción 3: Stack desde Repositorio (Solo si Portainer tiene Git)

1. **Crear nuevo Stack** en Portainer
2. **Seleccionar "Repository"**
3. **Configurar repositorio:**
   - URL: `https://github.com/vicvasbob/bblist.git`
   - Reference: `refs/heads/master`
   - Compose file path: `docker-compose.simple.yml`
4. **Deploy Stack**

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