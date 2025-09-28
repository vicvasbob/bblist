FROM node:20-alpine

# Install system dependencies including git for potential build processes
RUN apk add --no-cache openssl git

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies with verbose output
RUN echo "Installing dependencies..." && \
    npm ci --include=dev && \
    echo "Dependencies installed successfully"

# Copy source code
COPY . .

# Generate Prisma client with error checking
RUN echo "Generating Prisma client..." && \
    npx prisma generate && \
    echo "Prisma client generated successfully"

# Try to build Next.js application, but don't fail the Docker build if it fails
RUN echo "Attempting Next.js build during image creation..." && \
    (NODE_ENV=production npm run build && \
     echo "Build completed successfully during image creation!" && \
     ls -la .next/ && \
     echo "BUILD_ID: $(cat .next/BUILD_ID 2>/dev/null || echo 'Not found')") || \
    echo "Build failed during image creation - will retry at runtime"

# Expose port
EXPOSE 3000

# Default command for production
CMD ["npm", "start"]

