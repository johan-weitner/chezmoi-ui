FROM node:latest

WORKDIR /app

COPY server/ .
COPY server/.env.docker .env

RUN npm install -g pnpm && pnpm install

RUN mkdir -p /var/db-data

RUN pnpx prisma migrate dev --schema=./prisma/schema.prisma
RUN pnpx prisma migrate deploy --schema=./prisma/schema.prisma;

EXPOSE 3000

CMD node index.js