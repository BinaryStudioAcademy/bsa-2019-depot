#!/bin/bash
cd /home/git/bsa-2019-depot/scripts/git-hooks
chmod u+x pre-receive
chmod u+x update
cd /home/git/
. setEnv.sh
cd /home/git/bsa-2019-depot/server/
pm2 delete all
npx sequelize-cli db:migrate
pm2 start server.js --name Depot
cd /home/git/bsa-2019-depot/raw-server/
pm2 start server.js --name Depot-Raw