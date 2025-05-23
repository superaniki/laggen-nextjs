#!/bin/bash

# Function to check if a port is available
check_port() {
  local port=$1
  nc -z localhost $port >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    # Port is in use
    return 1
  else
    # Port is available
    return 0
  fi
}

# Find an available port starting from 3000
find_available_port() {
  local port=${1:-3000}  # Start from provided port or default to 3000
  while ! check_port $port; do
    echo "Port $port is in use, trying next port..."
    port=$((port + 1))
    if [ $port -gt 3100 ]; then
      echo "Error: Could not find an available port in range 3000-3100"
      exit 1
    fi
  done
  echo $port
}

# Start the application with the specified port
start_app() {
  local PORT=$1
  local MODE=$2
  local EXTRA_ARGS=$3
  
  echo "Using port: $PORT for frontend"
  
  # Create a temporary compose file with the available port
  if [ "$MODE" = "prod" ]; then
    COMPOSE_FILE="compose.prod.yml"
    # Create a temporary production compose file
    cat "$COMPOSE_FILE" | sed "s/- 3000:3000/- $PORT:3000/" > compose.temp.yml
    echo "Starting in production mode on port $PORT..."
    sudo docker compose -f compose.temp.yml up --build $EXTRA_ARGS
    # Clean up temporary file when done
    trap "rm compose.temp.yml" EXIT
  else
    COMPOSE_FILE="compose.yml"
    # Create a temporary development compose file
    cat "$COMPOSE_FILE" | sed "s/- 3000:3000/- $PORT:3000/" > compose.temp.yml
    echo "Starting in development mode on port $PORT..."
    sudo docker compose -f compose.temp.yml up --build $EXTRA_ARGS
    # Clean up temporary file when done
    trap "rm compose.temp.yml" EXIT
  fi
  
  # Print access URLs
  echo "Access the application at:"
  echo "Frontend: http://localhost:$PORT"
  echo "Backend API: http://localhost:8080"
}

# Print usage information
usage() {
  echo "Usage: $0 [FUNCTION] [ARGS...]"
  echo ""
  echo "Functions:"
  echo "  check_port PORT              Check if a port is available"
  echo "  find_available_port [START]  Find an available port starting from START (default: 3000)"
  echo "  start_app PORT MODE [ARGS]   Start the application with specified PORT and MODE (dev/prod)"
  echo "  help                         Show this help message"
  echo ""
  echo "Without arguments, the script will find an available port and start in dev mode"
  echo "Examples:"
  echo "  $0                           Start in dev mode with auto port detection"
  echo "  $0 prod                      Start in prod mode with auto port detection"
  echo "  $0 prod -d                   Start in prod mode with auto port detection in detached mode"
  echo "  $0 check_port 3000           Check if port 3000 is available"
  echo "  $0 find_available_port 8000  Find an available port starting from 8000"
  echo "  $0 start_app 3001 dev        Start in dev mode on port 3001"
}

# Main script execution
if [ "$1" = "check_port" ] && [ -n "$2" ]; then
  check_port "$2"
  if [ $? -eq 0 ]; then
    echo "Port $2 is available"
    exit 0
  else
    echo "Port $2 is in use"
    exit 1
  fi
elif [ "$1" = "find_available_port" ]; then
  find_available_port "${2:-3000}"
elif [ "$1" = "start_app" ] && [ -n "$2" ] && [ -n "$3" ]; then
  start_app "$2" "$3" "$4"
elif [ "$1" = "help" ]; then
  usage
else
  # Default behavior (backward compatible)
  MODE=${1:-dev}  # Default to dev mode if not specified
  PORT=$(find_available_port)
  start_app "$PORT" "$MODE" "$2"
fi
