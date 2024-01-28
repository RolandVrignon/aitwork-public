#!/bin/bash

# Vérifiez si make est installé
if ! command -v make &> /dev/null
then
    echo "Update des dépôts..."
    sudo apt update
    echo "Installation de make..."
    sudo apt install make -y
else
    echo "make est déjà installé."
fi
