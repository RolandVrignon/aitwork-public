# Utilisez l'image officielle de Certbot comme base
FROM certbot/certbot

# Copiez votre script d'entrée personnalisé dans l'image
COPY entrypoint.sh /entrypoint.sh

# Assurez-vous que le script est exécutable
RUN chmod +x /entrypoint.sh

# Définissez votre script d'entrée comme point d'entrée de l'image
ENTRYPOINT ["/entrypoint.sh"]
