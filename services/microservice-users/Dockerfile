# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the package files first
COPY package.json ./

# Install dependencies
RUN yarn install 

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN yarn run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy only the built code and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Set the command (adjust the entry point if needed)
CMD ["yarn", "start:prod"]
