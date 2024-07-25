# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy client files
COPY client/ .

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Expose client port
EXPOSE 8000

# Start client
CMD ["pnpm", "run", "deploy"]