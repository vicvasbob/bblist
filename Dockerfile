FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application for production
RUN npm run build

# Expose port
EXPOSE 3000

# Default command for production
CMD ["npm", "start"]

