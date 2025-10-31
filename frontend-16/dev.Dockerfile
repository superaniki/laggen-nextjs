 # Use the official Node.js 19 image.
 FROM node:19

 # Create and change to the app directory.
 WORKDIR /app

 # Copy application dependency manifests to the container image.
 COPY package*.json ./

 # Install production dependencies.
 RUN npm install

 # Install next globally to ensure it's available in PATH
 RUN npm install -g next

 # Copy local code to the container image.
 COPY . .

 # Copy the appropriate env file based on the build argument
 # COPY .env.local .env.local

 # Generate the DB files
 RUN npx prisma generate
 # RUN npx prisma db push --accept-data-loss

 # Set the environment variable
 ENV NODE_ENV=${NODE_ENV}

 # Run the web service on container startup.
 CMD ["npx", "next", "dev"]
