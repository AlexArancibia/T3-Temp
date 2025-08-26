# ======================
# 1) Etapa de build
# ======================
FROM dockette/nodejs:20 AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
# Si usas Bun como gestor, descomenta:
# COPY bun.lockb ./

# Instalar dependencias (solo producción para reducir tamaño)
RUN npm ci --omit=dev
# Si prefieres Bun:
# RUN bun install --production

# Copiar el resto del proyecto
COPY . .

# Build de Next.js
RUN npm run build

# ======================
# 2) Etapa de runtime
# ======================
FROM dockette/nodejs:20 AS runner

WORKDIR /app

# Establecer variable para Next.js en producción
ENV NODE_ENV=production

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "start"]
