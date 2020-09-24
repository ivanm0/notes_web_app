#!/bin/sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd /var/www/notes_web_app/
pm2 start server
cd /var/www/notes_web_app/frontend/
npm run build
systemctl start nginx
cd /var/www/notes_web_app/