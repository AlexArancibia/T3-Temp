# -----------------------------------------------------------------------------
# This Dockerfile is specifically configured for projects using Bun
# -----------------------------------------------------------------------------

# Use Bun's official image
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies with bun
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Next.js collects completely anonymous telemetry data about general usage.
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build:docker

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files and generated client for database functionality
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Create entrypoint script for database migrations
COPY --chown=nextjs:nodejs <<EOF /app/entrypoint.sh
#!/bin/sh
set -e

echo "🚀 Starting Feniz Trading Platform..."

# Run database migrations if DATABASE_URL is set
if [ -n "\$DATABASE_URL" ]; then
    echo "🔄 Running database migrations..."
    bunx prisma migrate deploy || echo "⚠️  Migration failed, but continuing..."
    bunx prisma generate || echo "⚠️  Prisma generate failed, but continuing..."
fi

echo "✅ Starting the application..."
exec bun ./server.js
EOF

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
