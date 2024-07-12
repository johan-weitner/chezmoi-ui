# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy server files
COPY server/ .
COPY server/.env.docker .env

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Generate Prisma client
# RUN pnpx prisma generate

# Create db
# RUN pnpx prisma migrate dev

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]