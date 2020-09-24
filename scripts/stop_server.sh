#!/bin/sh
cd /var/www/notes_web_app/
pm2 stop server
systemctl stop nginx
chmod +x scripts/stop_server.sh