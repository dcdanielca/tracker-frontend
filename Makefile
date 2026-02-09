.PHONY: help build up down restart logs shell test clean dev prod install lint format type-check

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

##@ General

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\n$(GREEN)Usage:$(NC)\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

dev: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker compose --profile dev up -d
	@echo "$(GREEN)✓ Development server running at http://localhost:5173$(NC)"

install: ## Install dependencies inside container
	@echo "$(GREEN)Installing dependencies...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

##@ Docker Operations

build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker compose build --no-cache
	@echo "$(GREEN)✓ Images built successfully$(NC)"

up: ## Start all services (development mode)
	@echo "$(GREEN)Starting services...$(NC)"
	docker compose --profile dev up -d
	@echo "$(GREEN)✓ Services are running$(NC)"

down: ## Stop and remove containers
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker compose --profile dev --profile prod --profile test down
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: down up ## Restart all services

logs: ## Show logs (use LOG_SERVICE=frontend-dev to filter)
	@if [ -z "$(LOG_SERVICE)" ]; then \
		docker compose --profile dev --profile prod logs -f; \
	else \
		docker compose --profile dev --profile prod logs -f $(LOG_SERVICE); \
	fi

shell: ## Access container shell (default: frontend-dev)
	@echo "$(GREEN)Opening shell in container...$(NC)"
	docker compose --profile dev exec frontend-dev sh

##@ Production

prod: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	docker compose --profile prod up -d
	@echo "$(GREEN)✓ Production server running at http://localhost:3000$(NC)"

prod-build: ## Build production image
	@echo "$(GREEN)Building production image...$(NC)"
	docker compose build --no-cache frontend-prod
	@echo "$(GREEN)✓ Production image built$(NC)"

##@ Testing & Quality

test: ## Run tests inside container
	@echo "$(GREEN)Running tests...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm test

test-coverage: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	docker compose --profile test run --rm frontend-test

test-ui: ## Open Vitest UI
	@echo "$(GREEN)Opening Vitest UI...$(NC)"
	docker compose --profile dev run --rm -p 51204:51204 frontend-dev npm run test:ui -- --host 0.0.0.0

lint: ## Run ESLint
	@echo "$(GREEN)Running linter...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm run lint

lint-fix: ## Fix linting issues
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm run lint:fix

format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm run format

type-check: ## Check TypeScript types
	@echo "$(GREEN)Checking types...$(NC)"
	docker compose --profile dev run --rm frontend-dev npm run type-check

##@ Maintenance

clean: ## Remove containers, volumes, and images
	@echo "$(RED)Cleaning up...$(NC)"
	docker compose --profile dev --profile prod --profile test down -v --rmi local
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-modules: ## Remove node_modules volume
	@echo "$(RED)Removing node_modules volume...$(NC)"
	docker volume rm tracker-frontend-node-modules || true
	@echo "$(GREEN)✓ node_modules volume removed$(NC)"

prune: ## Remove all unused Docker resources
	@echo "$(RED)Pruning Docker system...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✓ Docker system pruned$(NC)"

status: ## Show status of all containers
	@echo "$(GREEN)Container Status:$(NC)"
	@docker compose --profile dev --profile prod ps

##@ Utilities

exec: ## Execute command in container (use CMD="your command")
	@if [ -z "$(CMD)" ]; then \
		echo "$(RED)Error: Please provide CMD variable$(NC)"; \
		echo "Example: make exec CMD=\"npm install axios\""; \
	else \
		docker compose --profile dev exec frontend-dev $(CMD); \
	fi

run: ## Run one-off command (use CMD="your command")
	@if [ -z "$(CMD)" ]; then \
		echo "$(RED)Error: Please provide CMD variable$(NC)"; \
		echo "Example: make run CMD=\"npm install axios\""; \
	else \
		docker compose --profile dev run --rm frontend-dev $(CMD); \
	fi
