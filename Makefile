# Cibles par défaut
.PHONY: all setup main build down clean

all: config build setup main

config:
	@echo "Configuration des dependances..."
	sudo bash install.sh

# Set Intern Ip Address Minio Endpoint et Construit ou reconstruit les services
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

update-backend:
	@echo "Mise à jour du backend..."
	docker-compose stop back && docker-compose build back && docker-compose up -d back

update-frontend:
	@echo "Mise à jour du frontend..."
	docker-compose stop front && docker-compose build front && docker-compose up -d front

# Arrête et nettoie les services
down:
	@echo "Arrêt des services et nettoyage..."
	sudo docker-compose down

re: down build setup main
	@echo "Les services ont été redémarrés avec succès."

# Supprime les images Docker non utilisées
prune:
	@echo "Suppression des images Docker non utilisées..."
	sudo docker image prune -f

# Supprime toutes les images Docker non utilisées
prune-all:
	@echo "Suppression de toutes les images Docker non utilisées..."
	sudo docker image prune -a -f
