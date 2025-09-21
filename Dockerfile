# Usa la imagen oficial de Node.js (Debian)
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

ENV NEXT_PRIVATE_TURBOPACK=0
# Compila la app Next.js en modo producción
RUN npm run build
# Inicia el servidor en modo producción
CMD ["npm", "start"]

# Expone el puerto por defecto de Next.js
EXPOSE 3000

