# Étape 1: Construction de l'application React
FROM node:18-alpine as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances et les installer
COPY package*.json ./
RUN npm install

# Copier le code source et construire l'application
COPY . .
RUN npm run build

# Étape 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de construction dans le répertoire de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port par défaut de Nginx
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
