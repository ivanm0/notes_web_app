#!/bin/sh
pm2 start server
cd frontend/
npm run build
systemctl start nginx
chmod +x scripts/start_server.sh