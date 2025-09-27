# Docker Deployment Guide

## Files Created

### 1. `Dockerfile`
- Multi-stage build optimized for production
- Uses Bun as package manager and runtime
- Includes Prisma client generation
- Automatic database migrations on startup
- Health check endpoint
- Non-root user for security

### 2. `docker-compose.yml`
- Standard Docker Compose configuration
- Environment variable mapping
- Health checks and resource limits
- Logging configuration

### 3. `docker-compose.coolify.yml`
- Optimized specifically for Coolify deployment
- Includes Coolify-specific labels
- Default values for optional environment variables
- Resource limits optimized for VPS deployment

### 4. `/src/app/api/health/route.ts`
- Health check endpoint for container monitoring
- Returns application status, uptime, and environment info

## Quick Start

### Local Development with Docker
```bash
# Build and run with docker-compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Building the Docker Image
```bash
# Build the image
docker build -t feniz-trading-platform .

# Run the container
docker run -p 3000:3000 --env-file .env feniz-trading-platform
```

## Environment Variables

All environment variables from `env.example` are supported. Key variables for production:

```bash
# Required
DATABASE_URL=postgresql://username:password@host:5432/database
BETTER_AUTH_SECRET=your-secure-secret-here
SITE_URL=https://your-domain.com

# Optional
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODEMAILER_SMTP=your-smtp-server
NODEMAILER_USER=your-email
NODEMAILER_PASSWORD=your-password
```

## Coolify Deployment

1. **Create new application** in Coolify
2. **Select Docker Compose** as deployment type
3. **Point to** `docker-compose.coolify.yml`
4. **Configure environment variables** in Coolify dashboard
5. **Set domain** and enable SSL
6. **Deploy**

### Coolify Environment Variables Setup
```bash
# In Coolify dashboard, add these environment variables:
DATABASE_URL=postgresql://user:pass@host:5432/dbname
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
SITE_URL=https://your-domain.com
# ... add other variables as needed
```

## Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## Database Migrations

Migrations run automatically on container startup if `DATABASE_URL` is provided:

1. **`bunx prisma migrate deploy`** - Applies pending migrations
2. **`bunx prisma generate`** - Generates Prisma client
3. **Starts the application**

## Resource Requirements

### Minimum Requirements
- **CPU**: 0.25 cores
- **Memory**: 512MB
- **Storage**: 1GB

### Recommended for Production
- **CPU**: 0.5-1.0 cores
- **Memory**: 1-1.5GB
- **Storage**: 5GB

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs -f

# Check if all environment variables are set
docker-compose config
```

### Database connection issues
```bash
# Test database connectivity
docker-compose exec app bunx prisma db pull
```

### Health check failing
```bash
# Test health endpoint manually
curl http://localhost:3000/api/health
```

### Port already in use
```bash
# Stop existing containers
docker-compose down

# Or use different port
docker-compose up --build -p 3001:3000
```

## Security Features

- **Non-root user**: Application runs as `nextjs` user
- **Minimal base image**: Alpine Linux for smaller attack surface
- **Resource limits**: Prevents resource exhaustion
- **Health checks**: Automatic container restart on failure

## Performance Optimizations

- **Multi-stage build**: Smaller production image
- **Standalone output**: Minimal Node.js server
- **Bun runtime**: Faster JavaScript execution
- **Static file serving**: Optimized asset delivery

## Monitoring

### Logs
```bash
# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
```

### Metrics
- Health check status: `/api/health`
- Container stats: `docker stats`
- Resource usage: Available in Coolify dashboard

## Updates

To update the application:

1. **Pull latest code**
2. **Rebuild container**: `docker-compose build --no-cache`
3. **Restart services**: `docker-compose up -d`

For Coolify: Push to your repository and redeploy through the dashboard.
