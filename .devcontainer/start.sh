#!/usr/bin/env bash
# Starts MySQL and the website every time the Codespace opens.
sudo service mariadb start
cd server && setsid nohup node index.js > ../server.log 2>&1 &
sleep 2
