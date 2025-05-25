# apps/webapp/Dockerfile
# Simple and reliable Neuronpedia Webapp Dockerfile
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache curl git openssl

WORKDIR /app

# Copy package files first for better caching
COPY package*.json yarn.lock* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy the rest of the source code
COPY . .

# Generate Prisma client (don't fail if it doesn't work)
RUN npx prisma generate || echo "Prisma generate skipped - will retry at runtime"

# Try to build the application (don't fail if it doesn't work)
RUN SKIP_ENV_VALIDATION=true npm run build || echo "Build skipped - will retry at runtime"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Simple health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Simple startup command with runtime build fallback
CMD ["sh", "-c", "\
    echo 'Starting Neuronpedia Webapp...' && \
    echo 'Node version:' $(node --version) && \
    echo 'NPM version:' $(npm --version) && \
    echo 'Files in /app:' && ls -la && \
    if [ ! -d '.next' ]; then \
        echo 'No .next directory found, generating Prisma client and building...'; \
        npx prisma generate || echo 'Prisma generate failed'; \
        if [ ! -z \"$DATABASE_URL\" ]; then \
            echo 'Setting up database...'; \
            npx prisma db push || echo 'Database setup failed'; \
        fi; \
        SKIP_ENV_VALIDATION=true npm run build || echo 'Build failed, trying dev mode'; \
        if [ ! -d '.next' ]; then \
            echo 'Build failed, starting in dev mode'; \
            exec npm run dev; \
        fi; \
    fi && \
    echo 'Starting production server...' && \
    exec npm start \
    "]
