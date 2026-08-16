# syntax=docker/dockerfile:1

# ---------- Tahap build ----------
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Tahap produksi ----------
# Server sudah dibundel penuh ke dist/server.cjs, jadi tidak perlu node_modules.
FROM node:22-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Jalankan sebagai pengguna non-root: bila proses berhasil dieksploitasi,
# penyerang tidak langsung memperoleh hak root di dalam kontainer.
RUN chown -R node:node /app
USER node

COPY --from=builder --chown=node:node /app/dist ./dist

# PORT disuntikkan Cloud Run saat runtime (default 8080) — jangan dipaku di sini.
EXPOSE 8080

CMD ["node", "dist/server.cjs"]
