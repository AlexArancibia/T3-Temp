# Base image con Bun
FROM oven/bun:1

# Crear directorio de la app
WORKDIR /app

# Copiar package.json y lockfile
COPY package.json bun.lockb ./

# Instalar dependencias
RUN bun install

# Copiar todo el código
COPY . .

# Exponer el puerto de Next.js
EXPOSE 3000

# Comando para desarrollo con hot reload
CMD ["bun", "run", "dev"]
