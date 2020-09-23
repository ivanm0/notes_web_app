#!/bin/sh
pm2 start server
cd frontend/
npm run build
systemctl start nginx