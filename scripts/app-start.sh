#!/bin/bash
pm2 delete Depot
cd /home/ubuntu/bsa-2019-depot/server/
npx sequelize-cli db:migrate
pm2 start server.js --name "Depot"