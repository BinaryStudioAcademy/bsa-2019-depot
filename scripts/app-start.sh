#!/bin/bash
cd /home/git/
. setEnv.sh
cd /home/git/bsa-2019-depot/server/
pm2 delete all
npx sequelize-cli db:migrate
pm2 start server.js --name Depot