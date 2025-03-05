#!/bin/bash

# build the server function
sudo docker build -f backend/Dockerfile -t imagefunc .

# build the client image :
sudo docker build -f frontend/Dockerfile -t laggen .

# create the network
docker network create laggen-net

# start the server function
sudo docker run -d --net laggen-net --name imagefunc -p 8080:80 imagefunc

# start the client image :
sudo docker run -d --net laggen-net --name laggen-web --rm -it -p 3000:3000 laggen


# examples:

# start the ES container
#docker run -d --name es --net laggen-net -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.2

# start the flask app container
#docker run -d --net laggen-net -p 5000:5000 --name foodtrucks-web prakhar1989/foodtrucks-web
