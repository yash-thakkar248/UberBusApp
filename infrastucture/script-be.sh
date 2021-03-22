#! /bin/bash
sudo apt update
sudo apt install nginx -y
sudo apt-get install git -y
sudo apt update
sudo apt install python3-pip -y
sudo pip3 install virtualenv
virtualenv .venv
source .venv/bin/activate
git clone https://github.com/yash-thakkar248/UberBusApp.git
pip3 install -r UberBusApp/uber-backend/requirements.txt
pip uninstall bson -y
pip uninstall pymongo -y
pip3 install bson
pip3 install pymongo
pip3 install gunicorn
sudo cp wsgi.py UberBusApp/uber-backend/
sudo cp back-end.service /etc/systemd/system/back-end.service 
sudo systemctl daemon-reload
sudo systemctl start back-end
sudo systemctl enable back-end
sudo systemctl daemon-reload
sudo cp back-end.nginx /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/back-end.nginx /etc/nginx/sites-enabled/back-end.nginx
sudo systemctl reload nginx