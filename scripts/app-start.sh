#!/bin/bash
pm2 delete Depot
cd /home/ubuntu/bsa-2019-depot/server/
pm2 start server.js --name "Depot"