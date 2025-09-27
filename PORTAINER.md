# 🐳 Despliegue en Portainer

## 🎯 **Método Principal: Web Editor (Siempre funciona)**

**⚠️ Usar este método si obtienes errores de git o TLS**

**Archivo recomendado:** `docker-compose.fallback.yml`

1. **Crear nuevo Stack** en Portainer
2. **Seleccionar "Web editor"**
3. **Copiar contenido completo** de `docker-compose.fallback.yml` desde GitHub
4. **Pegar** en el editor de Portainer
5. **Variables de entorno** (opcionales):
   ```
   POSTGRES_PASSWORD=tu_contraseña_segura
   NEXT_PUBLIC_API_URL=http://localhost:3000
   GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
   ```
6. **Deploy Stack**

### ✅ **Por qué este método siempre funciona:**
- No requiere `git` en Portainer
- No requiere acceso directo a GitHub desde Portainer  
- El contenedor clona el repo internamente
- Compatible con cualquier instalación de Portainer

## 🔄 **Método Alternativo: Desde Repositorio**

**⚠️ Solo si tu Portainer NO tiene los errores de git**

## � **Si hay problemas con build desde GitHub:**

Usar `docker-compose.fallback.yml` que funciona con runtime clone:

1. **Web editor** en Portainer
2. **Copiar contenido** de `docker-compose.fallback.yml`
3. **Deploy Stack**

## ⚙️ **Variables por defecto incluidas:**

- `POSTGRES_DB=babylist`
- `POSTGRES_USER=babyuser`
- `POSTGRES_PASSWORD=babypass` ⚠️ **Cambiar por una segura**
- `DATABASE_URL` se genera automáticamente
- `NEXT_PUBLIC_API_URL=http://localhost:3000`
- `NODE_ENV=production`

## 🌐 **Acceso tras despliegue:**

- **Aplicación**: http://localhost:3000 (o tu dominio)
- **PostgreSQL**: Solo acceso interno (seguro)

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