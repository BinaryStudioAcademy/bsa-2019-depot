#!/bin/bash
cd /home/git/bsa-2019-depot/scripts/git-hooks
chmod u+x pre-receive
chmod u+x update
cd /home/git/bsa-2019-depot/server/
pm2 delete all
npm install
npx sequelize-cli db:migrate
pm2 start server.js --name Depot