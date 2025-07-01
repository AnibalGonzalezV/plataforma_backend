# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files primero
COPY package.json ./

# Instala todas las dependencias (dev y prod)
RUN yarn install 

# Copia solo el código fuente
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

# Compila TypeScript
RUN yarn run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copia solo lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Instala solo dependencias de producción
RUN yarn install --frozen-lockfile --production

# Comando de inicio
CMD ["yarn", "start"]
