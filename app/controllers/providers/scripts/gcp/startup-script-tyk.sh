#!/bin/bash

# Setup
apt-get update
apt-get install -y apt-transport-https
TYK_CONFIG=$(curl http://metadata/computeMetadata/v1/instance/attributes/tyk-config -H "Metadata-Flavor: Google")

# Install Redis
sudo apt-get install -y redis-server

# Install Tyk
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
curl -s https://packagecloud.io/install/repositories/tyk/tyk-gateway/script.deb.sh | sudo bash
sudo apt-get install tyk-gateway=3.2.1
sudo /opt/tyk-gateway/install/setup.sh --listenport=8083 --redishost=tyk --redisport=6379 --domain=""

# Copy configurations
sudo rm /opt/tyk-gateway/apps/*
echo $TYK_CONFIG > /opt/tyk-gateway/apps/kong.json

# Start Tyk
sudo service tyk-gateway start
