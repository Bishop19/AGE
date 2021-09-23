#!/bin/bash

# Setup
apt-get update
apt-get install -y apt-transport-https
KRAKEND_CONFIG=$(curl http://metadata/computeMetadata/v1/instance/attributes/krakend-config -H "Metadata-Flavor: Google")

# Install KrakenD
apt-key adv --keyserver keyserver.ubuntu.com --recv 5DE6FD698AD6FDD2
echo "deb https://repo.krakend.io/apt stable main" | tee /etc/apt/sources.list.d/krakend.list
apt-get update
apt-get install -y krakend

# Copy configuration
echo $KRAKEND_CONFIG > /etc/krakend/krakend.json

# Start KrakenD
krakend run -c /etc/krakend/krakend.json -d
