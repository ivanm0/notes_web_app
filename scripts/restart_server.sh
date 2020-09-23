#!/bin/sh
pm2 restart server
cd frontend/
npm run build
systemctl restart nginx