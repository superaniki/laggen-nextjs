#!/bin/bash

ENV_FILE="./.env.k8s"
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env.k8s file not found at $ENV_FILE"
  echo "Please create an .env.k8s file with your environment variables first."
  exit 1
fi

# Create a fresh secrets.yaml file
cat > ./k8s/secrets.yaml << EOL
apiVersion: v1
kind: Secret
metadata:
  name: laggen-secrets
type: Opaque
stringData:
EOL

# Read .env file and add each line to the secrets.yaml file
while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  if [ -z "$line" ] || [ "${line#\#}" != "$line" ]; then
    continue
  fi
  
  # Extract key and value
  key=$(echo "$line" | cut -d '=' -f 1)
  # Remove quotes from the beginning and end of the value if they exist
  value=$(echo "$line" | cut -d '=' -f 2- | sed 's/^"//;s/"$//')
  
  # Add the key-value pair to secrets.yaml
  echo "  $key: \"$value\"" >> ./k8s/secrets.yaml
done < "$ENV_FILE"

echo "Kubernetes secrets created successfully at ./k8s/secrets.yaml"

# Apply the secrets to Kubernetes
echo "Applying secrets to Kubernetes..."
kubectl apply -f ./k8s/secrets.yaml

echo "Done! Your secrets have been applied to your Minikube cluster."
