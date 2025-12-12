FROM node:latest

WORKDIR /app

# Copy lockfiles first for better layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --filter chezmoi-ui-server...

# Copy server files
COPY server/ ./server/

# Copy env file
COPY server/.env.docker ./server/.env

# Create db directory
RUN mkdir -p /var/db-data

# Generate Prisma client and run migrations
WORKDIR /app/server
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy

EXPOSE 3000

CMD ["node", "index.js"]
