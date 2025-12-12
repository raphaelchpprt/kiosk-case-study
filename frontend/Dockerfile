FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build Next.js
RUN npm run build

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]