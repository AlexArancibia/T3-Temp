# Base con Bun
FROM oven/bun:1

WORKDIR /app

# Copiar lockfile y package.json primero
COPY package.json bun.lock ./
RUN bun install

# Copiar código fuente

COPY . .

# Instalar OpenSSL y npm necesarios para Prisma
RUN apt-get update -y && apt-get install -y openssl npm

# Instalar @prisma/client con npm
RUN npm install @prisma/client
# Generar Prisma Client
RUN bunx prisma generate

EXPOSE 3000

# Hot reload (Bun dev server)
CMD ["bun", "run", "dev"]
