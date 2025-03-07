#!/bin/bash

# build server function
sudo docker build -f backend/Dockerfile -t imagefunc ./backend

# build client for production
sudo docker build -f frontend/Dockerfile-prod -t laggen ./frontend

