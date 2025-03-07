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

 # Kolla, bra hjälp
 # https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/docker/production/Dockerfile#L22

 # Generate the DB files
 RUN npx prisma generate
 RUN npx prisma db push --accept-data-loss

 # Run the web service on container startup.
 CMD ["npm", "run", "dev"]