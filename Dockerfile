# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend (Vite) + backend (esbuild — fully bundled, no --packages=external)
RUN npm run build

# ===== Stage 2: Production =====
# Server is fully self-contained in dist/server.cjs — no npm install needed
FROM node:20-alpine AS production

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Copy public assets (served by express.static in production)
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/public ./public

# Set environment
ENV NODE_ENV=production
# PORT is injected by Cloud Run at runtime (default 8080)
# server.ts reads process.env.PORT — do NOT hardcode here

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Start server
CMD ["node", "dist/server.cjs"]

