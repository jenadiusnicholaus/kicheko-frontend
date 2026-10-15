# Multi-stage build for Kicheko Frontend (Vue 3 + Vite)

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (use yarn or npm)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile || npm install

# Copy source code and build
COPY . .
RUN npm run build:ci

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for Vue SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production dist from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
