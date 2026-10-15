# Multi-stage build for Kicheko Frontend (Vue 3 + Vite)

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Enable Corepack so Yarn matches the version in package.json
RUN corepack enable

# Install dependencies (e2e workspace manifest needed for --immutable)
COPY package.json yarn.lock .yarnrc.yml ./
COPY e2e/package.json e2e/package.json
RUN yarn install --immutable

# Copy source code and build
COPY . .
RUN yarn build:ci

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for Vue SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production dist from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
