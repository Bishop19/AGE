#!/bin/bash

# Setup
apt-get update
apt-get install -y apt-transport-https
TYK_TOTAL_FILES=$(curl http://metadata/computeMetadata/v1/instance/attributes/tyk-total-files -H "Metadata-Flavor: Google")
# Install Redis
sudo apt-get install -y redis-server

# Install Tyk
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
curl -s https://packagecloud.io/install/repositories/tyk/tyk-gateway/script.deb.sh | sudo bash
sudo apt-get install tyk-gateway=3.2.1
sudo /opt/tyk-gateway/install/setup.sh --listenport=8083 --redishost=tyk --redisport=6379 --domain=""

# Copy configurations
sudo rm /opt/tyk-gateway/apps/*
for (( index=0; index<$TYK_TOTAL_FILES; index++ ))
do
    TYK_CONFIG=$(curl http://metadata/computeMetadata/v1/instance/attributes/tyk-config-${index} -H "Metadata-Flavor: Google")
    echo $TYK_CONFIG > /opt/tyk-gateway/apps/config-${index}.json
done

# Start Tyk
sudo service tyk-gateway start
