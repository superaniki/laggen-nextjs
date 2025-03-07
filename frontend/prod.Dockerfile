 # Use the official Node.js 16 image.
 FROM node:19

 # Create and change to the app directory.
 WORKDIR /app

 # Copy application dependency manifests to the container image.
 COPY package*.json ./

 # Install production dependencies.
 RUN npm install

 # Copy local code to the container image.
 COPY . .

 # Compile the next app
 RUN npm run build

 # Run the web service on container startup.
 CMD ["npm", "start"]