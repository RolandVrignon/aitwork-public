# Cibles par défaut
.PHONY: all setup main build down clean

all: config build setup main

config:
	@echo "Configuration des dependances..."
	sudo bash install.sh

# Set Intern Ip Address Minio Endpoint et Construit ou reconstruit les services
build:
	@echo "Récupération de l'adresse IP interne..."
	@IP_ADDR=$$(ip addr | grep "inet\b" | awk '{print $$2}' | cut -d/ -f1 | sed -n '2p'); \
	sed -i '/^MINIO_LOCAL_ENDPOINT=/d' .env; \
	echo "MINIO_LOCAL_ENDPOINT=\"$$IP_ADDR\"" >> .env
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

re: down build setup main
	@echo "Les services ont été redémarrés avec succès."

# Supprime les images, volumes et réseaux
clean:
	@echo "Suppression des images, volumes et réseaux..."
	sudo docker-compose down --rmi all --volumes --remove-orphans



