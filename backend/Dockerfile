FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3001

# Lancer l'application
CMD ["npm", "start"]