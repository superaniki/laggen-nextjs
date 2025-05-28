# Laggen - the traditional wooden bucket editor

With this tool, you can easily create your library of buckets and print out templates for use as
you manually create your wooden bucket using manual tools like in the pre-industry society.

## The application is made up of 3 parts:
<b>Frontend</b> - application - includes the editor
<b>Backend</b> - server function for exporting images and pdfs of templates
<b>DB</b> - Database using SQlite or PostgreSQL

## Techstack
Client: Next.js(app router), React, tailwind, SQLite or PostgreSQL</b>
Backend tech: Dotnet core, Skiasharp, Newtonsoft


## Build and start using Docker Compose

### Prerequisites
- Docker and Docker Compose installed on your system
- Clone this repository to your local machine

### Environment Setup
Before starting the application, make sure you have the proper environment files:
- For development: `frontend/.env.local`
- For production: `frontend/.env.production`

### Starting the Application with Dynamic Port Allocation
Use the provided script to automatically find an available port if the default port (3000) is already in use:

```bash
# Start in development mode with auto port detection
./start-docker.sh

# Start in production mode with auto port detection
./start-docker.sh prod

# Run in detached mode (add -d as the second parameter)
./start-docker.sh dev -d  # For development
./start-docker.sh prod -d # For production
```

The script will:
1. Check if port 3000 is available
2. If not, increment the port number until it finds a free port
3. Start the application using the available port
4. Display the URL to access the application

### Manual Startup (Fixed Ports)
Alternatively, you can start the application manually with fixed ports:

```bash
# Development mode
docker compose up --build

# Production mode
docker compose -f compose.prod.yml up --build

# To run in detached mode, add -d
docker compose up --build -d
docker compose -f compose.prod.yml up --build -d
```

This will start:
- Frontend client on port 3000 (with hot-reloading)
- Backend image service on port 8080

### Stopping the Application
To stop all running containers:

```bash
# For development
docker compose down

# For production
docker compose -f compose.prod.yml down
```

### Accessing the Application
- Frontend: http://localhost:<PORT> (where <PORT> is the port displayed when starting with the script, default is 3000)
- Backend API: http://localhost:8080

When using the `start-docker.sh` script, it will display the correct URL to access the application.



### Startup locally with minicube, using Kubernetes config files

```bash
./deploy-to-minikube.sh
```

### Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed on your system
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your system
- Docker installed on your system

### Environment Setup
Before deploying to Kubernetes, you need to set up your environment variables:

1. Create a `.env.k8s` file in the root directory with the following variables:
   ```
   SQLITE_LOCAL_DATABASE_URL="file:./dev.db"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   AUTH_SECRET="your-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   LAGGEN_SERVER_FUNC="http://laggen-backend-service:7071/api/BarrelToImage"
   ```

### Deployment Steps

1. Start Minikube:
   ```bash
   minikube start
   ```

2. Set Docker to use Minikube's Docker daemon:
   ```bash
   eval $(minikube docker-env)
   ```

3. Deploy the application using the provided script:
   ```bash
   ./deploy-to-minikube.sh
   ```

   This script will:
   - Build Docker images for the frontend and backend
   - Create Kubernetes secrets from your `.env.k8s` file
   - Apply Kubernetes configurations for deployments and services
   - Wait for deployments to be ready

4. Access the application:
   ```bash
   minikube service laggen-frontend-service
   ```

### Important Notes

- Environment variables are stored as Kubernetes secrets

### Troubleshooting

- If pods fail to start, check the logs:
  ```bash
  kubectl logs deployment/laggen-frontend
  kubectl logs deployment/laggen-backend
  ```

- To restart deployments after making changes:
  ```bash
  kubectl rollout restart deployment/laggen-frontend deployment/laggen-backend
  ```
