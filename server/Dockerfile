# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy server files
COPY server/ .
COPY server/.env.docker .env

# Install dependencies
RUN if [ ! -x "$(command -v pnpm)" ]; then npm install -g pnpm; fi && if [ ! -d "node_modules" ]; then pnpm install; fi

RUN if [ ! -f "/var/db-data/dev.db" ]; then \
  mkdir -p /var/db-data && \
  pnpx prisma migrate dev --schema=./prisma/schema.prisma; \
  pnpx prisma migrate deploy --schema=./prisma/schema.prisma; \
  fi

# Expose server port
EXPOSE 3000

# Start server
# CMD ["node", "index.js"]