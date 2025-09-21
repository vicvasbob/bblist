# Usa la imagen oficial de Node.js (Debian)
FROM node:20

# Instala git para poder clonar el repositorio
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /app

# Clona el repositorio desde GitHub
RUN git clone https://github.com/vicvasbob/bblist.git .

# Instala las dependencias
RUN npm install

# Genera el cliente de Prisma
RUN npx prisma generate

# Configuración de entorno
ENV NEXT_PRIVATE_TURBOPACK=0
ENV NODE_ENV=production

# Compila la app Next.js en modo producción
RUN npm run build

# Inicia el servidor en modo producción
CMD ["npm", "start"]

# Expone el puerto por defecto de Next.js
EXPOSE 3000

