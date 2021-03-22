#! /bin/bash
sudo apt update
sudo apt install unzip -y
sudo apt install nginx -y
sudo apt-get install git -y
sudo apt-get update
sudo apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo apt update
sudo apt install npm -y
git clone https://github.com/yash-thakkar248/UberBusApp.git
cd UberBusApp/uber-frontend/
sudo npm install
sudo npm run-script build
cd
sudo cp front-end.nginx /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/front-end.nginx /etc/nginx/sites-enabled/front-end.nginx
sudo systemctl reload nginx