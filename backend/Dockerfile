# Utiliser une image de base Node.js légère (Alpine)
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de définition des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'API écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
