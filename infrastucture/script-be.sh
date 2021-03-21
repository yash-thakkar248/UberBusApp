#! /bin/bash
sudo apt update
sudo apt install nginx -y
sudo apt-get install git -y
sudo apt update
sudo apt-get update
sudo apt install python3-pip -y
git clone https://github.com/yash-thakkar248/UberBusApp.git
cd UberBusApp/uber-backend/
pip3 install -r requirements.txt
# python3 uberbe.py
