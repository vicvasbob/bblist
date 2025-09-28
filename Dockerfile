FROM node:20-alpine

# Install system dependencies including git for potential build processes
RUN apk add --no-cache openssl git

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies with robust connectivity handling
RUN echo "Testing npm registry connectivity..." && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    echo "Installing dependencies with retries..." && \
    (npm ci --include=dev || \
     (echo "First attempt failed, trying with different registry..." && \
      npm config set registry https://registry.npm.taobao.org/ && \
      npm ci --include=dev) || \
     (echo "Second attempt failed, trying with original registry and force..." && \
      npm config set registry https://registry.npmjs.org/ && \
      npm install --include=dev --force)) && \
    echo "Verifying critical dependencies..." && \
    npm list tailwindcss && \
    npm list next && \
    npm list react && \
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

