#!/bin/bash

# Mise à jour de la liste des paquets
sudo apt update

# Vérifiez si make est installé
if ! command -v make &> /dev/null
then
    echo "Installation de make..."
    sudo apt install make -y
else
    echo "make est déjà installé."
fi

# Exécution de make
echo "Exécution de make..."
make

# Suite de votre script si nécessaire...
