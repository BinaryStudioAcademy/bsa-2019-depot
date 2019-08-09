source /home/ubuntu/.profile

cd /home/ubuntu/bsa-2019-depot/server/
pm2 delete Depot
pm2 start npm --name "Depot" -- start