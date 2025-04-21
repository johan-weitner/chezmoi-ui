# Build stage
FROM node:20-slim as builder

WORKDIR /app

# Copy client files
COPY client/ .

# Install dependencies and build
RUN npm install -g pnpm && \
    pnpm install && \
    pnpm run build

# Production stage
FROM node:20-slim

# Install serve and curl for healthcheck
RUN apt-get update && \
    apt-get install -y curl tini && \
    npm install -g serve && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose client port
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

# Start static server with tini for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["serve", "-l", "8000", "-s", "dist"]
