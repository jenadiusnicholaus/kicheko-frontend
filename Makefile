.PHONY: help build up down restart logs ps deploy clean

COMPOSE = docker compose
SERVICE = frontend
PORT = 8024

help:
	@echo "Available commands:"
	@echo "  make deploy   - Pull latest changes, rebuild container, and restart service"
	@echo "  make build    - Build Docker image using docker compose"
	@echo "  make up       - Start Docker container in background (port $(PORT))"
	@echo "  make down     - Stop and remove Docker containers"
	@echo "  make restart  - Restart Docker containers"
	@echo "  make logs     - View container logs"
	@echo "  make ps       - Check status of running containers"
	@echo "  make clean    - Remove unused Docker images and build cache"

deploy:
	@echo "🚀 Starting deployment..."
	git pull origin main
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d --remove-orphans
	@echo "✅ Deployment successful! Service running at http://localhost:$(PORT)"

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f $(SERVICE)

ps:
	$(COMPOSE) ps

clean:
	docker system prune -f
