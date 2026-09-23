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

# Push DB schema and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && npm start"]
