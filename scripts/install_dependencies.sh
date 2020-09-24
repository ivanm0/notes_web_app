#!/bin/sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd /var/www/notes_web_app/backend/
npm install
cd ../frontend/
npm install
cd ../
chmod +x scripts/install_dependencies.sh