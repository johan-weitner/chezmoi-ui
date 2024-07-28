#!/bin/bash

# Start Docker service if it's not already running
if ! systemctl is-active --quiet docker; then
  echo "Docker is not running. Starting Docker..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open --background -a Docker
  else
    if command -v systemctl &> /dev/null; then
      systemctl start docker
    elif command -v service &> /dev/null; then
      service docker start
    else
      echo "Unable to start Docker service. Please start it manually."
    fi
  fi
fi

# Run docker-compose up --build if the images are not already built,
# otherwise run docker-compose up
if ! docker images | grep -q 'chezmoi-ui'; then
  echo "Docker images not found. Running docker-compose up --build..."
  docker-compose up --build
else
  docker-compose up
fi