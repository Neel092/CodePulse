FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies for production
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose backend port (default in server.js is 5000)
EXPOSE 5000

CMD ["node", "server.js"]
