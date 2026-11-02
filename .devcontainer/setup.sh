#!/usr/bin/env bash
# Prepares the project the first time a Codespace is created.
set -e

# MySQL (MariaDB) database server
sudo apt-get update -y
sudo apt-get install -y mariadb-server

# Start MySQL and allow "root" with no password (same as XAMPP)
sudo service mariadb start
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');"

# Create the database with the sample products and orders
mysql -u root < database/schema.sql

# Settings file
[ -f server/.env ] || cp server/.env.example server/.env

# Install packages and build the React site
npm run setup
npm run build

echo "✔ Ready — the website starts automatically on port 5000"
