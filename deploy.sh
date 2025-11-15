#!/bin/bash

# Nouveau port à utiliser
NEW_PORT=16789

# Fichier docker-compose
COMPOSE_FILE="docker-compose.yml"

echo "---- Mise à jour du port Docker dans $COMPOSE_FILE ----"
# Remplacer le mapping de port (ex: "16384:80") par "$NEW_PORT:80"
sed -i -E "s/\"\d+:80\"/\"$NEW_PORT:80\"/" "$COMPOSE_FILE"

echo "---- Arrêt des anciens conteneurs ----"
sudo docker compose down

echo "---- Démarrage des conteneurs ----"
sudo docker compose up -d

echo "---- Etat des conteneurs ----"
sudo docker ps

echo ""
echo "---- IMPORTANT ----"
echo "Vérifie dans ta Freebox que la redirection du port externe $NEW_PORT est active vers l'IP locale du serveur (ex: 192.168.1.88) port 80"
echo "Ton site sera accessible via l'adresse :"
echo "   http://portfolio06.freeboxos.fr:$NEW_PORT/"
echo ""
