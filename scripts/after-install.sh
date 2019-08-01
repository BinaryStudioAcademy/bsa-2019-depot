#!/bin/bash
export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/ubuntu/bsa-2019-depot/client/
npm install
cd /home/ubuntu/bsa-2019-depot/server/
npm install