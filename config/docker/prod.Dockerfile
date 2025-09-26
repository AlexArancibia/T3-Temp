# ======================
# 1) Build stage (con Bun)
# ======================
FROM oven/bun:1 AS builder

WORKDIR /app

# Configure npm registry for better reliability
RUN bun config set registry https://registry.npmjs.org/

COPY package.json bun.lock ./

# Install dependencies with retry logic and better error handling
RUN for i in 1 2 3; do \
    bun install --production --no-cache --verbose && break || \
    (echo "Attempt $i failed, retrying..." && sleep 10); \
    done

COPY . .

# Build the application with error handling
RUN bun run build || (echo "Build failed, checking for common issues..." && exit 1)

# ======================
# 2) Runtime (con Node.js)
# ======================
FROM node:22-alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app
ENV NODE_ENV=production

# Copiar solo lo necesario
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

RUN useradd --system --create-home --shell /bin/bash appuser
RUN chown -R appuser:appuser /app
USER appuser

CMD ["npx", "next", "start"]
