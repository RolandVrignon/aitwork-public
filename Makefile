# Cibles par défaut
.PHONY: all setup main build down

all: build setup main

# Construit ou reconstruit les services
build:
	@echo "Construction des services..."
	docker-compose build

# Démarre le setup
setup:
	@echo "Démarrage du setup..."
	docker-compose up setup

# Démarre la stack principale
main:
	@echo "Démarrage de la stack principale..."
	docker-compose up -d

# Arrête et nettoie les services
down:
	@echo "Arrêt des services et nettoyage..."
	docker-compose down
