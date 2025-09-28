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
    npm ci --verbose && \
    echo "Dependencies installed successfully"

# Copy source code
COPY . .

# Generate Prisma client with error checking
RUN echo "Generating Prisma client..." && \
    npx prisma generate && \
    echo "Prisma client generated successfully"

# Build Next.js application with comprehensive error checking
RUN echo "Starting Next.js build..." && \
    NODE_ENV=production npm run build && \
    echo "Build completed, checking output..." && \
    ls -la . && \
    echo "Checking .next directory..." && \
    ls -la .next/ && \
    echo "Verifying BUILD_ID..." && \
    cat .next/BUILD_ID && \
    echo "Build verification complete!"

# Expose port
EXPOSE 3000

# Default command for production
CMD ["npm", "start"]

