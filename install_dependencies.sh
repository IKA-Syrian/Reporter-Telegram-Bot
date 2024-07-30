#!/bin/bash

# Update package list and install prerequisites
sudo apt update
sudo apt install -y curl gnupg software-properties-common gperf zlib1g-dev cmake g++ wget git libssl-dev openssl

# Install Node.js 20.15.1 and PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# Install MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

git clone --recurse-submodules https://github.com/tdlib/telegram-bot-api.git
cd telegram-bot-api

# Check if the 'td' directory exists and if not, initialize and update submodules
if [ ! -d "td" ]; then
    git submodule update --init --recursive
fi

mkdir build
cd build
cmake ..
cmake --build . --target install
