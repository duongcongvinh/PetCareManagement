FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma on Alpine
RUN apk add --no-cache openssl

# Copy package files and prisma schema first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

EXPOSE 5000

# Push DB schema with retry until MongoDB Replica Set is ready, seed data, and start server
CMD ["sh", "-c", "until npx prisma db push --accept-data-loss; do echo 'Waiting for MongoDB Replica Set to be ready...'; sleep 2; done && node prisma/seed.js && npm start"]
