#!/bin/sh

# Générer le fichier de configuration Nginx à partir du modèle
envsubst '${SUBDOMAIN},${DOMAIN},${EMAIL},${BACK_PORT},${FRONT_PORT},${MONGO_EXPRESS_PORT},${MINIO_PORT},${MINIO_CONSOLE_PORT},${KIBANA_PORT},${GRAFANA_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Exécuter la commande par défaut (démarrer Nginx dans ce cas)
exec "$@"
