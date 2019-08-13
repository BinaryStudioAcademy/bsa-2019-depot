#!/bin/bash
cd /home/ubuntu/
. setEnv.sh
cd /home/ubuntu/bsa-2019-depot/server/
pm2 delete all
npx sequelize-cli db:migrate
pm2 start server.js --name Depot