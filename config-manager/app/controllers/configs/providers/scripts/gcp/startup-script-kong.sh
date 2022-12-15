#!/bin/bash

# Setup
apt-get update
apt-get install -y apt-transport-https

# Install Kong
echo "deb [trusted=yes] https://download.konghq.com/gateway-2.x-ubuntu-$(lsb_release -sc)/ default all" | sudo tee /etc/apt/sources.list.d/kong.list
sudo apt-get update
sudo apt install -y kong

# Copy configurations
curl http://metadata/computeMetadata/v1/instance/attributes/kong-config -H "Metadata-Flavor: Google" > /etc/kong/kong.yml
echo '
database = off
declarative_config = /etc/kong/kong.yml
proxy_listen = 0.0.0.0:8082 reuseport backlog=16384, 0.0.0.0:8443 http2 ssl reuseport backlog=16384
' > /etc/kong/kong.conf

# Start Kong
sudo kong config -c /etc/kong/kong.conf parse /etc/kong/kong.yml --vv
sudo kong start -c /etc/kong/kong.conf
