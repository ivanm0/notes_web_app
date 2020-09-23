#!/bin/sh
cd /var/www/notes_web_app/
pm2 start server
cd /var/www/notes_web_app/frontend/
npm run build
systemctl start nginx
chmod +x scripts/start_server.sh