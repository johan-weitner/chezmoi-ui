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
  touch /var/db-data/dev.db && \
  pnpx prisma generate --schema=./prisma/schema.prisma --watch && \
  pnpx prisma migrate deploy --schema=./prisma/schema.prisma; \
  fi

# Generate Prisma client and seed db, if db is missing
# RUN if [ ! -f "/var/db-data/dev.db" ]; then \
#   echo "" &&\
#   echo "***** CREATING DATABASE *****" &&\
#   echo "" &&\
#   pnpx prisma generate && \
#   pnpx prisma migrate deploy; \
#   fi

# RUN pnpx prisma generate && pnpx prisma migrate deploy
# RUN pnpx prisma migrate dev

# Expose server port
EXPOSE 3000

# Start server
# CMD ["node", "index.js"]