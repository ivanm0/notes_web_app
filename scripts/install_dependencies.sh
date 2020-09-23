#!/bin/sh
cd /var/www/notes_web_app/backend/
npm install
cd ../frontend/
npm install
cd ../
chmod +x scripts/install_dependencies.sh