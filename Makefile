# ================================
# Variables
# ================================
DOCKER_COMPOSE = docker compose -f config/docker/docker-compose.yml
PKG = bun

# ================================
# Docker
# ================================
# Levantar en desarrollo
dev:
	$(DOCKER_COMPOSE) up --build

# Levantar en segundo plano
up:
	$(DOCKER_COMPOSE) up -d --build

# Apagar los contenedores
down:
	$(DOCKER_COMPOSE) down

# Ver logs
logs:
	$(DOCKER_COMPOSE) logs -f app

# Acceder a la shell dentro del contenedor
sh:
	$(DOCKER_COMPOSE) exec app sh

# Borrar contenedor + volúmenes
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Reconstruir todo desde cero
rebuild: clean
	$(DOCKER_COMPOSE) up --build

# ================================
# App (Bun/Next.js)
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
