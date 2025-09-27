# 🍼 Baby List - Lista de Regalos para Bebé

Sistema completo de gestión de listas de regalos para bebés con autenticación, administración de usuarios y productos, e internacionalización.

## 🚀 Características

- ✅ **Gestión de usuarios** completa (crear, activar, desactivar, eliminar)
- ✅ **Sistema de productos** con reservas
- ✅ **Autenticación JWT** con roles de admin
- ✅ **Interfaz de administración** completa
- ✅ **Sistema i18n** con editor de traducciones
- ✅ **Base de datos PostgreSQL** con Prisma ORM
- ✅ **Docker** para desarrollo y despliegue

## 📋 Requisitos Previos

- Docker y Docker Compose
- Git (para desarrollo local)
- Node.js 20+ (para desarrollo local)

## 🐳 Despliegue con Docker

### Desarrollo Local
```bash
# Clonar el repositorio
git clone https://github.com/vicvasbob/bblist.git
cd bblist

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servicios de desarrollo
docker-compose up -d
```

### Servidor/Portainer
```bash
# Opción 1: Usar docker-compose.server.yml en Portainer
# - Crear Stack desde Web Editor
# - Copiar contenido de docker-compose.server.yml

# Opción 2: Desde terminal
docker-compose -f docker-compose.server.yml up -d
```

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/vicvasbob/bblist.git
cd bblist

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Iniciar base de datos
docker-compose up postgres -d

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

## 🌍 Variables de Entorno

```env
DATABASE_URL=postgresql://babyuser:babypass@localhost:5432/babylist
NEXT_PUBLIC_API_URL=http://localhost:3000
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

## 📖 Uso

1. **Acceder a la aplicación**: http://localhost:3000
2. **Página de productos**: http://localhost:3000/products
3. **Admin de usuarios**: http://localhost:3000/admin/users
4. **Admin de productos**: http://localhost:3000/admin/products
5. **Editor de textos**: http://localhost:3000/admin/settings

## 🔧 Tecnologías

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT personalizado
- **Estado**: Zustand
- **Containerización**: Docker & Docker Compose
- **Internacionalización**: Sistema i18n personalizado

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Páginas de administración
│   │   ├── api/            # API Routes
│   │   └── products/       # Página pública de productos
│   ├── components/         # Componentes React
│   ├── lib/               # Utilidades y configuración
│   ├── locales/           # Archivos de traducción
│   └── store/             # Estado global
├── prisma/                # Schema y migraciones
├── docker-compose.yml     # Desarrollo
├── docker-compose.production.yml  # Producción
└── Dockerfile            # Imagen de contenedor
```

## 🚀 Despliegue en Producción

El proyecto está configurado para desplegarse fácilmente en:

- **Vercel** (recomendado para Next.js)
- **Docker** en cualquier VPS
- **Railway**, **Render**, etc.

### Vercel
1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Docker VPS
```bash
# En tu servidor
docker-compose -f docker-compose.production.yml up -d
```

## 📝 Licencia

MIT License

## 👨‍💻 Autor

Victor Albasole (vicvasbob)
