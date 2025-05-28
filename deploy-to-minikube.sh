#!/bin/bash
set -e

# Start Minikube if it's not running
if ! minikube status &>/dev/null; then
  echo "Starting Minikube..."
  minikube start
else
  echo "Minikube is already running"
fi

# Set docker env to use Minikube's Docker daemon
echo "Setting Docker environment to use Minikube's Docker daemon..."
eval $(minikube docker-env)

# Build the frontend Docker image
echo "Building frontend Docker image..."
cd frontend
docker build -t laggen-frontend:dev -f dev.Dockerfile .
cd ..

# Build the backend Docker image
echo "Building backend Docker image..."
cd backend
docker build -t laggen-backend:dev -f Dockerfile .
cd ..

# Create and apply secrets from .env file
echo "Creating and applying secrets..."
./create-secrets.sh

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/laggen-frontend
kubectl rollout status deployment/laggen-backend

# Get the URL to access the frontend
echo "Getting frontend URL..."
minikube service laggen-frontend-service --url

echo "Deployment completed successfully!"
echo "You can access your application using the URL above."
