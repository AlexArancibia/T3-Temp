# Use Node.js 22 as base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl bash
WORKDIR /app

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Copy package files and Prisma schema
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache curl bash
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install Bun in builder stage
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Set environment variables for build
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
ENV NEXTAUTH_SECRET="docker-build-secret"
ENV NEXTAUTH_URL="http://localhost:3000"

# Ensure Prisma client is generated in builder stage
RUN bunx prisma generate

# Build the application (using Docker-specific build script)
RUN bun run build:docker

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
