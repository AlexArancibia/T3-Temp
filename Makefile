# ================================
# Variables
# ================================
DOCKER_COMPOSE = docker compose
PKG = npm

# ================================
# Docker Compose Commands
# ================================
# Start all services in development mode
docker-dev:
	$(DOCKER_COMPOSE) up --build

# Start all services in background (production-like)
docker-up:
	$(DOCKER_COMPOSE) up -d --build

# Stop all services
docker-down:
	$(DOCKER_COMPOSE) down

# View logs from all services
docker-logs:
	$(DOCKER_COMPOSE) logs -f

# View logs from app service only
docker-logs-app:
	$(DOCKER_COMPOSE) logs -f app

# View logs from Redis
docker-logs-redis:
	$(DOCKER_COMPOSE) logs -f redis

# Access shell inside the app container
docker-sh:
	$(DOCKER_COMPOSE) exec app sh

# Clean up containers and volumes
docker-clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f

# Rebuild everything from scratch
docker-rebuild: docker-clean
	$(DOCKER_COMPOSE) up --build

# Run database migrations in Docker
docker-migrate:
	$(DOCKER_COMPOSE) exec app bunx prisma migrate deploy

# Generate Prisma client in Docker
docker-generate:
	$(DOCKER_COMPOSE) exec app bunx prisma generate

# Reset database (DANGER: deletes all data) - Uses external DB
docker-db-reset:
	$(DOCKER_COMPOSE) exec app bunx prisma migrate reset --force

# ================================
# App (npm/Next.js)
# ================================
start:
	$(PKG) run start

build:
	$(PKG) run build

verify:
	$(PKG) run verify

# ================================
# Lint & Format (Biome)
# ================================
lint:
	$(PKG) run lint

lint-fix:
	$(PKG) run lint:fix

format:
	$(PKG) run format

format-fix:
	$(PKG) run format:fix

# ================================
# Prisma
# ================================
db-generate:
	$(PKG) run prisma:generate

db-migrate:
	$(PKG) run prisma:migrate

db-studio:
	$(PKG) run prisma:studio

# ================================
# Commits
# ================================
commit:
	$(PKG) run commit

# ================================
# Utils
# ================================
sitemap:
	$(PKG) run sitemap

prepare:
	$(PKG) run prepare
