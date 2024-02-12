#!/bin/sh

# Construisez la commande certbot avec les variables d'environnement
URL="${SUBDOMAIN}.${DOMAIN}"
EMAIL="${SSL_EMAIL:-your-email@example.com}" # Utilisez une valeur par défaut ou celle passée par l'environnement

# Exécutez la commande certbot
certbot certonly --webroot --webroot-path=/etc/nginx/certbot-conf --email "${EMAIL}" --agree-tos -n --expand --domains "${URL}" --domains "${SUBDOMAIN}-api.${DOMAIN}" --domains "${SUBDOMAIN}-minio.${DOMAIN}" --domains "${SUBDOMAIN}-minio-s3.${DOMAIN}" --domains "${SUBDOMAIN}-grafana.${DOMAIN}" --domains "${SUBDOMAIN}-mongo-express.${DOMAIN}"

# Gardez le conteneur en vie si nécessaire (peut être omis selon votre cas d'utilisation)
# exec "$@"
