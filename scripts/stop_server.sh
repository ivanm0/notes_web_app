#!/bin/sh
pm2 stop server
systemctl stop nginx
chmod +x scripts/stop_server.sh