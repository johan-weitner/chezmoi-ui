# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy lockfiles first for better layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client/package.json ./client/

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile --filter chezmoi-ui-client

# Copy client files
COPY client/ ./client/

# Set working directory to client
WORKDIR /app/client

# Expose client port
EXPOSE 8000

# Start client
CMD ["pnpm", "run", "host"]
