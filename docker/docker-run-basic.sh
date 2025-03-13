#!/bin/bash

# build the server function
sudo sudo docker build -f backend/Dockerfile -t imagefunc ./backend

# build the client image :
sudo docker build -f frontend/Dockerfile -t laggen ./frontend

# create the network
sudo docker network create laggen-net

# start the server function
sudo docker run -d --net laggen-net --name imagefunc --rm -p 8080:80 imagefunc

# start the client image :
sudo docker run -d --net laggen-net --name laggen-web --rm -it -p 3000:3000 laggen
