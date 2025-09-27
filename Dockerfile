# Dockerfile for Next.js application with Prisma
# Using multi-stage builds for optimized production image

# ============================================================================
# Base stage - Sets up the foundation
# ============================================================================
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts && npm cache clean --force

# ============================================================================
# Builder stage - Builds the application
# ============================================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for environment variables needed during build
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG JWT_SECRET
ARG NODEMAILER_USER
ARG NODEMAILER_PASSWORD
ARG NODEMAILER_SMTP
ARG NODEMAILER_PORT
ARG NEXTAUTH_URL

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODEMAILER_USER=${NODEMAILER_USER}
ENV NODEMAILER_PASSWORD=${NODEMAILER_PASSWORD}
ENV NODEMAILER_SMTP=${NODEMAILER_SMTP}
ENV NODEMAILER_PORT=${NODEMAILER_PORT}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Generate Prisma client
RUN npx prisma generate

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build:docker

# ============================================================================
# Runner stage - Final production image
# ============================================================================
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Note: No public folder to copy in this project

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy package.json for runtime
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
