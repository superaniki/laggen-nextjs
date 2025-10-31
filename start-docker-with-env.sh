#!/bin/bash

# Export environment variables from .env.local
if [ -f ./frontend/.env.local ]; then
  echo "Loading environment variables from frontend/.env.local"
  export $(grep -v '^#' ./frontend/.env.local | xargs)
else
  echo "Warning: frontend/.env.local file not found"
fi

# Run the original start-docker.sh script with all arguments
./start-docker.sh "$@"
