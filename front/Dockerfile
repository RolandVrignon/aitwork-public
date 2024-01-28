# Utilisation de l'image Node.js Alpine comme base
FROM node:lts-alpine

# Déclare la variable d'environnement comme argument de build
ARG REACT_APP_API_URL

# Définit la variable d'environnement
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Créez un répertoire de travail pour l'application
WORKDIR /app

# Copiez uniquement les fichiers nécessaires (package.json et package-lock.json)
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Build de l'application React
RUN npm run build

# Supprimez le dossier src et les fichiers non nécessaires
RUN rm -rf src node_modules

# Installez serve pour servir l'application
RUN npm install -g serve

# Définissez la commande pour exécuter l'application ReactJS
CMD ["serve", "-s", "build"]
