# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend (Vite) + backend (esbuild)
RUN npm run build

# ===== Stage 2: Production =====
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Copy public assets
COPY --from=builder /app/assets ./assets

# Set environment
ENV NODE_ENV=production
# PORT is injected by Cloud Run at runtime (default 8080)
# Do NOT hardcode PORT here — server.ts reads process.env.PORT

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start server
CMD ["node", "dist/server.cjs"]
