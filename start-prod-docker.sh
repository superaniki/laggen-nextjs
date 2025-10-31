#!/bin/bash

# Find an available port starting from 3000
find_available_port() {
  local port=${1:-3000}  # Start from provided port or default to 3000
  while nc -z localhost $port >/dev/null 2>&1; do
    echo "Port $port is in use, trying next port..."
    port=$((port + 1))
    if [ $port -gt 3100 ]; then
      echo "Error: Could not find an available port in range 3000-3100"
      exit 1
    fi
  done
  echo $port
}

# Get available port
PORT=$(find_available_port)
echo "Using port: $PORT for frontend"

# Create a temporary .env file from frontend/.env.local
if [ -f ./frontend/.env.local ]; then
  echo "Loading environment variables from frontend/.env.local"
  cp ./frontend/.env.local ./.env.docker
else
  echo "Warning: frontend/.env.local file not found"
  exit 1
fi

# Create a temporary compose file with the available port
cat compose.prod.yml | sed "s/- 3000:3000/- $PORT:3000/" > compose.temp.yml

echo "Starting in production mode on port $PORT..."
# Use the .env.docker file for environment variables
sudo docker compose --env-file ./.env.docker -f compose.temp.yml up --build $1

# Clean up temporary files when done
trap "rm compose.temp.yml .env.docker" EXIT

# Print access URLs
echo "Access the application at:"
echo "Frontend: http://localhost:$PORT"
echo "Backend API: http://localhost:8080"
