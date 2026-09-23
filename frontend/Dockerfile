FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

EXPOSE 3000

# Start Vite dev server on port 3000
CMD ["npm", "run", "dev"]
