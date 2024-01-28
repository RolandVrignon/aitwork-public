# Cibles par défaut
.PHONY: all setup main build down clean

all: build setup main

# Construit ou reconstruit les services
build:
	@echo "Construction des services..."
	sudo docker-compose build

# Démarre le setup
setup:
	@echo "Démarrage du setup..."
	sudo docker-compose up setup

# Démarre la stack principale en mode détaché (silencieux)
main:
	@echo "Démarrage de la stack principale en arrière-plan..."
	sudo docker-compose up -d

# Arrête et nettoie les services
down:
	@echo "Arrêt des services et nettoyage..."
	sudo docker-compose down

# Supprime les images, volumes et réseaux
clean:
	@echo "Suppression des images, volumes et réseaux..."
	sudo docker-compose down --rmi all --volumes --remove-orphans

