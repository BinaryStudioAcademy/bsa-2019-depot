#!/bin/bash

cd /home/ubuntu/bsa-2019-depot/client/
npm install
cd /home/ubuntu/bsa-2019-depot/server/
npm install
pm2 delete Depot
pm2 start npm --name "Depot" -- start