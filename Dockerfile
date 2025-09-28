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

# Build Next.js application for production with error checking
RUN echo "Starting Next.js build..." && \
    npm run build && \
    echo "Build completed successfully" && \
    ls -la .next/ && \
    echo "Checking build ID..." && \
    cat .next/BUILD_ID || echo "BUILD_ID not found!"

# Expose port
EXPOSE 3000

# Default command for production
CMD ["npm", "start"]

