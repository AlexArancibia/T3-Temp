# ======================
# 1) Build stage (con Bun)
# ======================
FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production

COPY . .
RUN bun run build   # compila Next.js

# ======================
# 2) Runtime (con Node.js)
# ======================
FROM node:20-alpine AS runner

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
