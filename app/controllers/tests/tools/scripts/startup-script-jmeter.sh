#!/bin/bash

generate_post_data()
{
  cat <<EOF
{
    "results": {
        "kong": "$RESULTS_KONG",
        "krakend": "$RESULTS_KRAKEND",
        "tyk": "$RESULTS_TYK"
    }
}
EOF
}

# Setup
sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get install -y unzip

# Install JAVA
sudo apt install -y default-jdk

# Install JMeter and plugins
wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.4.1.tgz -O jmeter.tgz
tar xzf jmeter.tgz

cd apache-jmeter-5.4.1

wget https://jmeter-plugins.org/files/packages/jpgc-cmd-2.2.zip
wget https://jmeter-plugins.org/files/packages/jpgc-synthesis-2.2.zip
wget https://jmeter-plugins.org/files/packages/jpgc-filterresults-2.2.zip
sudo unzip -o jpgc-cmd-2.2.zip
sudo unzip -o jpgc-filterresults-2.2.zip
sudo unzip -o jpgc-synthesis-2.2.zip

cd bin

# Copy configurations and start JMeter for each one

# Kong
echo "STARTING KONG"
RESULTS_KONG=()
TEST_FILE_KONG=$(curl http://metadata/computeMetadata/v1/instance/attributes/test-file-kong -H "Metadata-Flavor: Google")
if [ ! -z "$TEST_FILE_KONG" ]; then
    echo $TEST_FILE_KONG > test_kong.jmx;
    sudo ./jmeter.sh -n -t test_kong.jmx -l test_kong.jtl;
    sudo ./JMeterPluginsCMD.sh --generate-csv results_kong.csv --input-jtl test_kong.jtl --plugin-type AggregateReport;
    RESULTS_KONG=$(<results_kong.csv)
else
    echo "NO KONG CONFIG"
fi
echo "ENDING KONG"

# KrakenD
echo "STARTING KRAKEND"
RESULTS_KRAKEND=()
TEST_FILE_KRAKEND=$(curl http://metadata/computeMetadata/v1/instance/attributes/test-file-krakend -H "Metadata-Flavor: Google")
if [ ! -z "$TEST_FILE_KRAKEND" ]; then
    echo $TEST_FILE_KRAKEND > test_krakend.jmx;
    sudo ./jmeter.sh -n -t test_krakend.jmx -l test_krakend.jtl;
    sudo ./JMeterPluginsCMD.sh --generate-csv results_krakend.csv --input-jtl test_krakend.jtl --plugin-type AggregateReport;
    RESULTS_KRAKEND=$(<results_krakend.csv)
else
    echo "NO KRAKEND CONFIG"
fi
echo "ENDING KRAKEND"

# Tyk
echo "STARTING TYK"
RESULTS_TYK=()
TEST_FILE_TYK=$(curl http://metadata/computeMetadata/v1/instance/attributes/test-file-tyk -H "Metadata-Flavor: Google")
if [ ! -z "$TEST_FILE_TYK" ]; then
    echo $TEST_FILE_TYK > test_tyk.jmx;
    sudo ./jmeter.sh -n -t test_tyk.jmx -l test_tyk.jtl;
    sudo ./JMeterPluginsCMD.sh --generate-csv results_tyk.csv --input-jtl test_tyk.jtl --plugin-type AggregateReport;
    RESULTS_TYK=$(<results_tyk.csv)
else
    echo "NO TYK CONFIG"
fi
echo "ENDING TYK"

# Post results to config
TOKEN=$(curl http://metadata/computeMetadata/v1/instance/attributes/token -H "Metadata-Flavor: Google")
CONFIG_ID=$(curl http://metadata/computeMetadata/v1/instance/attributes/config_id -H "Metadata-Flavor: Google")
TEST_ID=$(curl http://metadata/computeMetadata/v1/instance/attributes/test_id -H "Metadata-Flavor: Google")
echo "$(generate_post_data)"

curl \
-X PUT \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d "$(generate_post_data)" \
"https://agp-config-manager.herokuapp.com/configurations/$CONFIG_ID/tests/$TEST_ID"
