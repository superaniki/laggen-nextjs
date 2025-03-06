#!/bin/bash

# build the server function
sudo sudo docker build -f backend/Dockerfile -t imagefunc ./backend

# build the client image :
sudo docker build -f frontend/Dockerfile -t laggen ./frontend

