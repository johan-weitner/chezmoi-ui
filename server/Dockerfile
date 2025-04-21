FROM node:20-slim

# Install curl for healthcheck and tini for signal handling
RUN apt-get update && apt-get install -y curl tini && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/ .
COPY server/.env.docker .env

RUN npm install -g pnpm && pnpm install

RUN mkdir -p /var/db-data

RUN pnpx prisma migrate dev --schema=./prisma/schema.prisma
RUN pnpx prisma migrate deploy --schema=./prisma/schema.prisma;

EXPOSE 3000

ENV NODE_ENV=development

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "index.js"]
